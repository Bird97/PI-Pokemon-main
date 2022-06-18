const { Router } =require('express');
const router =Router();
const {getAllPokemons,buscarPorId,crear} =require('../controllers/index.controllers');
require('dotenv').config(); 
//import { Pokemon, Type } from '../db'; //Datos de la base de datos
const {pokeURL} = process.env;

//Midleweres
//traer info de la api

//rutas
router.get('/',async(req,res)=>{
    const {name}=req.query;
    let pokemons=await getAllPokemons();
    res.send(pokemons);
    });

//ruta buscar por id
router.get('/:id',buscarPorId);

router.post('/create', crear)

module.exports= router;