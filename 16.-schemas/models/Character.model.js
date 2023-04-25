// Importarnos mongoose

const mongoose = require("mongoose");

// Sacamos de la libreria la parte de schema para poder definir nuestro modelo de datos

const Schema = mongoose.schema;

/// Definimos el esqueleto del modelo character
/// 1) Definimos lo primero el TYPE ----> tipo de dato
/// 2) Vamos a definir que este dato sea requerido para crear el modelo REQUIRED

const CharacterSchema = new Schema(
  {
    /// Definimos la estructura de nuestro modelo de dato
    name: { type: String, required: true },
    age: { type: Number, required: true },
    image: { type: String, required: false },
  },
  {
    /// Esta propiedad mete la fecha en el que hemos creado el elemento en la DB
    timestamps: true,
  }
);
/// Creamos el modelo con la definicion de datos que se incluye en el schema anterior
const Character = mongoose.model("Character", CharacterSchema);

// Exportamos Character
module.exports = Character;
