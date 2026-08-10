# HANDOFF — leoasal.com

Lebendes Übergabedokument für diesen Ordner. Bei jeder wesentlichen Änderung
aktualisieren, nicht nur anhängen — veraltete Abschnitte korrigieren.
**Proaktiv aktualisieren und committen, ohne dass Leo danach fragen muss** —
direkt im Anschluss an die eigentliche Änderung, als fester Teil davon.
**Seit 2026-08-07 gilt das auch fürs Pushen selbst:** Leo will vorm
`git push` nicht mehr gefragt werden ("frag mich ab jetzt nicht mehr...
mach es einfach von alleine") — lokal testen wie gewohnt, dann direkt
committen + pushen, ohne Rückfrage.

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

**Privater Ordner `Website Kalender/`** liegt in diesem Repo-Verzeichnis,
ist aber bewusst in `.gitignore` eingetragen und wird **nie committet** —
das Repo ist öffentlich, der Ordner enthält private Notizen (aktuell: ein
Handoff-Dokument für einen separaten Agenten, der Leos persönlichen
Kalender nach Konzerten durchsucht und öffentliche Termine in "Website
Termine" einträgt). Nicht versehentlich mit `git add -A` o.ä. doch
committen (2026-08-08).

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
                               Jakob Bänsch, Ketzberg, Loft Arts — jede eigene Unterseite,
                               jede Karte hat ein Bild + Subtitle
yamuna.html                   YAMUNA (nicht mehr "YAMUNA EPK"): eigene Überschrift oben,
                               dann Album-Block ("Out now" + Front-/Back-Cover, beide als
                               Lightbox anklickbar, "Listen/Buy Vinyl" UNTER den Covern),
                               dann Beschreibung, Pressefotos, Videos, Downloads
jakob-manz-project.html       Beschreibung + kleiner Icon+Domain-Link (jakobmanz.de,
                               `.project-link`) + 5 YouTube-Videos
jakob-baensch-quartett.html   Beschreibung + kleiner Icon+Domain-Link (jakobbaensch.com) +
                               5 Fotos als Farbgalerie + 3 YouTube-Videos
haertel-asal-duo.html         Album-Block oben ("Out now" + Cover + 4 Fotos daneben als
                               2x2-Grid, alle klickbar via Lightbox, "Buy CD"-Link
                               darunter), dann Beschreibung + 4 YouTube-Videos
ketzberg.html                 Beschreibung + kleiner Icon+Domain-Link (ketzberg.com) +
                               5 Bandfotos als Graustufen-Galerie + 7 YouTube-Videos
loft-arts.html                Echter Beschreibungstext (Agentur-Info + Leos Rolle als
                               Schlagzeuger/Musical Director) + Icon+Domain-Link
                               (loft-arts.com) + 12 YouTube-Videos (Reihenfolge: 4x
                               Megaloh, Novaa, Teesy, MAJAN, Woodie Smalls, OG Keemo,
                               Lostboi Lino, Buffala, Joshua J)
contact.html                  Nur noch E-Mail — Social-Icons sind jetzt im Header (s.u.),
                               nicht mehr extra auf dieser Seite
impressum.html, datenschutz.html   IMMER Deutsch, kein Sprachumschalter (bewusste
                               Entscheidung: rechtlich verbindliche Fassung)
```

Gemeinsames Muster pro Seite: Header mit Logo + Nav + Sprachumschalter,
Content in `<main>`, `<nav class="mobile-nav">` (nur <800px sichtbar),
Footer mit Impressum/Datenschutz/Sprachumschalter-Kopie fürs Handy. Neue
Seiten am besten von einer bestehenden ähnlichen Seite kopieren statt neu
aufbauen, damit nichts vergessen wird.

Header-Nav (ab `min-width: 800px`): `.site-nav` ist `display: flex`, Haupt-
links (`ul`) und Sprachumschalter (`.lang-switch`) sitzen dadurch auf einer
Zeile, Sprachumschalter rechtsbündig mit Trennstrich (2026-08-07, vorher
stand der Umschalter darunter statt daneben).

**Social-Icons sind Teil des Headers**: `.logo`, `.site-social` und
`.site-nav` sind **direkte Flex-Geschwister** in `.site-header .container`
(kein Wrapper-Div mehr — bewusst entfernt, siehe unten). `.container` ist
`display:flex; justify-content:space-between` **immer** (nicht nur ab
800px). Das ergibt automatisch:
- **Mobil** (`.site-nav` ist `display:none`): nur 2 sichtbare Items →
  Logo links, Icons rechts, Lücke dazwischen frei.
- **Desktop** (`.site-nav` sichtbar): 3 Items → `space-between` verteilt
  den Icons-Block **exakt mittig** in die Lücke zwischen Logo und "Bio"
  (dem ersten Nav-Link). Das war explizit so gewünscht — nicht wieder auf
  eine `.brand-group`-Wrapper-Lösung umbauen, die zieht die Icons direkt
  neben den Logo-Text statt sie mittig zu verteilen (2026-08-07).

Aktuell: Instagram, Facebook, Spotify, Apple Music, Tidal — inline SVGs,
identisch in allen 12 HTML-Dateien. Bei neuen Seiten unbedingt aus einer
bestehenden Seite kopieren, nicht neu tippen (sonst Copy-Paste-Fehler bei
den langen SVG-Paths). Frühere Versuche (nur auf der Startseite im Hero-
Bild, nur auf der Kontaktseite inline im Content, dann eine Zwischenlösung
mit `.brand-group`-Wrapper) wurden alle verworfen und entfernt.

Die 5 Projekt-Unterseiten (Yamuna, Jakob Manz, Jakob Bänsch, Härtel/Asal,
Loft Arts) haben im `.page-header` statt eines reinen "Project"-Textes einen
klickbaren Zurück-Link (`.back-link`, Pfeil-SVG + `nav.projects`-Text) auf
`projects.html` — bei neuen Projekt-Unterseiten dieses Pattern übernehmen,
nicht wieder einen reinen Text-Eyebrow einbauen (2026-08-07). Die Haupt-
Nav-Seiten (Bio/Dates/Projects/Contact) behalten ihren normalen Text-Eyebrow.

## i18n (EN/DE/ES)

- `assets/js/i18n.js` liest `assets/i18n/{en,de,es}.json`, ersetzt alles mit
  `data-i18n="key"` (innerHTML) bzw. `data-i18n-attr="attr:key"`.
- Default-Sprache Englisch, Auswahl in `localStorage['lang']`, gilt seitenübergreifend.
- **Impressum/Datenschutz bewusst ausgenommen** — kein Sprachumschalter dort.
- Dynamisch nachgeladener Inhalt (z.B. Termine) muss nach dem Rendern
  `window.i18nRefresh()` aufrufen, sonst bleibt er unübersetzt bei
  Sprachwechsel/Reload-Race — siehe `assets/js/dates.js` als Beispiel.
  `window.i18nRefresh()` verarbeitet seit 2026-08-07 auch `data-i18n-attr`
  (vorher nur `data-i18n`/innerHTML) — nötig, damit dynamisch eingefügte
  Elemente wie das Location-Icon ein übersetztes `aria-label` bekommen.
- Neuen Text immer in **allen drei** JSON-Dateien ergänzen, nicht nur Englisch.

## Kalender-Sync (Apple Calendar → dates.html)

- Leo pflegt einen eigenen iCloud-Kalender "Website Termine", öffentlich
  freigegeben (webcal-Link → https:// umgeschrieben).
- Link liegt als Repo-Secret `CALENDAR_URL` (Settings → Secrets and
  variables → Actions) — nicht im Code, nicht im Chat wiederholen.
- `.github/workflows/sync-calendar.yml` läuft alle 6h + manuell auslösbar
  (`gh workflow run sync-calendar.yml` oder im Actions-Tab).
- `scripts/sync-calendar.js` parst das ics, schreibt `data/dates.json`:
  `{ title, location, start (ISO), allDay (bool), url }`. `url` kommt primär
  aus dem **URL-Feld** des Kalendereintrags (ics-Property `URL:`), Fallback:
  erste Zeile der Notizen. Beides akzeptiert auch **Domains ohne Schema**
  (z.B. `jakobmanz.de` statt `https://jakobmanz.de`) — wird automatisch mit
  `https://` ergänzt, da Leo es i.d.R. so eintippt.
- **Mehrtägige ganztägige Termine** (Festival, Kreuzfahrt o.ä.): `DTEND` wird
  jetzt mitgelesen (vorher komplett ignoriert). Nur wenn er vom Startdatum
  abweicht, bekommt der JSON-Eintrag zusätzlich ein `end` (inklusives
  letztes Tagesdatum, ICS-`DTEND` ist ja exklusiv → in `shiftIsoDate(-1)`
  umgerechnet). `dates.js` zeigt dann eine Spanne wie "16.–23. Okt 2026"
  (`formatDateRange()`) statt nur des ersten Tages; beim Re-Export in
  `dates.ics` wird die Spanne wieder korrekt in ein exklusives `DTEND`
  zurückgerechnet. Eintägige Termine bekommen weiterhin kein `end`-Feld
  (Format bleibt für die bestehenden Konsumenten unverändert) (2026-08-08).
- **Vergangene Termine**: `sync-calendar.js` schreibt sie seit 2026-08-09
  mit in `data/dates.json` (vorher hart auf "Startdatum ≥ jetzt-1Tag"
  gefiltert). `dates.js` teilt beim Rendern in `upcoming`/`previous` auf;
  `previous` (neuestes zuerst) landet als flache Liste in einem
  eingeklappten `<details id="dates-previous">` / `<ul id="dates-list-
  previous">` unter der normalen Liste, komplett versteckt wenn leer.
  (Kurzzeitig gab es hier eine Gruppierung nach Jahr mit verschachtelten
  `<details>` pro Jahr — auf Leos Wunsch am selben Tag wieder auf die
  flache Liste zurückgebaut, falls das Bedürfnis nochmal aufkommt.) Der
  öffentliche `dates.ics`-Abo-Feed bleibt bewusst nur-zukünftig gefiltert
  (niemand will hunderte vergangene Konzerte in seiner Kalender-App).
- `dates.json` wird **nur vom Workflow verwaltet** — nicht von Hand
  reinschreiben und committen (außer kurz zum lokalen Testen, danach
  zurücksetzen, siehe Git-History für ein Beispiel).
- Frontend (`assets/js/dates.js`): jeder Termin ein `<details>`-Element,
  antippen/klicken zeigt Zeit (falls nicht `allDay`), Ort und Link (falls
  vorhanden). Bewusst kein Hover-only-Pattern, damit es auf dem Handy genauso
  funktioniert wie am Desktop.
- Zeit, Ort und URL zeigen jeweils ein Icon statt eines Text-Labels (Uhr/
  Pin/Pfeil, alle `role="img"` + `data-i18n-attr="aria-label:dates.X"` fürs
  Screenreader-Label — die i18n-Keys `dates.time`/`dates.location`/
  `dates.moreInfo` liefern jetzt nur noch den `aria-label`, keinen
  sichtbaren Text mehr). Das URL-Icon war zuerst ein Info-Kreis (i), auf
  Leos Wunsch durch einen simplen ">"-Pfeil ersetzt (`ICON_ARROW` in
  `dates.js`) — gleiches Icon auch auf den `.project-link`-Zeilen bei
  Jakob Manz/Jakob Bänsch/Loft Arts (2026-08-08).
- Ort ist klickbar → verlinkt auf Google-Maps-Suche
  (`https://www.google.com/maps/search/?api=1&query=...`), und darunter
  liegt ein eingebettetes Google-Maps-Preview (`.date-map` iframe,
  `output=embed`-Trick, kein API-Key nötig). **Kein Apple-Maps-Link mehr**
  (auf Leos Wunsch entfernt, 2026-08-07).
- Der URL-Link zeigt die **rohe Domain ohne Schema** als Linktext (z.B.
  `jakobmanz.de`, via `displayUrl()` in `dates.js`, strippt `https://`),
  nicht mehr "More information" als Phrase. Location- und URL-Link sind
  **nicht mehr fett** (nur `text-decoration: underline`), auf Leos Wunsch
  (2026-08-07).
- `.dates-list` hat **kein `max-width: 68ch` mehr** — die Termin-Zeilen
  sind jetzt so breit wie der `.container` (960px), damit auch lange
  Adressen (z.B. "Sommernachtskino Tübingen, Brunnenstraße 3, ...") in
  eine Zeile neben das Pin-Icon passen, statt umzubrechen (2026-08-07).
- **Wichtig (2026-08-07):** Commits, die der Sync-Workflow selbst mit dem
  Standard-`GITHUB_TOKEN` pusht, lösen **keinen** neuen `Deploy Pages`-Run
  aus — GitHub verhindert das bewusst (Loop-Schutz: Events von
  `GITHUB_TOKEN` triggern keine anderen Workflows). Deshalb triggert
  `sync-calendar.yml` am Ende jetzt explizit `gh workflow run deploy-pages.yml`,
  wenn sich `dates.json` geändert hat (Schritt "Trigger Pages deploy",
  braucht `permissions: actions: write`). Ohne das würde jeder automatische
  6h-Sync zwar committen, aber nie live gehen.

### Kalender-Abo (2026-08-08)

Fans können den Kalender abonnieren, ohne dass Leos private iCloud-Feed-URL
(das `CALENDAR_URL`-Secret) veröffentlicht werden muss:

- `scripts/sync-calendar.js` schreibt jetzt zusätzlich zu `data/dates.json`
  auch **`data/dates.ics`** — ein eigener, öffentlicher RFC5545-Feed mit
  denselben Terminen (Funktion `buildIcs()`). `sync-calendar.yml` committet
  und deployt beide Dateien zusammen (`git diff`/`git add` prüft jetzt
  beide Pfade).
- **Zeitzone:** `e.start` ist entweder ein echtes UTC-`Z`-Datum oder (der
  Normalfall bei Leos Kalender) eine "floating" lokale Zeit ohne Zeitzone.
  Floating-Zeiten werden als `DTSTART;TZID=Europe/Berlin:...` geschrieben
  statt als `Z`-UTC-Zeit — sonst zeigen Abonnenten-Apps die Termine 1–2h
  falsch an (Sommer-/Winterzeit-Verschiebung). Bei ganztägigen Terminen
  `VALUE=DATE`, kein Zeitzonen-Thema.
- Keine echten Event-Enddaten vorhanden → Fallback: 2h-Slot für Termine mit
  Uhrzeit, 1 Tag für ganztägige Termine (`addHoursToDateTimeDigits`/
  `addDaysToDateDigits`, reine Wall-Clock-Arithmetik via `Date.UTC`, absichtlich
  zeitzonen-unabhängig von der Umgebung, in der das Skript läuft).
- Frontend: `dates.html` hat einen "Subscribe to this calendar"-Link
  (`webcal://leoasal.com/data/dates.ics` — funktioniert direkt in Apple
  Calendar/Outlook) plus einen kleinen Hinweistext für Google Calendar
  (das braucht "Einstellungen → Kalender hinzufügen → Per URL" mit der
  `https://`-Variante, reagiert nicht auf `webcal://`-Klicks). Sitzt
  **unterhalb** der Terminliste (`.dates-subscribe`, `margin-top: 3.5rem`
  für sichtbaren Abstand zum letzten Termin) — bewusst nicht oben, auf
  Leos Wunsch (2026-08-08).
- GitHub Pages liefert `.ics`-Dateien automatisch mit
  `Content-Type: text/calendar` — kein Workaround nötig.
- Lokal ohne Node lässt sich der echte Sync nicht testen (s.u.); beim
  ersten Rollout wurde `data/dates.ics` einmalig per Python-Skript von
  Hand nachgebaut (mit identischer TZID-Logik) und nach dem ersten echten
  `gh workflow run sync-calendar.yml` durch die Node-Version überschrieben
  — falls nochmal nötig, lieber gleich den Workflow triggern statt lokal
  nachzubauen.

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
  Am Ende immer live gegenchecken (`curl -s https://leoasal.com/... | grep ...`
  nach einer eindeutigen neuen CSS-Klasse/Textstelle bzw. `curl -I` auf
  `last-modified`), nicht nur dem Workflow-Status vertrauen — und **beim
  Session-Start immer erstmal prüfen, ob es noch unerledigte/hängende
  Deploys vom letzten Mal gibt**, bevor man annimmt, der letzte Push sei live.

  **Korrektur (2026-08-07): Der "GitHub-weite Runner-Ausfall" vom 2026-08-06
  war eine Fehldiagnose.** Tatsächliche Ursache: Der Workflow hat
  `concurrency: { group: "pages", cancel-in-progress: false }`
  (`.github/workflows/deploy-pages.yml`). Ein einzelner Run blieb auf
  `waiting` hängen (Ursache dafür unklar — evtl. doch ein kurzer, echter
  Runner-Hänger) und **blockierte durch die Concurrency-Gruppe alle
  nachfolgenden Runs**, die dann ebenfalls auf `pending`/`waiting` standen —
  das sah nach einem plattformweiten Ausfall aus, war aber nur dieser eine
  Zombie-Run. `githubstatus.com` zeigte die ganze Zeit "All Systems
  Operational". **Fix bei hängendem `waiting`/`pending` über mehrere
  Minuten:** zuerst den ältesten hängenden Run canceln
  (`gh run cancel <id> --repo leoasal/leoasal-website`), dann erst neu
  triggern falls nötig — nicht einfach nur neu triggern, das reiht sich
  nur hinten in der gleichen blockierten Gruppe ein.
- **Kein Homebrew, kein Node lokal** in diesem Environment — gh CLI läuft
  als portable Binary (s.o.), der Kalender-Sync läuft nur in der GitHub
  Action (dort ist Node vorhanden), nicht lokal testbar ohne eigenes Node.

## Offene Punkte / mögliche nächste Schritte

- Kein offener inhaltlicher Task-Rückstand; alles unten in "Erledigt" ist
  umgesetzt und live verifiziert. Neue Wünsche einfach hier oben ergänzen,
  sobald sie reinkommen, und nach Erledigung nach unten verschieben.

## Erledigt (chronologisch, neueste zuerst)

- Jakob-Bänsch-Galerie auf 4 Fotos reduziert (5. Foto entfernt, zu nah am
  4.). Neues Projektkarten-Vorschaubild: Bandfoto aller 4 Musiker vor der
  Kirche (`JakobBänsch-221.jpg`, gleiche Nürnberg-26.5.23-Session wie das
  vorherige Vorschaubild) statt des Performance-Fotos (2026-08-10)
- Yamuna: gleiches Muster wie beim 4. Pressefoto — auch `yamuna-press-2.jpg`
  lag nur als Graustufen-Datei im Repo, obwohl die Aufnahme
  (`2302_Yamuna_173.jpg`, gleiche Session wie press-4) original farbig war.
  Farboriginal in `.../YAMUNA/2023/Initiative Musik Foe-Ru 56/Bilder/`
  gefunden (Leo hatte den Ordnerpfad direkt mitgeschickt), quadratisch auf
  2043x2043 zugeschnitten (passend zu den anderen 3 Fotos), Datei ersetzt +
  `.cover-trigger--color` ergänzt. Falls weitere Pressefotos betroffen
  sind: gleiche Kanal-Differenz-Prüfung wie oben beschrieben nutzen
  (2026-08-10)
- Jakob-Bänsch-Quartett-Seite: 5-Foto-Galerie ergänzt (Gruppenfoto vor
  Rolltor + 3 Drum-Studio-Shots inkl. Doppelbelichtung, aus
  `.../Jakob Bänsch/Jakob Bänsch Quartett/2024/Bilder Studio/` in iCloud —
  Leo hatte die Fotos direkt im Chat gepostet, ohne Dateipfad; Zuordnung
  zu den Originaldateien per visuellem Abgleich der Aufnahmen). Neues
  Projektkarten-Vorschaubild (`project-jakob-baensch.jpg`): Live-Foto vom
  Nürnberg-Konzert 26.5.23 (Kirche, Klavier/Bass/Trompete/Schlagzeug,
  blau/rot beleuchtet) aus `.../2023/Bänsch Nürnberg 26.5.23/Bilder (Tom
  Schneider)/JakobBänsch-62.jpg`, ebenfalls per Bildvergleich gefunden.
  Beide Foto-Quellen liegen NICHT im Repo, nur lokal in iCloud — falls
  nochmal gebraucht: Dateinamen/Pfade oben (2026-08-10)
- Yamuna: Kanal-Differenz-Analyse (R/G/B-Werte vergleichen) ergab, dass
  von den 4 Pressefotos nur `yamuna-press-4.jpg` original farbig war
  (die anderen 3 sind echte Graustufen-Dateien, kein Filter). Neue Klasse
  `.cover-trigger--color` hebt den Graustufen-Filter gezielt nur für
  dieses eine Bild auf — nützliche Technik für ähnliche Fälle: bei
  Unsicherheit, ob ein Bild originalfarbig war, `PIL` R/G/B-Kanäle
  vergleichen statt zu raten (2026-08-10)
- Ketzberg-Bandfoto (#6 in der Galerie) durch hochauflösende Version
  ersetzt — die vorherige Datei stammte von der 550x550-Vorschau auf
  `project-ketzberg.jpg`, Leo hat das Originalfoto nachgereicht
  (`230909_shotbysvenja_ketzberg_braunschweig_72.jpg`, gleiche Aufnahme),
  jetzt wie die anderen Galerie-Fotos auf 1600px lange Kante skaliert
  (2026-08-10)
- `dates.html` Mobile-Layout: mehrzeilige Adressen (langer Venue-Name +
  Adresse) rutschten beim Zeilenumbruch unter das Pin-Icon zurück an den
  linken Rand, statt eingerückt neben dem Icon zu bleiben. `.date-detail`
  von `flex` (mit `flex-wrap`, dadurch sprang der ganze Text-Block bei zu
  wenig Platz in eine neue Zeile ab Container-Rand) auf `grid` mit fixer
  Icon-Spalte (`grid-template-columns: 1.1em 1fr`) umgestellt — betrifft
  alle drei Detail-Zeilen (Uhrzeit, Adresse, Mehr-Infos-Link) einheitlich,
  Desktop-Ansicht unverändert (2026-08-09)
- Ketzberg-Galerie auf 4 Fotos reduziert: Gruppenfoto (#1) und zweites
  Drum-Foto (#4) entfernt (samt Bilddateien), neues Bandfoto (#6) an den
  Anfang, die beiden mittleren (Drums/Neon-Schild) getauscht — Reihenfolge
  jetzt 6-3-2-5. Deploy schlug beim ersten Versuch mit "Multiple artifacts
  named github-pages" fehl (transienter GitHub-Actions-Fehler, nichts mit
  dem Inhalt zu tun) — einmal manuell neu getriggert
  (`gh workflow run deploy-pages.yml`), lief danach durch (2026-08-09)
- Härtel/Asal Duo: 4 kleine Fotos brachen auf Mobile linksbündig um
  (Weißraum rechts sichtbar größer als links) — `justify-content:center`
  auf `.epk-covers--mixed` behebt das, ab 700px zurück auf `flex-start`
  (2026-08-09)
- Ketzberg-Galerie war fälschlich zwangsweise auf Graustufen gesetzt
  (gleiche `.epk-gallery`-Klasse wie Yamuna) — neue Modifier-Klasse
  `.epk-gallery--color` hebt den Filter auf. **Wichtig für künftige
  Foto-Arbeiten: Fotos, die farbig geliefert werden, bleiben farbig —
  nicht von selbst auf Graustufen umstellen, außer explizit gewünscht.**
  Alle 6 Ketzberg-Fotos (das 6. ist `project-ketzberg.jpg`, als
  `ketzberg-photo-6.jpg` in die Galerie kopiert) jetzt einzeln per
  Lightbox anklickbar, genau wie Yamunas Albumcover. Yamunas 4 Press-Fotos
  sind jetzt ebenfalls anklickbar (Lightbox), ihr Graustufen-Filter blieb
  bewusst unverändert (2026-08-09)

- Loft-Arts-Videos neu sortiert (4x Megaloh, Novaa, Teesy, MAJAN, Woodie
  Smalls, OG Keemo, Lostboi Lino, Buffala, Joshua J) + neues Joshua-J-Video
  ergänzt (jetzt 12 statt 11). Die beiden unbeschrifteten Megaloh-Videos
  ("Zombiemodus", "Gordon Shumway") per YouTube-oEmbed `author_name`
  verifiziert, da der Titel selbst keinen Künstlernamen enthielt
  (2026-08-09)
- Ketzberg bekam eine eigene Projekt-Unterseite (`ketzberg.html`) statt nur
  extern zu verlinken — gleiches Muster wie Jakob Manz/Bänsch: Beschreibung
  (bisher nur Karten-Subtitle auf projects.html, jetzt zusätzlich als
  `ketzberg.description`-i18n-Key), Icon+Domain-Link zu ketzberg.com, 5
  Bandfotos (von Svenja, Konzert im Berliner Junction Café) als
  Graustufen-Galerie (gleiches Pattern wie Yamunas Press-Fotos), 7
  YouTube-Videos. `projects.html`-Karte verlinkt jetzt intern statt mit
  `target="_blank"` (2026-08-09)
- "Vorherige Termine"-Archiv kurz nach Jahr gruppiert (pro Jahr ein
  eigenes `<details>`), auf Leos Wunsch am selben Tag wieder zurück auf
  die flache Liste (2026-08-09)
- Kalender-Sync-Workflow kann jetzt auch von Claude selbst ausgelöst
  werden (`~/.local/gh-cli/.../gh workflow run sync-calendar.yml`,
  s. Abschnitt "GitHub-Zugriff in diesem Environment") — vorher fälschlich
  angenommen, das ginge nicht, weil `gh` nicht im Standard-PATH der
  Bash-Tool-Sandbox liegt (2026-08-09)
- Bahn-Fahrten ohne bahn.de-Link im Titel (z.B. "Basel SBB ➞ Köln Hbf")
  rutschen durch den reinen URL-basierten Bahn-Filter — beim nächsten
  Kalender-Cleanup zusätzlich auf "➞" im Titel prüfen (2026-08-09)
- Härtel/Asal-Duo: 4 kleine Fotos nach dem Verkleinern (15.5rem) auf
  Mittelweg 16.75rem wieder etwas vergrößert — `align-items:center` sorgt
  weiterhin automatisch für gleichen Weißraum ober-/unterhalb, unabhängig
  von der genauen Größe (2026-08-09)
- Härtel/Asal-Duo: die 4 kleinen Fotos nochmal etwas verkleinert
  (`.epk-covers-extra` max-width 18rem → 15.5rem) und `align-items: center`
  statt `flex-start` auf `.epk-covers--mixed` — das Foto-Grid ist jetzt
  vertikal mittig neben dem (höheren) Cover ausgerichtet, gleich viel
  Weißraum ober- und unterhalb (2026-08-09)
- Härtel/Asal-Duo-Fotogrid nachjustiert: Cover war zunächst größer als
  Yamunas Cover und die 4 kleinen Fotos hatten ungleiche Abstände
  (Reihen-Höhe > Bild-Höhe durch einen Stretch/aspect-ratio-Konflikt in
  CSS Grid). Fix: `aspect-ratio:1` sitzt jetzt auf dem
  `.epk-covers-extra`-Grid-Container selbst statt auf den einzelnen
  Bildern, plus `align-items:flex-start` auf `.epk-covers--mixed`, damit
  der Flex-Container das Grid nicht auf Cover-Höhe streckt. Cover-Größe
  jetzt exakt `19.375rem`/`21.375rem` (mobil/≥700px) — identisch zu den
  einzelnen Front/Back-Covern bei Yamuna. Lehre für ähnliche Fälle:
  `aspect-ratio` auf Grid-/Flex-*Items* kollidiert mit Default-Stretch —
  lieber auf den Container setzen und Kinder explizit füllen lassen
  (2026-08-09)
- Härtel/Asal-Duo-Seite: Album-Block ganz oben, analog zu Yamuna —
  "Out now"-Eyebrow + Albumtitel „Ein Tag wie ein anderer", Cover +
  restliche 4 Fotos (CD-Objekt-Shots, Booklet-Innenseite) alle klickbar via
  Lightbox. Layout: Cover links + 2×2-Foto-Grid rechts daneben (neue
  Klassen `.epk-covers--mixed`/`.epk-covers-extra`, ersetzt die zunächst
  gebaute Graustufen-Galerie unter der Beschreibung — auf Leos Wunsch
  stattdessen direkt neben dem Cover, in Farbe). Neuer Hover-Effekt auf
  `.cover-trigger img` (leichtes Scale beim Hover) gilt jetzt site-weit für
  alle Cover-Trigger-Bilder, auch Yamuna. Plus "Buy CD"-Link
  (charlyhaertel.de/shop) unter dem Album-Block — bewusst eigener Text
  statt Yamunas "Listen / Buy Vinyl", per neuem i18n-Key
  `haertelasal.buyCd` übersetzt (DE "CD kaufen", ES "Comprar CD"). Neue
  i18n-Keys `haertelasal.eyebrow`/`albumLine` in allen 3 Sprachen
  (2026-08-09)
- Termine: Datum-/Zeit-Strings werden jetzt bei Sprachwechsel neu formatiert
  (Monatsnamen, Reihenfolge — z.B. "Aug 12, 2026" vs. "12. Aug. 2026" vs.
  "12 ago 2026"). Vorher wurden sie nur beim initialen Laden per
  `toLocaleDateString()` gerendert und blieben nach einem späteren
  Sprachwechsel unverändert stehen, da nur die `data-i18n`-Labels aktualisiert
  wurden, nicht die bereits fertig gerenderten Termin-Strings. Fix: `i18n.js`
  feuert nach jedem Sprachwechsel ein `langchange`-Event, `dates.js` cached
  die geladenen Termine und rendert bei diesem Event neu (2026-08-09)
- Mehrtägige Termine (Festival/Kreuzfahrt) zeigen jetzt eine Datumsspanne
  ("16.–23. Okt 2026") statt nur des ersten Tages — `DTEND` wurde bisher
  komplett ignoriert. Details siehe Abschnitt "Kalender-Sync" (2026-08-08)
- Loft-Arts-Seite: 4 weitere Videos ergänzt (insgesamt jetzt 11) (2026-08-08)
- Jakob-Manz-Project-Seite: 3 weitere Videos ergänzt (insgesamt jetzt 5)
  (2026-08-08)
- Eigenes Favicon statt Safaris automatisch generiertem Magenta-Monogramm:
  `assets/images/favicon.svg` (rundes Quadrat in `--ink` #0a0a0a, "LA" in
  Georgia Bold — Fallback aus dem `--font-display`-Stack, da Playfair
  Display nur als woff2 vorliegt und hier kein Tool zum Konvertieren nach
  TTF verfügbar war; optisch praktisch identisch), dünne `--accent`-Linie
  darunter. Plus PNG/ICO-Fallbacks (`favicon-16.png`, `favicon-32.png`,
  `favicon.ico`, `apple-touch-icon.png` 180px, generiert per PIL-Skript,
  System-Font Georgia Bold) für ältere Browser/iOS-Homescreen. `favicon.ico`
  liegt zusätzlich im Repo-Root (Browser-Default-Lookup). Auf allen 12
  Seiten per `<link rel="icon"/apple-touch-icon>` im `<head>` verlinkt
  (2026-08-08)
- YAMUNA-Seite bekam eine eigene Social-Icon-Zeile (Instagram, Spotify,
  Tidal, Apple Music — YAMUNAs eigene Profile, nicht Leos) im
  `.page-header`, rechts neben "‹ Projects"/"YAMUNA". Neue CSS-Klassen
  `.page-header-with-social` (flex, `justify-content: space-between`,
  `align-items: flex-start`) + `.page-header-social` machen `.page-header`
  zum Flex-Container, ohne die bestehenden `.page-header`-Vorkommen auf
  anderen Seiten zu beeinflussen (diese nutzen weiterhin nur die einfache
  `.page-header`-Klasse ohne den Modifier). Icon-Markup/Styling wiederverwendet
  `.site-social` aus dem Header. Bei Bedarf gleiches Pattern für andere
  Projekt-Unterseiten übernehmen (2026-08-08)
- Kalender-Abo-Link von oberhalb nach **unterhalb** der Terminliste
  verschoben (mit deutlich mehr Abstand zum letzten Termin, `margin-top:
  3.5rem`). Separates, nicht-committetes Handoff-Dokument für einen neuen
  Agenten angelegt (`Website Kalender/`-Ordner, per `.gitignore` vom
  öffentlichen Repo ausgeschlossen), der Leos persönlichen Kalender nach
  Konzerten durchsuchen und öffentliche Termine in "Website Termine"
  eintragen soll (2026-08-08)
- Header-Layout korrigiert: `.brand-group`-Wrapper wieder entfernt, Logo/
  Icons/Nav sind jetzt direkte Flex-Geschwister — dadurch landen die Icons
  auf Mobil rechts (Logo links, Lücke dazwischen) und auf Desktop exakt
  mittig zwischen Logo und "Bio" (Details oben unter "Seitenstruktur").
  Kalender- und Projekt-Link-Icon (vorher Info-Kreis) ist jetzt ein
  einfacher ">"-Pfeil. Neues Feature: Kalender-Abo als `.ics`-Feed zum
  Selbst-Abonnieren in Apple/Google/Outlook-Kalendern, ohne Leos privaten
  iCloud-Link preiszugeben (Details oben unter "Kalender-Sync") (2026-08-08)
- Social-Icons final ins Header-`.brand-group`/`.site-social` verschoben
  (siehe "Seitenstruktur" oben) — jetzt auf allen 12 Seiten identisch oben
  links, Tidal ergänzt (`tidal.com/artist/20479911/u`). Kalender-Feinschliff:
  Zeit/Ort/URL als Icons statt Text-Label, Location-/URL-Link nicht mehr
  fett, URL zeigt rohe Domain statt "More information", `.dates-list` ohne
  68ch-Cap (volle Container-Breite, lange Adressen passen jetzt in eine
  Zeile). "Visit website"-Buttons auf Jakob-Manz-/Jakob-Bänsch-/Loft-Arts-
  Seite durch kleinen Icon+Domain-Link (`.project-link`, gleiches Info-Icon
  wie im Kalender) ersetzt. Loft-Arts-Karte auf projects.html hat jetzt
  einen Subtitle wie die anderen Karten. Leo will ab jetzt **nicht mehr vor
  jedem Push gefragt werden** (s.o., 2026-08-07)
- Loft Arts bekam einen echten Beschreibungstext (Agentur-Info von Leo
  Stolz/Niklas von Klitzing + Leos eigene Rolle als Schlagzeuger/Musical
  Director, in allen 3 Sprachen umformuliert statt 1:1 von der Loft-Arts-
  Website übernommen) und 3 weitere Videos (Novaa, Woodie Smalls, MAJAN
  live — insgesamt jetzt 7). Social-Icons: Instagram/Facebook auf der
  Startseite ergänzt, dann auf Leos Wunsch von "unter Leo Asal" zu fest
  positioniert **oben links auf dem Hero-Bild** verschoben (`.hero-social`,
  `position: absolute`, unabhängig vom Namens-Schriftzug); dabei auch
  Spotify + Apple Music ergänzt (auf Startseite UND Kontaktseite) — Leo
  hatte den Apple-Music-Link fälschlich "Tidal" genannt, das war die
  einzige Rückfrage nötig (2026-08-07)
- Nav-Layout, Zurück-Links, Kalender-Feinschliff, Loft-Arts-Bild (alles
  2026-08-07): Header-Nav und Sprachumschalter jetzt auf einer Zeile statt
  übereinander; die 5 Projekt-Unterseiten haben einen "‹ Projects"-Zurück-
  Link statt reinem "Project"-Text (Muster oben unter "Seitenstruktur"
  dokumentiert); Kalender zeigt Pin-/Info-Icons statt Text-Labels, Apple-
  Maps-Link entfernt, dafür eingebettete Google-Maps-Preview, Link heißt
  "More information" statt "Website"; Loft-Arts-Karte auf projects.html
  zeigt jetzt Leos echtes Logo statt "Photos coming soon"; "Arbeit"-Eyebrow
  auf der Projects-Seite blieb auf Leos Wunsch erhalten (kurz entfernt,
  dann zurückgeholt). Alle Punkte live verifiziert.
- Kalender-URLs gefixt: Sync-Skript liest jetzt das ics-`URL:`-Feld (statt
  nur Notizen) und akzeptiert Domains ohne `https://`-Schema. Zusätzlich
  triggert der Sync-Workflow jetzt explizit einen Pages-Deploy nach einem
  Commit, da `GITHUB_TOKEN`-Pushes sonst nie automatisch deployt worden
  wären (s.o.). Beide Termine (jakobmanz.de, jakobbaensch.com) live
  verifiziert (2026-08-07)
- Hero-Bild auf der Startseite: Text ("Drummer · Composer") saß auf Desktop-
  Breite über einem hellen Bildbereich statt über der schwarzen Hose wie
  auf Mobile. Erster Versuch war `object-position: center bottom` (Bild-
  Crop unten verankern) — **von Leo verworfen, Bildausschnitt vorher war
  ihm lieber**. Stattdessen jetzt: Bild-Crop zurück auf Standard (`object-fit:
  cover` ohne `object-position`), dafür Layout ab `min-width: 800px` geändert
  — `.hero-content` wird `display: flex; justify-content: space-between`,
  Eyebrow ("Drummer · Composer") liegt per `order: 2` rechts auf gleicher
  Grundlinie wie „Leo Asal" statt darüber. Mobile bewusst unverändert
  (gestapeltes Layout wie vorher) (2026-08-07)
- Hängenden Deploy von gestern gelöst: alter Zombie-Run in der `concurrency`-
  Gruppe "pages" gecancelt, danach lief der Deploy sofort durch. Alle
  gestrigen Änderungen (Loft-Arts, Dates-Ort/Website-Zeile, Yamuna-Position,
  Nav-Abstand) sind jetzt live und live-verifiziert. Ursache war keine
  GitHub-weite Störung, siehe korrigierter Abschnitt oben (2026-08-07)
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
