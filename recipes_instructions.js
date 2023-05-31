const axios = require('axios');
const fs = require('fs');
const NUM_OF_RECIPES = 50;
var RECIPE_IDS = []
var RECIPE_NAMES = []
// Base configuration of all Spoonacular HTTP requests
const spoon = axios.create({
  baseURL: "https://api.spoonacular.com/",
  timeout: 5000,
  headers: { 'x-api-key': "81e81ac3e7c14d2b9913ceebbbb4025a" }, // TODO: move to secret vault
});

async function getInstructions(ids) {
  try {
    var recipesJson = JSON.parse('{}');
    for(i = 0; i < NUM_OF_RECIPES; i++){
        //api call for instructions
        var apiResponse = await spoon.get(`recipes/${ids[i]}/analyzedInstructions`)
        var obj = apiResponse.data;
    

        //get first object = steps
        var steps = obj[0].steps;
        
        var ingr_str = [];
        var step_str = [];
        steps.forEach(elem => {
          step_str.push(elem.step)
          //if ingredients exists push to array
          if(elem.hasOwnProperty("ingredients")){
            var ingr = elem.ingredients;
            ingr.forEach(elem2 => {
              ingr_str.push(elem2.name)
            });
            }
        });
        
        //output
        recipesJson["recipe" + (i+1)] = {
            name: RECIPE_NAMES[i],
            steps: step_str,
            ingredients: ingr_str
            
        }
    }
    return recipesJson;
  }
  catch (error) {    
      console.log(error)
      return {
          success: false,
          message: error.message
      };
    }
}
async function getResult(ids){
  const result = await getInstructions(ids);

  fs.writeFile('output.txt', JSON.stringify(result), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Data written to file successfully.');
  });
}

async function getRandomRecipes(){
  try{
    const apiResponse = await spoon.get(`recipes/random?limitLicense=true&number=${NUM_OF_RECIPES}`)
    const obj = apiResponse.data;
    
    for(let i = 0; i < NUM_OF_RECIPES; i++){
      RECIPE_IDS.push(JSON.stringify(obj.recipes[i].id))
      RECIPE_NAMES.push(obj.recipes[i].title)
    } 
    
    console.log(RECIPE_IDS)
    return RECIPE_IDS
    
  }
  catch (error) {    
    console.log(error)
    return {
        success: false,
        message: error.message
    };
  }
  
}
async function start(){
  const ids = await getRandomRecipes();
  getResult(ids);
}
start();