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
  const {username, password, name, surname, mail} = req.body; 
  try {
    const user = await prisma.Usuario.create({
      data: {
        "username": username,
        "password": password,
        "name": name,
        "surname": surname,
        "mail": mail
      } // Pasamos los datos del usuario
    });
    res.json(user);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

console.log('Connected to PlanetScale!')
