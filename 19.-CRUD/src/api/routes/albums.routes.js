const express = require("express");
const Albums = require("../models/albums.model");
//Creamos el router
const router = express.Router();
//Importamos el modelo

//GET ALL
router.get("/", async (req, res, next) => {
  try {
    const album = await Albums.find();
    if (album) {
      return res.status(200).json(album);
    } else {
      return res.status(404).json("albums no found");
    }
  } catch (error) {
    return next(error);
  }
});
/// ------async await -------------------------
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const albumById = await Albums.findById(id);
    if (albumById) {
      return res.status(200).json(albumById);
    } else {
      return res.status(404).json("Album by id not found");
    }
  } catch (error) {}
});
/// ---------PROMESAS-------------
/// endpoint de busqueda por el nombre
router.get("/title/:title", (req, res, next) => {
  //! ----- url: http://localhost:8081/api/v1/albums/title/Ride%20the%20Lightning
  const { title } = req.params;
  /// el findone esta trayendonos un objeto si lo hicieramos con el find() nos trae un array
  return Albums.findOne({ title: title })
    .then((albums) => res.status(200).json(albums))
    .catch((error) => console.log(error));
});
/// ------ LE ENVIAMOS LA INFORMACION POR EL BODY --

//! --------- esto de abajo es el objeto que pasamos por insomnia
//! IMPORTANTE CAMBIAR EL BODY A TIPO JSON
// {
// 	"title": "sdkgjkdkgdjkgfjkg",
// 	"cover": "ASFJKKSDJ",
//   "artist": "SDGJDSFKFGJS",
//   "year": 2022
// }
router.post("/create", async (req, res, next) => {
  try {
    const { year } = req.query;
    console.log(year);
    const findByArtist = await Albums.find({
      artist: req.body.artist,
      year: year,
    });
    if (findByArtist) {
      return next("Artist already exist");
    } else {
      const albumNew = new Albums(req.body);
      const albumsCreate = await albumNew.save();

      if (albumsCreate) {
        return res.status(200).json(albumsCreate);
      } else {
        return res.status(404).json("Error on create New Albums");
      }
    }
  } catch (error) {
    next(error);
  }
});

// --------DELETE BY ID-------------------------

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteAlbums = await Albums.findByIdAndDelete(id);
    if (deleteAlbums) {
      return res.status(200).json("Album by id delete ok");
    } else {
      return res.status(404).json("Error on Album by id delete");
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const findByArtist = await Albums.findByIdAndUpdate(id, req.body);
    if (findByArtist) res.status(200).json(await Albums.findById(id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
