import { generateFragment } from './gptAPI.js';
import { identifyType } from './gptAPI.js';
import {extractContent} from './extractResponseContent.js';

export const processSegment = async (segment) => {
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
  
  //console.log('Processing segment:', segment);

  try {
    const type = await identifyType(segment.text);
    if (type === 'Usabilidad') {
      var prompt = promptUsabilidad;
    } else if(type === 'API') {
      var prompt = promptAPI;
    }
    const fragment = await generateFragment(prompt);

    // Extraer los campos del fragmento
    
    const { title, summary, tags, reference, content } = extractContent(fragment);
    //console.log('Processed segment:', { title, summary, tags, reference, content });
    return {
      title,
      summary,
      type,
      tags,
      reference,
      content,
    };
  } catch (error) {
    console.error('Error processing segment:', error);
    throw error;
  }
};
