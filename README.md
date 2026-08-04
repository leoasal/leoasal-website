# leoasal.com

Schlanke, statische Website (reines HTML/CSS/JS, kein Build-Schritt, kein CMS). Ersetzt die alte WordPress-Seite.

## Lokal ansehen

Da die Seite `fetch()` für Übersetzungen und Termine nutzt, muss sie über einen lokalen Server laufen (nicht per Doppelklick auf `index.html` öffnen):

```bash
python3 -m http.server 5173
```

Dann [http://localhost:5173](http://localhost:5173) öffnen.

## Struktur

- `index.html`, `bio.html`, `dates.html`, `projects.html`, `contact.html`, `yamuna.html` — Hauptseiten (EN/DE/ES)
- `impressum.html`, `datenschutz.html` — rechtlich verbindlich, bleiben immer Deutsch
- `assets/css/style.css` — gesamtes Styling
- `assets/js/i18n.js` — Sprachumschalter-Logik (liest `assets/i18n/{en,de,es}.json`)
- `assets/js/dates.js` — lädt `data/dates.json` und rendert die Termine
- `assets/fonts/` — selbst gehostete Schriften (Playfair Display, Source Code Pro)
- `scripts/sync-calendar.js` — holt den öffentlichen Apple-Kalender-Feed und schreibt `data/dates.json`
- `.github/workflows/sync-calendar.yml` — führt den Sync automatisch alle 6h aus

## Deployment (GitHub Pages)

1. Auf [github.com](https://github.com) ein neues, öffentliches Repo anlegen (z.B. `leoasal-website`).
2. Dieses Verzeichnis dorthin pushen:
   ```bash
   git remote add origin git@github.com:<dein-github-name>/leoasal-website.git
   git branch -M main
   git push -u origin main
   ```
3. Im Repo unter **Settings → Pages**: Source auf „Deploy from a branch“, Branch `main` / `root` einstellen.
4. Unter **Settings → Pages → Custom domain**: `leoasal.com` eintragen (die Datei `CNAME` im Repo ist dafür schon vorbereitet).
5. Bei deinem Domain-/DNS-Anbieter für `leoasal.com` folgende Records setzen:
   - 4× **A-Record** auf `@` (Apex-Domain), Ziel-IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Optional zusätzlich **AAAA-Records** (IPv6) auf:
     `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - Falls du auch `www.leoasal.com` willst: **CNAME-Record** `www` → `<dein-github-name>.github.io`
   - DNS-Änderungen können bis zu 24h brauchen, bis sie überall greifen.
6. In GitHub Pages-Settings „Enforce HTTPS“ aktivieren, sobald das Zertifikat bereitsteht.

## Kalender-Sync einrichten (Apple Calendar → /dates)

1. In der Apple Kalender-App (Mac/iPhone) oder auf [icloud.com/calendar](https://icloud.com/calendar) einen neuen Kalender anlegen, z.B. **„Website Termine“**.
2. Nur die Termine eintragen, die öffentlich auf der Website erscheinen sollen.
3. Für jeden Termin optional die **Website des Veranstalters als erste Zeile in die Notizen** schreiben (z.B. `https://smoothjazzfestival.com`) — die wird dann als Link auf der Website angezeigt.
4. Kalender freigeben: Rechtsklick auf den Kalender → „Freigabe“ → „Öffentlichen Kalender“ aktivieren. Du bekommst eine `webcal://…`-URL.
5. `webcal://` durch `https://` ersetzen.
6. Im GitHub-Repo unter **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `CALENDAR_URL`
   - Wert: die `https://…`-URL aus Schritt 5
7. Fertig — der Workflow läuft automatisch alle 6h und bei manuellem Anstoß (Actions-Tab → „Sync calendar“ → „Run workflow“).

Nur Titel, Ort, Datum/Uhrzeit und (falls vorhanden) die Veranstalter-Website werden übernommen — keine weiteren Kalenderdetails.

## Sprachumschalter

Standardsprache ist Englisch. Nutzer:innen können auf Deutsch oder Spanisch wechseln (oben rechts / im Footer auf Mobile); die Wahl wird lokal im Browser gespeichert. Impressum und Datenschutz bleiben unabhängig davon immer auf Deutsch (rechtlich verbindliche Fassung).

Texte anpassen: in `assets/i18n/en.json`, `de.json`, `es.json` den jeweiligen Schlüssel bearbeiten.
