# CLAUDE.md — leoasal.com

Lebende Referenz für diesen Ordner: aktueller Stand, Architektur-
Entscheidungen und Fallstricke, die ein Agent kennen muss, bevor er hier
etwas ändert. Wird von Claude Code automatisch bei jeder Session geladen.

**Bei jeder wesentlichen Änderung aktualisieren, nicht nur anhängen** —
veraltete Abschnitte korrigieren statt neue Wahrheit unten dranzuhängen.
**Proaktiv aktualisieren und committen, ohne dass Leo danach fragen muss** —
direkt im Anschluss an die eigentliche Änderung, als fester Teil davon.
**Das gilt auch fürs Pushen selbst:** Leo will vor `git push` nicht gefragt
werden ("frag mich ab jetzt nicht mehr... mach es einfach von alleine") —
lokal testen wie gewohnt, dann direkt committen + pushen, ohne Rückfrage.

Abgeschlossene Änderungen/History gehören **nicht** hierher, sondern in
`CHANGELOG.md` (chronologisch, neueste zuerst) bzw. ins Git-Log selbst.
Dieses Dokument beschreibt nur den **Ist-Zustand**.

## Was das hier ist

Kompletter Neubau von leoasal.com: weg von WordPress/Elementor, hin zu einer
schlanken statischen Seite (reines HTML/CSS/JS, kein Build-Schritt, kein
Framework, kein CMS). Live seit 2026-08-06.

- **Repo:** https://github.com/leoasal/leoasal-website (öffentlich)
- **Hosting:** GitHub Pages, deployt automatisch bei jedem Push auf `main`
- **Domain:** leoasal.com, DNS bei Strato (1× A-Record → `185.199.108.153`),
  SSL-Zertifikat von GitHub/Let's Encrypt, HTTPS erzwungen
- **GitHub-Account des Kunden:** `leoasal`
- **Owner:** Leo Asal — Schlagzeuger/Komponist aus Köln, nicht technisch,
  arbeitet aber gerne direkt mit Claude Code statt über ein Admin-Panel

**Privater Ordner `Website Kalender/`** liegt in diesem Repo-Verzeichnis,
ist aber bewusst in `.gitignore` eingetragen und wird **nie committet** —
das Repo ist öffentlich, der Ordner enthält private Notizen. Darin:
`leoasal-calendar-handoff.md` — das Playbook für die zweite Aufgabe dieses
Agenten (Kalenderpflege, s. Abschnitt "Kalenderpflege" unten). Nicht
versehentlich mit `git add -A` o.ä. doch committen.

## Zwei Aufgabenbereiche (ein Agent)

1. **Website-Code & Design** — dieses Dokument. Repo, HTML/CSS/JS, i18n,
   Deploy, Sync-Pipeline-Technik.
2. **"Website Termine"-Kalenderpflege** — Leos öffentlichen iCloud-Kalender
   aus seinen persönlichen Kalendern pflegen (der die Termine auf
   leoasal.com speist). Ablauf, Gig-Cluster, Ausschlussregeln, Fallstricke
   und die osascript-Technik stehen im **privaten** Playbook
   `Website Kalender/leoasal-calendar-handoff.md` (gitignored, weil es
   Leos Kalenderstruktur + interne Booking-Infos enthält) — bei
   Kalenderarbeit zuerst das komplett lesen und danach dort aktualisieren.
   Kurzüberblick unten unter "Kalenderpflege". Läuft zusätzlich 1×/Woche
   automatisch als geplanter Task `leoasal-calendar-weekly-sync` (bleibt
   bestehen — reine Automatisierung).

## Lokal arbeiten

```bash
cd ~/Documents/leoasal-website
python3 -m http.server 5173
```
→ http://localhost:5173 (Doppelklick auf `index.html` funktioniert NICHT,
`fetch()` für i18n/Termine braucht einen echten HTTP-Server, kein `file://`).
**Port 5173 ist teils von einem anderen lokalen Projekt ("Buchhaltung")
belegt** — dann einfach einen anderen Port nehmen (z.B. 5178) und dort
testen.

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

