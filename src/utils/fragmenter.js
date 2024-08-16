import { generateFragment } from "./gptAPI.js";
import { identifyType } from "./gptAPI.js";
import { extractContent } from "./extractResponseContent.js";

export const processSegment = async (segment) => {
  // Definir los prompts para cada tipo de documento
  const promptUsabilidad = `
  Por favor, fragmenta la siguiente documentación de usabilidad en los siguientes campos usando alrededor y máximo 1000 tokens:
  
  1. **Título**: Proporciona un título descriptivo para el documento.
  2. **Resumen**: Resume el documento en 2-3 oraciones.
  3. **Tags**: Lista 3-5 palabras clave relacionadas con el documento.
  4. **Referencia**: Proporciona el enlace a la referencia original.
  5. **Contenido**: Detalla los puntos clave del documento, divididos en secciones numeradas.
  
  Documento: ${segment.text}
  
  Referencia: ${segment.url}
  
  Responde en el siguiente formato:
  
  ### Título
  [Título]
  
  ### Resumen
  [Resumen]
  
  ### Tags
  [Tags]
  
  ### Referencia
  [Referencia]
  
  ### Contenido
  [Contenido]
  `;

  const promptAPI = `
  Por favor, fragmenta la siguiente de uso de API de Adereso para desarrolladores en los siguientes campos usando alrededor y máximo 1000 tokens:
  
  1. **Título**: Proporciona un título descriptivo para el documento.
  2. **Resumen**: Resume el documento en 2-3 oraciones.
  3. **Tags**: Lista 3-5 palabras clave relacionadas con el documento.
  4. **Referencia**: Proporciona el enlace a la referencia original.
  5. **Contenido**: Detalla los puntos clave del documento, divididos en secciones numeradas.
  
  Documento: ${segment.text}
  
  Referencia: ${segment.url}
  
  Responde en el siguiente formato:
  
  ### Título
  [Título]
  
  ### Resumen
  [Resumen]
  
  ### Tags
  [Tags]
  
  ### Referencia
  [Referencia]
  
  ### Contenido
  [Contenido]
  `;

  try {
    // identificar el tipo de segmento para elegir el prompt correcto
    const type = await identifyType(segment.text);

    let prompt;

    if (type === "Usabilidad") {
      prompt = promptUsabilidad;
    } else if (type === "API") {
      prompt = promptAPI;
    } else {
      throw new Error("No se pudo identificar el tipo de segmento");
    }

    // Generar el fragmento con el prompt correspondiente
    const fragment = await generateFragment(prompt);

    // Extraer los campos del fragmento
    const { title, summary, tags, reference, content } =
      extractContent(fragment);

    return {
      title,
      summary,
      type,
      tags,
      reference,
      content,
    };
  } catch (error) {
    console.error("Error processing segment:", error);
    throw error;
  }
};
