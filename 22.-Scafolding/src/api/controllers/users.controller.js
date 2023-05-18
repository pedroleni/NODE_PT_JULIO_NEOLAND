const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const setError = require('../../helpers/handle-error');
const { deleteImgCloudinary } = require('../../middlewares/files.middleware');
dotenv.config();

//! ------------------------------------------------------------------------
//? -------------------------- REGISTER-------------------------------------
//! ------------------------------------------------------------------------

const register = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    //! lo primero actualizar los index de los elementos unique
    await User.syncIndexes();
    //! vamos a configurar nodemailer porque tenemos que enviar un codigo
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });

    //! crear el codigo
    const confirmationCode = Math.floor(
      Math.random() * (999999 - 100000) + 100000
    );

    //! HACER UNA NUEVA INSTANCIA DE USUARIO
    const newUser = new User({ ...req.body, confirmationCode });
    //! le metemos la imagen en caso de recibirla, sino la recibo le meto una estandar
    if (req.file) {
      newUser.image = req.file.path;
    } else {
      newUser.image = 'https://pic.onlinewebfonts.com/svg/img_181369.png';
    }

    //! tenemos que buscarlo en la base de datos para saber que no existe
    const userExists = await User.findOne({
      email: newUser.email,
      name: newUser.name,
    });

    if (userExists) {
      deleteImgCloudinary(catchImg);
      return next(setError(409, 'This user already exist'));
    } else {
      const createUser = await newUser.save();
      createUser.password = null;

      //!! --------VAMOS A ENVIAR EL CORREO .------
      const mailOptions = {
        from: email,
        to: req.body.email,
        subject: 'Code confirmation',
        text: `Your code is ${confirmationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return res.status(201).json({
        user: createUser,
        confirmationCode: confirmationCode,
      });
    }
  } catch (error) {
    deleteImgCloudinary(catchImg);
    return next(
      setError(error.code || 500, error.message || 'failed create user')
    );
  }
};

//! ------------------------------------------------------------------------
//? -------------------------- CHECK NEW USER------------------------------
//! ------------------------------------------------------------------------

const checkNewUser = async (req, res, next) => {
  try {
    //! nos traemos de la req.body el email y codigo de confirmation
    const { email, confirmationCode } = req.body;

    //! hay que ver que el usuario exista porque si no existe no tiene sentido hacer ninguna verificacion
    const userExists = await User.findOne({ email });
    if (!userExists) {
      //!No existe----> 404 de no se encuentra
      return res.status(404).json('User not found');
    } else {
      // cogemos que comparamos que el codigo que recibimos por la req.body y el del userExists es igual
      if (confirmationCode === userExists.confirmationCode) {
        // si es igual actualizamos la propiedad check y la ponemos a true
        await userExists.updateOne({ check: true });
        // hacemos un testeo de que este user se ha actualizado correctamente, hacemos un findOne
        const updateUser = await User.findOne({ email });

        // este finOne nos sirve para hacer un ternario que nos diga si la propiedad vale true o false
        return res.status(200).json({
          testCheckOk: updateUser.check == true ? true : false,
        });
      } else {
        /// En caso dec equivocarse con el codigo lo borramos de la base datos y lo mandamos al registro
        const deleteUser = await User.findByIdAndDelete(userExists._id);

        // borramos la imagen
        deleteImgCloudinary(userExists.image);

        // devolvemos un 200 con el test de ver si el delete se ha hecho correctamente
        return res.status(200).json({
          userExists,
          check: false,
          delete: (await User.findById(userExists._id))
            ? 'error delete user'
            : 'ok delete user',
        });
      }
    }
  } catch (error) {
    // siempre en el catch devolvemos un 500 con el error general
    return next(setError(500, 'General error check code'));
  }
};

module.exports = {
  register,
  checkNewUser,
};
