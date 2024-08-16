export const extractContent = (content) => {
  // Función auxiliar para extraer cada campo
  const extractField = (field) => {
    const regex = new RegExp(
      `###\\s*${field}\\s*\\n+([\\s\\S]+?)(?=\\n###|$)`,
      "i",
    );
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };

  // Extraer todos los campos relevantes
  return {
    title: extractField("Título"),
    summary: extractField("Resumen"),
    tags: extractField("Tags"),
    reference: extractField("Referencia"),
    content: extractField("Contenido"),
  };
};
