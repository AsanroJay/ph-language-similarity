const fs = require('fs');

const BOOKS = [
    { code: 'GEN', chapters: 50 },
    { code: 'EXO', chapters: 40 },
    { code: 'LEV', chapters: 27 }
];


const OUTPUT_DIR = '../data/bible_api';

async function downloadTranslation(translationId) {
    for (const book of BOOKS) {
        console.log(`Downloading ${translationId} ${book.code}...`);

        let output = '';

        for (let chapter = 1; chapter <= book.chapters; chapter++) {
            const url = `https://bible.helloao.org/api/${translationId}/${book.code}/${chapter}.json`;

            const res = await fetch(url);

            if (!res.ok) {
                console.warn(`Skipping ${book.code} ${chapter}`);
                continue;
            }

            const data = await res.json();

            for (const item of data.chapter.content) {
                switch (item.type) {
                    case 'heading':
                        output += '\n' + item.content.join('') + '\n';
                        break;

                    case 'verse':
                        output += item.content
                            .filter(part => typeof part === 'string')
                            .join('') + '\n';
                        break;
                }
            }

            output += '\n'; // Separate chapters
        }
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        fs.writeFileSync( 
            `${OUTPUT_DIR}/${translationId}_${book.code}.txt`,
            output.trim(),
            'utf8'
        );

        console.log(`✓ Saved ${OUTPUT_DIR}/${translationId}_${book.code}.txt`);
    }
}


downloadTranslation('BSB').catch(console.error);
downloadTranslation('spa_bes').catch(console.error);
