const { Router } =require('express');
const router =Router();
const {getTypesFromDb} =require('../controllers/index.controllers');
require('dotenv').config(); 
//import { Pokemon, Type } from '../db'; //Datos de la base de datos
const {pokeURL} = process.env;

//Midleweres
//traer info de la api

//rutas
router.get('/',getTypesFromDb);

module.exports= router;