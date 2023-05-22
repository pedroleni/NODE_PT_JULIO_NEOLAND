//! ------- CREAMOS EL SERVIDOR WEB CON EXPRESS -------------
// instalar esto npm i bcrypt cloudinary cors dotenv express jsonwebtoken mongoose multer multer-storage-cloudinary nodemailer validator
//  instalar dependencias de desarrollo: npm -D i eslint eslint-config-prettier jest nodemon prettier supertest
const express = require('express');
const dotenv = require('dotenv');
const connect = require('./src/utils/db');
const { configCloudinary } = require('./src/middlewares/files.middleware');

dotenv.config();

//! ------TRAERNOS EL PORT, CREAR EL SERVER WEB, CONECTAR LA DB  y configurar cloudinary
const PORT = process.env.PORT;
configCloudinary();
const app = express();
connect();

//! --------CONFIGURAMOS LAS CORS QUE SON LOS LIMITES AL ACCESO DE NUESTRA API
const cors = require('cors');

app.use(cors());

app.use((req, res, next) => {
  // con el asterisco les estamos diendo en la header que puede entrar a nuestro backend cualquier cliente
  res.header('Access-Control-Allow-Origen', '*');

  // Primero decimos que las header ayudar a  controlar el acceso de nuestra api
  //Segundo puede haber authorizaciones mediante las request que acepten un contenido concreto en nuestra api
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  /// VERBOS  PERMITIDOS EN NUESTRA
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

//! ----- DECIRLE EL TIPO DE SERVE WEB QUE VAMOS A TENER, UNA CONFIG BASICA INICIAL -----
// Json Data
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

//! ------ LAS ROUTAS -------------------------------------------
const UserRoutes = require('./src/api/routes/user.routes');

app.use('/api/v1/users', UserRoutes);
app.use('*', (req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

//! ------VAMOS A ESCUCHAR EL SERVIDOR WEB EN SU PUERTO CORRESPONDIENTE------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
