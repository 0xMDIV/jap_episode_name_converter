### Notice, written with ChatGPT because i was to lazy

# 🏷️ Hentai Title Converter

Ein Node.js-Tool zum vereinheitlichten Umbenennen von `.mp4`-Dateien anhand von Seriennamen und Episodennummern — ideal für Hentai-Ordner mit chaotischer Namensstruktur.

---

## 🔧 Features

- Erkennt automatisch Episoden anhand von Dateinamen (z. B. `Vol.1`, `OVA03`, `02`, etc.)
- Wählt automatisch den passendsten Serientitel aus:
  - aus dem längsten Dateinamen
  - aus lesbaren CamelCase-Titeln
  - aus dem übergebenen Ordnernamen
- Benutzerinteraktive Auswahl des Serientitels
- Konsistente Umbenennung im Format:

  ```
  titel episode 01.mp4
  ```

- Linux-kompatible Dateinamen mit Kleinbuchstaben und Leerzeichen

---

## ▶️ Beispiel

**Vorher:**

```
Kuroinu03.mp4
Kuroinu.Kedakaki.Seijo.wa.Hakudaku.ni.Somaru.Vol..2.mp4
KuroinuKedakakiSeijowaHakudakuniSomaruVol.5.mp4
```

**Nachher:**

```
kuroinu kedakaki seijo wa hakudaku ni somaru episode 03.mp4
kuroinu kedakaki seijo wa hakudaku ni somaru episode 02.mp4
kuroinu kedakaki seijo wa hakudaku ni somaru episode 05.mp4
```

---

## 📦 Installation

```bash
git clone https://github.com/dein-nutzername/hentai-title-converter.git
cd hentai-title-converter
npm install
```

---

## 🚀 Nutzung

```bash
node index.js "Pfad/zum/Ordner"
```

Beispiel (Windows):

```bash
node index.js "U:\AneChijoMaxHeart"
```

---

## 📂 Kompatible Dateinamenformate

Das Tool erkennt Episoden aus Namen wie:

- `Vol.1`, `vol_2`
- `Episode03`, `ep04`
- `OVA03`
- `MySeries02.mp4`

---

## ❓ Fragen oder Verbesserungsvorschläge?

Gerne als Issue melden oder Pull Request einreichen!

---

## 🧠 Lizenz

MIT – kostenlos nutzbar und veränderbar.
