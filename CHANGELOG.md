# CHANGELOG — leoasal.com

Chronologischer Verlauf abgeschlossener Änderungen (neueste zuerst).
Aktueller Zustand/Architektur steht in `CLAUDE.md`, nicht hier.

## Erledigt (chronologisch, neueste zuerst)

- **Jakob-Bänsch-Quartett-Seite: neue "Releases"-Sektion (2026-09-11).**
  Zwei Alben-Cover zwischen der Beschreibung/dem Domain-Link und "Photos"
  eingefügt — „All the Others" (2025, zuerst) und „Opening" (2023, ihr
  Debütalbum, im Beschreibungstext schon erwähnt). Cover kamen als
  Bild-Anhänge direkt im Chat (keine Datei mit höherer Auflösung in Leos
  iCloud-Projektordner gefunden, `Jakob Bänsch`-Ordner enthält nur
  Studio-/Live-Fotos und Rohmixe, keine fertigen Cover) — aus dem
  Session-Transcript extrahiert (Base64 im JSONL) und unverändert
  (1155×1035, kein manueller Crop, da unklar ob das Cover-Design bewusst
  leicht nicht-quadratisch ist und ein Crop Text hätte anschneiden können)
  als `assets/images/baensch-album-all-the-others.jpg` /
  `-opening.jpg` gespeichert.
  - Markup: `<div class="discography epk-covers">` mit zwei
    `<figure class="discography-item">` (je `.cover-trigger` +
    `<figcaption>` mit Titel/Jahr). Die zusätzliche `epk-covers`-Klasse ist
    **notwendig, nicht kosmetisch** — `lightbox.js` gruppiert Lightbox-
    Geschwister nur innerhalb des nächsten `.epk-gallery`/`.epk-covers`-
    Vorfahren; ohne die Klasse hätte ein Klick auf ein Cover **alle**
    `[data-lightbox]`-Elemente der Seite gruppiert (inkl. der 4 unabhängigen
    Fotos weiter unten) statt nur die 2 Cover. Lokal verifiziert: Lightbox
    zeigt nur die 2 Cover im Karussell, nicht die Fotogalerie.
  - Neue Caption-Styles `.discography-item`/`.discography-title`/
    `.discography-year` (Titel in `--font-display`, Jahr klein/gedimmt,
    analog zu `.project-card h3`/`.subtitle`).
  - **Nachzieher (Leo, selber Tag):** "mehr Abstand zwischen den Abschnitten"
    — `.epk-covers` selbst trägt **kein** Margin (steckt auch in
    `.epk-hero` auf Yamuna/Härtel-Asal, das über Flex-`gap` spacet), dadurch
    saß der neue Cover-Block ohne jeden Abstand direkt vor der
    "Photos"-Überschrift. Fix: `.discography { margin: 2rem 0 2.5rem }` —
    **nur** auf die neue `.discography`-Klasse, nicht auf `.epk-covers`
    selbst, damit Yamuna/Härtel-Asal unangetastet bleiben. Passt die
    Rhythmik jetzt an `.epk-gallery`s bestehendes `margin: 2rem 0` an (eher
    noch etwas großzügiger unten Richtung "Photos").
  - Neuer geteilter i18n-Key `project.releasesHeading` (wie
    `project.photosHeading`/`project.videosHeading`, für künftige
    Discography-Sektionen auf anderen Projektseiten wiederverwendbar) in
    allen 3 Sprachen.
  - Dabei aufgefallen und mitkorrigiert: Die Tabelle unten unter
    "Seitenstruktur" hatte für diese Seite "5 Fotos" stehen, tatsächlich
    sind es 4 (seit dem 2026-08-10-Umbau) — Dokufehler behoben.
  - Lokal verifiziert (Desktop 1000px + Mobile 375px): 2-spaltiges Grid,
    Cover laden (200 OK, korrekte Byte-Größen), Caption/Jahr korrekt,
    i18n-Heading in DE/ES übersetzt, kein horizontaler Overflow, Lightbox-
    Gruppierung isoliert. Screenshot nach `scrollIntoView` zunächst leere
    Platzhalter-Boxen (bekannter Render-Bug dieser Preview-Pane nach
    Scroll-Aktionen) — nach `scrollTo(0,0)` + erneutem `scrollIntoView`
    rendert es korrekt, beide Cover sichtbar.
