const axios = require('axios');
const fs = require('fs');
const NUM_OF_RECIPES = 3;
const RECIPE_IDS = []
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
        var apiResponse = await spoon.get(`recipes/${ids[i]}/analyzedInstructions`)
        var obj = apiResponse.data;
        recipesJson["recipe" + (i+1)] = {
            steps: obj[0].steps
        }
        console.log('done' + i)
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
    } 
    idString = RECIPE_IDS.toString()
    console.log(idString)
    return idString
    
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