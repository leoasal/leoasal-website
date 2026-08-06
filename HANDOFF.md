# HANDOFF — leoasal.com

Lebendes Übergabedokument für diesen Ordner. Bei jeder wesentlichen Änderung
aktualisieren, nicht nur anhängen — veraltete Abschnitte korrigieren.

## Was das hier ist

Kompletter Neubau von leoasal.com: weg von WordPress/Elementor, hin zu einer
schlanken statischen Seite (reines HTML/CSS/JS, kein Build-Schritt, kein
Framework, kein CMS). Live seit 2026-08-06.

- **Repo:** https://github.com/leoasal/leoasal-website (öffentlich)
- **Hosting:** GitHub Pages, deployt automatisch bei jedem Push auf `main`
- **Domain:** leoasal.com, DNS bei Strato (1× A-Record → `185.199.108.153`),
  SSL-Zertifikat von GitHub/Let's Encrypt, HTTPS erzwungen
- **GitHub-Account des Kunden:** `leoasal` (frisch angelegt in dieser Session)
- **Owner:** Leo Asal — Schlagzeuger/Komponist aus Köln, nicht technisch,
  arbeitet aber gerne direkt mit Claude Code statt über ein Admin-Panel

## Lokal arbeiten

```bash
cd ~/Documents/leoasal-website
python3 -m http.server 5173
```
→ http://localhost:5173 (Doppelklick auf `index.html` funktioniert NICHT,
`fetch()` für i18n/Termine braucht einen echten HTTP-Server, kein `file://`).

Nach Änderungen immer lokal im Browser gegenprüfen (Mobile **und** Desktop-
Breite), dann committen und pushen — GitHub Pages baut automatisch.

```bash
git add -A && git commit -m "..." && git push origin main
```

Falls der Remote inzwischen neue Commits hat (z.B. vom Kalender-Sync-Workflow):
`git pull --rebase origin main` vor dem Push.

## GitHub-Zugriff in diesem Environment

GitHub CLI ist **nicht** über Homebrew installiert (kein Homebrew vorhanden),
sondern als portable Binary hier abgelegt:
```
~/.local/gh-cli/gh_2.97.0_macOS_arm64/bin/gh
```
Bereits eingeloggt als `leoasal` (inkl. `workflow`-Scope, nötig für Pushes,
die `.github/workflows/*` ändern). Für gh-Befehle immer den vollen Pfad
nutzen oder als Variable setzen: `GH=~/.local/gh-cli/gh_2.97.0_macOS_arm64/bin/gh`.

## Seitenstruktur

```
index.html                    Startseite: Foto + Name + Nav, kein Intro-Text (bewusst leer)
bio.html                      Bio kurz + ausklappbare Langfassung, Portraitfoto
dates.html                    Termine, gespeist aus data/dates.json (siehe unten)
projects.html                 Projekt-Grid: Yamuna, Jakob Manz, Härtel/Asal Duo,
                               Jakob Bänsch, Ketzberg (Ketzberg verlinkt extern,
                               die anderen vier haben eigene Unterseiten)
yamuna.html                   YAMUNA (nicht mehr "YAMUNA EPK"): eigene Überschrift oben,
                               dann Album-Block ("Out now" + Front-/Back-Cover, beide als
                               Lightbox anklickbar, "Listen/Buy Vinyl" UNTER den Covern),
                               dann Beschreibung, Pressefotos, Videos, Downloads
jakob-manz-project.html       Beschreibung + 2 YouTube-Videos + Link zu jakobmanz.de
jakob-baensch-quartett.html   Beschreibung + 3 YouTube-Videos + Link zu jakobbaensch.com
haertel-asal-duo.html         Kurzbeschreibung + 4 YouTube-Videos (keine externe Site)
loft-arts.html                Platzhalter-Text ("weitere Infos folgen") + 4 YouTube-Videos,
                               Karte auf projects.html mit "Photos coming soon"-Platzhalter
contact.html                  E-Mail + Instagram/Facebook (inline SVG-Icons)
impressum.html, datenschutz.html   IMMER Deutsch, kein Sprachumschalter (bewusste
                               Entscheidung: rechtlich verbindliche Fassung)
```

