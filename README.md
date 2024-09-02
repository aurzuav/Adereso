# Adereso Challenge - Fullstack Developer

Este proyecto es un desafío técnico para la posición de desarrollador Fullstack en Adereso. El objetivo es procesar un archivo JSONL que contiene segmentos de texto, fragmentarlos utilizando la API de GPT y generar un nuevo archivo JSONL con los fragmentos procesados, relacionándolos según sus etiquetas (tags).

Video explicativo: https://vimeo.com/999702165/63768d77bd?share=copy
Video Explicativo V2: https://vimeo.com/1005259628/3d7fdcb729?share=copy


## Instalación

Primero se deben instalar las dependencias con yarn

```
yarn install
```

Luego se debe asegurar de tener un archivo .env para poder correr la app. (ejemplo en .env.example)

```
OPENAI_API_KEY=
PORT=
```

Para levantar la app en modo producción debe correr:

```
yarn start
```

Para modo development

```
yarn dev
```

Además se debe tener python instalado con las siguientes dependencias 

```
pip install scikit-learn
```

# Modo de uso

Para procesar un archivo JSONL con múltiples segmentos primero se debe cargar un archivo "segments.jsonl" dentro del directorio "./src/data/" y correr la aplicación.

Luego se debe levantar la app en modo producción o desarrollo y hacer un GET a http://localhost:${PORT}/process. Esto va a procesar el archivo JSONL, separandolo en cada línea y procesandola mediante el uso de la API de OpenAI.

## Lógica de la solución

Se procesa el archivo de input línea por línea sólamente tomando los con "type":"article" según el enunciado.

Luego de esto se llama a la función "processSegment" en donde se definen dos prompts para cada tipo de segmento, correspondiente a contenido de usabilidad o documentación de API. Para esto, se hace una consulta a la API de OpenAI (usando el modelo gpt-4o-mini) haciendo que determine a qué tipo de segmento corresponde segun lo que contiene.

Una vez determinado el tipo, se usa un prompt específico para cada tipo y generar la fragmentación. Se le pide a la API que la realice en un formato específico sin utilizar más de 1000 tokens en su response. Además, se crea un archivo de log en ./src/logs/usage_logs.txt para revisar esto.

Posteriormente, se retorna la respuesta y se extrae el contenido type, tags, title, summary, reference y content con la funcion extractContent.

La función processSegment retorna el segmento fragmentado y se almacena en una lista de segmentos procesados y una lista de promesas.

Al cerrar el archivo de lectura, se espera a que todas las promesas se cumplan y se determina qué segmentos estan relacionados con otros con la funcion findSimilarities.

Esta función, llama a un archivo python kmeans.py que hace clustering del contenido de los fragmentos y tambien calcula la similaridad entre estas con la funcion cosine_similarity. Para mejores resultados, se eliminan todos los "stop words" del lenguaje español.

Con estos resultados, luego se compara cada fragmento con los otros, para ver si estan en el mismo cluster y cumplen el criterio de similitud. 

Una vez se determina que dos títulos tienen relación, se agrega a relatedFragments para cada titulo.

Finalizando, se escribe en el archivo "./src/data/processed_fragments.jsonl" todos los segmentos fragmentados con:

```
{"type":"(API/Usabilidad)","tags":"","summary":"","reference":"","content":"","relatedFragments:""}
```

## Testing

Se usa Jest para el testing. Para esto se debe correr:

```
yarn test
```

Que tiene pruebas unitarias para las funciones clave processSegment y CheckIfRelated en el archivo ./src/tests/fragmenter.test.js

También se hace una prueba de integración al endpoint /process en /src/tests/integration.test.js

# Contacto

**Autor**: Agustín Urzúa  
**Correo**: aurzuav@uc.cl  
**GitHub**: aurzuav
