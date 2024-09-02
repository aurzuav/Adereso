import { spawn } from 'child_process';
import zlib from 'zlib';

// Función para calcular los clusters y cosine similarities de los fragmentos
export function findSimilatrities(allFragments) {
  return new Promise((resolve, reject) => {
    const fragments = JSON.stringify(allFragments);
    const pythonProcess = spawn('python3', ['./src/utils/kmeans.py', fragments]);

    pythonProcess.stdout.on('data', (data) => {
      try {
        const clustersAndSimilarities = JSON.parse(zlib.unzipSync(Buffer.from(data, 'latin1')).toString());
        if (clustersAndSimilarities.error) {
          reject(new Error(clustersAndSimilarities.error));
        } else {
          resolve(clustersAndSimilarities);
        }
      } catch (error) {
        reject(new Error('Failed to process Python output: ' + error.message));
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Error in Python process:', data.toString());
      reject(new Error('Python process error: ' + data.toString()));
    });

    pythonProcess.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with non-zero code ${code}`));
      }
    });
  });
}

// Función para verificar si dos fragmentos están relacionados usando los clusters
export function checkIfRelated(fragment, otherFragment, clusters) {
  const fragmentCluster = clusters[fragment.id];
  const otherFragmentCluster = clusters[otherFragment.id];

    // Verificar si ambos fragmentos están en el mismo clúster
    if (fragmentCluster && otherFragmentCluster && fragmentCluster.cluster === otherFragmentCluster.cluster) {
      // Verificar si tienen una similitud por coseno significativa
      const similarity = fragmentCluster.cosine_similarities[otherFragment.id] || 0;
      return similarity > 0; // Aquí puedes ajustar el umbral según tu necesidad
    }
  
    return false;
  }

