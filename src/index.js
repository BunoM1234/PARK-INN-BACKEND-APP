const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const mysql = require('mysql')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
require('dotenv').config()
// const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)

const app = express();
app.use(bodyParser.json());

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
    res.send({ msg: "No existe el usuario" })
  }
})

app.post('/CreateParking', async (req, res) => {
  const { adress, type, capacity, userID } = req.body;
  try {
    const add = await prisma.Estacionamientos.create({
      data: {
        adress,
        type,
        capacity,
        usuario: {
          connect: {
            ID: userID  
          }
        }
      }
    });
    res.json(add);
  } catch (error) {
    console.error('Error al crear el Parking:', error);
    res.status(500).json({ error: 'Error al crear el Parking' });
  }
});

console.log('Connected to PlanetScale!')

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});