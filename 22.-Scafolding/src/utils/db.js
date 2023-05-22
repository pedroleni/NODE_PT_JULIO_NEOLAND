//! ------- CREAMOS LA FUNCION QUE CONECTA CON LA BASE DE DATOS: MONGO DB ---------

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//! ----- NOS TRAERMOS LA MONGO_URI de nuestra DB ------------------------.-

const MONGO_URI = process.env.MONGO_URI;

//! -------CREAMOS EL CUERPO DE LA FUNCION QUE SE VA EXPORTAR E IMPORTAR EN EL INDEX -----

const connect = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { host, name } = db.connection;
    console.log(`Connected to db: ${name} in host: ${host}`);
  } catch (error) {
    console.log('Error connecting to db: ', error);
  }
};

module.exports = connect;
