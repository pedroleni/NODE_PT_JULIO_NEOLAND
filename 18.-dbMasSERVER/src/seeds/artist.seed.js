//// 1.- Nos traemos mongoose, el modelo de datos y coger dotenv para el punto env
const mongoose = require("mongoose");
const Artist = require("../models/artist.model");
const dotenv = require("dotenv");
dotenv.config();

/// 2.- Tener el objeto con los datos que queremos inyectar en la DB
const artistsDataSet = [
  {
    name: "Metallica",
    origin: "USA",
    genre: "Trash Metal",
  },
  {
    name: "Chayanne",
    origin: "Puerto Rico",
    genre: "Baladas latinas",
    age: 54,
  },
  {
    name: "Camela",
    origin: "España",
    genre: "Fantasia",
  },
  {
    name: "Immortal",
    origin: "Noruega",
    genre: "Black Metal",
  },
];

/// 3.- Recorrer el array y crear un array de nuevos objetos de los diferentes modelos

const artistsDocuments = artistsDataSet.map((artist) => new Artist(artist));

/// 4.- Conexion con la MONDO DB que se hace mediante la libreria mongoose

const MONGO_URI = process.env.MONGO_URI;

const seedGrowArtist = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      // buscar la coleccion completa de artist en la DB para luego borrarla
      const AllArtist = await Artist.find();

      if (AllArtist.length) {
        await Artist.collection.drop();
        console.log("db BORRADA ❌");
      }
    })
    .catch((error) => console.log("Error borrando en la DB", error))
    .then(async () => {
      /// vamos a insertar los diferentes modelos creados arriba en el objeto albumsDocuments
      await Artist.insertMany(artistsDocuments);
      console.log("coleccion creada🎉");
    })
    .catch((error) => {
      console.log("No se ha podido inyectar la coleccion de datos", error);
    })
    .finally(() => mongoose.disconnect());
};

module.exports = seedGrowArtist;