- **Website- und Kalender-Agent zusammengeführt (2026-09-02).** Auf Leos
  Wunsch gibt es nur noch **einen** leoasal.com-Agenten für beide Aufgaben
  (Website-Code + "Website Termine"-Kalenderpflege). Handoffs
  zusammengelegt: neuer Abschnitt "Zwei Aufgabenbereiche" + "Kalenderpflege"
  hier oben, "separater Agent"-Formulierungen entfernt; das private
  Playbook `Website Kalender/leoasal-calendar-handoff.md` bleibt eine
  eigene (gitignored) Datei, weil es private Kalenderdetails enthält, ist
  aber jetzt explizit als "Kalender-Hälfte **dieses** Agenten" gerahmt und
  verweist auf HANDOFF.md für den Rest. Der geplante Task
  `leoasal-calendar-weekly-sync` bleibt unverändert (reine Automatisierung).
  Der separate Kalender-Agent/Chat kann gelöscht werden.
- **Scrollspy: Nav zeigt jetzt, wo man ist (2026-09-02).** Beim Scrollen
  durch die Startseite bekommt der Nav-Link der aktuell sichtbaren Sektion
  `aria-current="location"` — in Desktop- UND Mobile-Nav, gleicher
  Accent-Look wie `aria-current="page"` auf den Projekt-Unterseiten
  (CSS-Selektoren `.site-nav a` / `.mobile-nav a` um `[aria-current=
  "location"]` erweitert). Logik am Ende von `assets/js/anchor-scroll.js`
  (`evaluateSpy`): reiner Scroll-Listener + `getBoundingClientRect` (bewusst
  **kein** IntersectionObserver — der feuert im hidden Preview-Tab dieser
  Session gar nicht, Scroll-Listener schon; und die Logik ist so simpel
  genug). "Aktuell" = die unterste Sektion, deren Oberkante über einer
  Linie bei ~33% Viewport-Höhe liegt; ganz oben (Hero, `scrollY<40`) ist
  nichts markiert, ganz unten immer die letzte Sektion (`#contact`).
  Sektionen fest verdrahtet: `blog/bio/dates/projects/contact`. Lokal für
  alle 5 Sektionen + oben/unten auf Mobile und Desktop verifiziert (im
  Test `scroll`-Event manuell dispatchen, da `window.scrollTo` im Pane
  keins auslöst).
- **Mobiler Sprachumschalter in die Header-Leiste (2026-09-02):** Auf
  `<800px` sitzt EN/DE/ES jetzt permanent im Sticky-Header, mittig zwischen
  Logo und Social-Icons (`.lang-switch.lang-switch--mobile`, DOM-Position
  zwischen `.logo` und `.site-social`, `space-between` verteilt die drei).
  Der alte Footer-Umschalter `.mobile-lang-switch` ist ersatzlos entfernt
  (aus allen 7 Seiten mit Header + aus `style.css`). Desktop unverändert
  (nutzt weiter die Kopie in `.site-nav`). Details oben unter
  "Seitenstruktur → Sprachumschalter". Lokal auf 375px + 1000px verifiziert
  (mittig, gleichmäßige Abstände, kein Overflow, Klick schaltet + merkt
  sich die Sprache, Impressum/Datenschutz weiterhin ohne Umschalter).
