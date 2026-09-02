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

**WICHTIGE ARCHITEKTUR-ÄNDERUNG (2026-09-01, erweitert 2026-09-02):
Blog/Bio/Termine/Projekte/Kontakt sind keine eigenständigen Seiten mehr.**
Leo wollte, dass Klicken in der Nav und Runterscrollen auf der Startseite
zum exakt selben Ergebnis führen ("die Unterscheidung zwischen Scrollen und
den einzelnen Seiten soll es nicht mehr geben"). Der komplette Inhalt
dieser 5 Bereiche lebt jetzt ausschließlich als Sektionen in `index.html`
(`#blog`, `#bio`, `#dates`, `#projects`, `#contact` — in dieser
Reihenfolge, Blog zuerst direkt nach dem Hero). `blog.html`/`bio.html`/
`dates.html`/`projects.html`/`contact.html` existieren nur noch als
minimale Redirect-Stubs (`<meta http-equiv="refresh">` +
`location.replace(...)`) auf `index.html#<section>`, damit alte
Bookmarks/Backlinks nicht ins Leere laufen. **Nicht versehentlich wieder
"echte" Seiten daraus machen** — jede Änderung an
Blog/Bio/Termine/Projekten/Kontakt gehört jetzt ausschließlich in die
passende Sektion von `index.html` (Text weiter über die i18n-JSONs).
Blog war bis 2026-09-01 die "einzige echte Extra-Seite" — ist jetzt auch
eine reine Homepage-Sektion (Leo: "wie die anderen Seiten, als erstes").

```
index.html                    Startseite: Hero (Foto + Name), danach direkt im Anschluss
                               die vollständigen Sektionen #blog/#bio/#dates/#projects/
                               #contact (siehe Architektur-Hinweis oben) — abwechselnd
                               weißer/hellgrauer Hintergrund (`.home-section`/
                               `.home-section--alt`, Reihenfolge weiß/grau/weiß/grau/weiß)
                               zur optischen Trennung, großzügiger Abstand (`padding: 5rem
                               0`). Sektions-Überschriften (`h2`) bewusst zwischen h2- und
                               h1-Größe (`.home-section .page-header h2`,
                               `clamp(2rem,5.5vw,3.2rem)`) — Leo fand die h1-Größe der
                               alten Einzelseiten schön, aber beim Scrollen durch mehrere
                               Sektionen hintereinander zu groß. Blog-Sektion: die 2
                               `.blog-post`-Artikel (YAMUNA-Album groß mit `.blog-post-cover`
                               + "Jakob Manz Project @ Jazzopen Stuttgart" mit 2 Videos),
                               Artikel-Titel sind hier `h3` (`clamp(1.4rem,3vw,1.75rem)`,
                               eigene Größe da globales h3 nur 1.2rem wäre). Neue
                               Blog-Einträge oben in der `#blog`-Sektion einfügen.
                               ACHTUNG: dadurch lädt die Startseite jetzt 2 youtube-nocookie-
                               iframes beim Laden (vorher 0 externe Embeds auf der Startseite)
blog.html, bio.html,          NUR NOCH REDIRECT-STUBS auf index.html#blog/#bio/#dates/
dates.html, projects.html,    #projects/#contact (s. Architektur-Hinweis oben) — kein echter
contact.html                  Inhalt mehr, keine Nav/Header/Footer, kein data-i18n
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
  den Icons-Block **exakt mittig** in die Lücke zwischen Logo und "Blog"
  (dem ersten Nav-Link, seit 2026-09-01 — vorher "Bio"). Das war explizit
  so gewünscht — nicht wieder auf eine `.brand-group`-Wrapper-Lösung
  umbauen, die zieht die Icons direkt neben den Logo-Text statt sie mittig
  zu verteilen (2026-08-07).

Aktuell: Instagram, Facebook, Spotify, Apple Music, Tidal — inline SVGs,
identisch in allen Seiten mit echtem Header (index.html, die 5
Projekt-Unterseiten, impressum.html, datenschutz.html — **nicht** in
blog.html/bio.html/dates.html/projects.html/contact.html, die sind
Redirect-Stubs ohne Header). Bei neuen Seiten unbedingt aus einer
bestehenden Seite kopieren, nicht neu tippen (sonst Copy-Paste-Fehler bei
den langen SVG-Paths). Frühere Versuche (nur auf der Startseite im Hero-
Bild, nur auf der Kontaktseite inline im Content, dann eine Zwischenlösung
mit `.brand-group`-Wrapper) wurden alle verworfen und entfernt.

Die 5 Projekt-Unterseiten (Yamuna, Jakob Manz, Jakob Bänsch, Härtel/Asal,
Loft Arts) haben im `.page-header` statt eines reinen "Project"-Textes einen
klickbaren Zurück-Link (`.back-link`, Pfeil-SVG + `nav.projects`-Text) auf
`index.html#projects` (bis 2026-09-01: `projects.html`) — bei neuen
Projekt-Unterseiten dieses Pattern übernehmen, nicht wieder einen reinen
Text-Eyebrow einbauen (2026-08-07). Blog/Bio/Dates/Projects/Contact als
Homepage-Sektionen behalten ihren normalen Text-Eyebrow.

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
- `.github/workflows/sync-calendar.yml` läuft **1x/Woche, freitags ~17:30
  CEST/16:30 CET (15:30 UTC fix im Cron, daher der DST-Versatz)** + manuell
  auslösbar (`gh workflow run sync-calendar.yml` oder im Actions-Tab). War
  bis 2026-08-20 alle 6h, auf Leos Wunsch reduziert — der lokale
  `leoasal-calendar-weekly-sync`-Task (Freitags 17:00 lokal, siehe
  `Website Kalender/leoasal-calendar-handoff.md`) triggert diesen Workflow
  nach jedem Durchlauf ohnehin selbst per `workflow_dispatch`; der
  Wochen-Cron hier ist nur der Fallback, falls die Claude-App an dem Tag
  nicht offen war.
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
  automatische Sync zwar committen, aber nie live gehen.

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

- **Bio-Portraitfoto auf der Startseite** (`#bio`-Sektion in `index.html`)
  ist aktuell nur ein Platzhalter (`assets/images/hero.jpg`, identisch zum
  Hero-Bild direkt darüber). Leo hat angekündigt, ein anderes Foto dafür zu
  schicken — sobald es da ist, in `index.html` bei `<figure
  class="bio-portrait">` den `src` austauschen (bio.html selbst existiert
  nicht mehr als eigene Seite, s. Architektur-Hinweis oben).

## Erledigt (chronologisch, neueste zuerst)

- **Blog ist jetzt auch eine Homepage-Sektion (`#blog`), als erstes direkt
  nach dem Hero** (Leo: "füge die Seite Blog auch auf die Startseite hinzu,
  wie die anderen Seiten, sie soll als erstes erscheinen"). Damit ist der
  2026-09-01-Umbau konsequent zu Ende geführt — Blog war die letzte
  verbliebene "echte" Extra-Seite. Umsetzung analog zu Bio/Termine/…:
  - Neue `<section id="blog" class="home-section">` in `index.html` vor
    `#bio`, mit den 2 bestehenden `.blog-post`-Artikeln (gleiche
    i18n-Keys `blog.*`, keine neuen Keys nötig). Sektions-Titel `h2`,
    Artikel-Titel von `h2` → `h3` heruntergestuft (Hierarchie unter dem
    Sektions-`h2`), dafür `.blog-post h3` eine eigene Größe
    `clamp(1.4rem,3vw,1.75rem)` in `style.css` gegeben (globales `h3` wäre
    nur 1.2rem). `.blog-post h2`-Regeln um `h3` erweitert.
  - `blog.html` → Redirect-Stub auf `index.html#blog` (wie bio.html etc.).
  - Alle Nav-Links `href="blog.html"` → `index.html#blog` (bzw. `#blog` auf
    index.html selbst), Desktop- + Mobile-Nav, alle 9 Seiten mit Header +
    impressum/datenschutz.
  - Alternierende Hintergründe neu ausgerichtet (blog weiß, bio grau, dates
    weiß, projects grau, contact weiß) — `home-section--alt` bei bio+projects
    ergänzt, bei dates+contact entfernt.
  - **Nebeneffekt:** die Startseite lädt jetzt 2 youtube-nocookie-iframes
    beim Laden (Jazzopen-Videos). Vorher hatte die Startseite 0 externe
    Embeds. In `datenschutz.html` sind die YT-Embeds bereits generell
    offengelegt; falls Leo die Startseite embed-frei halten will, wäre die
    Option die Jazzopen-Videos nur zu verlinken statt einzubetten.
  - Lokal verifiziert (Server auf :5173): Sektions-Reihenfolge
    `#blog/#bio/#dates/#projects/#contact`, Nav (Desktop+Mobile) Blog zuerst,
    i18n greift auf der Blog-Sektion (DE "Aktuelles" / "Das Debütalbum…"),
    Redirect-Stub `blog.html` → `index.html#blog` inkl. Sprung zur Sektion,
    kein horizontaler Overflow bei 375px, Video-Grid 1-spaltig mobil /
    2-spaltig Desktop, Cover 416px, keine Konsolenfehler. Screenshot/Scroll
    nach unten wie gewohnt unzuverlässig im Browser-Tool (YT-iframes) —
    durchgehend per DOM/computed-style geprüft (2026-09-02)
- **Große Umbauten am selben Tag (2026-09-01), chronologisch:**
  1. Neue erste Nav-Seite `blog.html` (Highlights/News/Alben) angelegt, s.
     "Seitenstruktur" oben. Nav-Link "Blog" per Skript in allen damals 13
     bestehenden Seiten (Desktop- + Mobile-Nav) ergänzt.
  2. Browser-Tab-Titel der Startseite auf reines "Leo Asal" gekürzt (vorher
     "Leo Asal – Drummer & Composer" etc., Leo fand den Untertitel im Tab
     überflüssig) — `head.index.title` in allen 3 Sprachen + `<title>`-
     Fallback in `index.html`.
  3. Homepage-Sektionen (Bio/Termine/Projekte/Kontakt) bekamen mehr
     Zeilenabstand und alternierenden weiß/hellgrau-Hintergrund zur
     optischen Trennung beim Scrollen — neue Wrapper-Klassen
     `.home-section`/`.home-section--alt` (nutzt `--bg`/`--bg-soft`,
     dieselben Farbvariablen wie der Rest der Seite, keine neue Farbe
     erfunden), `padding: 5rem 0`, `scroll-margin-top: 80px` (Ausgleich für
     den `position: sticky`-Header, `--nav-height: 64px`).
  4. **Größter Umbau: Bio/Termine/Projekte/Kontakt sind keine eigenständigen
     Seiten mehr**, siehe fetten Architektur-Hinweis oben bei
     "Seitenstruktur" — bitte unbedingt zuerst lesen, bevor an einem
     dieser 4 Bereiche etwas geändert wird. Auslöser: Leo wollte, dass
     Klick auf "Projekte" oben in der Nav zur exakt selben Stelle führt wie
     Runterscrollen bis dorthin — "die Unterscheidung soll es nicht mehr
     geben". Umsetzung: `bio.html`/`dates.html`/`projects.html`/
     `contact.html` → Redirect-Stubs auf `index.html#<section>`; alle
     Nav-Links (Desktop + Mobile, auf allen anderen Seiten) und die
     Projekt-Unterseiten-Zurück-Links zeigen jetzt auf
     `index.html#bio/#dates/#projects/#contact`; auf `index.html` selbst
     nur `#bio` usw. (kein `index.html`-Präfix nötig/sinnvoll bei
     Selbstverweis). Neues `assets/js/anchor-scroll.js` (nur auf
     `index.html` eingebunden) übernimmt das Scrollen zum Anker robust
     selbst, statt sich auf natives Browser-Verhalten zu verlassen:
     - Beim Laden mit vorhandenem `location.hash` (Ankunft über einen
       Redirect-Stub oder einen Cross-Page-Nav-Klick): **sofortiger**
       Sprung (`behavior:"instant"`, kein Smooth) nach 60ms Verzögerung
       (Layout muss sich gesetzt haben).
     - Bei Klick auf einen `a[href^="#"]`-Link während man bereits auf der
       Seite ist: `preventDefault`, `history.pushState`, dann
       **smooth** `scrollIntoView` — dadurch fühlt sich ein Nav-Klick
       genauso an wie manuelles Scrollen, wie von Leo gewünscht.
     - Setzt nach dem Scrollen `tabindex="-1"` + Fokus aufs Zielelement,
       da das Abfangen der Klicks (für den Smooth-Scroll) sonst den
       nativen Fokus-Sprung verhindert hätte — wichtig für
       Tastatur-/Screenreader-Nutzer, betrifft auch den Skip-Link
       (`#main`).
     - **Wichtiger Debugging-Fund:** `scroll-behavior: smooth` (neu global
       auf `html` gesetzt) UND `scrollIntoView({behavior:"smooth"})`
       liefen im Browser-Test-Tool dieser Session überhaupt nicht (Seite
       blieb bei `scrollY:0`, egal wie lange gewartet) — mit
       `behavior:"instant"` funktionierte es hingegen sofort exakt richtig
       (`scrollY` sprang korrekt, Zielelement landete exakt bei den
       vorgesehenen 80px unter dem Header). Sehr wahrscheinlich dieselbe
       Eigenheit wie beim Karussell-Lightbox-Feature weiter unten
       (`requestAnimationFrame` lief im Hintergrund-Tab dieses Tools nicht
       zuverlässig) — smooth-scroll-Animationen scheinen in diesem
       Testtool grundsätzlich nicht zu rendern. Deshalb bewusst nur der
       initiale Sprung auf `instant` gestellt (der Fall, der zuverlässig
       funktionieren MUSS, unabhängig vom Tool-Verhalten), während
       In-Page-Klicks smooth bleiben (dort ist die Animation ein
       Nice-to-have, kein Korrektheits-Kriterium) — in echten,
       aktiven Browser-Tabs ist smooth `scrollIntoView` Standardverhalten
       und sollte dort einwandfrei animieren.
  5. Bio-Portraitfoto ist zurück (Leo: "das fand ich schön, dass da ein
     Bild war, während man liest") — als Platzhalter aktuell wieder
     `assets/images/hero.jpg` (dasselbe Foto wie im Hero direkt darüber,
     nicht ideal, aber Leo schickt ein anderes Foto nach, dann einfach die
     Datei/den Pfad in der `#bio`-Sektion in `index.html` ersetzen).
     `.bio-portrait` floatet ab 800px rechts neben dem Fließtext (bestehende
     CSS-Regel, unverändert) — genau der "Bild während man liest"-Effekt.
  6. Homepage-Sektionsüberschriften (`.home-section .page-header h2`) auf
     einen Mittelweg zwischen normaler h2- (`clamp(1.6rem,4vw,2.2rem)`) und
     h1-Größe (`clamp(2.5rem,8vw,4.5rem)`) gebracht:
     `clamp(2rem,5.5vw,3.2rem)` — Leo fand die große h1-Größe der früheren
     Einzelseiten schön, aber beim Scrollen durch mehrere Sektionen
     hintereinander etwas zu wuchtig.
  - Lokal ausführlich verifiziert: alle 4 Redirect-Stubs landen korrekt bei
    `index.html#<section>`, Anker-Scroll trifft exakt die vorgesehene
    Position (80px Abstand), Bio-Portrait floatet ab 800px korrekt,
    Fokus-Handling funktioniert, keine Konsolenfehler. Screenshot-
    Verifikation nach Scroll-Aktionen war im Browser-Tool wie erwartet
    unzuverlässig (bekannter Blank-Screenshot-Bug) — stattdessen
    durchgehend per `getBoundingClientRect`/`scrollY`/computed style im
    DOM verifiziert.
- Termine-Sektion auf der Startseite zeigt jetzt nur die ersten 4 kommenden
  Termine, Rest hinter „Show more"/„Mehr anzeigen" (Leos Wunsch — die volle
  Liste war ihm auf der Startseite zu lang). **Nur die Startseite betroffen,
  `dates.html` zeigt weiterhin die komplette Liste unverändert.**
  Umsetzung: `<ul id="dates-list" data-limit="4">` + neuer Block
  `<details id="dates-more" hidden><summary>…</summary><ul id="dates-list-
  more">…</ul></details>` direkt danach in `index.html` — exakt das gleiche
  `<details>`-Aufklapp-Muster wie das bereits bestehende „Vorherige
  Termine". `assets/js/dates.js` prüft in `render()`, ob `#dates-more`/
  `#dates-list-more` überhaupt existieren UND `data-limit` gesetzt ist —
  nur dann wird die Liste gesplittet (erste N in `#dates-list`, Rest in
  `#dates-list-more`, `#dates-more` sichtbar gemacht); ohne diese Elemente
  (wie auf `dates.html`) läuft exakt der alte Code-Pfad, komplett
  unverändert. CSS-Selektoren von `.dates-previous` auf `.dates-more`
  miterweitert (gleicher Chevron-Look), aber bewusst **nicht** die
  `.dates-list--previous`-Klasse (die dimmt die Vergangenheits-Termine
  optisch ab — die "mehr"-Termine sind ja weiterhin normale anstehende
  Termine, sollen also normal aussehen). Neuer i18n-Key
  `dates.showMore` in allen 3 Sprachen. Lokal verifiziert: Startseite
  zeigt 4/26, Rest korrekt in "Show more", `dates.html` weiterhin alle 26,
  Aufklapp-Zustand + Übersetzung bleiben nach Sprachwechsel korrekt
  (2026-09-01)
- Startseite (`index.html`) ist jetzt eine lange scrollbare Seite: nach dem
  Hero folgen direkt die Inhalte von Bio, Termine, Projekte und Kontakt als
  eigene `<section id="bio/dates/projects/contact">`-Blöcke (Leos Wunsch:
  auf dem Laptop UND mobil soll man sich per Scrollen automatisch durch
  alle Bereiche bewegen können — die einzelnen Unterseiten bio.html/
  dates.html/projects.html/contact.html bleiben unverändert eigenständig
  aufrufbar, Header-/Mobile-Nav verlinkt weiterhin dorthin, keine Änderung
  am Verlinkungsverhalten).
  - **Bewusste Architekturentscheidung gegen ein Fetch-Include-System:**
    Die Sektionen sind direkt als HTML in `index.html` dupliziert (gleiches
    Muster wie Header/Footer, die laut diesem Dokument schon länger über
    alle 12 Seiten kopiert werden), **nicht** per `fetch()` aus den
    Einzelseiten nachgeladen. Grund: der eigentliche Text kommt so oder so
    aus den i18n-JSONs (`assets/i18n/*.json`) — Textänderungen an einer
    Stelle wirken automatisch auf Homepage UND Einzelseite, keine
    Text-Duplikation. Nur die HTML-Struktur/Bildpfade/Hrefs sind doppelt
    vorhanden (ändert sich selten). Ein Fetch-Ansatz hätte zusätzliche
    Requests, DOM-Parsing-Fragilität und vor allem ein Henne-Ei-Problem bei
    den Terminen bedeutet (dates.js müsste dann zweimal laufen/die
    gerenderte dates.html nachträglich re-hydrieren).
    **Wichtig für künftige Änderungen:** Wenn Bio-Absätze, der Termine-
    Block, die Projekt-Karten (neues Projekt, neue Reihenfolge, geänderter
    Href) oder der Kontakt-Block strukturell geändert werden, **immer
    beide Stellen aktualisieren** — die jeweilige Einzelseite UND den
    passenden Abschnitt in `index.html`. Reine Text-/Bild-Änderungen
    (i18n-JSON bearbeiten, Bilddatei ersetzen) wirken dagegen automatisch
    überall.
  - `assets/js/dates.js` läuft jetzt zusätzlich auf `index.html`
    (Script-Tag ergänzt) — funktioniert unverändert, da es rein über
    `document.getElementById("dates-list")` etc. arbeitet, ohne
    Seiten-Check.
  - Bio-Sektion auf der Startseite **ohne** das Portraitfoto
    (`bio-portrait`-Figure) eingebaut — direkt unter dem großformatigen
    Hero-Bild (das dasselbe Foto `hero.jpg` zeigt) wäre dasselbe Bild ein
    zweites Mal direkt darunter aufgetaucht, das wirkt wie ein Fehler.
    `bio.html` selbst behält das Portrait, nur die Homepage-Sektion nicht.
    Falls Leo dort doch ein (anderes) Bild möchte: einfach Bescheid geben.
  - Überschriften-Hierarchie: Hero behält das einzige `<h1>` ("Leo Asal")
    der Seite, die vier neuen Abschnitte nutzen `<h2>` (vorher auf den
    Einzelseiten jeweils `<h1>`) — semantisch korrekt, `.page-header`-CSS
    ist nicht ans Element gebunden, sieht also identisch aus.
  - Lokal verifiziert: alle vier Sektionen rendern mit korrektem Inhalt,
    Termine laden live nach (`dates.json`), Sprachumschalter wirkt auf
    Überschriften UND auf die bereits gerenderten Termin-Strings, Mobile-
    Layout (375px) zeigt den Projekt-Grid einspaltig und die mobile Nav
    korrekt. Screenshot-Verifikation nach dem Scrollen war im Browser-Tool
    wie gewohnt unzuverlässig (bekannter Blank-Screenshot-Bug dieser
    Preview-Pane) — stattdessen per `getBoundingClientRect`/computed style
    direkt im DOM geprüft (2026-08-12)
- `sync-calendar.yml`-Schedule von alle-6h auf 1x/Woche (freitags ~15:30
  UTC) reduziert, auf Leos Wunsch — soll zusammen mit dem lokalen
  `leoasal-calendar-weekly-sync`-Task laufen statt unabhängig alle 6h
  (2026-08-22).
- Lightbox-Slide-Übergang komplett neu gebaut als echtes Karussell (Leos
  Feedback zur ersten Version: der Fade+kleiner-Versatz-Effekt war ihm zu
  wenig „normal" — er wollte, dass beim Wischen das Bild live mit dem
  Finger mitwandert und das nächste Foto dabei gleichzeitig sichtbar
  nachrückt, und dass ein Klick auf die Pfeile exakt dieselbe Bewegung
  auslöst). Neue Struktur in `assets/js/lightbox.js` +
  `assets/css/style.css`: `.lightbox-stage` (fester Viewport,
  `min(92vw, 1200px)` × `calc(100vh - 8rem)`, `overflow:hidden`) enthält
  `.lightbox-track` (3 `.lightbox-slide`s nebeneinander, je 33.33% Breite,
  für prev/current/next), Track ist 300% breit und ruht bei
  `translateX(-33.3333%)` auf der mittleren Slide. Bilder pro Slide per
  `object-fit:contain` eingepasst (dadurch jetzt fester Stage-Rahmen statt
  bild-individueller Boxgröße — leichtes Letterboxing bei stark
  abweichenden Seitenverhältnissen, akzeptabler Trade-off für einen
  echten Karussell-Effekt).
  - **Wischen:** `touchmove` setzt `track.style.transform` live auf
    `calc(-33.3333% + <dx>px)` (Transition währenddessen `none`) — 1:1
    Finger-Following. `touchend` entscheidet anhand Schwellwert
    (`min(90px, 18% der Stage-Breite)`): drüber → Rest des Wegs zur
    nächsten/vorherigen Slide animieren (`settleTo`), drunter → zurück zur
    Mitte snappen. Vertikale Wischgesten (`|dy| > |dx|`) brechen die
    Erkennung sofort ab, damit kein Konflikt mit Scroll-Versuchen entsteht.
  - **Klick/Tastatur:** `go(±1)` ruft dieselbe `settleTo()`-Funktion mit
    vollem Weg auf (kein Drag-Ausgangspunkt nötig) — dadurch identische
    Bewegung wie beim committeten Wischen, wie gewünscht.
  - Nach jeder abgeschlossenen Navigation: Index aktualisieren, alle 3
    Slides mit den (neuen) Nachbarfotos neu befüllen, Track ohne Transition
    sofort zurück auf die Mitte setzen — da die neu befüllte Mittel-Slide
    exakt das Foto zeigt, das gerade sichtbar war, gibt es dabei keinen
    optischen Sprung. Funktioniert unverändert für alle Gruppen inkl.
    Album-Cover (`.epk-covers`), da `open()`/`go()` gruppenunabhängig sind.
    Frühere Fade-Version (Commit davor) komplett ersetzt, nicht nur
    angepasst (2026-08-12)
- Credit-Datenmodell aufgeteilt in Präfix + Name, damit bei Ketzberg nur
  der Name/Handle unterstrichen ist, nicht das „©"-Zeichen (Leos Wunsch).
  Aus `data-credit="© @shotbysvenja"` wurde
  `data-credit="©" data-credit-name="@shotbysvenja"` (+ weiterhin
  `data-credit-url`). `assets/js/lightbox.js` rendert jetzt: Präfix als
  reiner Textknoten, danach `data-credit-name` entweder als `<a>` (wenn
  `data-credit-url` gesetzt, dadurch automatisch nur dieser Teil
  unterstrichen dank `.lightbox-credit a { text-decoration: underline }`)
  oder ebenfalls als Textknoten. Alle 5 Projektseiten mit Credit auf das
  neue Attributpaar umgestellt (nur Ketzberg hat aktuell eine URL). Dabei
  auch Härtel/Asal-Duo-Credit korrigiert: Leo hatte sich beim Fotografen
  vertan, jetzt `© Johannes Napp` statt der vorherigen (falschen)
  „Anika Maierhöfer (@frauanikafotografiert)" (2026-08-12)
- Foto-Credits fertig ausgerollt: Loft Arts (`© Loft Arts`), Jakob Bänsch
  (`© Vincent Sima`). Zusätzlich neues optionales `data-credit-url`-Attribut
  (gleiche Fallback-Logik wie `data-credit`: erst am Trigger, dann am
  `.epk-gallery`-Container) — `assets/js/lightbox.js` rendert die
  Credit-Zeile dann als Link (`target="_blank" rel="noopener"`) statt reinem
  Text. Ketzbergs Credit verlinkt jetzt auf
  `https://www.instagram.com/shotbysvenja/`. Alle 5 Projektseiten mit
  eigenständiger Foto-Galerie haben jetzt ein Credit: Yamuna, Härtel/Asal
  Duo, Ketzberg, Loft Arts, Jakob Bänsch (Jakob Manz hat keine Fotogalerie,
  nur Videos) (2026-08-12)
- Ketzberg-Galerie bekam ebenfalls einen `data-credit`: „© @shotbysvenja"
  (Leo hat nur den Instagram-Handle genannt, kein Klarname) (2026-08-12)
- Härtel/Asal-Duo-Bilder-Galerie (die 4 Recording-Fotos) bekam ebenfalls
  einen `data-credit`: „© Anika Maierhöfer (@frauanikafotografiert)" —
  Album-Cover-Block bleibt wie bei Yamuna ohne Credit-Zeile (2026-08-12)
- Lightbox zeigt jetzt optional eine kleine Credit-Zeile unter dem Foto in
  der Großansicht (z.B. „© Henk Aaron Szanto"). Mechanik: `data-credit="…"`
  Attribut auf dem `.epk-gallery`-Container (gilt für alle Fotos darin) oder
  optional auf einzelnen `[data-lightbox]`-Buttons für Overrides pro Foto;
  `assets/js/lightbox.js` sucht beim Anzeigen zuerst am Trigger, dann am
  nächsten `.epk-gallery`-Vorfahren — bewusst **nicht** an `.epk-covers`
  (Album-Cover bleiben ohne Credit-Zeile, wie von Leo gewünscht). Ohne
  `data-credit` bleibt die Zeile per `hidden`-Attribut unsichtbar, keine
  Änderung für Galerien ohne Credit-Angabe. Bisher nur bei Yamunas
  Pressefoto-Galerie gesetzt (`© Henk Aaron Szanto`); bei Bedarf gleiches
  Attribut auf den anderen `.epk-gallery`-Containern (Bänsch, Ketzberg,
  Härtel/Asal, Loft Arts) ergänzen, sobald Leo die Fotografen-Credits dafür
  nennt. Neuer Wrapper `.lightbox-content` (flex-column: Bild + Credit)
  um `.lightbox-img`, `.lightbox-img` cappt jetzt auf
  `calc(100vh - 8rem)` statt `100%`, damit unter dem Bild Platz für die
  Credit-Zeile bleibt (2026-08-11)
- Lightbox unterstützt jetzt Wisch-Gesten auf Touch-Geräten (Leos Wunsch:
  auf Mobile musste man bisher auf die Pfeile tippen, Wischen ging nicht).
  `assets/js/lightbox.js`: `touchstart`/`touchend`-Listener auf dem Overlay,
  wertet die horizontale Differenz aus (`>40px` und deutlich horizontaler
  als vertikaler Versatz, Faktor 1.5, um Wischen von normalem Scrollen zu
  unterscheiden) — Wisch nach links → nächstes Foto, nach rechts →
  vorheriges. `touchend` ruft bei erkanntem Swipe `preventDefault()` auf,
  damit kein synthetisches `click`-Event danach die Lightbox versehentlich
  schließt. Einzelner Tap ohne nennenswerte Bewegung bleibt unverändert
  (schließt weiterhin bei Tap auf den Hintergrund). Per synthetischen
  `TouchEvent`s lokal verifiziert (swipe left/right + normaler Tap-Close),
  da echte Touch-Gesten im Browser-Tool nicht zuverlässig auslösbar sind
  (bekannte Einschränkung, s. u.) (2026-08-11)
- Härtel/Asal-Duo-Seite bekam eine neue "Bilder"-Galerie (4 Recording-Fotos,
  `haertel-asal-photo-1..4.jpg`, aus `.../Härtel : Asal Duo/Bilder/
  Recording Bilder/`, nicht im Repo) — gleiches Muster wie Bänsch/Ketzberg/
  Loft Arts, unterhalb der Beschreibung, oberhalb "Videos". Bleibt getrennt
  vom Album-Cover-Block oben (Cover + 4 Extra-Fotos, eigener "Out now"-
  Kontext, unverändert). `gallery-nav.js` war auf dieser Seite noch nicht
  eingebunden (gleicher Fall wie damals bei Loft Arts) — nachgeholt. Farb-/
  Graustufen-Zuordnung wieder per Kanal-Differenz-Analyse: 3 von 4 klar
  farbig (092, 189, 016 → `.cover-trigger--color`), eine (021, Kanal-Diff
  ~10, deutlich näher an neutral als die anderen) als Graustufen belassen
  (2026-08-11)
- Leo berichtete, die Lightbox-Pfeile (Album-Cover-Durchklicken) hätten auf
  Mobile evtl. nicht funktioniert (war sich selbst nicht sicher). Konnte es
  im Browser-Tool nicht reproduzieren — echte Taps auf `.lightbox-next`/
  `.lightbox-prev` per Mobile-Viewport-Emulation liefen dort konsequent in
  einen Tool-Timeout, unabhängig vom Code (gleiche bekannte Scroll-/Touch-
  Eigenheit dieser Preview-Pane wie schon beim Galerie-Pfeil-Feature; per
  synthetischem `.click()` funktioniert die Navigation nachweislich).
  Trotzdem vorsorglich zwei bekannte echte Mobile-Safari-Stolperfallen
  behoben, die genau so ein Symptom (Tap reagiert nicht/braucht 2. Versuch)
  verursachen können: `touch-action: manipulation` (eliminiert den
  ~300ms-Tap-Delay/Doppeltipp-Zoom-Konflikt) + expliziter `z-index` auf
  `.lightbox-close`, `.lightbox-nav` und `.gallery-nav` (vorher `auto`,
  jetzt garantiert oberste Stacking-Ebene, kein Risiko dass das
  darunterliegende Bild den Tap abfängt). Falls das Problem auf einem
  echten iPhone weiter auftritt: nächster Verdächtiger wäre iOS Safaris
  bekannter "erster Tap auf `position:fixed`-Element wird verschluckt,
  wenn `body{overflow:hidden}` gesetzt ist"-Bug (Lightbox setzt das beim
  Öffnen) — Fix dafür wäre ein echtes Scroll-Lock-Pattern
  (`body{position:fixed; top:-scrollY}` statt nur `overflow:hidden`),
  bisher nicht umgesetzt, da nicht sicher reproduziert (2026-08-11)
- Zwei Lightbox-Fixes: (1) `yamuna-press-13.jpg` war nur per CSS-Filter
  graustufen-getrickst (Thumbnail grau, Lightbox-Großansicht zeigte aber
  das Farboriginal, da der Graustufen-Filter nur auf `.epk-gallery img`
  wirkt, nicht auf `.lightbox-img`) — jetzt echt per PIL desaturiert
  (`ImageOps.grayscale`), damit Thumbnail und Großansicht konsistent
  schwarzweiß sind. (2) `assets/js/lightbox.js`: `close()` ruft jetzt
  `items[index].scrollIntoView({block:"nearest", inline:"nearest"})` auf
  das zuletzt angesehene Foto, damit sich die Galerie-Zeile beim Schließen
  der Lightbox zur zuletzt angesehenen Position mitbewegt (Leos Wunsch:
  nicht wieder ganz vorne stehen, wenn man sich bis zum letzten Foto
  durchgeklickt hat). Album-Cover-Navigation (Yamuna Front/Back) war schon
  vorher funktionsfähig (gleiche Gruppierungslogik wie die Foto-Galerien,
  über `.closest(".epk-gallery, .epk-covers")`) — lokal nochmal bestätigt.
  **Testhinweis:** Der `scrollIntoView`-Effekt beim Schließen ließ sich im
  Browser-Tool wieder nicht zuverlässig verifizieren (gleiche bekannte
  Scroll-Eigenheit dieser Preview-Pane bei der echten `.epk-gallery` wie
  schon beim Pfeil-Feature — ein isolierter Minimal-Test mit identischer
  API lief einwandfrei). Bitte Leo live gegenchecken (2026-08-11)
- Yamuna-Pressefoto-Reihenfolge auf durchgehenden Farbe/Schwarzweiß-Wechsel
  gebracht (Leos Wunsch, nachdem die 10 neuen Fotos ergänzt waren): Fotos
  #9/#10 (`yamuna-press-9.jpg`/`-10.jpg`) in der HTML-Reihenfolge getauscht,
  damit Graustufen-/Farbfoto sich wieder abwechseln. Da nur 4 der 10 neuen
  Fotos echte Graustufen-Originale waren (6 Farbe), reichte die Alternation
  nicht bis zum Ende — dafür bei `yamuna-press-13.jpg` die
  `cover-trigger--color`-Klasse entfernt (Leo hat das explizit erlaubt:
  "beim allerletzten... in schwarz-weiß umwandeln"). Keine Pixel-Bearbeitung
  nötig, nur die Klasse entfernt — Galerie ist standardmäßig
  graustufen-gefiltert (`.epk-gallery img { filter: grayscale(1) }`),
  `cover-trigger--color` ist der Opt-in fürs Original-Farbfoto. Ergebnis:
  alle 14 Fotos wechseln jetzt lückenlos G/C/G/C/…/G/C (2026-08-11)
- Yamuna-Pressefoto-Galerie um 10 weitere Fotos ergänzt (`yamuna-press-5`
  bis `-14.jpg`, aus `.../YAMUNA/2023/Initiative Musik Foe-Ru 56/Bilder/`,
  nicht im Repo) — jetzt 14 Fotos insgesamt, damit greift automatisch die
  neue Einzeilen-Galerie mit Pfeil-Navigation (>4 Fotos). Farb- vs.
  Graustufen-Zuordnung wieder per Kanal-Differenz-Analyse geprüft (wie bei
  den früheren Yamuna-/Ketzberg-Fällen): 6 der 10 waren Farboriginale
  (387, 401, 410, 787, 789, 797 → `.cover-trigger--color`), 4 echte
  Graustufen-Aufnahmen (319, 363 1, 467, 550 → normaler Graustufen-Filter).
  Keine manuelle Quadrat-Zuschneidung nötig — `.epk-gallery img` croppt
  Thumbnails per CSS (`aspect-ratio:1; object-fit:cover`) automatisch,
  Lightbox zeigt das Originalseitenverhältnis (2026-08-11)
- Galerie-Pfeile (`assets/js/gallery-nav.js`) sprangen bisher um eine ganze
  "Seite" (`gallery.clientWidth`, alle ~4 sichtbaren Fotos auf einmal) —
  Leo wollte pro Klick nur **ein Foto** weiter. Fix: neue `step()`-Funktion
  berechnet den Abstand zwischen dem 1. und 2. Foto (`offsetLeft`-Differenz,
  automatisch korrekt für Mobile-50%/Desktop-25%-Breite), `scrollBy` nutzt
  jetzt diesen Wert statt der vollen Container-Breite (2026-08-11)
- Neues generelles Galerie-Verhalten: Foto-Galerien mit **mehr als 4 Fotos**
  zeigen jetzt nur noch **eine Zeile** (horizontal scrollbar) statt in
  mehrere Grid-Zeilen umzubrechen — mit Pfeil-Buttons rechts/links zum
  Weiterklicken (zusätzlich zum bestehenden Lightbox-Klick-Durch mit
  Pfeilen). Implementiert in `assets/js/gallery-nav.js` (neu, auf allen
  Seiten mit `.epk-gallery` eingebunden: Bänsch, Ketzberg, Yamuna,
  Loft Arts): zählt beim Laden die Fotos pro `.epk-gallery`, aktiviert die
  Einzeilen-Variante (`epk-gallery--row`-Klasse + dynamisch eingefügter
  `.epk-gallery-wrap` mit Pfeil-Buttons) **nur wenn mehr als 4 Fotos**
  vorhanden sind — bei ≤4 bleibt das bisherige 2x2/4er-Grid unverändert.
  Automatisch zukunftssicher: sobald eine Seite über 4 Fotos wächst, greift
  die Einzeilen-Variante ohne manuelle Anpassung. Bewusst **kein**
  `scroll-snap-type` verwendet (erst mit `mandatory` gebaut, dann wieder
  entfernt — in Kombination mit prozentualen `flex-basis`-Breiten kam es zu
  Scroll-Aussetzern, sowohl im Test als auch potenziell in echten Browsern;
  reines `overflow-x:auto` + `scrollBy()` ist robuster).
  **Testhinweis:** Das Pfeil-Weiterklicken auf der Foto-Zeile selbst
  (`.gallery-next`/`.gallery-prev`) ließ sich in diesem Environment nicht
  zuverlässig über das Browser-Tool verifizieren — horizontales Scrollen
  (`computer scroll` mit `direction:right`) hat die Preview-Pane wiederholt
  zum Hängen gebracht (Timeout, "pane is hidden"), unabhängig vom Code.
  Isolierte Minimal-Tests mit identischem CSS/JS-Mechanismus (Flex +
  `overflow-x:auto` + `scrollBy`) liefen im selben Environment erfolgreich,
  daher vermutlich eine Eigenheit des Browser-Tools bei verschachtelten
  Scroll-Containern, kein Code-Bug — **Leo bitte einmal live auf
  loft-arts.com gegenchecken**, ob der Pfeil bei der Fotoreihe wirklich
  weiterblättert (2026-08-11)
- Loft-Arts-Titelbild auf `projects.html` ist jetzt `loftarts-photo-1.jpg`
  (Kopie nach `project-loft-arts.jpg`) statt des alten Platzhalterfotos
  (2026-08-11)
- Loft-Arts-Seite bekam eine neue Foto-Galerie (7 Live-/Konzertfotos,
  `loftarts-photo-1..7.jpg`, aus `.../Loft Arts/BILDER/`, nicht im Repo),
  gleiches Muster wie Bänsch/Ketzberg (`epk-gallery epk-gallery--color` +
  "Bilder"-Überschrift, vor "Videos" eingefügt). Dabei aufgefallen: Loft
  Arts hatte als einzige der Projektseiten noch **kein**
  `<script src="assets/js/lightbox.js">` eingebunden (weil es vorher keine
  Bildergalerie dort gab) — Lightbox öffnete sich ohne diesen Fix gar
  nicht. Falls nochmal eine neue Projektseite eine erste Galerie bekommt:
  immer prüfen, ob `lightbox.js` schon eingebunden ist (2026-08-11)
- Ketzberg-Galerie: 1. und 3. Foto ausgetauscht (Leo hat Ordnerpfad +
  Dateinamen direkt mitgeschickt, kein Bildvergleich nötig) —
  `ketzberg-photo-6.jpg` → `230909_shotbysvenja_ketzberg_braunschweig_68.jpg`,
  `ketzberg-photo-2.jpg` → `230909_shotbysvenja_ketzberg_braunschweig_150.jpg`,
  beide aus `.../Ketzberg/Svenja Fotos Auswahl/`, nicht im Repo. Gleiches
  Seitenverhältnis wie bisher (2:3 Hochformat), auf 1600px lange Kante
  skaliert (2026-08-10)
- Bildergalerien jetzt durchklickbar (Pfeil-Navigation im Lightbox), plus
  neue Überschrift "Bilder"/"Photos"/"Fotos" (i18n-Key
  `project.photosHeading`, analog zu `project.videosHeading`) über den
  reinen Foto-Galerien. `assets/js/lightbox.js` gruppiert Bilder jetzt
  automatisch nach nächstgelegenem `.epk-gallery`- bzw.
  `.epk-covers`-Container (`element.closest(...)`, keine neue Markup-
  Attribute nötig) — dadurch bilden Yamunas Album-Cover (2 Bilder) und
  Pressefotos (4 Bilder) zwei getrennte Klick-Kreise, während Härtel/Asals
  Cover+4-Extra-Fotos (verschachtelt in `.epk-covers-extra` innerhalb von
  `.epk-covers--mixed`) eine gemeinsame 5er-Gruppe bilden. Pfeile
  (`.lightbox-prev`/`.lightbox-next`) mit Wrap-Around, Tastatur-Pfeiltasten
  funktionieren zusätzlich zu Escape. "Bilder"-Überschrift bewusst nur bei
  den eigenständigen Foto-Galerien ergänzt (Bänsch, Ketzberg, Yamunas
  Pressefotos) — **nicht** bei Yamunas/Härtel-Asals Album-Cover-Block
  (eigener "Out now"-Kontext) und nicht bei Jakob Manz/Loft Arts (haben gar
  keine Fotogalerie, nur Videos). Jakob-Bänsch-Galerie: erstes Foto (#1)
  ausgetauscht — Leo wollte explizit `Jakob_Bänsch_Quartett-203.jpg`
  (Gruppenfoto vor Rolltor, gleiche Session wie das Vorschaubild), Dateiname
  direkt mitgeschickt statt Bildvergleich nötig (2026-08-10)
- Jakob-Bänsch-Galerie: letztes Foto (#4) ausgetauscht — Leo hat das
  gewünschte Foto direkt als Bild in den Chat gepastet (kein Dateipfad
  mitgeschickt), Zuordnung zur Originaldatei per visuellem Abgleich mit
  allen Fotos in `.../Jakob Bänsch/Jakob Bänsch Quartett/2024/Bilder
  Studio/` (Kontaktabzug aller 25 Bilder gebaut, dann Kandidaten einzeln
  vergrößert verglichen): `Jakob_Bänsch_Quartett-356.jpg`. Gleiche
  Bildquelle wie die restliche Galerie, nicht im Repo (2026-08-10)
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
