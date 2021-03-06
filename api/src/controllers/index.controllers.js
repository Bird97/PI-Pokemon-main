const axios =require("axios");
const e = require("express");
//const fetch = require("node-fetch");
require('dotenv').config(); 
const {Type,Pokemon} =require('../db'); //Datos de la base de datos
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
async function getDbPkms(req, res,next){
  try{
  const poke= await Pokemon.findAll({
    include:{
      attributes: ["name"],
      model: Type,
      through: {
        attributes: [],
      },
    },
  })
  return poke;
}catch(error){
  console.log(error)
  res.status(404);
}
}
//unimos ambos
const getAllPokemons = async () => {
  const api = await getApiPkms();
  let db =await getDbPkms();
  if(db==undefined){
    db=[];
  }
  const total = api.concat(db);
  return total;
}
//crear pokemon
 var iddb = 5000;
async function crear(req, res){
  try {
    let { name, image, hp, attack, defence, speed, height, weight, type} = req.body
    let encontrar = await Pokemon.findOne({  //si existe un pokemon con ese nombre no se devuelve un mensaje
       where: {
         name: name.toLowerCase(),
       },
     });
    // //Primero verifico que el nombre este disponible.
     if (encontrar)
       return res.json({ msg: "El Pokemon ya existe." });

     let pokemon = await Pokemon.create({
       id: iddb++,
       name: name,
      image,
      hp,
      attack,
      defence,
      speed,
      height,
      weight,
    });
    
     if (!name) return res.json({ info: "El nombre es obligatorio" });
     if(Array.isArray(type) && type.length){ //Consulto si lo que me llega en types es un arreglo y si tiene algo adentro.
      let dbTypes = await Promise.all( //Armo una variable que dentro tendra una resolucion de promesas
         type.map((e) => { // Agarro la data de types y le hago un map para verificar que cada elemento exista en nuestra tabla de types
           return Type.findOne({where:{ name: e}}) 
         })
       )
      await pokemon.setTypes(dbTypes) //Una vez que se resuelva la promesa del Pokemon.create, le agrego los types

      return res.send("Pokemon creado exitosamente");
     }
  } catch (err) {   
    res.status(400).send("Error en data");
  }
};
//buscamos por id
async function buscarPorId (req,res) { 
  const {id}=req.params;
  try{   
    if(id>=5000){
      datab= await Pokemon.findByPk(id); //esto debes pasarlo a json
      if(datab){
        return res.status(200).send(datab);
      }else{
        return res.status(404).json({ err: `No se encontr?? un Pokemon para el id: ${id}` });
      }
      //return datab;//.data.toJSON();      
    }else{ 
      const pokemon= await axios.get(`${pokeURL}/pokemon/${id}`);
      const {name,weight,types,sprites,stats}= await pokemon.data;
        const poke={
          id: pokemon.data.id,
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
        };
        res.status(200).json(poke);//poke;     
    }

  }catch(error){
    res.status(404).json({ err: `No se encontr?? un Pokemon para el id: ${id}` });
  }

}

//pide todos los tipos de pokemon a la API y los guarda en DB
async function getAllTypes(){
  try{
    let contador=0;
    let types =(await axios(`${pokeURL}type`)).data.results.map(e=>({id:contador=contador+1, name:e.name}));
    //console.log(types);
    await Type.bulkCreate(types);//??
    console.log("Tipos de pokemon cargados en DB correctamente");
  }catch(e){
    console.log(e);
  }
}
//pide los tipos de pokemon a la DB
function getTypesFromDb(req, res,next){
  Type.findAll()
  .then(types=>res.send(types))
  .catch(e=>next(e))
}
//devuelve un pokemon
async function getPokemon(req,res){
  const {name}=req.query;
  if(name){
    const nam = name.slice(1,-1); 
    try{        
      const pokemon= await axios.get(`https://pokeapi.co/api/v2/pokemon/${nam}`);
      const {name,weight,types,sprites,stats}= await pokemon.data;
          const poke={
            id: pokemon.data.id,
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
          };
          return res.status(200).send(poke);//poke;     
    }catch(e){
      console.log(`${nam} no existe en la api`)
    }
  }
  //Buscamos si existe en la base de datos
  let pokemons=await getAllPokemons();
  
  if(name!=undefined){
    let poke=pokemons.filter(pokemon=>pokemon.name==name.slice(1,-1));
    if(poke){
      return res.status(200).send(poke)
    }
     return res.status(500).send("No existe pokemon con ese nombre")
    }
  
  res.status(200).send(pokemons);
}

//unimos todo 
module.exports={
    getApiPkms,
    getAllTypes,
    getTypesFromDb,
    getAllPokemons,
    buscarPorId,
    crear,
    getPokemon,
}