const express = require("express");

/// creamos la constante que crea el objeto con las routas
const router = express.Router();

/// importarnos el modelo de dato
const Albums = require("../../../../18.-dbMasSERVER/src/models/albums.model");

/// ----------------------------------------------------------------------------------
/// ---------------------------- GET ALL --------------------------------------------
/// ---------------------------------------------------------------------------------

router.get("/", async (req, res, next) => {
  try {
    const albums = await Albums.find();

    if (albums) {
      return res.status(200).json(albums);
    } else {
      return res.status(404).json("Albums not found");
    }
  } catch (error) {
    return next(error);
  }
});

module.export = router;
