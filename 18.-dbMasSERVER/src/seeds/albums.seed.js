//// 1.- Nos traemos mongoose, el modelo de datos y coger dotenv para el punto env
const mongoose = require("mongoose");
const Albums = require("../models/albums.model");
const dotenv = require("dotenv");
dotenv.config();

/// 2.- Tener el objeto con los datos que queremos inyectar en la DB
const albumDataSet = [
  {
    title: "Ride the Lightning",
    cover: "https://m.media-amazon.com/images/I/716FcW7qgSL._SL1200_.jpg",
    artist: "Metallica",
    year: 1984,
  },
  {
    title: "Atado a tu amor",
    cover: "https://m.media-amazon.com/images/I/61BCOynkb-L._SY355_.jpg",
    artist: "Chayanne",
    year: 1998,
  },
  {
    title: "Que la musica de acompañe",
    cover:
      "https://static.fnac-static.com/multimedia/Images/ES/NR/01/f5/77/7861505/1540-1.jpg",
    artist: "Camela",
    year: 2022,
  },
  {
    title: "Pure Holocaust",
    cover:
      "https://www.emp-online.es/dw/image/v2/BBQV_PRD/on/demandware.static/-/Sites-master-emp/default/dw015b3c24/images/4/0/7/0/407028.jpg?sw=1000&sh=800&sm=fit&sfrm=png",
    artist: "Immortal",
    year: 1993,
  },
];

/// 3.- Recorrer el array y crear un array de nuevos objetos de los diferentes modelos

const albumsDocuments = albumDataSet.map((album) => new Albums(album));

/// 4.- Conexion con la MONDO DB que se hace mediante la libreria mongoose

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const seedGrow = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      // buscar la coleccion completa de albums en la DB
      const AllAlbums = await Albums.find();

      if (AllAlbums.length) {
        await Albums.collection.drop();
        console.log("db BORRADA ❌");
      }
    })
    .catch((error) => console.log("Error borrando en la DB", error))
    .then(async () => {
      /// vamos a insertar los diferentes modelos creados arriba en el objeto albumsDocuments
      await Albums.insertMany(albumsDocuments);
      console.log("coleccion creada🎉");
    })
    .catch((error) => {
      console.log("No se ha podido inyectar la coleccion de datos", error);
    })
    .finally(() => mongoose.disconnect());
};

module.exports = seedGrow;
