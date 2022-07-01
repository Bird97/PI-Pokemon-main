const { Router } =require('express');
const router =Router();
const {getPokemon,buscarPorId,crear} =require('../controllers/index.controllers');
require('dotenv').config(); 
//import { Pokemon, Type } from '../db'; //Datos de la base de datos
const {pokeURL} = process.env;

//rutas

//devuelve todos los pokemones
router.get('/',getPokemon);
//ruta buscar por id
router.get('/:id', buscarPorId);

//router.post('/create', crear)

module.exports= router;