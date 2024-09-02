# kmeans.py
import sys
import json
import zlib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

# Umbral minimo de similitud
SIMILARITY_THRESHOLD = 0.2

# Número de clústeres
num_clusters = 12


def main():
    # Leer los argumentos que vienen de Node.js
    fragments = json.loads(sys.argv[1])

    # Cargar el archivo JSON con las stop words
    with open('./src/extras/stopwords-es.json', 'r', encoding='utf-8') as f:
        stop_words = json.load(f) 

    contents = [fragment['content'] for fragment in fragments]
    vectorizer = TfidfVectorizer(stop_words=stop_words)  

    X = vectorizer.fit_transform(contents)

    # Calcular similitud coseno entre los vectores TF-IDF
    cosine_similarities = cosine_similarity(X)

    model = KMeans(n_clusters=num_clusters)
    model.fit(X)

    # Crear el diccionario con id como llave y agregar clúster y similitud coseno
    result = {}
    clusters = model.labels_.tolist()

    for i, fragment in enumerate(fragments):
        fragment_id = fragment['id']
        similar_fragments = {}

        for j in range(len(fragments)):
            if i != j and cosine_similarities[i, j] > SIMILARITY_THRESHOLD:
                similar_fragments[fragments[j]['id']] = cosine_similarities[i, j]

        # Solo incluir en el resultado si hay similitudes mayores al umbral
        if similar_fragments:
            result[fragment_id] = {
                'cluster': clusters[i],
                'cosine_similarities': similar_fragments
            }
    # Retornar el resultado como un JSON string
    try:
       compressed_result = zlib.compress(json.dumps(result).encode('utf-8'))
       sys.stdout.buffer.write(compressed_result)  # Envía el buffer comprimido a Node.js
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
