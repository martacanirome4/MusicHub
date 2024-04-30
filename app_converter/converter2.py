import csv
import json

# Nombre del archivo CSV de entrada y del archivo JSON de salida
csv_file = 'musichub_dataset.csv'
json_file = 'musichub_dataset.json'

# Lista para almacenar los datos
data = []

# Abrir el archivo CSV y leer los datos
with open(csv_file, mode='r', newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file, delimiter=';')
    for row in reader:
        track = {
            'track_uri': row['Track URI'],
            'track_name': row['Track Name'],
            'artist_uris': [uri.strip() for uri in row['Artist URI(s)'].split(',')],
            'artist_names': [name.strip() for name in row['Artist Name(s)'].split(',')],
            'album_uri': row['Album URI'],
            'album_name': row['Album Name'],
            'album_artist_uris': [uri.strip() for uri in row['Album Artist URI(s)'].split(',')],
            'album_artist_names': [name.strip() for name in row['Album Artist Name(s)'].split(',')],
            'album_release_date': row['Album Release Date'],
            'album_image_url': row['Album Image URL']
        }
        data.append(track)

# Escribir los datos en formato JSON
with open(json_file, mode='w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)
