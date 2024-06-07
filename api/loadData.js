const { MongoClient } = require('mongodb');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// URL de conexión de MongoDB
const uri = process.env.MONGODB_URI;

// Nombre de la base de datos y colección
const dbName = 'musicDB';
const collectionName = 'tracks';

// Ruta del archivo JSON
const dataFilePath = path.join(__dirname, '../dataset/musichub_dataset.json');

// Leer datos del archivo JSON
const loadData = async () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        const tracks = JSON.parse(data);

        // Conectar a MongoDB
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Conectado a MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Limpiar colección existente
        await collection.deleteMany({});
        console.log('Colección limpiada');

        // Insertar datos nuevos
        await collection.insertMany(tracks);
        console.log('Datos insertados exitosamente');

        // Cerrar la conexión
        await client.close();
        console.log('Conexión cerrada');
    } catch (err) {
        console.error('Error cargando datos:', err);
    }
};

loadData();
