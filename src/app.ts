import express, { json } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(json());

app.get('/', (req, res) => res.send('Prueba api node'))

app.listen(8080, ()=>{
console.log("Api funcionando en el puerto 8080")
}) 