Gemeinsames Muster pro Seite: Header mit Logo + Nav + Sprachumschalter,
Content in `<main>`, `<nav class="mobile-nav">` (nur <800px sichtbar),
Footer mit Impressum/Datenschutz/Sprachumschalter-Kopie fürs Handy. Neue
Seiten am besten von einer bestehenden ähnlichen Seite kopieren statt neu
aufbauen, damit nichts vergessen wird.

## i18n (EN/DE/ES)

- `assets/js/i18n.js` liest `assets/i18n/{en,de,es}.json`, ersetzt alles mit
  `data-i18n="key"` (innerHTML) bzw. `data-i18n-attr="attr:key"`.
- Default-Sprache Englisch, Auswahl in `localStorage['lang']`, gilt seitenübergreifend.
- **Impressum/Datenschutz bewusst ausgenommen** — kein Sprachumschalter dort.
- Dynamisch nachgeladener Inhalt (z.B. Termine) muss nach dem Rendern
  `window.i18nRefresh()` aufrufen, sonst bleibt er unübersetzt bei
  Sprachwechsel/Reload-Race — siehe `assets/js/dates.js` als Beispiel.
- Neuen Text immer in **allen drei** JSON-Dateien ergänzen, nicht nur Englisch.

## Kalender-Sync (Apple Calendar → dates.html)

