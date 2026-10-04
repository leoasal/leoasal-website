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

**Architektur: Blog/Bio/Termine/Projekte/Gear/Kontakt sind keine
eigenständigen Seiten.** Leo wollte, dass Klicken in der Nav und
Runterscrollen auf der Startseite zum exakt selben Ergebnis führen ("die
Unterscheidung zwischen Scrollen und den einzelnen Seiten soll es nicht
mehr geben"). Der komplette Inhalt dieser 6 Bereiche lebt ausschließlich
als Sektionen in `index.html` (`#blog`, `#bio`, `#dates`, `#projects`,
`#gear`, `#contact` — in dieser Reihenfolge, Blog zuerst direkt nach dem
Hero, Gear vor Contact — 2026-09-30 auf Leos Wunsch von "letzter Punkt"
auf "5. Punkt, vor Contact" korrigiert). `blog.html`/`bio.html`/
`dates.html`/`projects.html`/`gear.html`/`contact.html` existieren nur
noch als minimale Redirect-Stubs (`<meta http-equiv="refresh">` +
`location.replace(...)`) auf
`index.html#<section>`, damit alte Bookmarks/Backlinks nicht ins Leere
laufen. Zusätzlich gibt es seit 2026-09-30 `#home` (= die `.hero`-Sektion
ganz oben, kein eigener Inhaltsblock, kein `home.html`-Stub nötig — der
Nav-Punkt "Home" führt einfach zurück an den Seitenanfang, s.
"Header/Nav-Layout" unten). **Nicht versehentlich wieder "echte" Seiten daraus machen** —
jede Änderung an Blog/Bio/Termine/Projekten/Kontakt/Gear gehört
ausschließlich in die passende Sektion von `index.html` (Text weiter über
die i18n-JSONs). **Das gilt auch für neue Bereiche dieser Art** — bei der
Gear-Seite (2026-09-30) war der erste Entwurf fälschlich eine echte
eigenständige `gear.html`-Seite mit eigenem Header/Footer und einem
6. Punkt in der Nav, der auf `gear.html` statt auf `#gear` zeigte; Leo
korrigierte das ausdrücklich ("soll auch nur ein Marker auf dem One-Pager
sein") — bei jedem neuen Nav-Punkt zuerst dieses Architektur-Prinzip
prüfen, nicht automatisch eine eigenständige Seite bauen.

```
index.html                    Startseite: Hero (Foto + Name), danach direkt im Anschluss
                               die vollständigen Sektionen #blog/#bio/#dates/#projects/
                               #gear/#contact (siehe Architektur-Hinweis oben) — abwechselnd
                               weißer/hellgrauer Hintergrund (`.home-section`/
                               `.home-section--alt`, Reihenfolge weiß/grau/weiß/grau/weiß/grau)
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
dates.html, projects.html,    #projects/#gear/#contact (s. Architektur-Hinweis oben) — kein
gear.html, contact.html       echter Inhalt mehr, keine Nav/Header/Footer, kein data-i18n
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

Gemeinsames Muster pro Seite: Header (Logo, `.header-actions` mit
Social-Icons + Sprachumschalter + Hamburger-Button `.menu-toggle`), darin
unten das Dropdown `<nav class="menu-panel" id="menu-panel">`, Content in
`<main>`, Footer mit Impressum/Datenschutz + Copyright, Skripte (`i18n.js`,
`menu.js`, `anchor-scroll.js`, …). Details zur Nav s. "Header/Nav" unten.
Neue Seiten am besten von einer bestehenden ähnlichen Seite kopieren statt
neu aufbauen, damit nichts vergessen wird.

**Header/Nav — aktuell: Hamburger-Dropdown (live seit 2026-10-03, Vorbild
julius-asal.com):** Auf allen 9 Seiten und allen Breiten dieselbe Nav: ein
Hamburger-Button (`.menu-toggle`, wird beim Öffnen zum X) rechts in der
Kopfzeile, nach den Social-Icons und der Sprachwahl in `.header-actions`.
Er klappt `.menu-panel` auf — ein weißes Dropdown, das an der Unterkante des
Headers hängt (`position:absolute; top:100%`, rechtsbündig zur Container-
Kante, halbtransparentes Milchglas `rgba(255,255,255,.72)` + `blur(14px)`, 0.25 s
Ein-/Ausblenden; Leo: "etwas transparent"), mit den 7 Punkten Home/Blog/
Bio/Dates/Projects/Gear/Contact untereinander. `assets/js/menu.js` steuert
Auf/Zu (Klick auf den Button, Klick außerhalb, Esc, Klick auf einen Eintrag)
und zieht unterhalb 480 px die `.site-social`-Icons per `matchMedia` aus der
Kopfzeile ins Dropdown (dort kein Platz; Tidal & Co. wären sonst abgeschnitten
— bei breiterem Viewport wandern sie zurück). `anchor-scroll.js` ist nur noch
Scrollspy + Hash-Landung: der nächstgelegene Abschnitt bekommt
`aria-current="location"` auf dem `.menu-panel`-Link (Unterseiten:
"Projects" hartcodiert `aria-current="page"`). **Falle:** der Header-Hintergrund + `backdrop-filter` sitzt auf
`.site-header::before` (nicht auf dem Header selbst) — ein `backdrop-filter`
am Header würde ihn zum "Backdrop Root" machen, und der Blur des Dropdowns
(Kind des Headers) sähe dann nur den Header, nicht die Seite dahinter.
Menü-Eintrag-Selektoren im
CSS sind auf `.menu-panel ul a` begrenzt (sonst erben die Social-Links das
Eintrags-Padding). i18n: `nav.menu` (aria-label des Buttons) in allen 3
JSONs; auf impressum/datenschutz hartcodiert "Menü". Es gibt keine
`.site-nav`, `.side-rail`, `.mobile-nav` mehr und keinen Bottom-Bar-
`main`-Abstand.

> **Archiv: Marker-Rail-Variante** (bis 2026-10-02 live). Vollständig
> erhalten als Branch `menu-option-side-rail` (Stand der Rail) bzw. Tag
> `menu-rail-last-main` (letzter `main`-Commit vor dem Dropdown-Merge, inkl.
> aller damaligen Doku). Zurückwechseln: `git revert -m 1 <Merge-Commit>`
> oder die Dateien aus dem Tag holen (`git checkout menu-rail-last-main --
> index.html <alle Unterseiten> assets/css/style.css assets/js/
> anchor-scroll.js`), `menu.js`-Einbindung entfernen. Der folgende Abschnitt
> bis "Home-Punkt" beschreibt diese **nicht mehr aktive** Variante, bleibt
> aber bewusst stehen, falls Leo wieder wechseln will.

**Header/Nav-Layout, dreistufig responsiv (2026-09-30 komplett umgebaut,**
Vorgänger-Version mit `.lang-switch--mobile`-Doppelkopie und mittig
schwebenden Social-Icons existiert nicht mehr): Leo fand die Hauptnav "zu
voll" (damals 6 Punkte, seither ist "Home" als 7. dazugekommen, s. unten
— und irgendwann noch "Unterricht" als 8., s. "Offene Punkte" weiter unten)
und wollte die Sprachauswahl rechts neben die Social-Icons und die
Hauptnav als linke, beim Scrollen mitwandernde "Marker-Galerie" statt
einer horizontalen Leiste — **die Galerie sitzt inzwischen rechts, nicht
links** (Leo hat das direkt im Anschluss korrigiert: "mache das menü auf
die rechte seite"). Außerdem gibt es jetzt einen **"Home"-Punkt ganz oben**
in jeder Nav-Liste (führt zu `#home`, dem `.hero`-Element auf index.html —
per Klick auf Leo-Wunsch ergänzt: "ganz an den Anfang der Website"),
**7 Punkte gesamt**: Home/Blog/Bio/Dates/Projects/Gear/Contact. Ergebnis —
drei Breakpoints:

- **`<800px` (mobil):** `.site-header .container` ist `display:flex;
  justify-content:space-between` mit genau 2 sichtbaren Kindern —
  `.logo` links, `.header-actions` (wrapt `.site-social` + `.lang-switch`)
  rechts. `.site-nav` und `.side-rail` sind hier `display:none`.
  Haupt-Navigation läuft über die bestehende `.mobile-nav` (fixe
  Bottom-Bar, unverändert, 7 Items durch `.mobile-nav a { flex:1 }`
  automatisch gleich verteilt — kein CSS-Fix nötig beim Hinzufügen eines
  8. Punkts).
- **`800–1099px` (schmales Desktop/Tablet, Fallback-Stufe):** zu schmal,
  damit ein `position:fixed`-Rail neben dem zentrierten 960px-`.container`
  Platz hat, ohne Seiteninhalt zu überlappen (bei ~800px hat der Container
  praktisch keinen Außenabstand). Deshalb hier stattdessen die **alte
  horizontale `.site-nav`-Leiste** als dritter Flex-Punkt zwischen `.logo`
  und `.header-actions` (`.site-header .container` hat in dieser Stufe
  3 sichtbare Kinder statt 2, `space-between` verteilt sie).
- **`≥1100px`:** `.site-nav` versteckt sich, stattdessen erscheint
  `.side-rail` — eine **fixe vertikale Leiste rechts am Viewport-Rand**
  (`position:fixed; right:2rem; top:50%; transform:translateY(-50%)`),
  eigenständiges `<nav>` außerhalb von `.site-header` (nicht Teil des
  Headers, bleibt beim Scrollen stehen). Enthält dieselben Punkte wie
  `.site-nav`/`.mobile-nav`, aber vertikal gestapelt in einer
  `.side-rail-track`-Box mit halbtransparentem weißem Frosted-Glass-
  Hintergrund (`rgba(255,255,255,0.85)` + `backdrop-filter:blur(6px)`,
  **notwendig, nicht kosmetisch** — ohne Hintergrund sind die Labels auf
  dunklen Foto-Hintergründen wie dem Hero-Bild unlesbar, das war der erste
  Entwurf und musste korrigiert werden). Text ist rechtsbündig
  (`.side-rail a { text-align:right }`), die dünne vertikale Linie
  (`.side-rail-line`) und der gleitende Akzent-Balken
  (`.side-rail-indicator`, 3px breit, 1.15rem hoch) sitzen dafür
  **rechts** in der Box (`right:` statt `left:`, gespiegelt seit dem
  Seitenwechsel) — das ist die "Marker-Galerie, die sich beim Scrollen
  weiterbewegt".

**Rail blendet sich aus (nur index.html, 2026-10-02):** `<nav class="side-rail
side-rail--autohide">` ist beim Laden unsichtbar (`opacity:0`, Überblendung
0.9 s, bleibt hit-testbar). `anchor-scroll.js` setzt bei jedem Scroll
`.is-visible` und entfernt es `HIDE_DELAY_MS` (400 ms) nach dem letzten
Scroll-Event; zusätzlich `.is-pointer-active` bei **jeder** Mausbewegung auf
der Seite (Ort des Zeigers egal, kein Radius mehr — Leo-Wunsch), entfernt
`POINTER_IDLE_MS` (1500 ms) nach Stillstand der Maus. `:hover` auf der Rail
und `:focus-within` halten sie per CSS sichtbar. Test per synthetischem
`mousemove` auf `window`; die Timer laufen auch in verborgener Pane.

**Unterseiten (6 Projektseiten, Impressum, Datenschutz) haben gar keine
`.side-rail` mehr** (2026-10-02, Leo: "Kein Menü auf den Unterseiten") — das
`<nav>` ist dort aus dem HTML entfernt. Heißt: ab ≥1100px (`.site-nav`
versteckt, Rail fehlt) gibt es auf Unterseiten keine Hauptnav, nur Logo +
Zurück-Link; 800–1099px zeigt weiter `.site-nav`, <800px `.mobile-nav`.

**Scrollspy + Rail-Balken, kontinuierlich statt sprunghaft (2026-10-02,
auf Leos Wunsch: "beim Runterscrollen bewegt sich der Streifen langsam und
proportional nach unten", "genau auf Höhe des Markers", "Streifen selbst
bewegen als Navigation", "navigiert nicht exakt zum Marker"):**
- **Balken-Position proportional zur Scrollposition:**
  `anchor-scroll.js` berechnet pro Frame (`requestAnimationFrame`-gedrosselt,
  **kein** CSS-`transition` mehr auf dem Balken — die Bewegung kommt direkt
  vom Scrollen) die "Landing-Position" jeder Sektion (`absTop(sec) -
  scroll-margin-top`, geklemmt auf das Seitenende). Zwischen zwei
  Landing-Positionen wird der Balken linear zwischen den Mitten der beiden
  Marker interpoliert (`railCentres()` = Link-Mitte relativ zur Oberkante
  von `.side-rail-track`, per `getBoundingClientRect`). Das aktive Label
  (`aria-current="location"`, auch in `.site-nav`/`.mobile-nav`) ist die
  *nächstgelegene* Sektion (`t >= 0.5 ? i+1 : i`). Verifiziert: bei 0/25/50/
  75/100 % Weg zwischen Bio und Dates steht der Balken exakt bei
  0/0.25/0.5/0.75/1 des Marker-Abstands.
- **Balken exakt auf Marker-Höhe:** `.side-rail-indicator` braucht
  `top: 0` — ohne explizites `top` sitzt ein `position:absolute`-Element an
  seiner statischen Position, also um das `padding-top` der Box (0.85rem)
  zu tief; das war der Grund für "immer etwas unterhalb des Markers".
  Gemessen: Abweichung Balkenmitte ↔ Link-Mitte ≤ 0.2px an allen Markern.
- **Balken ziehbar (nur index.html):** `anchor-scroll.js` setzt
  `.side-rail-track.is-draggable`; Pointer-Events (`pointerdown/move/up`
  mit `setPointerCapture`) auf dem Balken, vergrößerte Trefferfläche per
  `::before`. Beim Ziehen wird die Rail-Y-Position per Umkehrabbildung in
  eine Scrollposition umgerechnet (`window.scrollTo({behavior:"instant"})`);
  der Balken folgt über den normalen Scroll-Handler. Magnetzone ±6px um jede
  Marker-Mitte, damit man beim Zielen exakt bündig landet. Unterseiten
  haben keine Rail.
- **Landung bündig unter dem Header:** `scroll-margin-top` von
  `.home-section`/`.hero` ist jetzt `var(--header-h)` (= `--nav-height + 1px`
  Border = 65px, vorher fest 80px → 15px vom vorherigen Abschnitt lugten
  oben heraus). `anchor-scroll.js` liest den Offset aus dem Header
  (`HEADER_OFFSET = header.offsetHeight`) bzw. aus dem berechneten
  `scroll-margin-top`, **nie mehr hartkodiert** — Header-Höhe nur noch an
  einer Stelle (CSS) ändern. `#contact` hat `min-height: calc(100vh -
  var(--header-h))`, sonst endet die Seite vor der Landung und "Contact"
  kann nicht bündig angefahren werden (leere Fläche unter dem Kontakt-Text
  ist Absicht).
- **Nachjustieren nach Seitenwechsel:** Nach Ankunft über `index.html#...`
  wächst Inhalt oberhalb teils nach (Termine, Lazy-Bilder) und schiebt die
  Sektion nach unten; `settle()` korrigiert 2.5 s lang per `scrollTo`,
  solange der Nutzer nicht selbst scrollt (`userTookOver`).
- **Test-Falle:** Ist die Browser-Pane verborgen (`document.visibilityState
  === "hidden"`), läuft `requestAnimationFrame` nicht — Scrollspy-Tests
  zeigen dann stale Zustände, kein Code-Fehler. Tab vorher mit `tabs_select`
  nach vorn holen.

**"Home"-Punkt / `#home`:** `<section id="home" class="hero">` (statt nur
`<section class="hero">`) — die Hero-Sektion selbst ist jetzt ein
Scrollspy-Ziel wie jede andere Sektion. `spyIds` in `anchor-scroll.js`
beginnt jetzt mit `"home"` statt `"blog"`. Die alte Sonderregel "nichts ist
aktiv, solange der Hero oben im View ist" (`pageYOffset < 40 →
setActive(null)`) ist **entfernt** — die normale Scrollspy-Schleife
markiert "Home" jetzt korrekt selbst (`spySections[0]` ist `#home`, Landing-
Position 0). `.hero` hat wie `.home-section` `scroll-margin-top:
var(--header-h)`. Auf
Unterseiten ist der Link `index.html#home` (kein `aria-current`, wie bei
Blog/Bio/Dates/Gear/Contact — nur "Projects" wird dort hartcodiert
markiert).

**Sprachumschalter — jetzt nur noch EINE Kopie, an allen Breakpoints
an derselben Stelle** (in `.header-actions`, direkt nach den Social-Icons,
mit dem alten Trennstrich `border-left`): `.lang-switch--mobile` und die
alte Breakpoint-Logik dafür (`@media (min-width:800px){display:none}`)
sind komplett entfernt — durch den Wegfall der Nav aus dem Header war die
alte "drei Items, Sprache in der Mitte"-Notlösung nicht mehr nötig.
Impressum/Datenschutz haben weiterhin **gar keinen** Umschalter (bewusst).
Es gibt weiterhin **keinen** Footer-Umschalter (redundant, permanent im
Header). i18n.js hört per Event-Delegation auf jedes `[data-lang]`, keine
JS-Änderung nötig gewesen.

**Mobil-Header (<480px):** `.logo` hat `white-space:nowrap; flex-shrink:0`
(sonst brach "LEO ASAL" bei 375px in zwei Zeilen um, weil Icons + Sprache
zusammen 238px brauchten); `@media (max-width:479px)` macht
`.header-actions`/`.site-social`/`.lang-switch` kompakter (kleinere Gaps,
Padding) → zusammen ~211px. **Seit dem Dropdown (2026-10-03) ist das
überholt:** unter 480 px stehen in der Kopfzeile nur noch Logo, Sprachwahl
und Hamburger; die Social-Icons sitzen im Dropdown (s. "Header/Nav —
aktuell").

**`.header-actions`** (`display:flex; align-items:center; gap:1.1rem`)
wrapt `.site-social` + `.lang-switch` zu einer Gruppe — dadurch landen
Icons und Sprache **immer zusammen** rechts, an jedem Breakpoint, statt
wie vorher einzeln über `justify-content:space-between` verteilt zu
werden. Kein `.brand-group`-Wrapper um Logo+Icons nötig (das war die alte,
bewusst vermiedene Lösung aus der Vorgänger-Version — jetzt obsolet, da
die Icons nicht mehr mittig schweben müssen).

Aktuell: Instagram, Facebook, Spotify, Apple Music, Tidal — inline SVGs,
identisch in allen Seiten mit echtem Header (index.html, die 6
Projekt-Unterseiten, impressum.html, datenschutz.html — **nicht** in
blog.html/bio.html/dates.html/projects.html/contact.html/gear.html, die
sind Redirect-Stubs ohne Header). Bei neuen Seiten unbedingt aus einer
bestehenden Seite kopieren, nicht neu tippen (sonst Copy-Paste-Fehler bei
den langen SVG-Paths).

Die 6 Projekt-Unterseiten (Yamuna, Jakob Manz, Jakob Bänsch, Härtel/Asal,
Ketzberg, Loft Arts) haben im `.page-header` statt eines reinen "Project"-Textes einen
klickbaren Zurück-Link (`.back-link`, Pfeil-SVG + `nav.projects`-Text) auf
`index.html#projects` — bei neuen Projekt-Unterseiten dieses Pattern
übernehmen, nicht wieder einen reinen Text-Eyebrow einbauen. Blog/Bio/
Dates/Projects/Gear/Contact als Homepage-Sektionen behalten ihren normalen
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

**Lightbox schließen (2026-10-03, Leo-Wunsch):** außer per X, Esc, **Leertaste**
(2026-10-04, `preventDefault`, damit die Seite nicht scrollt und ein fokussierter
Trigger-Button nicht neu auslöst) oder Backdrop schließt **jeder Klick auf die schwarze Fläche** um Foto/Video —
`lightbox.js` prüft `!e.target.closest(".lightbox-img, .lightbox-credit")`
(die Wrapper `.lightbox-content/-stage/-slide` decken den Rand ab, ein
reiner `target === overlay`-Test würde dort nicht greifen). Klick auf das
Foto/Video selbst oder die Credit-Zeile (mit Link) schließt nicht; Pfeile
haben ihre eigenen Handler. Gilt für alle Galerien und Video-Items.

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

**Gear-Sektion (`#gear` in index.html, neu 2026-09-30):** Leo wollte eine
Sektion für Marken/Ausrüstung, mit der er kooperiert (erster Eintrag:
Vision Ears, In-Ear-Monitore) — als eigener Punkt im One-Pager, genau wie
Blog/Bio/Dates/Projects/Contact (s. Architektur-Hinweis ganz oben in
diesem Abschnitt), **Position 6 von 7 (Home/Blog/Bio/Dates/Projects/Gear/Contact), direkt vor Contact** (2026-09-30
per Rückfrage zunächst ans Ende gesetzt, dann von Leo explizit vor
Contact korrigiert: "gear soll als 5. punkt, vor kontakt, sein"). **Erster
Entwurf war außerdem eine eigenständige `gear.html` mit eigenem
Header/Nav-Link `gear.html`** — von Leo direkt korrigiert ("soll auch nur
ein Marker auf dem One-Pager sein"); jetzt `gear.html` nur noch
Redirect-Stub auf `index.html#gear` wie die anderen 5. Nav-Link auf allen
Seiten mit echtem Header ist `index.html#gear` (bzw. auf index.html
selbst nur `#gear`), **eingefügt zwischen Projects und Contact** +
`nav.gear`-i18n-Key (auch auf impressum.html/datenschutz.html, dort wie
die anderen Nav-Labels hartcodiert ohne `data-i18n`). die
`.menu-panel`-Liste hat jetzt **7 Einträge** inkl. Home (Dropdown wächst
automatisch, kein CSS-Fix nötig).
`assets/js/anchor-scroll.js`: `spyIds`-Array ist
`["home","blog","bio","dates","projects","gear","contact"]` — **die
Reihenfolge in diesem Array muss immer exakt der DOM-Reihenfolge der
Sektionen entsprechen** (die Landing-Positionen müssen aufsteigend sein,
sonst bricht die Landing-Positions-Logik des Scrollspy. `index.html` lädt jetzt
zusätzlich `assets/js/lightbox.js` (vorher nicht nötig, da die Homepage
bis dahin keine Lightbox-Galerie hatte). Hintergrund-Alternierung dadurch
`#gear` = weiß (5. Band), `#contact` = grau (6. Band, vorher weiß als
5. Band) — bei künftigem Verschieben von Sektionen immer beide
Hintergrundklassen der betroffenen Sektionen neu durchzählen, nicht nur
die neue Sektion isoliert einfärben.

**Vision-Ears-Logo (2026-10-03):** farbiges Wortmarken-Logo
(`assets/images/visionears-logo.png`, 560 px breit, aus `VE Straight Colour/
VE VE straight_2.png`, transparent → passt auf dem weißen `#gear`-Band,
verlinkt auf vision-ears.de). **Es sitzt rechts neben dem Zitat, bündig mit
dessen Oberkante** (Leo: erste Platzierung über der Überschrift gefiel nicht,
dann "etwas höher und kleiner"): `<div class="gear-quote-row">` (Flex,
`align-items:flex-start`, `space-between`) wrappt `.gear-quote` +
`.brand-side` (rechts: nur das verlinkte `.brand-logo`, 150 px breit, Hover
= leicht transparent; **ausschließlich der Logo-Link**, es gibt bewusst keinen
zusätzlichen Text-Link `vision-ears.de` mehr, Leo hat ihn entfernt); unter 640 px stapelt es (Logo unter dem Zitat,
120 px). Bewusst das eckige statt
des runden Logos: Wortmarke bleibt klein lesbar, das Rund-Siegel hat
winzigen Text ("CUSTOM IN-EARS"). Das Rund-Logo (`VE Round Colour/
VE Round2.png`) liegt nur in Leos Downloads als Alternative. Das Zitat
(`.gear-quote p`) ist 0.85rem, der Footer 0.75rem.

Sektionsaufbau (wie jede Homepage-Sektion): `.page-header` mit Eyebrow
(`gear.eyebrow`, i18n) + `<h2>` "Gear" (`gear.heading`, i18n — auf
Spanisch "Equipo", wie `nav.gear`). **Als erweiterbare Liste angelegt:**
jede Marke/jedes Endorsement kriegt darunter einen eigenen `<h3>`-Block
(nicht als eigenes `.home-section`-Band, da Gear insgesamt schon eine
einzelne Homepage-Sektion ist — analog zu den `.blog-post`-Artikeln unter
der Blog-Sektion). Bisher nur Vision Ears: `<h3>Vision Ears Artist</h3>`
(2026-09-30 — ursprünglich `<h3>Vision Ears</h3>` mit separatem
Eyebrow-Badge "Vision Ears Artist" darüber, auf Leos Wunsch
zusammengelegt: Badge raus, Markenname selbst heißt jetzt "Vision Ears
Artist"), Intro-Satz (`gear.visionears.text`, i18n), Zitat
(`.gear-quote`, neue CSS-Klasse — linker Akzent-Strich + kursiv, s.
`style.css`) als **echtes, übersetztes** `gear.visionears.quote`
(i18n in allen 3 Sprachen — das deutsche Original ist das tatsächliche,
öffentlich auf vision-ears.de veröffentlichte Testimonial-Zitat, EN/ES
sind Übersetzungen davon), Zitat-Footer ist nur noch `— Leo Asal`
(2026-09-30 den vision-ears.de-Link dort entfernt — er stand direkt
neben dem separaten `.project-link` weiter unten, war doppelt), 4 Fotos
in einer `.epk-gallery.epk-gallery--color` (**in Farbe**, 2026-10-03 auf Leos
Wunsch; ohne `--color` wären sie Graustufen; Standard-4-Spalten-Grid, kein
inline-Override mehr — s. Foto-Herkunft unten), Link auf vision-ears.de
nur über das Logo (s. u.). **Sonor-Vintage-Series-Block (2026-10-04):** zweiter Marken-Block darunter
(`<h3 class="gear-brand">Sonor Vintage Series</h3>`, `.gear-brand` = 4rem
Abstand nach oben), Satz `gear.sonor.text` (i18n, 3 Sprachen — bewusst nur
"Leo spielt ein Sonor Vintage Series Schlagzeug", keine Endorsement-
Behauptung, da Leo es als "mein Sonor Vintage Series" beschrieb), darunter
eine normale `.epk-gallery.epk-gallery--color` mit 4 Fotos des grünen Kits
(`assets/images/sonor-photo-1.jpg`–`-4.jpg`, aus iPhone-Originalen
`IMG_8338/8343/8339.jpeg` (in dieser Reihenfolge, 2↔3 getauscht); **Bild 4 ist
seit 2026-10-04 das beschriftete Setup-Foto** (`setup-beschriftet-dunkel.jpg`,
Draufsicht mit Weißen Beschriftungsboxen je Trommel/Becken, 2000×1500 q85;
Einzelne Boxen enthalten noch den Platzhalter „[Modell folgt]“ im Bild selbst) 4032×3024 auf 1600×1200 skaliert, JPEG q82;
Grid zeigt sie quadratisch zugeschnitten, die Lightbox das volle 4:3-Bild).
Kein Credit/`data-credit` (Leos eigene Fotos). Originale in
`Inbox/processed/`. Neue
Marke ergänzen: denselben h3+Text-Block unter dem Vision-Ears-Block
anhängen (kein Alternieren nötig, da nur eine Sektion).

Fotos (`assets/images/visionears-photo-1.jpg` bis `-4.jpg`, seit
2026-09-30): ursprünglich 2 von Instagram gezogene 640×640-Crops (s.
Git-Historie/CHANGELOG), dann von Leo durch 4 echte, hochauflösende
Fotos aus der Inbox ersetzt (Originaldateien: `medium_Leo_Asal_c_
Christian_Nordstroem_...png`, `SJM2023-C15-RuedigerBaldauf-017.jpg`,
`SJM2023-C5-MichaelManson-021.jpg`/`-022.jpg` — Smooth-Jazz-Festival-
Livefotos, alle mit sichtbarem In-Ear). Die beiden `SJM2023-C5-*`-Fotos
sind Querformat (1800×1200) und wurden mit PIL auf ein zentriertes
1200×1200-Quadrat zugeschnitten (Leo leicht rechts der Mitte im Original,
daher Crop-Box `x=[350,1550]` statt striktem Mittig-Crop), die anderen
beiden waren schon quadratisch. Weil jetzt 4 statt 2 Bilder da sind, ist
der frühere `.epk-gallery`-Sonderfall (`style="grid-template-columns:
repeat(2,1fr);max-width:32rem"`, s.o.) wieder entfernt — die Standard-
4-Spalten-Grid passt jetzt exakt. Credit `data-credit-name`/`-url` auf
"Christian Nordström" / `https://www.smoothjazzphoto.com` umgestellt
(vorher `@smoothjazzphoto`-Instagram-Handle) — der Name steht auch als
sichtbares Wasserzeichen in den Originalfotos. Die alten 2
Instagram-Crops wurden von der Seite entfernt (Leo: "die alten beiden
Fotos kannst du dann löschen").

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
  bevor committet wird. **Gilt genauso für `assets/css/style.css`** (am
  2026-10-02 beobachtet: geänderte `scroll-margin-top`-Werte kamen im Tab
  nicht an, bis `style.css?t=N` angehängt wurde) — für jede JS- **und**
  CSS-Änderung ein temporäres `?t=N` an `<link>`/`<script>` einplanen und
  danach per `grep -rn '?t=' *.html assets/js/*.js` sicherstellen, dass nichts
  davon committet wird. HTML-Seiten selbst waren bisher nicht betroffen.
- **Verborgene Browser-Pane = kein `requestAnimationFrame`:** ist
  `document.visibilityState === "hidden"`, laufen rAF-basierte Handler
  (Scrollspy) nicht — Tests zeigen dann stale Zustände, kein
  Code-Fehler. Tab vorher per `tabs_select` nach vorn holen.
- **Neue Tabs landen auf `file://`:** Nach `Edit`/`Write` öffnet sich ein
  `file://`-Preview-Tab ohne CSS; `navigate` weicht manchmal auf ihn aus
  ("Tab … shows a local file"). Dann `tabs_context`, Stray-Tabs schließen,
  `tabs_select` auf den `localhost`-Tab und per `javascript_tool`
  (`location.href`) prüfen, dass man auf der richtigen Seite ist.
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
- **Kein Homebrew**; gh CLI läuft als portable Binary (s.o.). **Node ist
  lokal vorhanden** (v24, Stand 2026-10-02) — nützlich für `node --check
  assets/js/*.js scripts/sync-calendar.js` (Syntaxcheck vor dem Commit). Der
  Kalender-Sync selbst läuft weiterhin nur in der GitHub Action, weil er das
  Secret `CALENDAR_URL` braucht (Secrets nie lokal ablegen).
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

- **Neuer Nav-Punkt "Unterricht"** (angekündigt 2026-09-30, noch nicht
  umgesetzt): Leo will später einen 8. Punkt in der Hauptnav für
  Drum-Unterricht ergänzen (Home/Blog/Bio/Dates/Projects/Gear/Contact sind
  aktuell 7). Wenn er das anstößt: neue `#unterricht`-Sektion in
  `index.html` nach dem Muster der bestehenden Sektionen (s.
  "Seitenstruktur" oben), `nav.unterricht`-i18n-Key in allen 3 JSONs, Link
  in **einer** Stelle pro Seite mit echtem Header ergänzen (`.menu-panel`-
  `<ul>`) auf **allen 9** Seiten (s.
  "Header/Nav-Layout" oben), `spyIds`-Array in `anchor-scroll.js` um
  `"unterricht"` an der richtigen Position erweitern (Reihenfolge muss der
  DOM-Reihenfolge der Sektionen entsprechen, sonst bricht der Scrollspy),
  Hintergrund-Alternierung der betroffenen Sektionen neu durchzählen.
  Noch nicht geklärt: an welcher Position in der Reihenfolge (vermutlich
  nicht einfach ans Ende, s. Präzedenzfall Gear, das explizit vor statt
  nach Contact eingeordnet wurde) — bei Umsetzung nachfragen statt raten.
