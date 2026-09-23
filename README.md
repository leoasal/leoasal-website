# leoasal.com

Schlanke, statische Website für Leo Asal (Schlagzeuger/Komponist, Köln) —
reines HTML/CSS/JS, kein Build-Schritt, kein Framework, kein CMS. Ersetzt
die frühere WordPress/Elementor-Seite, live seit 2026-08-06.

## Setup / Lokal starten

```bash
cd leoasal-website
python3 -m http.server 5173
```
Dann [http://localhost:5173](http://localhost:5173) öffnen — nicht per
Doppelklick auf `index.html`, die Seite nutzt `fetch()` für Übersetzungen
und Termine und braucht dafür einen echten HTTP-Server.

## Struktur

- `index.html` — Startseite: Hero + die Sektionen `#blog`/`#bio`/`#dates`/
  `#projects`/`#contact`. Die "Seiten" Blog/Bio/Termine/Projekte/Kontakt
  leben inhaltlich hier, nicht als eigene Dateien.
- `blog.html`, `bio.html`, `dates.html`, `projects.html`, `contact.html` —
  reine Redirect-Stubs auf die jeweilige `index.html#…`-Sektion, für alte
  Bookmarks/Links.
- `yamuna.html`, `jakob-manz-project.html`, `jakob-baensch-quartett.html`,
  `haertel-asal-duo.html`, `ketzberg.html`, `loft-arts.html` —
  eigenständige Projekt-Unterseiten.
- `impressum.html`, `datenschutz.html` — rechtlich verbindlich, bleiben
  immer Deutsch (kein Sprachumschalter).
- `assets/css/style.css` — gesamtes Styling.
- `assets/js/i18n.js` — Sprachumschalter-Logik (liest
  `assets/i18n/{en,de,es}.json`).
- `assets/js/dates.js` — lädt `data/dates.json` und rendert die Termine.
- `assets/js/anchor-scroll.js` — Scrollen zu Homepage-Sektionen + zeigt in
  der Nav an, welche Sektion gerade sichtbar ist.
- `assets/js/lightbox.js`, `assets/js/gallery-nav.js` — Bildergalerien.
- `assets/fonts/` — selbst gehostete Schriften (Playfair Display, Source
  Code Pro).
- `scripts/sync-calendar.js` + `.github/workflows/sync-calendar.yml` —
  holt Leos öffentlichen Apple-Kalender-Feed und schreibt
  `data/dates.json`/`data/dates.ics` (läuft automatisch, s. unten).
- `data/dates.json`, `data/dates.ics` — vom Sync-Workflow generiert, nicht
  von Hand bearbeiten.
- `Inbox/` — Ablage für noch nicht einsortierte Dateien (Fotos, Notizen).

Architektur-Entscheidungen, Konventionen und der aktuelle Stand stehen in
[`CLAUDE.md`](CLAUDE.md); der Verlauf abgeschlossener Änderungen in
[`CHANGELOG.md`](CHANGELOG.md).

## Deployment

GitHub Pages, deployt automatisch bei jedem Push auf `main`
(`.github/workflows/deploy-pages.yml`). Domain `leoasal.com` läuft über
Strato-DNS (A-Record → `185.199.108.153`), SSL-Zertifikat von GitHub/
Let's Encrypt, HTTPS erzwungen. Die Datei `CNAME` im Repo-Root hält die
Custom-Domain-Konfiguration.

## Sprachumschalter

Standardsprache ist Englisch, Besucher:innen können auf Deutsch oder
Spanisch wechseln (im Header — auf Mobile mittig zwischen Logo und
Social-Icons, auf Desktop rechts neben der Nav); die Wahl wird lokal im
Browser gespeichert. Impressum und Datenschutz bleiben unabhängig davon
immer auf Deutsch (rechtlich verbindliche Fassung).

Texte anpassen: in `assets/i18n/en.json`, `de.json`, `es.json` den
jeweiligen Schlüssel bearbeiten (immer in allen drei Dateien).

## Kalender

Die Termine unter „Dates" kommen aus Leos privatem iCloud-Kalender
„Website Termine" — ein GitHub-Actions-Workflow synchronisiert sie
automatisch (1×/Woche + manuell). Die Pipeline-Technik steht in
`CLAUDE.md`; die private Playbook-Datei für die inhaltliche Kalenderpflege
(welche Termine übernommen werden, bekannte Ausnahmen) ist nicht Teil
dieses öffentlichen Repos.
