const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

function sanitizeTitle(title) {
  return title
    .replace(/\.[mM][pP]4$/, '')                        // .mp4 entfernen
    .replace(/vol[.\s_]*\d+/gi, '')                     // Vol. x entfernen
    .replace(/\d{2,3}/g, '')                            // Episodenzahlen entfernen
    .replace(/[^a-zA-Z0-9]+/g, ' ')                     // Nicht-Alphanum zu Leerzeichen
    .replace(/\s+/g, ' ')                               // Mehrfache Leerzeichen
    .trim();
}

function extractEpisodeNumber(filename) {
    const patterns = [
      /vol[\.\s_-]*?(\d{1,3})/i,     // Vol.1, Vol 01, Vol_03
      /episode[\.\s_-]*?(\d{1,3})/i, // Episode 1, Episode_02
      /ep[\.\s_-]*?(\d{1,3})/i,      // Ep01, ep_2
      /ova[\.\s_-]*?(\d{1,3})/i,     // OVA03, ova-2
      /[^a-zA-Z](\d{1,3})(?=\D|$)/   // 03, 2 at end of string (not part of word)
    ];
  
    for (const pattern of patterns) {
      const match = filename.match(pattern);
      if (match && match[1]) {
        return match[1].padStart(2, '0');
      }
    }
  
    return '00'; // Fallback
  }


function generateReadableVariants(titles) {
    const variants = new Set();

    titles.forEach((title) => {
        variants.add(title);

        // CamelCase zu Wortfolge z. B. AneChijoMaxHeart → Ane Chijo Max Heart
        const camelSpaced = title.replace(/([a-z])([A-Z])/g, '$1 $2');
        if (camelSpaced !== title) {
        variants.add(camelSpaced);
        }
    });

    return Array.from(variants);
}
  

async function main() {
  const folder = process.argv[2];
  if (!folder || !fs.existsSync(folder)) {
    console.error('❌ Bitte gib einen gültigen Ordnerpfad an (z. B. in Anführungszeichen).');
    process.exit(1);
  }

  const files = fs.readdirSync(folder).filter(f => f.toLowerCase().endsWith('.mp4'));
  if (files.length === 0) {
    console.log('📭 Keine .mp4-Dateien im Ordner gefunden.');
    return;
  }

  // Ordnername als Vorschlag einfügen
  const folderNameRaw = path.basename(folder);
  const folderTitle = sanitizeTitle(folderNameRaw);

  // Titel aus Dateinamen generieren
  const titlesRaw = files.map(f => sanitizeTitle(f));
  const allTitles = [folderTitle, ...titlesRaw];

  // Duplikate entfernen
  // Duplikate + lesbare Varianten erzeugen
    const uniqueTitles = generateReadableVariants([...new Set(allTitles)]);

    // Sortiert und als Auswahl anzeigen
    const { selectedTitle } = await inquirer.prompt([
    {
        type: 'list',
        name: 'selectedTitle',
        message: 'Wähle einen Titel als Basis:',
        choices: uniqueTitles.sort((a, b) => a.localeCompare(b))
    }
    ]);

  const proposedRenames = files.map(file => {
    const episode = extractEpisodeNumber(file);
    const safeTitle = selectedTitle
        .toLowerCase()
        .replace(/[^a-z0-9 ]/gi, '')      // nur a-z, 0-9 und Leerzeichen
        .replace(/\s+/g, ' ')             // doppelte Leerzeichen entfernen
        .trim();
    const newName = `${safeTitle} episode ${episode}.mp4`;
    return { old: file, new: newName };
  });

  console.log('\n🔍 Vorschau der neuen Dateinamen:\n');
  proposedRenames.forEach(({ old, new: newName }) => {
    console.log(`→ ${old}  ⇒  ${newName}`);
  });

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '\nMöchtest du die Dateien jetzt umbenennen?',
      default: false
    }
  ]);

  if (!confirm) {
    console.log('❌ Vorgang abgebrochen.');
    return;
  }

  proposedRenames.forEach(({ old, new: newName }) => {
    const oldPath = path.join(folder, old);
    const newPath = path.join(folder, newName);
    fs.renameSync(oldPath, newPath);
    console.log(`✅ ${old} → ${newName}`);
  });

  console.log('\n🎉 Alle Dateien wurden umbenannt!');
}

main().catch(err => {
  console.error('Fehler:', err);
});
