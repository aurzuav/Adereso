// Función para verificar si dos fragmentos están relacionados

export const checkIfRelated = (fragment1, fragment2) => {
  // Convertir el string de tags en un array, separando por comas o cualquier otro delimitador que estés usando
  const tags1 = fragment1.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);
  const tags2 = fragment2.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);

  // Filtrar los tags comunes entre ambos fragmentos
  const commonTags = tags1.filter((tag) => tags2.includes(tag));

  // Considerar relacionados si comparten al menos un tag
  return commonTags.length > 0;
};
