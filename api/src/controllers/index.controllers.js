const axios =require("axios");
//const fetch = require("node-fetch");
require('dotenv').config(); 
const {Types} =require('../db'); //Datos de la base de datos
const {pokeURL} = process.env;

//pedimpos datos de api
const getApiPkms= async()=>{
    const Apipokemons = await axios.get(`${pokeURL}pokemon?limit=40`);
    const {results}= Apipokemons.data;
    let Pokemons=[];
    for (i = 0; i < results.length; i++) {
      if(!results[i]){
        console.log(i); 
        return Pokemons;
      };
      if(results[i].url){
        const pokemon = await axios.get(`${results[i].url}`);
        const {name,id,weight,types,sprites,stats}= await pokemon.data;
        //const {height} = await pokemon.data;
        Pokemons.push({
          id: id,
          name: name,
          type: types.map((t) => t.type.name),
          img: sprites.versions["generation-v"]["black-white"].animated
            .front_default,
          hp: stats[0].base_stat,
          attack: stats[1].base_stat,
          speed: stats[5].base_stat,
          defence: stats[2].base_stat,
          weight: weight,
          height: pokemon.data.height,
        });
      }
    }
    //console.log(Pokemons);
    return Pokemons; 
}
//pedimos datos de db
//const getDbPkms= async()=>{
//  const bd = await Pokemon.findAll({ include: Tipo });
//  console.log(bd);
//}


//pide todos los tipos de pokemon a la API
async function getAllTypes(){
  try{
    let contador=0;
    let types =(await axios(`${pokeURL}type`)).data.results.map(e=>({id:contador=contador+1, name:e.name}));
    await Types.bulkCreate(types);
    console.log("Tipos de pokemon cargados en DB correctamente");
  }catch(e){
    console.log(e);
  }
}

function getTypesFromDb(req, res,next){
  Types.findAll()
  .then(types=>res.send(types))
  .catch(e=>next(e))
}
//unimos todo 
module.exports={
    getApiPkms,
    getAllTypes,
    getTypesFromDb
}