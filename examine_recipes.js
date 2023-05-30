const axios = require('axios');
const fs = require('fs');
const NUM_OF_RECIPES = 3;
const RECIPE_IDS = []
// Base configuration of all Spoonacular HTTP requests
const spoon = axios.create({
  baseURL: "https://api.spoonacular.com/",
  timeout: 10000,
  headers: { 'x-api-key': "81e81ac3e7c14d2b9913ceebbbb4025a" }, // TODO: move to secret vault
});

async function getBulk(ids) {
  try {
    
    const apiResponse = await spoon.get(`recipes/informationBulk?ids=${ids}&includeNutrition=true`)
    const obj = apiResponse.data;
    
    var recipesJson = JSON.parse('{}');
    for(let i = 0; i < NUM_OF_RECIPES; i++){
      
      recipesJson["recipe" + i] = {
      
        title: obj[i].title,
        vegetarian: obj[i].vegetarian,
        vegan: obj[i].vegan,
        glutenFree: obj[i].glutenFree,
        dairyFree: obj[i].dairyFree,
        veryHealthy: obj[i].veryHealthy,
        cheap: obj[i].cheap,
        veryPopular: obj[i].veryPopular,
        preparationMinutes: obj[i].preparationMinutes,
        cookingMinutes: obj[i].cookingMinutes,
        aggregateLikes: obj[i].aggregateLikes,
        healthScore: obj[i].healthScore,
        pricePerServing: obj[i].pricePerServing,
        extendedIngredients: obj[i].extendedIngredients,
        readyInMinutes: obj[i].readyInMinutes,
        servings: obj[i].servings,
        sourceUrl: obj[i].sourceUrl,
        image: obj[i].image,
        nutrition: obj[i].nutrition.nutrients,
        summary: obj[i].summary,
        cuisines: obj[i].cuisines,
        dishTypes: obj[i].dishTypes,
        diets: obj[i].diets,
        instructions: obj[i].instructions,
        analyzedInstructions: obj[i].analyzedInstructions
      
      };
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
  const result = await getBulk(ids);

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