- Leo pflegt einen eigenen iCloud-Kalender "Website Termine", öffentlich
  freigegeben (webcal-Link → https:// umgeschrieben).
- Link liegt als Repo-Secret `CALENDAR_URL` (Settings → Secrets and
  variables → Actions) — nicht im Code, nicht im Chat wiederholen.
- `.github/workflows/sync-calendar.yml` läuft alle 6h + manuell auslösbar
  (`gh workflow run sync-calendar.yml` oder im Actions-Tab).
- `scripts/sync-calendar.js` parst das ics, schreibt `data/dates.json`:
  `{ title, location, start (ISO), allDay (bool), url }`. `url` kommt aus
  der **ersten Zeile der Notizen** des Kalendereintrags (nur falls es wie
  eine http(s)-URL aussieht).
- `dates.json` wird **nur vom Workflow verwaltet** — nicht von Hand
  reinschreiben und committen (außer kurz zum lokalen Testen, danach
  zurücksetzen, siehe Git-History für ein Beispiel).
- Frontend (`assets/js/dates.js`): jeder Termin ein `<details>`-Element,
  antippen/klicken zeigt Zeit (falls nicht `allDay`), Ort und Link (falls
  vorhanden). Bewusst kein Hover-only-Pattern, damit es auf dem Handy genauso
  funktioniert wie am Desktop.
- Ort ist klickbar → verlinkt auf Google-Maps-Suche
  (`https://www.google.com/maps/search/?api=1&query=...`), daneben ein
  kleinerer sekundärer "(Apple Maps)"-Link (`https://maps.apple.com/?q=...`).
  Beide aus `e.location` gebaut, kein API-Key nötig.
- Die eingetragene URL wird als eigene, sichtbare Zeile mit Label "Website"
  angezeigt (nicht mehr als generischer "More info"-Button).
- **Wichtig:** Leos aktuelle echte Kalendereinträge haben (Stand 2026-08-06)
  weder Ort noch URL gepflegt — das ist kein Bug, einfach noch nicht
  eingetragen. Erst prüfen ob Leo das nachträgt, bevor man denkt, die
  Anzeige sei kaputt.

## Rechtliches: Cookie-Banner / YouTube-Embeds

Es gibt **bewusst keinen Cookie-Banner mehr**. Die Seite setzt keine Cookies,
lädt keine Fonts/Gravatar extern, hat kein Tracking/Analytics/Werbung — dafür
ist kein Banner nötig. Einzige Grauzone: die YouTube-Embeds (`youtube-nocookie.com`)
auf Yamuna/Jakob-Manz/Jakob-Bänsch/Härtel-Asal-Duo/Loft-Arts übertragen beim
Laden trotzdem die Besucher-IP an Google, auch ohne Klick auf Play. In der
Datenschutzerklärung ist das offengelegt (siehe `datenschutz.html`). Leo wurde
explizit die sicherere "Klick-zum-Laden"-Variante (Vorschaubild statt Auto-Embed)
angeboten — **er hat sich bewusst dagegen entschieden**, aktueller Stand bleibt
wie er ist. Falls er's sich anders überlegt: Thumbnail (`img.youtube.com/vi/<id>/hqdefault.jpg`)
statt iframe zeigen, iframe erst per Klick nachladen.

## Bekannte Eigenheiten dieser Umgebung

- **Browser-Tool-Screenshots werden manchmal komplett weiß** nach `scroll`,
  besonders auf Seiten mit mehreren YouTube-iframes — kein echter Bug,
  einfach per `javascript_tool` den DOM-Zustand direkt prüfen
  (`document.querySelectorAll(...)`) statt sich auf den Screenshot zu
  verlassen. Klicks auf `<summary>`/`<details>` per rohen Pixel-Koordinaten
  treffen oft daneben — lieber `read_page` → `ref_N` → darüber klicken.
- **Tab-Cap im Browser-Tool**: alte `file://`-Preview-Tabs (öffnen sich
  automatisch nach jedem `Write`/`Edit`) sammeln sich an und blockieren
  neue Tabs — ab und zu mit `tabs_close` aufräumen.
- **Wayback Machine / `archive.org`** ist von hier aus geblockt (429 bei
  curl, "per-action approval" beim Browser-Tool, WebFetch schlägt fehl).
  Für alten WordPress-Content lieber den Kunden direkt fragen (hat gut
  funktioniert: er hat die YouTube-Links der alten Projektseiten selbst
  rausgesucht und geschickt).
- **GitHub-Pages-Zertifikat kann ungewöhnlich lange brauchen** (bei diesem
  Setup >1h). Fix falls es hängt: Custom Domain per API einmal entfernen
  und neu setzen (`gh api repos/leoasal/leoasal-website/pages -X PUT -f "cname="`
  dann nochmal mit dem echten Domainnamen) — das hat den Issuance-Prozess
  neu gestartet und danach ging es in ~1 Minute.
- **Deploy-Pipeline**: Das alte Legacy-Build-System von Pages (Branch-Deploy)
  fing irgendwann an, mit generischem "Page build failed." zu scheitern
  (kein Jekyll-Problem, `.nojekyll` hat es NICHT gefixt). Deshalb läuft
  Deployment jetzt über `.github/workflows/deploy-pages.yml`
  (`actions/upload-pages-artifact` + `actions/deploy-pages`), Pages-Setting
  `build_type: workflow`.
  **Auch dieser Weg kann hängen — teils nur Minuten, teils Stunden.** Am
  2026-08-06 gab es einen GitHub-weiten Runner-Ausfall: mehrere Jobs steckten
  4+ Stunden in `waiting`/`pending` fest ("The job was not acquired by Runner
  of type hosted even after multiple attempts"), auch `gh workflow run` und
  `gh run cancel` schlugen zwischenzeitlich mit HTTP 500/502 fehl. Das ist
  ein echter GitHub-Ausfall, keine Fehlkonfiguration hier — in dem Fall bringt
  wiederholtes Retriggern nichts, nur abwarten und die Seite läuft in der
  Zwischenzeit unverändert mit dem letzten erfolgreichen Deploy weiter.
  **Nach jedem Push den Deploy-Status wirklich prüfen, nicht nur pushen und
  gut sein lassen:**
  ```bash
  GH=~/.local/gh-cli/gh_2.97.0_macOS_arm64/bin/gh
  $GH run list --repo leoasal/leoasal-website --workflow=deploy-pages.yml --limit 3
  ```
  Bei `failure` (nicht `waiting`/`pending`/`queued`!): einmal neu auslösen
  mit `$GH workflow run deploy-pages.yml --repo leoasal/leoasal-website`.
  Bei `waiting`/`pending` über mehrere Minuten: das ist der Runner-Ausfall,
  nicht neu triggern, sondern in ein paar Minuten mit `gh run view <id>
  --json status,conclusion` nachschauen (robuster als `gh run watch`, das bei
  Netzwerkflakes selbst mit falschem Exit-Code abbricht). Am Ende immer live
  gegenchecken (`curl -s https://leoasal.com/... | grep ...` nach einer
  eindeutigen neuen CSS-Klasse/Textstelle), nicht nur dem Workflow-Status
  vertrauen — und **beim Session-Start immer erstmal prüfen, ob es noch
  unerledigte/hängende Deploys vom letzten Mal gibt**, bevor man annimmt,
  der letzte Push sei live.
- **Kein Homebrew, kein Node lokal** in diesem Environment — gh CLI läuft
  als portable Binary (s.o.), der Kalender-Sync läuft nur in der GitHub
  Action (dort ist Node vorhanden), nicht lokal testbar ohne eigenes Node.

## Offene Punkte / mögliche nächste Schritte

- **⚠️ Stand 2026-08-06, ~18:40 Uhr: mehrere Commits sind gepusht, aber wegen
  des GitHub-Runner-Ausfalls (s.u.) noch NICHT live.** Betrifft: Dates
  Ort/Website-Anzeige, Yamuna Listen/Buy-Vinyl-Position, Nav-Abstand-Fix,
  komplette Loft-Arts-Seite inkl. Videos. Erstes, was eine neue Session tun
  sollte: Deploy-Status prüfen (`gh run list --workflow=deploy-pages.yml
  --limit 3`) und ggf. den zuletzt hängenden Job/Push neu antriggern.
- Leo trägt nach und nach echte Termine in "Website Termine" ein — einfach
  beobachten, ob der Sync sauber durchläuft (`gh run list --workflow=sync-calendar.yml`).
- Kein offener inhaltlicher Task-Rückstand sonst; alles unten in "Erledigt"
  ist umgesetzt (auch wenn der Deploy gerade hängt, s.o.). Neue Wünsche
  einfach hier oben ergänzen, sobald sie reinkommen, und nach Erledigung
  nach unten verschieben.

## Erledigt (chronologisch, neueste zuerst)

- Loft-Arts-Projektseite angelegt (Platzhaltertext + 4 YouTube-Videos),
  Karte auf projects.html mit Platzhalter-Thumb (2026-08-06)
- Dates: Ort verlinkt jetzt zu Google Maps (+ sekundärer Apple-Maps-Link),
  eingetragene URL wird als eigene "Website"-Zeile sichtbar angezeigt
  statt als generischer "More info"-Link (2026-08-06)
- Yamuna: "Listen / Buy Vinyl" von über die Cover nach darunter verschoben,
  "Out now" + Album-Zeile bleiben oben (2026-08-06)
- Nav-Sprachumschalter bekam etwas mehr Abstand nach oben (überschnitt sich
  fast mit den Nav-Link-Unterstrichen beim Hover) (2026-08-06)
- Cookie-Banner-Frage geklärt: keiner nötig (keine Cookies/Tracking mehr),
  YouTube-nocookie-Embeds sind die einzige Grauzone, in Datenschutz
  offengelegt, Leo hat sich bewusst gegen "Klick-zum-Laden" entschieden (2026-08-06)
- Deploy auf Actions-basiertes Pages-Deployment umgestellt (Legacy-Build
  fing an zu scheitern), Yamuna-Album-Cover deutlich größer/prominenter,
  beide Cover (Front + neu: Back) klickbar → öffnen in eigener Lightbox
  statt neuem Tab (2026-08-06)
- Yamuna-Seite: eigene „YAMUNA"-Überschrift (page-header wie bei den anderen
  Projektseiten) getrennt vom Album-Block („Out now" + Cover + Listen/Buy Vinyl)
- Termine sind jetzt aufklappbar (Zeit/Ort/Link), `allDay`-Feld ergänzt,
  Yamuna-Seite umbenannt zu "YAMUNA", Video/Bilder vor die Downloads
  verschoben, Kartenbild-Ausschnitt feinjustiert (2026-08-06)
- SSL-Zertifikat aktiv, HTTPS erzwungen, Seite vollständig live ohne Warnungen
- Jakob-Manz-, Jakob-Bänsch- und Härtel/Asal-Duo-Unterseiten mit YouTube-Videos
  (Links kamen direkt vom Kunden, da Wayback Machine nicht erreichbar war)
- Projekt-Bilder von Graustufen auf Farbe umgestellt, Bio-Seite um Portraitfoto ergänzt
- Sprachumschalter EN/DE/ES ergänzt (nachträglicher Wunsch, nicht im
  Ursprungsplan) — Default Englisch, merkt sich Wahl, Legal-Seiten ausgenommen
- Kalender-Sync-Pipeline gebaut und mit echten Terminen erfolgreich getestet
- GitHub-Repo angelegt, Pages aktiviert, Custom Domain + DNS bei Strato
  eingerichtet, Seite deployt
- Grundgerüst: alle Hauptseiten, Startseite ohne Yamuna/Discover-Zwang,
  Social-Icon-Bug behoben, Inhalte/Bilder von der alten WordPress-Seite übernommen
