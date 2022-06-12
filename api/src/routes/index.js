const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

//rutas necesarias
//const pokemon=require('./pokemon.js');
const pokemons=require('./pokemons.js');
const types=require('./types.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//router.use('/pokemon', pokemon);
router.use('/pokemons', pokemons);
router.use('/types', types);

module.exports = router;
