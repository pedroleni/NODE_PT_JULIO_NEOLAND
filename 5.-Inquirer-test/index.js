import inquirer from "inquirer";

const respuesta = [
  "RickyMorty: te gustan las APIS",
  "Doraimon: tienes un bolsillo magico con librerias",
  "Pikachu:  te gusta las animaciones de css electricas",
  "Asyncroniunt: estas asyncrono hasta para despertarte",
];

inquirer
  .prompt([
    {
      name: "name",
      message: "Cual es tu nombre ?",
    },
    {
      type: "list",
      name: "goal",
      message: "Cual es tu objetivo en la vida?",
      choices: [
        "Beber",
        "Leer Documentacion",
        "Acordarme de que es NODE",
        "Ser una gran influence",
      ],
    },
  ])
  .then((answers) => {
    switch (answers.goal) {
      case "Beber":
        console.log(`${answers.name} , ${respuesta[0]} `);
        break;
      case "Leer Documentacion":
        console.log(`${answers.name} , ${respuesta[1]} `);
        break;
      case "Acordarme de que es NODE":
        console.log(`${answers.name} , ${respuesta[2]} `);
      case "Ser una gran influence":
        console.log(`${answers.name} , ${respuesta[3]} `);
    }
  });