- **Nachzieher am 2026-09-02 (mehrere Iterationen, hier der Endstand):**
  1. Blog-Sektion zeigt **beide** YAMUNA-Album-Cover (Front +
     `yamuna-album-back.jpg`) nebeneinander statt nur der Front — neuer
     Flex-Wrapper `.blog-post-covers` (`gap:1rem`, `max-width:34rem`,
     `flex-wrap:wrap`), die einzelnen `.blog-post-cover` bekommen darin
     `flex:1 1 12rem` + `margin:0`. Beide verlinken auf yamuna.html (kein
     Lightbox auf der Startseite). Mobil stapeln sie full-width.
  2. **Termin-Aufklapper sind zentrierte Chevron-Toggles** statt Text-Links
     (Leo fand "Mehr anzeigen"/"Ver más" zu unauffällig):
     - **Kommende Termine über der 4er-Vorschau hinaus** (`#dates-more`):
       weiterhin ein `<details>`, Chevron **unter** der Liste, klappt den
       Rest inline nach unten auf.
     - **Vergangene Termine** (`#dates-previous-toggle` + `#dates-list-
       previous`): **kein `<details>` mehr**, sondern ein `<button>` mit
       `aria-expanded`, und die Liste `<ul id="dates-list-previous">` steht
       im DOM **über** dem Button (der wiederum über der kommenden Liste
       steht). Leo wollte: Pfeil bleibt fix an Ort und Stelle, die alten
       Termine erscheinen darüber, man scrollt hoch um sie nach und nach
       zu sehen, Fokus bleibt am Pfeil, und man kann wieder zuklappen. Der
       Klick-Handler in `dates.js` blendet die Liste per `hidden` ein/aus
       und **kompensiert dabei `window.scrollY` um die Höhendifferenz**
       (`scrollHeight` vorher/nachher), sodass der Button optisch exakt
       stehen bleibt (verifiziert: Viewport-Position ±1px auf Desktop und
       375px). `previous`-Sortierung **aufsteigend** (älteste zuerst) →
       beim Hochscrollen läuft man chronologisch rückwärts. Der frühere
       `<details>`-Ansatz sprang beim Öffnen zum ältesten Termin und ließ
       sich nicht mehr zuklappen — deshalb der Umbau.
     - **Beide Toggles teilen EINE Klasse `.dates-toggle`** (Leo: "das
       Design soll äquivalent sein zu dem Pfeil nach unten") — exakt
       dasselbe SVG (Pfad `M5 9l7 7 7-7`, Abwärts-Chevron), identisches
       Padding/Border/Größe/Farbe/Hover. `.dates-toggle` resettet
       zusätzlich `<button>`-Defaults (`background:none; border:0;
       width:100%; font:inherit`) + `:focus-visible`-Outline. Modifier
       `.dates-toggle--up` dreht das SVG per `rotate(180deg)` (zeigt hoch).
       Auf-/zugeklappt dreht der jeweilige Chevron in die Gegenrichtung
       (= "zuklappen"): `.dates-more[open] > .dates-toggle svg { rotate(180deg) }`
       bzw. `.dates-toggle--up[aria-expanded="true"] svg { rotate(0deg) }`.
       Alter `+`/`–`-Look weg.
     - Textlabels (`dates.showMore` / `dates.previous`) bleiben als
       `.visually-hidden`-Span (a11y, `i18nRefresh` unverändert).
  3. **Übergang von einer Projekt-Unterseite zurück zur Startseite** (Klick
     auf den `‹ Projects`-Back-Link → `index.html#projects`). War erst
     "hektisch" (Browser smooth-scrollte die ganze Seite von oben runter),
     dann nach dem ersten Fix "nicht smooth" (harter Sprung + kurzes
     Aufblitzen des Seitenanfangs, plus Ziel wanderte, während die
     Terminliste noch async nachrenderte). **Endstand in
     `anchor-scroll.js`:** bei Ankunft mit `location.hash`
     - sofort ~110px oberhalb der Zielsektion positionieren (kein
       Seitenanfang-Blitz), und das per `requestAnimationFrame`-Schleife
       durch jeden Layout-Shift halten;
     - erst wenn `window.load` UND ein neues `dates:rendered`-Event (feuert
       `dates.js` am Ende von `render()`) beide durch sind (Fallback
       `setTimeout` 1200 ms), **einmal** die letzten ~110px per
       `scrollIntoView({behavior:"smooth"})` sanft reingleiten — kurze,
       gleichbleibende Bewegung statt Ganzseiten-Scroll.
     - Bricht ab, sobald der Nutzer vorher selbst scrollt/tippt/tastet
       (`wheel`/`touchstart`/`keydown`, `once`).
     - In-Page-Nav-Klicks unverändert: direkt `scrollIntoView` smooth.
     - `HEADER_OFFSET = 80` muss mit `scroll-margin-top` der
       `.home-section` synchron bleiben.
  - **Außerdem (Fix aus derselben Serie):** globales
     `html { scroll-behavior: smooth }` ist **entfernt** (verursachte den
     "hektischen" Browser-Auto-Scroll); die blaue "Trennlinie" an
     Farbwechseln war der UA-Fokusring des von `anchor-scroll.js`
     geparkten Fokus → `.home-section:focus, #main:focus { outline: none }`
     (Fokus wird weiterhin geparkt, nur unsichtbar; die Sektionen sind nie
     in der Tab-Reihenfolge). `.epk-gallery--row` behält sein lokales
     `scroll-behavior: smooth`.
  - Alles per DOM verifiziert (Chevron-Pfade/Rotation, Sektions-Reihenfolge,
     Fokus-Parken, kein Overflow 375px, keine Konsolenfehler). Die
     eigentlichen Scroll-/Transform-**Animationen** sind in der 0-Pixel-
     Preview-Pane dieser Session nicht darstellbar (bekannte Einschränkung)
     — Leo bitte live gegenchecken: (a) Chevron dreht beim Auf-/Zuklappen,
     (b) Rücksprung von einer Projektseite gleitet sanft rein.
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
       Redirect-Stub oder einen Cross-Page-Nav-Klick): **VERALTETE
       Beschreibung** — die Lade-Ankunft wurde am 2026-09-02 mehrfach
       überarbeitet (instant-Sprung 60ms → dann "preposition + sanftes
       Reingleiten der letzten 110px nach `load`+`dates:rendered`"). Der
       **aktuelle Stand** steht im 2026-09-02-Eintrag oben, Punkt 3 —
       dort nachlesen, nicht hier.
     - Bei Klick auf einen `a[href^="#"]`-Link während man bereits auf der
       Seite ist: `preventDefault`, `history.pushState`, dann
       **smooth** `scrollIntoView` — dadurch fühlt sich ein Nav-Klick
       genauso an wie manuelles Scrollen, wie von Leo gewünscht.
       (Dieser Teil ist unverändert.)
     - **Scrollspy** (seit 2026-09-02, s. Eintrag oben): markiert beim
       Scrollen den Nav-Link der sichtbaren Sektion mit
       `aria-current="location"` (Desktop + Mobile).
     - Setzt nach dem Scrollen `tabindex="-1"` + Fokus aufs Zielelement,
       da das Abfangen der Klicks (für den Smooth-Scroll) sonst den
       nativen Fokus-Sprung verhindert hätte — wichtig für
       Tastatur-/Screenreader-Nutzer, betrifft auch den Skip-Link
       (`#main`). **Der dabei entstehende UA-Fokusring wird seit 2026-09-02
       per `.home-section:focus, #main:focus { outline: none }` unterdrückt**
       (sah sonst aus wie eine blaue Trennlinie am Sektionsrand) — Fokus
       wird weiterhin geparkt, nur unsichtbar.
     - **Korrektur 2026-09-02:** Das früher hier global auf `html` gesetzte
       `scroll-behavior: smooth` ist **wieder entfernt** — es ließ den
       Browser den Fragment-Sprung beim Laden animiert von oben bis zur
       Sektion runterscrollen ("hektisch", Leos Wort). Ohne die Regel ist
       der Lade-Sprung wieder instant; In-Page-Klicks bleiben smooth, weil
       die Animation aus `scrollIntoView({behavior:"smooth"})` im JS kommt,
       nicht aus dem CSS. Der ursprüngliche Debugging-Fund (Tool rendert
       keine Smooth-Scroll-Animation) bleibt gültig:
     - `scroll-behavior: smooth` (damals global gesetzt, s.o.) UND
       `scrollIntoView({behavior:"smooth"})`
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
  3.5rem`). Nicht-committetes Handoff-Dokument für die Kalenderpflege
  angelegt (`Website Kalender/`-Ordner, per `.gitignore` vom öffentlichen
  Repo ausgeschlossen) — Leos persönlichen Kalender nach Konzerten
  durchsuchen und öffentliche Termine in "Website Termine" eintragen. War
  bis 2026-09-02 ein separater Agent, seitdem Teil dieses Agenten
  (s. "Zwei Aufgabenbereiche" oben) (2026-08-08)
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
