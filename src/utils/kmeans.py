# kmeans.py
import sys
import json
import math
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

def main():
    # Leer los argumentos que vienen de Node.js
    fragments = json.loads(sys.argv[1])

    # Cargar el archivo JSON con las stop words
    with open('./src/extras/stopwords-es.json', 'r', encoding='utf-8') as f:
        stop_words = json.load(f)  # Esto te dará una lista directamente

    # print(fragments)

    contents = [fragment['content'] for fragment in fragments]
    vectorizer = TfidfVectorizer(stop_words=stop_words)  

    X = vectorizer.fit_transform(contents)

    # # Extraer el contenido de los fragmentos para convertirlo en vectores
    # contents = [fragment['content'] for fragment in fragments]

    # # Convertir textos en vectores TF-IDF
    # vectorizer = TfidfVectorizer()
    # X = vectorizer.fit_transform(contents)

    # Ejecutar K-means
    # print("Ejecutando K-means...")
    k = 12
    

    model = KMeans(n_clusters=k)
    model.fit(X)

    # Devolver los resultados (clusters y centroides)
    clusters = model.labels_.tolist()
       
    # Crear el diccionario con id como llave y cluster como valor
    result = {fragment['id']: clusters[i] for i, fragment in enumerate(fragments)}

    # Retornar el resultado como un JSON string
    try:
       print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
