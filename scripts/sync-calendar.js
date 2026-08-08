#!/usr/bin/env node
// Fetches Leo's public "Website Termine" iCloud calendar (ics feed) and writes
// a minimal data/dates.json containing only title, location, start time and
// (optionally) a URL — taken from the event's URL field, falling back to the
// first line of the description/notes if no URL field is set. Also writes
// data/dates.ics, a re-published feed of the same events so fans can
// subscribe to it directly (see assets/js/dates.js "Subscribe" link) without
// exposing Leo's private iCloud calendar URL.
//
// Usage: CALENDAR_URL="https://p12-caldav.icloud.com/published/2/....ics" node scripts/sync-calendar.js

const fs = require("fs");
const path = require("path");

const CALENDAR_URL = (process.env.CALENDAR_URL || "").trim();
const OUTPUT_PATH = path.join(__dirname, "..", "data", "dates.json");
const OUTPUT_ICS_PATH = path.join(__dirname, "..", "data", "dates.ics");

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

  fs.writeFileSync(OUTPUT_ICS_PATH, buildIcs(cleaned));
  console.log(`Wrote ${cleaned.length} upcoming event(s) to ${OUTPUT_ICS_PATH}`);
}

function buildIcs(events) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//leoasal.com//Website Termine//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Leo Asal – Termine",
  ];

  events.forEach((e) => {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${icsUid(e)}`);
    lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`);
    if (e.allDay) {
      // e.start is "YYYY-MM-DDT00:00:00" — a plain calendar date, no timezone.
      const startDigits = e.start.replace(/[-:]/g, "").slice(0, 8);
      lines.push(`DTSTART;VALUE=DATE:${startDigits}`);
      lines.push(`DTEND;VALUE=DATE:${addDaysToDateDigits(startDigits, 1)}`);
    } else {
      // e.start is either a true UTC instant ("...Z") or a floating local
      // time (see parseIcsDate below) which for Leo's calendar is always
      // Europe/Berlin wall-clock time. Represent it as such with TZID
      // rather than misreading the digits as UTC — otherwise every
      // subscriber's calendar app would show the event 1-2h off.
      const isUtc = /Z$/.test(e.start);
      const digits = e.start.replace(/[-:]/g, "").replace(/Z$/, "");
      // No end time in our data — default to a 2h slot, typical for a concert.
      const endDigits = addHoursToDateTimeDigits(digits, 2);
      lines.push(isUtc ? `DTSTART:${digits}Z` : `DTSTART;TZID=Europe/Berlin:${digits}`);
      lines.push(isUtc ? `DTEND:${endDigits}Z` : `DTEND;TZID=Europe/Berlin:${endDigits}`);
    }
    lines.push(`SUMMARY:${escapeIcsText(e.title)}`);
    if (e.location) lines.push(`LOCATION:${escapeIcsText(e.location.replace(/\n/g, ", "))}`);
    if (e.url) lines.push(`URL:${e.url}`);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

function icsUid(e) {
  const hash = require("crypto").createHash("sha1").update(e.title + e.start).digest("hex").slice(0, 16);
  return `${hash}@leoasal.com`;
}

// Pure wall-clock digit arithmetic via Date.UTC — timezone-independent
// (doesn't matter what TZ the current process runs in), and fine for a
// nominal +Nh/+Nd guess since we don't have real event durations.
function addDaysToDateDigits(digits, days) {
  const y = +digits.slice(0, 4), mo = +digits.slice(4, 6) - 1, d = +digits.slice(6, 8);
  const dt = new Date(Date.UTC(y, mo, d + days));
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`;
}

function addHoursToDateTimeDigits(digits, hours) {
  const y = +digits.slice(0, 4), mo = +digits.slice(4, 6) - 1, d = +digits.slice(6, 8);
  const h = +digits.slice(9, 11), mi = +digits.slice(11, 13), s = +digits.slice(13, 15);
  const dt = new Date(Date.UTC(y, mo, d, h, mi, s) + hours * 3600000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}`;
}

function escapeIcsText(str) {
  return String(str || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
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
          url: extractUrl(current.url) || extractUrl(current.description),
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
    else if (key === "URL") current.url = value;
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
  if (/^https?:\/\//i.test(firstLine)) return firstLine;
  // Bare domain without scheme (e.g. "example.com") — add https://
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(firstLine)) return `https://${firstLine}`;
  return "";
}

function unescapeIcs(value) {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}
