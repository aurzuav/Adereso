import pkg from 'natural';
import natural from 'natural';
const { TfIdf } = pkg;
import cosineSimilarity from 'cosine-similarity';
import { kmeans } from './kmeans.js';
import stringSimilarity from 'string-similarity';


// Configurar el procesamiento TF-IDF y clustering
const tfidf = new TfIdf();
const vectors = [];


// Función para calcular la similitud semántica y las relaciones
export function checkIfRelated(fragment, otherFragment, allFragments) {
  // Convertir las etiquetas (tags) de string a array
  const tags1 = fragment.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);

  const tags2 = otherFragment.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);


    
  // Convertir fragmentos en vectores usando TF-IDF
  if (vectors.length === 0) {
    allFragments.forEach(frag => {
      tfidf.addDocument(frag.content);
      const vector = [];
      tfidf.listTerms(allFragments.indexOf(frag)).forEach(term => {
        vector.push(term.tfidf);
      });
      vectors.push(vector);
    });
    console.log(`Vectors: ${vectors}`);
  }

  

  const fragmentIndex = allFragments.indexOf(fragment);
  const otherFragmentIndex = allFragments.indexOf(otherFragment);

  // 1. Calcular la similitud semántica (Cosine Similarity)
  const similarity2 = cosineSimilarity(vectors[fragmentIndex], vectors[otherFragmentIndex]);
  const similarity = stringSimilarity.compareTwoStrings(fragment.content, otherFragment.content);
  //console.log(`Similarity between fragment ${fragmentIndex} and fragment ${otherFragmentIndex}: ${similarity}`);
  //imprimir el fragmento y el otro fragmento
  //console.log(`Fragment: ${fragment.summary}`);
  //console.log(`Other fragment: ${otherFragment.summary}`);
  

  // 2. Definir un umbral de similitud (ajustar según tus necesidades)
  const similarityThreshold = 0.7; // Por ejemplo, 0.7

  // 3. Identificar co-ocurrencia de etiquetas
  const commonTags = tags1.filter(tag => tags2.includes(tag));

    // 4. Ejecutar clustering en los vectores usando la implementación básica
    const { clusters } = kmeans(vectors, 5);  // Ejecuta K-means con 5 clusters
    const fragmentCluster = clusters[fragmentIndex];
    const otherFragmentCluster = clusters[otherFragmentIndex];

   //console.log(`Fragment ${fragment.summary} belongs to cluster ${fragmentCluster}`);
    //console.log(`Fragment ${otherFragment.summary} belongs to cluster ${otherFragmentCluster}`);

    // 5. Determinar si están relacionados basándose en similitud, co-ocurrencia y clustering
    if ( similarity > similarityThreshold && commonTags.length > 0 ) {
      // console.log(`Fragment ${fragment.summary} and fragment ${otherFragment.summary} are related \n`);
      // //tags comunes
      // console.log(`Common tags: ${commonTags}, tags1: ${tags1}, tags2: ${tags2} \n`);
      // console.log(`Similarity: ${similarity} \n`);
      // console.log(`---- \n`);
        return true;  // Fragmentos relacionados
    }

    return false;  // Fragmentos no relacionados
}
