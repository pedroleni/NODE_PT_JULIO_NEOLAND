/// Nos traemos las importaciones y configuramos dotenv
const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// ----- NOS TRAEMOS EL PUERTO DEL .ENV
const PORT = process.env.PORT;

// ----- CONFIGURAMOS EN NUEVO SERVIDOR WEB
const server = express();

//-------CONFIGURAMOS EL ROUTER DE EXPRESS PARA PROBAR NODEMAILER ------
const router = express.Router();

router.get("/sendNewMail", (req, res, next) => {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });

  const mailOptions = {
    from: email,
    to: "backneoland@gmail.com",
    subject: "Confirmation TEST NODEMAILER",
    text: `ok todo bien`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return next(error);
    } else {
      return res.status(200).json("Email sent: " + info.response);
    }
  });
});

server.use("/", router);

// ---- PONEMOS A ESCUCHAR EL SERVIDOR EN EL PUERTO 8080
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
