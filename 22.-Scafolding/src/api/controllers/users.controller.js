const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const setError = require('../../helpers/handle-error');
const { deleteImgCloudinary } = require('../../middlewares/files.middleware');
const { generateToken } = require('../../utils/token');
const randomPassword = require('../../utils/randomPassword');
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

//! ------------------------------------------------------------------------
//? -------------------------- RESEND CODE CONFIRMATION---------------------
//! ------------------------------------------------------------------------

const resendCode = async (req, res, next) => {
  try {
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
    //! hay que ver que el usuario exista porque si no existe no tiene sentido hacer ninguna verificacion
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      const mailOptions = {
        from: email,
        to: req.body.email,
        subject: 'Confirmation code ',
        text: `tu codigo es ${userExists.confirmationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(200).json({
            resend: true,
          });
        }
      });
    } else {
      return res.status(404).json('User not found');
    }
  } catch (error) {
    return next(setError(500, error.message || 'Error general send code'));
  }
};

//! ------------------------------------------------------------------------
//? ------------------------------- LOGIN ----------------------------------
//! ------------------------------------------------------------------------

const login = async (req, res, next) => {
  try {
    // nos traemos el email y la password del req.body
    const { email, password } = req.body;

    // buscamos el usuario
    const user = await User.findOne({ email });
    // si no hay usuario entonces lanzamos una respuesta 404 con user not found
    if (!user) {
      return res.status(404).json('User no found');
    } else {
      // miramos si las contraseñas son iguales
      if (bcrypt.compareSync(password, user.password)) {
        // si lo hay generamos un token
        const token = generateToken(user._id, email);

        // devolvemos el user auth y el token
        return res.status(200).json({
          user: {
            email,
            _id: user._id,
          },
          token,
        });
      } else {
        // si la contraseña no esta correcta enviamos un 404 con el invalid password
        return res.status(404).json('invalid password');
      }
    }
  } catch (error) {
    return next(
      setError(500 || error.code, 'General error login' || error.message)
    );
  }
};

//! ------------------------------------------------------------------------
//? ---------------------CAMBIO CONTRASEÑA SIN ESTAR LOGADO------------------
//! ------------------------------------------------------------------------

const forgotPassword = async (req, res, next) => {
  try {
    // nos traemos el email de la req.body
    const { email } = req.body;

    // esto lo hacemos porque ver si el usuario esta registrado porque si no lo esta le lanzamos un 404
    const userDb = await User.findOne({ email });
    if (userDb) {
      // si el usuario existe hacemos redirect al otro controlador que se encarga del envio y actualizacion
      return res.redirect(
        `http://localhost:8081/api/v1/users/forgotpassword/sendPassword/${userDb._id}`
      );
    } else {
      // este usuario no esta en la base datos, le mandamos un 404 y le que no esta registrado
      return res.status(404).json('User not register');
    }
  } catch (error) {
    return next(error);
  }
};

