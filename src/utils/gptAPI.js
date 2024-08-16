import OpenAI from 'openai';
import fs from 'fs';


export const generateFragment = async (prompt) => {
  try {
    const openAIClient = new OpenAI(process.env.OPENAI_API_KEY);
    const completion = await openAIClient.chat.completions.create({
      model: "gpt-4o-mini",
      "max_tokens": 1000,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ]
    });

    // Extraer la información de usage para verifiarlo
    const usage = completion.usage;

    // Crear un log en un archivo de texto
    const logData = `Prompt tokens: ${usage.prompt_tokens}, Completion tokens: ${usage.completion_tokens}, Total tokens: ${usage.total_tokens}\n`;

    // Guardar el log en un archivo de texto
    fs.appendFileSync('./src/logs/usage_logs.txt', logData, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });

    // Retornar los fragmentos generados
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating fragment:', error);
    throw error;
  }
};

// Usa la API de OpenAI para identificar si un fragmento de texto es documentación de API o contenido de usabilidad
export const identifyType = async (fragmentText) => {
  try {
    const prompt = `
      Basado en el siguiente fragmento de texto, identifica si es documentación de API o contenido de usabilidad. 
      Responde únicamente si corresponde a API o Usabilidad.

      Fragmento: "${fragmentText}"
      `;
    const openAIClient = new OpenAI(process.env.OPENAI_API_KEY);
    const completion = await openAIClient.chat.completions.create({
      model: "gpt-4o-mini",
      "max_tokens": 1000,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ]
    });

    let type = completion.choices[0].message.content;

    // Lower case type
    type = type.toLowerCase();

    // El response es únicamente "API" o "Usabilidad"
    if (type.includes('usabilidad')) {
      return "Usabilidad";
    } else if (type.includes('api')) {
      return "API"
    }
    else {
      // Si no se identifica el tipo, lanzar un error
      console.log('Tipo no identificado:', type);
      throw new Error('Tipo no identificado');
    }

  } catch (error) {
    console.error('Error consulting type:', error);
    throw error;
  }
};
