// Función para calcular la distancia euclidiana entre dos puntos
function euclideanDistance(point1, point2) {
    return Math.sqrt(
        point1.reduce((sum, coord, index) => sum + Math.pow(coord - point2[index], 2), 0)
    );
}

// Función para encontrar el centroide más cercano
function closestCentroid(point, centroids) {
    let minDist = Infinity;
    let closest = -1;
    centroids.forEach((centroid, index) => {
        const dist = euclideanDistance(point, centroid);
        if (dist < minDist) {
            minDist = dist;
            closest = index;
        }
    });
    return closest;
}

// Función principal de K-means
export function kmeans(vectors, k) {
    const centroids = vectors.slice(0, k); // Inicializar centroides (puedes mejorar esta parte)
    let clusters = Array(vectors.length).fill(-1);
    let change = true;

    while (change) {
        change = false;
        // Asignar puntos al centroide más cercano
        clusters = vectors.map(point => closestCentroid(point, centroids));

        // Recalcular centroides
        for (let i = 0; i < k; i++) {
            const clusterPoints = vectors.filter((_, index) => clusters[index] === i);
            if (clusterPoints.length > 0) {
                const newCentroid = clusterPoints[0].map((_, dim) =>
                    clusterPoints.reduce((sum, point) => sum + point[dim], 0) / clusterPoints.length
                );
                if (!centroids[i].every((coord, index) => coord === newCentroid[index])) {
                    centroids[i] = newCentroid;
                    change = true;
                }
            }
        }
    }

    return { clusters, centroids };
}