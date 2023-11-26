const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const mysql = require('mysql')
var cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
require('dotenv').config()
const connection = mysql.createConnection(process.env.DATABASE_URL)



const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hola desde el servidor!" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});

app.post('/CreateUser', async (req, res) => {
  const { username, password, name, surname, mail } = req.body;
  try {
    const user = await prisma.Usuario.create({
      data: {
        "username": username,
        "password": password,
        "mail": mail
      } // Pasamos los datos del usuario
    });
    res.json(user);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

app.post('/loginValidation', async (req, res) => {
  const { username, password } = req.body;
  const userLog = await prisma.Usuario.findFirst({
    where: {
      "username": username,
      "password": password
    }
  });
  if (userLog) {
    res.json(userLog);
  }
  else {
    res.status(404).send("No existe el usuario");
  }
});

app.post('/CreateParking', async (req, res) => {
  const { adress, type, capacity, contact, barrio, userID} = req.body;
  const creacion = await prisma.Estacionamientos.create({
    data: {
      adress: adress,
      type: type,
      barrio: barrio,
      capacity: capacity,
      contact: contact,
      userID: userID
    }
  });
  if (creacion) {
    res.json(creacion);
  }
  else {
    res.status(404).send("No existe el usuario");
  }
});

app.post('/GetParkUser', async (req, res) => {
  const { userID } = req.body;
  const parkUser = await prisma.Estacionamientos.findMany({
    where: {
      userID: userID
    }
  });
  if (parkUser) {
    res.json(parkUser);
  }
  else {
    res.status(404).send("No existe el usuario");
  }
}); 

app.post('/UpdateParking', async (req, res) => {
  const { adress, type, capacity, contact, barrio, userID, id} = req.body;
  const update = await prisma.Estacionamientos.update({
    where: {
      ID: id
    },
    data: {
      adress: adress,
      type: type,
      capacity: capacity,
      barrio: barrio,
      contact: contact,
      userID: userID
    }
  });
  if (update) {
    res.json(update);
  }
  else {
    res.status(404).send("Error al actualizar el estacionamiento");
  }
});

app.post('/GetParkBarrio', async (req, res) => {
  const { barrio } = req.body;
  const parkBarrio = await prisma.Estacionamientos.findMany({
    where: {
      barrio: barrio
    }
  });
  if (parkBarrio) {
    res.json(parkBarrio);
  }
  else {
    res.status(404).send("No existe el usuario");
  }
}
);

app.post('/DeletePark', async (req, res) => {
  const { id } = req.body;
  const deletePark = await prisma.Estacionamientos.delete({
    where: {
      ID: id
    }
  });
  if (deletePark) {
    res.json(deletePark);
  }
  else {
    res.status(404).send("Error al eliminar el estacionamiento");
  }
}
);  

module.exports = app;

console.log('Connected to PlanetScale!')

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

