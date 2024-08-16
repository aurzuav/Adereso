import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import readline from 'readline';
import { URL } from 'url';
import { processSegment } from './utils/fragmenter.js';
import { checkIfRelated } from './utils/checkIfRelated.js';

dotenv.config();

// Ruta a archivo JSONL
const filePath = new URL('../src/data/adereso_cda.jsonl', import.meta.url).pathname;


    // Delete the file if it already exists
    if (fs.existsSync('./src/logs/type.txt')) {
      fs.unlinkSync('./src/logs/type.txt');
    }

      // Delete the file if it already exists
      if (fs.existsSync('./src/logs/type.txt')) {
        fs.unlinkSync('./src/logs/type.txt');
      }

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Función para procesar segmentos
app.get('/process', async (req, res) => {
  const segments = [];
  const promises = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', (line) => {
    const segment = JSON.parse(line);
    if (segment.type === 'article') {
      // Almacenar cada promesa de procesamiento en un array
      const processingPromise = processSegment(segment).then((processedSegment) => {
        segments.push(processedSegment);
    });
      promises.push(processingPromise);
    }
  });



  rl.on('close', async () => {
    // Esperar a que todas las promesas se resuelvan
    await Promise.all(promises);
    
    // Paso adicional: Identificar fragmentos relacionados
    segments.forEach((fragment, index) => {
      fragment.relatedFragments = [];
      segments.forEach((otherFragment, otherIndex) => {
        if (index !== otherIndex) {
          const areRelated = checkIfRelated(fragment, otherFragment);
          if (areRelated) {
            fragment.relatedFragments.push({ title: otherFragment.title });
          }
        }
      });
    });



    const outputPath = './src/data/processed_fragments.jsonl';
    console.log(segments);
    fs.writeFileSync(outputPath, segments.map(item => JSON.stringify(item)).join('\n'));
    res.send('Processing complete');
  });
});
  
  app.get('/', (req, res) => {
    res.send("Adereso Challenge API");
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
