import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import readline from "readline";
import { URL } from "url";
import { processSegment } from "./utils/fragmenter.js";
import { checkIfRelated } from "./utils/checkIfRelated.js";

// Cargar variables de entorno
dotenv.config();

// Ruta a archivo JSONL de input
const filePath = new URL("../src/data/adereso_cda.jsonl", import.meta.url)
  .pathname;

// Delete the file if it already exists
if (fs.existsSync("./src/logs/usage_logs.txt")) {
  fs.unlinkSync("./src/logs/usage_logs.txt");
}

const app = express();
const PORT = process.env.PORT || 3000;

// Exportar la app para los tests
export default app;

// Middleware para loggear las peticiones
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack); // Registrar el error en la consola
  res.status(err.status || 500).send({
    message: err.message || "Internal Server Error",
  });
  next();
});

app.use(express.json());

// Endpoint para procesar segmentos
app.get("/process", async (req, res, next) => {
  try {
    const segments = [];
    const promises = [];

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      output: process.stdout,
      terminal: false,
    });

    // Lee linea por linea
    rl.on("line", (line) => {
      try {
        const segment = JSON.parse(line);

        if (segment.type === "article") {
          // Almacenar cada promesa de procesamiento en un array
          const processingPromise = processSegment(segment).then(
            (processedSegment) => {
              segments.push(processedSegment);
            },
          );
          promises.push(processingPromise);
        }
      } catch (error) {
        next(error); // Maneja el error al procesar la línea
      }
    });

    rl.on("close", async () => {
      try {
        // Esperar a que todas las promesas se resuelvan
        await Promise.all(promises);

        // Identificar fragmentos relacionados mediante los tags
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

        // Escribir los fragmentos procesados en un archivo JSONL
        const outputPath = "./src/data/processed_fragments.jsonl";
        fs.writeFileSync(
          outputPath,
          segments.map((item) => JSON.stringify(item)).join("\n"),
        );
        res
          .status(200)
          .send({
            message:
              "Processing complete, check ./src/data/processed_fragments.jsonl",
          });
      } catch (error) {
        next(error); // Maneja errores en la finalización del procesamiento
      }
    });

    rl.on("error", (error) => {
      next(error); // Maneja errores en la lectura del archivo
    });
  } catch (error) {
    next(error); // Maneja errores generales
  }
});

app.get("/", (req, res) => {
  res.send("Adereso Challenge API");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