**Architektur: Blog/Bio/Termine/Projekte/Kontakt sind keine eigenständigen
Seiten.** Leo wollte, dass Klicken in der Nav und Runterscrollen auf der
Startseite zum exakt selben Ergebnis führen ("die Unterscheidung zwischen
Scrollen und den einzelnen Seiten soll es nicht mehr geben"). Der komplette
Inhalt dieser 5 Bereiche lebt ausschließlich als Sektionen in `index.html`
(`#blog`, `#bio`, `#dates`, `#projects`, `#contact` — in dieser
Reihenfolge, Blog zuerst direkt nach dem Hero). `blog.html`/`bio.html`/
`dates.html`/`projects.html`/`contact.html` existieren nur noch als
minimale Redirect-Stubs (`<meta http-equiv="refresh">` +
`location.replace(...)`) auf `index.html#<section>`, damit alte
Bookmarks/Backlinks nicht ins Leere laufen. **Nicht versehentlich wieder
"echte" Seiten daraus machen** — jede Änderung an
Blog/Bio/Termine/Projekten/Kontakt gehört ausschließlich in die
passende Sektion von `index.html` (Text weiter über die i18n-JSONs).

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
                               `.blog-post`-Artikel (YAMUNA-Album — Front- UND Back-Cover
                               nebeneinander in `.blog-post-covers`, beide verlinken auf
                               yamuna.html + "Jakob Manz Project @ Jazzopen Stuttgart" mit
                               2 Videos),
                               Artikel-Titel sind hier `h3` (`clamp(1.4rem,3vw,1.75rem)`,
                               eigene Größe da globales h3 nur 1.2rem wäre). Neue
                               Blog-Einträge oben in der `#blog`-Sektion einfügen.
                               ACHTUNG: dadurch lädt die Startseite 2 youtube-nocookie-
                               iframes beim Laden. Nav zeigt per Scrollspy
                               (`assets/js/anchor-scroll.js`) an, in welcher Sektion man
                               gerade ist (`aria-current="location"` auf dem Nav-Link)
blog.html, bio.html,          NUR NOCH REDIRECT-STUBS auf index.html#blog/#bio/#dates/
dates.html, projects.html,    #projects/#contact (s. Architektur-Hinweis oben) — kein echter
contact.html                  Inhalt mehr, keine Nav/Header/Footer, kein data-i18n
yamuna.html                   YAMUNA (nicht "YAMUNA EPK"): eigene Überschrift oben, dann
                               (2026-09-23) **Beschreibung direkt unter dem Titel** (weiß, s.
                               "Infotext zuerst" unten) → Album-Block ("Out now" +
                               Front-/Back-Cover, beide als Lightbox anklickbar, "Listen/Buy
                               Vinyl" UNTER den Covern, grauer `.epk-hero`-Hintergrund).
                               Danach alternierende `.home-section`/`.home-section--alt`-
                               Bänder (s. "Alternierende Sektions-Hintergründe" unten):
                               **"The Making of the Album Cover"** (weiß — 2 Fotos + 2 stumme
                               Boomerang-Loop-Videos vom Cover-Entstehungsprozess, Gemälde von
                               Estelle Müller, s. "Cover-Making-of-Galerie" unten) →
                               Pressefotos (grau) → Videos (weiß) → Downloads (grau)
jakob-manz-project.html       Alternierende Bänder: Beschreibung + kleiner Icon+Domain-Link
                               (jakobmanz.de, `.project-link`) (weiß) → 5 YouTube-Videos (grau)
jakob-baensch-quartett.html   Alternierende Bänder: Beschreibung + Icon+Domain-Link
                               (jakobbaensch.com) (weiß) → "Releases"-Sektion (2 Alben: „All
                               the Others" 2025, „Opening" 2023, Cover als
                               `.discography`/`.epk-covers`-Grid) (grau) → 4 Fotos als
                               Farbgalerie (weiß) → 3 YouTube-Videos (grau)
haertel-asal-duo.html         (2026-09-23) Beschreibung direkt unter dem Titel (weiß, s.
                               "Infotext zuerst" unten) → Album-Block ("Out now" + Cover +
                               4 Fotos daneben als 2x2-Grid, alle klickbar via Lightbox,
                               "Buy CD"-Link darunter, grauer `.epk-hero`-Hintergrund).
                               Danach alternierend: 4 Fotos (weiß) → 4 YouTube-Videos (grau)
ketzberg.html                 Alternierende Bänder: Beschreibung + Icon+Domain-Link
                               (ketzberg.com) (weiß) → 5 Bandfotos als Graustufen-Galerie
                               (grau) → 7 YouTube-Videos (weiß)
loft-arts.html                Alternierende Bänder: echter Beschreibungstext (Agentur-Info +
                               Leos Rolle als Schlagzeuger/Musical Director) + Icon+Domain-Link
                               (loft-arts.com) (weiß) → 7 Fotos (grau, >4 Fotos → automatisch
                               `.epk-gallery--row` mit Pfeil-Nav) → 12 YouTube-Videos (weiß,
                               Reihenfolge: 4x Megaloh, Novaa, Teesy, MAJAN, Woodie Smalls,
                               OG Keemo, Lostboi Lino, Buffala, Joshua J)
contact.html                  Nur noch E-Mail — Social-Icons sind jetzt im Header (s.u.),
                               nicht mehr extra auf dieser Seite
impressum.html, datenschutz.html   IMMER Deutsch, kein Sprachumschalter (bewusste
                               Entscheidung: rechtlich verbindliche Fassung)
```

**Infotext zuerst (2026-09-23):** Hat ein Projekt einen beschreibenden
Fließtext (Bandbeschreibung/Bio-Absatz), steht der **immer als allererstes
Band direkt unter dem Seitentitel** (`.page-header`), noch vor einem
eventuellen Album-Block (`.epk-hero`) — nicht erst irgendwo weiter unten.
Bei jakob-manz-project.html/jakob-baensch-quartett.html/ketzberg.html/
loft-arts.html war das schon immer so (kein `.epk-hero` auf diesen Seiten).
Bei yamuna.html und haertel-asal-duo.html (die einen Album-Block haben)
wurde die Beschreibung dafür 2026-09-23 von weiter unten auf der Seite
direkt vor den Album-Block verschoben. Bei neuen Projektseiten mit
Beschreibungstext dieses Muster übernehmen.

Zusätzlich (2026-09-23, selbe Session): der Infotext soll optisch **nah am
Titel** sitzen, nicht mit vollem Standard-Abstand abgesetzt sein. Dafür in
`style.css` `.project-page .page-header` (reduziertes `padding-bottom`/
`margin-bottom`, statt der 1.5rem/2.5rem auf anderen Seiten) und
`.project-page main > section:first-of-type` (reduziertes `padding-top`,
statt der 3rem der übrigen Bänder) — nur das allererste Band nach dem
Header rückt näher, alle weiteren Bänder behalten den normalen
Bänder-Abstand (s. oben, 3rem).

**Alternierende Sektions-Hintergründe auf Projekt-Unterseiten (2026-09-23):**
Leo wollte "die einzelnen Punkte" jeder Projektseite genauso weiß/grau
unterlegt sehen wie die Homepage-Sektionen. Jeder inhaltliche Block (jede
Beschreibung, jedes `<h2>`-Kapitel: Releases/Photos/Videos/Downloads) steckt
jetzt in einem eigenen `<section class="home-section">` bzw.
`<section class="home-section home-section--alt">` mit eigenem
`<div class="container">` darin — exakt dieselben Klassen wie auf der
Homepage, alternierend weiß/grau, erstes Band nach einem `.epk-hero`
(falls vorhanden) ist weiß. Der **obere Seiten-Header** (Zurück-Link + h1,
ggf. + Social-Icons) bleibt **außerhalb** jeder Sektion, unverändert in
seinem eigenen `<div class="container">` — analog zum Hero-Foto auf der
Homepage, das auch kein `.home-section` ist. Bei neuen Projektseiten
dieses Muster übernehmen: pro inhaltlichem Block eine eigene
`<section class="home-section[ home-section--alt]"><div class="container">
…</div></section>`, alternierend, nicht wieder alles in einen
gemeinsamen `<div class="container">` packen.

Gemeinsames Muster pro Seite: Header mit Logo + Nav + Sprachumschalter,
Content in `<main>`, `<nav class="mobile-nav">` (nur <800px sichtbar),
Footer mit Impressum/Datenschutz + Copyright. Neue Seiten am besten von
einer bestehenden ähnlichen Seite kopieren statt neu aufbauen, damit
nichts vergessen wird.

Header-Nav (ab `min-width: 800px`): `.site-nav` ist `display: flex`, Haupt-
links (`ul`) und Sprachumschalter (`.lang-switch`) sitzen dadurch auf einer
Zeile, Sprachumschalter rechtsbündig mit Trennstrich.

**Sprachumschalter:** Es gibt ZWEI Kopien im Header, je nach Breite genau
eine sichtbar:
- `<800px`: `.lang-switch.lang-switch--mobile` — direktes Flex-Geschwister
  von `.logo`/`.site-social`/`.site-nav` in `.site-header .container`,
  steht im DOM zwischen `.logo` und `.site-social`. Da `.site-nav` mobil
  `display:none` ist, verteilt `justify-content:space-between` die drei
  sichtbaren Blöcke: Logo links, Sprachumschalter mittig, Social-Icons
  rechts. `--mobile` entfernt nur `border-left`/`padding-left` der Basis-
  `.lang-switch` und ist ab 800px `display:none`.
- `≥800px`: die Kopie in `.site-nav` (rechtsbündig mit Trennstrich, s.o.);
  `.lang-switch--mobile` ist dann ausgeblendet.
- Es gibt **keinen** Footer-Umschalter mehr (war redundant, jetzt
  permanent im Sticky-Header oben). i18n.js hört per Event-Delegation auf
  jedes `[data-lang]`, also keine JS-Änderung nötig.
- Impressum/Datenschutz haben **weiterhin gar keinen** Umschalter.

**Social-Icons sind Teil des Headers**: `.logo`, `.lang-switch--mobile`,
`.site-social` und `.site-nav` sind **direkte Flex-Geschwister** in
`.site-header .container` (kein Wrapper-Div). `.container` ist
`display:flex; justify-content:space-between` **immer** (nicht nur ab
800px). Das ergibt automatisch:
- **Mobil** (`.site-nav` `display:none`, `.lang-switch--mobile` sichtbar):
  3 sichtbare Items → Logo links, Sprachumschalter mittig, Icons rechts.
- **Desktop** (`.site-nav` sichtbar, `.lang-switch--mobile` `display:none`):
  3 Items → `space-between` verteilt den Icons-Block **exakt mittig** in
  die Lücke zwischen Logo und "Blog" (dem ersten Nav-Link). Das ist
  explizit so gewünscht — nicht wieder auf eine `.brand-group`-Wrapper-
  Lösung umbauen, die zieht die Icons direkt neben den Logo-Text statt sie
  mittig zu verteilen.

Aktuell: Instagram, Facebook, Spotify, Apple Music, Tidal — inline SVGs,
identisch in allen Seiten mit echtem Header (index.html, die 6
Projekt-Unterseiten, impressum.html, datenschutz.html — **nicht** in
blog.html/bio.html/dates.html/projects.html/contact.html, die sind
Redirect-Stubs ohne Header). Bei neuen Seiten unbedingt aus einer
bestehenden Seite kopieren, nicht neu tippen (sonst Copy-Paste-Fehler bei
den langen SVG-Paths).

Die 6 Projekt-Unterseiten (Yamuna, Jakob Manz, Jakob Bänsch, Härtel/Asal,
Ketzberg, Loft Arts) haben im `.page-header` statt eines reinen "Project"-Textes einen
klickbaren Zurück-Link (`.back-link`, Pfeil-SVG + `nav.projects`-Text) auf
`index.html#projects` — bei neuen Projekt-Unterseiten dieses Pattern
übernehmen, nicht wieder einen reinen Text-Eyebrow einbauen. Blog/Bio/
Dates/Projects/Contact als Homepage-Sektionen behalten ihren normalen
Text-Eyebrow.

**Discography-Pattern** (Jakob Bänsch, erstmals 2026-09-11): mehrere
Alben-Cover einer Projektseite als `<div class="discography epk-covers">`
mit je `<figure class="discography-item">` (`.cover-trigger` +
`<figcaption>` für Titel/Jahr). Die `epk-covers`-Klasse ist **notwendig,
nicht kosmetisch** — `lightbox.js` gruppiert Lightbox-Geschwister nur
innerhalb des nächsten `.epk-gallery`/`.epk-covers`-Vorfahren; ohne sie
würde ein Klick **alle** `[data-lightbox]`-Elemente der Seite gruppieren.
`.discography` selbst trägt eigenes Margin (`.epk-covers` hat keins, weil
es auch in `.epk-hero` steckt, das per Flex-`gap` spaced).

**Cover-Making-of-Galerie** (Yamuna "The Making of the Album Cover",
erstmals 2026-09-11 als bespoke `.process-grid`, seit 2026-09-23 auf Leos
Wunsch ("die Galerie auch in einer Reihe, wie die andere Galerie")
umgebaut): mischt Fotos und kurze, stumme Boomerang-Loop-Videos in einer
**ganz normalen `.epk-gallery.epk-gallery--color`** (dieselbe Komponente
wie jede Photos-Sektion — 2/4 Spalten responsiv, ab >4 Elementen
automatisch `.epk-gallery--row` mit Pfeil-Nav, s. `gallery-nav.js`).
**Kein eigenes `.process-grid` mehr.** Jedes Element ist ein
`<figure class="process-item">` (nur `margin:0; min-width:0` — Letzteres
nötig, sonst verzerrt ein enthaltenes `<video>` die Grid-Spaltenbreiten
ungleich, klassischer CSS-Grid-Fallstrick bei Replaced Elements) mit
`.cover-trigger` (Foto: `<img>`, Video: `<video autoplay muted loop
playsinline poster="...">` — beide gleich gestylt via `.cover-trigger img`/
`.cover-trigger video`) + `<figcaption class="process-caption">` für die
Unterschrift.

**Bild-/Video-Credit in der Lightbox = die Bildunterschrift selbst:** jeder
Trigger bekommt zusätzlich `data-credit="<Fallback-Text>"
data-i18n-attr="data-credit:<gleicher-i18n-key-wie-figcaption>"` — dadurch
zeigt die Lightbox (`.lightbox-credit`) beim Anklicken dieselbe
(sprachabhängige) Unterschrift, die auch unter dem Grid-Thumbnail steht.

**Videos in der Lightbox (lightbox.js, erweitert 2026-09-23):** ein Trigger
mit `data-lightbox="pfad/zum/video.mp4" data-lightbox-video
data-lightbox-poster="pfad/zum/poster.jpg"` spielt beim Anklicken ein
echtes `<video>` **nur im zentrierten Slide** ab (autoplay/muted/loop/
playsinline) — die beiden Nachbar-Slides (links/rechts beim Swipen) zeigen
immer nur `data-lightbox-poster` als normales `<img>`, nie ein zweites
Video. So bleibt die bestehende Swipe-/Drag-Mechanik (die nur mit
Bild-Slides rechnet) unverändert, und es autoplayt nie ein unsichtbares
Video im Hintergrund. `close()` pausiert ein evtl. noch laufendes Video
explizit. **Rückwärtskompatibel** — alle anderen Galerien setzen
`data-lightbox-video` nie, verhalten sich exakt wie vorher (verifiziert:
Yamuna-Pressefotos, Bänsch-Discography, Bänsch-Photos zeigen nach dem
Umbau weiterhin nur `<img>`-Slides).

**Boomerang-Loop-Technik:** Quellvideos (meist Handy-Clips, z.B.
WhatsApp-Export mit Ton) werden mit ffmpeg vorwärts+rückwärts
aneinandergehängt (`reverse`+`concat`-Filter), quadratisch
zugeschnitten/skaliert und ohne Audiospur neu kodiert — mit `loop`-Attribut
ergibt das einen nahtlosen Pingpong-Loop. Kommandozeile:
```
ffmpeg -i in.mp4 -filter_complex \
  "[0:v]crop=w='min(iw,ih)':h='min(iw,ih)',scale=640:640,setsar=1,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[out]" \
  -map "[out]" -an -c:v libx264 -crf 26 -preset medium -pix_fmt yuv420p -movflags +faststart out.mp4
```
(ffmpeg-Binary s. "Bekannte Eigenheiten" unten). Rohe Quelldateien danach
nach `Inbox/processed/` (gitignored, s. "Inbox").

## i18n (EN/DE/ES)

- `assets/js/i18n.js` liest `assets/i18n/{en,de,es}.json`, ersetzt alles mit
  `data-i18n="key"` (innerHTML) bzw. `data-i18n-attr="attr:key"`.
- Default-Sprache Englisch, Auswahl in `localStorage['lang']`, gilt seitenübergreifend.
- **Impressum/Datenschutz bewusst ausgenommen** — kein Sprachumschalter dort.
- Dynamisch nachgeladener Inhalt (z.B. Termine) muss nach dem Rendern
  `window.i18nRefresh()` aufrufen, sonst bleibt er unübersetzt bei
  Sprachwechsel/Reload-Race — siehe `assets/js/dates.js` als Beispiel.
  `window.i18nRefresh()` verarbeitet auch `data-i18n-attr` (nicht nur
  `data-i18n`/innerHTML) — nötig, damit dynamisch eingefügte Elemente wie
  das Location-Icon ein übersetztes `aria-label` bekommen.
- Neuen Text immer in **allen drei** JSON-Dateien ergänzen, nicht nur Englisch.

## Kalenderpflege (Website Termine) — zweiter Aufgabenbereich

Vollständiges Playbook: **`Website Kalender/leoasal-calendar-handoff.md`**
(privat, gitignored). Dort stehen die etablierten Projekte, bekannten
Gig-Cluster, Ausschlusskategorien, Fallstricke, der Ablauf (Schritte 0–6)
und die osascript-Muster. Bei jeder Kalender-Session zuerst komplett lesen
und danach dort aktualisieren ("Zuletzt bearbeitet"-Datum + Verlauf-Eintrag).

Kurz:
- Leo trägt neue Gigs in seine **persönlichen** Kalender ein (ein
  Unterkalender pro Band + ein Sammelkalender "Gig"). Dieser Agent
  übernimmt die öffentlich-relevanten davon in den Kalender
  **"WEBSITE TERMINE"** — per osascript gegen Calendar.app auf Leos Mac
  (geht nicht cloudseitig; die Claude-App muss offen sein).
- Danach den Sync-Workflow auslösen (`gh workflow run sync-calendar.yml`,
  s. "Kalender-Sync" unten für die Pipeline) und live gegenchecken.
- **Nie raten:** unbekannte Gig-Cluster, zwei verschiedene Bands am selben
  Tag, verschwundene Quelltermine → überspringen und Leo berichten.
- Reine Kalenderpflege braucht **keinen** Git-Commit hier (der Workflow
  committet `dates.json`/`dates.ics` selbst). Nur das private Playbook
  lokal aktualisieren.
- Läuft zusätzlich 1×/Woche automatisch (`leoasal-calendar-weekly-sync`),
  dieser Task bleibt bestehen.

## Kalender-Sync (Apple Calendar → dates.html)

- Leo pflegt einen eigenen iCloud-Kalender "Website Termine", öffentlich
  freigegeben (webcal-Link → https:// umgeschrieben).
- Link liegt als Repo-Secret `CALENDAR_URL` (Settings → Secrets and
  variables → Actions) — nicht im Code, nicht im Chat wiederholen.
- `.github/workflows/sync-calendar.yml` läuft **1x/Woche, freitags ~17:30
  CEST/16:30 CET (15:30 UTC fix im Cron, daher der DST-Versatz)** + manuell
  auslösbar (`gh workflow run sync-calendar.yml` oder im Actions-Tab). Der
  lokale `leoasal-calendar-weekly-sync`-Task (Freitags 17:00 lokal, siehe
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
  mitgelesen. Nur wenn er vom Startdatum abweicht, bekommt der JSON-Eintrag
  zusätzlich ein `end` (inklusives letztes Tagesdatum, ICS-`DTEND` ist ja
  exklusiv → in `shiftIsoDate(-1)` umgerechnet). `dates.js` zeigt dann eine
  Spanne wie "16.–23. Okt 2026" (`formatDateRange()`) statt nur des ersten
  Tages; beim Re-Export in `dates.ics` wird die Spanne wieder korrekt in
  ein exklusives `DTEND` zurückgerechnet. Eintägige Termine bekommen kein
  `end`-Feld.
- **Vergangene Termine**: `sync-calendar.js` schreibt sie mit in
  `data/dates.json`. `dates.js` teilt beim Rendern in `upcoming`/`previous`
  auf; `previous` (älteste zuerst, aufsteigend) rendert in
  `<ul id="dates-list-previous">`, das **oberhalb** der kommenden Liste
  UND oberhalb des Toggle-Buttons `#dates-previous-toggle` (Aufwärts-
  Chevron) sitzt. Der Button ist **kein `<details>`**: Klick blendet die
  Liste ein/aus und `dates.js` kompensiert dabei den Scroll-Offset, damit
  der Pfeil optisch an Ort und Stelle bleibt (die alten Termine wachsen
  nach oben weg, man scrollt hoch um sie zu sehen). Aufsteigende Sortierung
  = beim Hochscrollen kommen die Termine chronologisch rückwärts. Button +
  Liste komplett versteckt, wenn keine vergangenen Termine da sind. Der
  öffentliche `dates.ics`-Abo-Feed bleibt bewusst nur-zukünftig gefiltert
  (niemand will hunderte vergangene Konzerte in seiner Kalender-App).
- `dates.json` wird **nur vom Workflow verwaltet** — nicht von Hand
  reinschreiben und committen (außer kurz zum lokalen Testen, danach
  zurücksetzen).
- Frontend (`assets/js/dates.js`): jeder Termin ein `<details>`-Element,
  antippen/klicken zeigt Zeit (falls nicht `allDay`), Ort und Link (falls
  vorhanden). Bewusst kein Hover-only-Pattern, damit es auf dem Handy genauso
  funktioniert wie am Desktop.
- Zeit, Ort und URL zeigen jeweils ein Icon statt eines Text-Labels (Uhr/
  Pin/Pfeil, alle `role="img"` + `data-i18n-attr="aria-label:dates.X"` fürs
  Screenreader-Label — die i18n-Keys `dates.time`/`dates.location`/
  `dates.moreInfo` liefern nur noch den `aria-label`, keinen sichtbaren
  Text mehr). URL-Icon ist ein simpler ">"-Pfeil (`ICON_ARROW` in
  `dates.js`) — gleiches Icon auch auf den `.project-link`-Zeilen bei
  Jakob Manz/Jakob Bänsch/Loft Arts.
- Ort ist klickbar → verlinkt auf Google-Maps-Suche
  (`https://www.google.com/maps/search/?api=1&query=...`), und darunter
  liegt ein eingebettetes Google-Maps-Preview (`.date-map` iframe,
  `output=embed`-Trick, kein API-Key nötig). Kein Apple-Maps-Link.
- Der URL-Link zeigt die **rohe Domain ohne Schema** als Linktext (z.B.
  `jakobmanz.de`, via `displayUrl()` in `dates.js`, strippt `https://`).
  Location- und URL-Link sind **nicht fett** (nur `text-decoration:
  underline`).
- `.dates-list` hat **kein `max-width: 68ch`** — die Termin-Zeilen sind so
  breit wie der `.container` (960px), damit auch lange Adressen in eine
  Zeile neben das Pin-Icon passen, statt umzubrechen.
- **Wichtig:** Commits, die der Sync-Workflow selbst mit dem Standard-
  `GITHUB_TOKEN` pusht, lösen **keinen** neuen `Deploy Pages`-Run aus —
  GitHub verhindert das bewusst (Loop-Schutz: Events von `GITHUB_TOKEN`
  triggern keine anderen Workflows). Deshalb triggert `sync-calendar.yml`
  am Ende explizit `gh workflow run deploy-pages.yml`, wenn sich
  `dates.json` geändert hat (Schritt "Trigger Pages deploy", braucht
  `permissions: actions: write`). Ohne das würde jeder automatische Sync
  zwar committen, aber nie live gehen.

### Kalender-Abo

Fans können den Kalender abonnieren, ohne dass Leos private iCloud-Feed-URL
(das `CALENDAR_URL`-Secret) veröffentlicht werden muss:

- `scripts/sync-calendar.js` schreibt zusätzlich zu `data/dates.json` auch
  **`data/dates.ics`** — ein eigener, öffentlicher RFC5545-Feed mit
  denselben Terminen (Funktion `buildIcs()`). `sync-calendar.yml` committet
  und deployt beide Dateien zusammen (`git diff`/`git add` prüft beide
  Pfade).
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
  für sichtbaren Abstand zum letzten Termin) — bewusst nicht oben.
- GitHub Pages liefert `.ics`-Dateien automatisch mit
  `Content-Type: text/calendar` — kein Workaround nötig.
- Lokal ohne Node lässt sich der echte Sync nicht testen (s.u.) — lieber
  gleich den Workflow triggern statt lokal nachzubauen.

## Rechtliches: Cookie-Banner / YouTube-Embeds

Es gibt **bewusst keinen Cookie-Banner**. Die Seite setzt keine Cookies,
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

- **KRITISCH — Browser-Tool cached `assets/js/*.js` hartnäckig, auch über
  `location.reload()` UND `navigate()` zur exakt selben URL hinweg**
  (2026-09-23, hat in dieser Session zu einer kompletten Fehldiagnose
  geführt: ein frisch geschriebener `lightbox.js`-Fix sah nach mehreren
  Reloads immer noch "kaputt" aus, obwohl der Server per `curl`/`fetch(...,
  {cache:'no-store'})` nachweislich schon den korrigierten Code auslieferte
  — das Tab führte einfach weiter die alte, im Speicher/Cache gehaltene
  Version aus). **Verlässlicher Test, ob eine JS-Änderung wirklich aktiv
  ist:** `fetch(url, {cache:'no-store'}).then(r=>r.text())` und auf den
  neuen Code-Inhalt prüfen — falls das jünger aussieht als das beobachtete
  Verhalten, liegt es am Cache, nicht am Code. **Fix:** an den
  `<script src="...">`-Tag temporär einen Query-String hängen (z.B.
  `?t=2`), neu navigieren, testen — **danach unbedingt wieder entfernen**,
  bevor committet wird. CSS-Änderungen (`assets/css/style.css`) scheinen
  davon nicht in gleichem Maß betroffen zu sein, HTML-Seiten selbst auch
  nicht spürbar — bisher nur bei `assets/js/*.js` beobachtet, im Zweifel
  aber für jede Skript-Änderung mit einplanen.
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
  Für alten WordPress-Content lieber den Kunden direkt fragen.
- **GitHub-Pages-Zertifikat kann ungewöhnlich lange brauchen** (bei diesem
  Setup >1h). Fix falls es hängt: Custom Domain per API einmal entfernen
  und neu setzen (`gh api repos/leoasal/leoasal-website/pages -X PUT -f "cname="`
  dann nochmal mit dem echten Domainnamen) — das startet den Issuance-
  Prozess neu.
- **Deploy-Pipeline**: Läuft über `.github/workflows/deploy-pages.yml`
  (`actions/upload-pages-artifact` + `actions/deploy-pages`), Pages-Setting
  `build_type: workflow` (das alte Legacy-Build-System scheiterte mit
  generischem "Page build failed.", kein Jekyll-Problem, `.nojekyll` hat
  es nicht gefixt).
  **Dieser Weg kann hängen — teils nur Minuten, teils Stunden.** Ursache in
  der Vergangenheit war fast immer `concurrency: { group: "pages",
  cancel-in-progress: false }`: ein einzelner Run bleibt auf `waiting`
  hängen und blockiert dadurch alle nachfolgenden Runs. **Nach jedem Push
  den Deploy-Status wirklich prüfen, nicht nur pushen und gut sein
  lassen:**
  ```bash
  GH=~/.local/gh-cli/gh_2.97.0_macOS_arm64/bin/gh
  $GH run list --repo leoasal/leoasal-website --workflow=deploy-pages.yml --limit 3
  ```
  Bei hängendem `waiting`/`pending` über mehrere Minuten: zuerst den
  ältesten hängenden Run canceln (`gh run cancel <id> --repo
  leoasal/leoasal-website`), dann erst neu triggern — nicht einfach nur
  neu triggern, das reiht sich nur hinten in der gleichen blockierten
  Gruppe ein. Bei echtem `failure`: `$GH workflow run deploy-pages.yml
  --repo leoasal/leoasal-website`.
  Am Ende immer live gegenchecken (`curl -s https://leoasal.com/... | grep ...`
  nach einer eindeutigen neuen CSS-Klasse/Textstelle bzw. `curl -I` auf
  `last-modified`), nicht nur dem Workflow-Status vertrauen — und **beim
  Session-Start immer erstmal prüfen, ob es noch unerledigte/hängende
  Deploys vom letzten Mal gibt**, bevor man annimmt, der letzte Push sei live.
- **Kein Homebrew, kein Node lokal** in diesem Environment — gh CLI läuft
  als portable Binary (s.o.), der Kalender-Sync läuft nur in der GitHub
  Action (dort ist Node vorhanden), nicht lokal testbar ohne eigenes Node.
- **ffmpeg lokal verfügbar über pip** (2026-09-23 entdeckt, für Video-
  Verarbeitung aus der Inbox — z.B. Boomerang-Loops für die YAMUNA-Cover-
  Prozess-Videos): `python3 -m pip install --user imageio-ffmpeg` installiert
  ein echtes statisches ffmpeg-7.x-Binary (mit libx264) ohne Homebrew, Pfad
  per `python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"`.
  `python3 -m pip` selbst ist vorhanden (pip 26, Python 3.9); `cv2`
  (OpenCV) ist ebenfalls schon installiert, falls mal reine Bildverarbeitung
  ohne ffmpeg reicht.

## Inbox

`Inbox/` ist der Ablageort für alles, was noch nicht einsortiert ist —
Fotos, Notizen, Links, Dateien, die Leo jederzeit reinlegen kann, ohne
selbst zu entscheiden, wo es hingehört (Alternative zum direkten
Chat-Paste, den er bisher meistens nutzt). **Am Anfang jeder Session
zuerst prüfen, ob `Inbox/` Dateien enthält, und diese vor der eigentlichen
Aufgabe abarbeiten.**

Verarbeitungsregeln für dieses Projekt:
- **Fotos** (Bandfotos, Album-Cover, Projektbilder): der passenden
  Projektseite zuordnen, nach `assets/images/` mit dem etablierten
  Namensschema kopieren (z.B. `<projekt>-photo-N.jpg`,
  `<projekt>-album-<titel>.jpg`), in die passende Galerie/Sektion
  einbinden (Muster einer ähnlichen bestehenden Seite kopieren, s.
  "Seitenstruktur"). Bei Unsicherheit, ob Farbe oder Graustufen original
  war, Kanal-Differenz-Analyse statt raten (siehe CHANGELOG,
  Yamuna/Ketzberg-Fälle).
- **Text-/Link-Notizen** (neue Bio-Absätze, Tourdaten, Projektbeschreibungen):
  Inhalt lesen und in die passende i18n-JSON (alle 3 Sprachen!) bzw.
  Sektion von `index.html`/der jeweiligen Projektseite übernehmen.
- **Kalender-relevantes** (Flyer, Datum/Ort-Infos): siehe stattdessen
  "Kalenderpflege" oben — das läuft über Calendar.app, nicht über Inbox.

Nach der Verarbeitung die Originaldatei **nicht löschen**, sondern nach
`Inbox/processed/` verschieben (Audit-Trail, falls doch mal was fehlt) —
außer Leo sagt ausdrücklich, dass gelöscht werden soll. `Inbox/processed/`
ist **gitignored** (2026-09-23 ergänzt) — die rohen Originaldateien (oft
mehrere MB, unbearbeitet) sollen nicht das öffentliche Repo aufblähen, nur
lokal als Audit-Trail liegen bleiben. Jede verarbeitete Datei kurz in
`CHANGELOG.md` festhalten (was reinkam, was draus wurde, wie/wohin
verarbeitet — Bild-Resize-Parameter, Video-Encoding-Optionen etc.).

## Offene Punkte / mögliche nächste Schritte

- **Bio-Portraitfoto auf der Startseite** (`#bio`-Sektion in `index.html`)
  ist aktuell nur ein Platzhalter (`assets/images/hero.jpg`, identisch zum
  Hero-Bild direkt darüber). Leo hat angekündigt, ein anderes Foto dafür zu
  schicken — sobald es da ist, in `index.html` bei `<figure
  class="bio-portrait">` den `src` austauschen (bio.html selbst existiert
  nicht mehr als eigene Seite, s. Architektur-Hinweis oben).
