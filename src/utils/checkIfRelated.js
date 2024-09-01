import { spawn } from 'child_process';


// Función para calcular los clusters una vez
export function calculateClusters(allFragments) {
  return new Promise((resolve, reject) => {
    const fragments = JSON.stringify(allFragments);

    const pythonProcess = spawn('python3', ['./src/utils/kmeans.py', fragments]);

    pythonProcess.stdout.on('data', (data) => {
      const clusters = JSON.parse(data.toString());
      resolve(clusters);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Error in Python process:', data.toString());
      reject(data.toString());
    });

    pythonProcess.on('exit', (code) => {
      console.log(`Python process exited with code ${code}`);
    });
  });
}

// Función para verificar si dos fragmentos están relacionados usando los clusters
export function checkIfRelated(fragment, otherFragment, clusters) {



  const cluster1 = clusters[fragment.id];
  const cluster2 = clusters[otherFragment.id];

  //console.log(fragment.id ,cluster1, otherFragment.id, cluster2)
  return cluster1 === cluster2;

}
