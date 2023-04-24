const express = require("express");

const app = express();
const router = express.Router();
const PORT = 8080;

///// ----------- ROUTING --------------

/// QUERY --->  Parametros opcionales

router.get("/name", (req, res) => {
  const id = req.query.id;
  ///  es un parametro que es opcional y que no rompe la ejecucion del controlador
  // para acceder a el valor se introduce en el path completo de la siguiente forma:
  // http://localhost:8080/name?id=125234646242567
  /// primero ?
  /// segundo el nombre del query
  /// tercero el = con el valor
  res.send(`La query es ${id}`);
});

// PARAMS ----> son obligatorios sino rompe la ejecucion o no hace match con la routa
router.get("/person/:name", (req, res) => {
  const { name } = req.params;
  ///const name = req.params.name  ----> ESTO ES LO MISMO QUE LO DE ARRIBA
  const people = ["Luis", "Lorena", "Felipe", "Joaquin", "Luis"];

  /// quiero encontrar a la persona que estoy mamndando por los params

  const peopleToLowerCase = people.map((element, index) => {
    return element.toLowerCase() === name.toLowerCase() && index;
  });

  console.log(peopleToLowerCase);

  /// ----> SOLO NOS VALE CUANDO TENEMOS UN ELEMENTO: const index = peopleToLowerCase.indexOf(name.toLowerCase());
  if (!peopleToLowerCase) {
    res.send("No lo he encontrado");
  } else {
    res.send(`Se encuentra en la posicion ${peopleToLowerCase.toString()}`);
  }
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server listening on port 🐱‍🚀 http://localhost:${PORT}`);
});
