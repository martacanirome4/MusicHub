#!/bin/bash

# Variables
DB_NAME="musicHub"
COLLECTION_NAME="music"
JSON_FILE="musichub_dataset.json"

# Verificar si el archivo JSON existe
if [ ! -f "$JSON_FILE" ]; then
  echo "Error: El archivo $JSON_FILE no existe."
  exit 1
fi

# Importar datos en MongoDB
mongoimport --db "$DB_NAME" --collection "$COLLECTION_NAME" --file "$JSON_FILE" --jsonArray

# Comprobar si la importación fue exitosa
if [ $? -eq 0 ]; then
  echo "Importación exitosa!"
else
  echo "Importación fallida!"
fi
