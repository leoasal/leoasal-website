#!/usr/bin/env node
// Fetches Leo's public "Website Termine" iCloud calendar (ics feed) and writes
// a minimal data/dates.json containing only title, location, start time and
// (optionally) a URL taken from the first line of the event description.
//
// Usage: CALENDAR_URL="https://p12-caldav.icloud.com/published/2/....ics" node scripts/sync-calendar.js

const fs = require("fs");
const path = require("path");

const CALENDAR_URL = (process.env.CALENDAR_URL || "").trim();
const OUTPUT_PATH = path.join(__dirname, "..", "data", "dates.json");

if (!CALENDAR_URL) {
  console.error("CALENDAR_URL is not set. Nothing to sync.");
  process.exit(1);
}

const fetchUrl = CALENDAR_URL.replace(/^webcal:\/\//i, "https://");

main().catch((err) => {
  console.error("Calendar sync failed:", err);
  process.exit(1);
});

async function main() {
  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch calendar: ${res.status} ${res.statusText}`);
  }
  const ics = await res.text();
  const events = parseIcs(ics);

  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const cleaned = events
    .filter((e) => e.start && new Date(e.start).getTime() >= oneDayAgo)
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(cleaned, null, 2) + "\n");
  console.log(`Wrote ${cleaned.length} upcoming event(s) to ${OUTPUT_PATH}`);
}

function parseIcs(text) {
  const unfolded = text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
  const lines = unfolded.split("\n");

  const events = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current) {
        events.push({
          title: current.summary || "Untitled event",
          location: current.location || "",
          start: current.start || null,
          allDay: !!current.allDay,
          url: extractUrl(current.description),
        });
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const rawKey = line.slice(0, idx);
    const value = unescapeIcs(line.slice(idx + 1));
    const key = rawKey.split(";")[0];

    if (key === "SUMMARY") current.summary = value;
    else if (key === "LOCATION") current.location = value;
    else if (key === "DESCRIPTION") current.description = value;
    else if (key === "DTSTART") {
      current.start = parseIcsDate(rawKey, value);
      current.allDay = /VALUE=DATE\b/.test(rawKey) && !rawKey.includes("DATE-TIME");
    }
  }

  return events;
}

function parseIcsDate(rawKey, value) {
  // All-day event: DTSTART;VALUE=DATE:20260910
  if (/VALUE=DATE\b/.test(rawKey) && !rawKey.includes("DATE-TIME")) {
    const m = value.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}T00:00:00`;
  }
  // UTC: 20260910T190000Z
  let m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`;
  // Local/floating or TZID-qualified: 20260910T190000
  m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
  return null;
}

function extractUrl(description) {
  if (!description) return "";
  const firstLine = description.split("\n")[0].trim();
  return /^https?:\/\//i.test(firstLine) ? firstLine : "";
}

function unescapeIcs(value) {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}
