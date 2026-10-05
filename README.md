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

- `index.html` — Startseite: Hero (`#home`) + die Sektionen `#blog`/`#bio`/
  `#dates`/`#projects`/`#gear`/`#contact`. Die "Seiten" Blog/Bio/Termine/
  Projekte/Gear/Kontakt leben inhaltlich hier, nicht als eigene Dateien.
- `blog.html`, `bio.html`, `dates.html`, `projects.html`, `gear.html`,
  `contact.html` — reine Redirect-Stubs auf die jeweilige
  `index.html#…`-Sektion, für alte Bookmarks/Links.
- `yamuna.html`, `jakob-manz-project.html`, `jakob-baensch-quartett.html`,
  `haertel-asal-duo.html`, `ketzberg.html`, `loft-arts.html` —
  eigenständige Projekt-Unterseiten.
- `impressum.html`, `datenschutz.html` — rechtlich verbindlich, bleiben
  immer Deutsch (kein Sprachumschalter).
- `assets/css/style.css` — gesamtes Styling.
- `assets/js/i18n.js` — Sprachumschalter-Logik (liest
  `assets/i18n/{en,de,es}.json`).
- `assets/js/dates.js` — lädt `data/dates.json` und rendert die Termine.
- `assets/js/menu.js` — Hamburger-Dropdown in der Kopfzeile (Auf/Zu,
  Klick außerhalb, Esc).
- `assets/js/anchor-scroll.js` — Scrollen zu Homepage-Sektionen und
  Scrollspy (markiert den aktuellen Abschnitt im Dropdown).
- `assets/js/lightbox.js` — Großansicht für Fotos und Videos (schließt per X,
  Esc, Leertaste oder Klick auf die schwarze Fläche).
- `assets/js/soft-scroll.js` — weiches Seitwärts-Gleiten (GPU-Transition) für
  Galerie-Pfeile; `assets/js/gallery-nav.js` — Foto-Reihen mit Pfeilen auf den
  Projektseiten; `assets/js/gear-slider.js` — horizontale Gear-Galerie
  (Vision Ears ↔ Sonor).
- `assets/fonts/` — selbst gehostete Schriften (Playfair Display, Source
  Code Pro).
- `scripts/sync-calendar.js` + `.github/workflows/sync-calendar.yml` —
  holt Leos öffentlichen Apple-Kalender-Feed und schreibt
  `data/dates.json`/`data/dates.ics` (läuft automatisch, s. unten).
- `data/dates.json`, `data/dates.ics` — vom Sync-Workflow generiert, nicht
  von Hand bearbeiten.
- `Inbox/` — Ablage für noch nicht einsortierte Dateien (Fotos, Videos,
  Notizen); verarbeitete Originale wandern nach `Inbox/processed/`
  (gitignored). Vor dem Committen leeren.

Architektur-Entscheidungen, Konventionen und der aktuelle Stand stehen in
[`CLAUDE.md`](CLAUDE.md); der Verlauf abgeschlossener Änderungen in
[`CHANGELOG.md`](CHANGELOG.md).

## Navigation

Ein Hamburger-Button rechts in der Kopfzeile (nach Social-Icons und
Sprachwahl) klappt ein halbtransparentes Dropdown mit den 7 Punkten
(Home/Blog/Bio/Dates/Projects/Gear/Contact) auf — auf allen Seiten und allen
Breiten gleich. Neue Nav-Punkte kommen in die `.menu-panel`-Liste auf allen
Seiten; die Checkliste steht in [`CLAUDE.md`](CLAUDE.md). Die frühere
Variante mit der Marker-Seitenleiste ist als Branch `menu-option-side-rail`
(und Tag `menu-rail-last-main`) erhalten.

## Gear

Der Abschnitt „Gear" ist eine horizontale Galerie: Vision Ears und Sonor
stehen als Slides nebeneinander, senkrechte Pfeil-Balken (Look wie die
Kalender-Pfeile) wechseln zwischen den Marken. Neue Marke = neuer Slide, siehe
`CLAUDE.md`.

## Deployment

GitHub Pages, deployt automatisch bei jedem Push auf `main`
(`.github/workflows/deploy-pages.yml`). Domain `leoasal.com` läuft über
Strato-DNS (A-Record → `185.199.108.153`), SSL-Zertifikat von GitHub/
Let's Encrypt, HTTPS erzwungen. Die Datei `CNAME` im Repo-Root hält die
Custom-Domain-Konfiguration.

## Sprachumschalter

Standardsprache ist Englisch, Besucher:innen können auf Deutsch oder
Spanisch wechseln (im Header, rechts neben den Social-Icons); die Wahl wird
lokal im Browser gespeichert. Impressum und Datenschutz bleiben unabhängig davon
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
