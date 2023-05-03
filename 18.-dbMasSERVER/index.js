const connect = require("./src/utils/db");

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

// nos traemos los modelos
const Albums = require("./src/models/albums.model");
const Artist = require("./src/models/artist.model");

// CREAMOS EL SERVIDOR WEB
const app = express();

// recibe informacion de tipo json y la codificamos mediante la url
// --->app.use(express.json());
// --->app.use(express.urlencoded({ extended: false }));

/// PORT
const PORT = process.env.PORT;

// conexion de LA DB -- la BASE DE DATOS DE MONGODB
connect();

//! ------- CREAR LAS ROUTAS ---------------
// Creamos el enrutado

/// ------->ENDPOINT ---> GET
const router = express.Router();

router.get("/artists", (req, res) => {
  return Artist.find()
    .then((artists) => res.status(200).json(artists))
    .catch((error) => res.status(500).json(error));
});

/// ------->ENDPOINT ---> GETByID
router.get("/artist/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const artistById = await Artist.findById(id);
    if (artistById) {
      return res.status(200).json(artistById);
    } else {
      return res.status(404).json("Artist id not found");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
/// ------->ENDPOINT ---> GetByName

router.get("/artist/name/:name", async (req, res) => {
  const { name } = req.params;
  const { origin } = req.query;
  //? URL REQUEST: http://localhost:8080/api/v1/artist/name/Immortal?origin=Noruega

  try {
    /// Importante como metemos los filtros , primero meter los filtros por paramas y luego los filtros por query
    ///Porque si no tenemos la query y el primer filtro el find no nos devuelve nada porque la query es undefined
    const artist = await Artist.find({ name: name, origin: origin });
    if (artist) {
      return res.status(200).json(artist);
    } else {
      return res.status(404).json("Artist by name not found");
    }
  } catch (error) {
    ///  ---> el error 500 (internal server error) siempre es cuando es un error capturado por el catch
    /// -----> en cambio en el try el status del error depende de la info que estemos solicitando
    return res.status(500).json(error);
  }
});

router.get("/albums", async (req, res) => {
  try {
    const albums = await Albums.find();
    if (albums) {
      return res.status(200).json(albums);
    } else {
      return res.status(404).json("Albums not found");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/albums/:id", (req, res) => {
  const { id } = req.params;
  return Albums.findById(id)
    .then((albumByID) => res.status(200).json(albumByID))
    .catch((error) => res.status(500).json(error));
});

router.get("/albums/title/:title", async (req, res) => {
  const { title } = req.params;
  /// para los espacios se pone con %20

  /// url ---request: http://localhost:8080/api/v1/albums/title/Que%20la%20musica%20de%20acompañe
  try {
    const albumsByTitle = await Albums.find({ title: title });
    if (albumsByTitle) {
      return res.status(200).json(albumsByTitle);
    } else {
      return res.status(404).json(albumsByTitle);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//! --------CREAR EL PATH GENERAL -----------

app.use("/api/v1", router);

//! --------CREAR UN USO DEL SERVER PARA CUANDO ME METAN UNA RUTA NO CONTEMPLADA (ROUTA MAXIMA O 404) ----
app.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

//! -------TENEMOS QUE ESCUCHAR EL SERVIDOR PARA QUE ESTE EJECUTANDOSE -------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