const sendPassword = async (req, res, next) => {
  try {
    // vamos a recibir el id por el parametro
    const { id } = req.params;
    // el id nos va a sevir para buscar el usario en la base datos y asi tener acceso a la contraseña guardada
    const userDb = await User.findById(id);

    //! Configuramos el correo electronico
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
    // generamos la contraseña random, lo hacemos aqui para que tenga un scou mas amplio
    let passwordSecure = randomPassword();
    const mailOptions = {
      from: email,
      to: userDb.email,
      subject: '-----',
      text: `User: ${userDb.name}. Your new code login is ${passwordSecure} Hemos enviado esto porque tenemos una solicitud de cambio de contraseña, si no has sido ponte en contacto con nosotros, gracias.`,
    };
    // enviamos el correo y dentro del envio gestionamos el guardado de la nuevacontraseña
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);

        // si no se ha enviado el correo enviamos un 404 y le decimos que no hemos hecho nada
        // porque ni hemos actualizado el user, ni tampoco enviado un correo
        return res.status(404).json('dont sent email and dont update user');
      } else {
        // encriptar la contraseña  que generamos arriba
        const newPasswordHash = bcrypt.hashSync(passwordSecure, 10);

        // una vez hasheada la contraseña la guardo en el bakend
        await User.findByIdAndUpdate(id, { password: newPasswordHash });

        /// !! --> TEESTEAMOS QUE SE HA HECHO TODO CORRECTAMENTE
        //---> Nos traemos el user actualizado y hacemos un if comparando las contraseñas
        const updateUser = await User.findById(id);
        if (bcrypt.compareSync(passwordSecure, updateUser.password)) {
          // si las contraseñas hacen match entonces mandamos un 200
          return res.status(200).json({
            updateUser: true,
            sendPassword: true,
          });
        } else {
          // si no son iguales le mandamos al frontal que el usuario no se ha actualizado aunque si ha
          // recibido un correo con la contraseña que no es valida.
          return res.status(404).json({
            updateUser: false,
            sendPassword: true,
          });
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

//! ------------------------------------------------------------------------
//? ---------------------CAMBIO CONTRASEÑA SIN ESTAR LOGADO------------------
//! ------------------------------------------------------------------------

const modifyPassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;

    const { _id } = req.user;
    if (bcrypt.compareSync(password, req.user.password)) {
      const newPasswordHash = bcrypt.hashSync(newPassword, 10);
      await User.findByIdAndUpdate(_id, { password: newPasswordHash });

      const updateUser = await User.findById(_id);

      if (bcrypt.compareSync(newPassword, updateUser.password)) {
        return res.status(200).json({
          updateUser: true,
        });
      } else {
        return res.status(404).json({
          updateUser: false,
        });
      }
    } else {
      return res.status(404).json('password not match');
    }
  } catch (error) {
    return next(error);
  }
};

//! ------------------------------------------------------------------------
//? -------------------------------UPDATE ----------------------------------
//! ------------------------------------------------------------------------

const update = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    // instanciamos un nuevo modelo de user
    const patchUser = new User(req.body);
    // si tenemos la req.file le metemos el path de cloudinary
    if (req.file) {
      patchUser.image = req.file.path;
    }
    // estas cosas no quiero que me cambien por lo cual lo cojo del req.user gracias a que esto es con auth
    patchUser._id = req.user._id;
    patchUser.password = req.user.password;
    patchUser.rol = req.user.rol;
    patchUser.confirmationCode = req.user.confirmationCode;
    patchUser.check = req.user.check;
    patchUser.email = req.user.email;

    // actualizamos en la db con el id y la instancia del modelo de user
    await User.findByIdAndUpdate(req.user._id, patchUser);
    // borrramos en cloudinary la imagen antigua
    if (req.file) {
      deleteImgCloudinary(req.user.image);
    }

    //! ----------------test  runtime ----------------
    // buscamos el usuario actualizado
    const updateUser = await User.findById(req.user._id);

    // cogemos la keys del body
    const updateKeys = Object.keys(req.body);

    // creamos una variable para  guardar los test
    const testUpdate = [];
    // recorremos las keys y comparamos
    updateKeys.forEach((item) => {
      if (updateUser[item] == req.body[item]) {
        testUpdate.push({
          [item]: true,
        });
      } else {
        testUpdate.push({
          [item]: false,
        });
      }
    });

    if (req.file) {
      updateUser.image == req.file.path
        ? testUpdate.push({
            file: true,
          })
        : testUpdate.push({
            file: false,
          });
    }
    return res.status(200).json({
      testUpdate,
    });
  } catch (error) {
    deleteImgCloudinary(catchImg);
    return next(error);
  }
};

//! ------------------------------------------------------------------------
//? -------------------------------DELETE ----------------------------------
//! ------------------------------------------------------------------------

const deleteUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndDelete(_id);
    if (await User.findById(_id)) {
      return res.status(404).json('Dont delete');
    } else {
      deleteImgCloudinary(req.user.image);
      return res.status(200).json('ok delete');
    }
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  register,
  checkNewUser,
  resendCode,
  login,
  forgotPassword,
  sendPassword,
  modifyPassword,
  update,
  deleteUser,
};
