const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const mysql = require('mysql')

const PORT = process.env.PORT || 3001;
require('dotenv').config()
// const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hola desde el servidor!" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
app.post('/CreateUser', async (req, res) => {
  try {
    const userData = req.body; // Asegúrate de que req.body contenga los datos necesarios para crear un usuario
    const user = await prisma.Usuario.create({
      data: userData, // Pasamos los datos del usuario
    });
    res.json(user);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

console.log('Connected to PlanetScale!')
