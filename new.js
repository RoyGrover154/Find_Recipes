 function searchRecipes(){
    const searchInput =  document.getElementById('searchInput').value;
     const recipeDiv =  document.getElementById('recipes');
     const notfoundDiv = document.getElementById('notfound');
 

///clear previous results
     recipeDiv.innerHTML = '';    
   notfoundDiv.style.display = 'none';
   
/// search for recipes

if(searchInput === ''){
   notfoundDiv.innerHTML = 'Please enter a recipe name!';   
notfoundDiv.style.display = 'block';
   return;
}

fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
   .then(response => response.json())
   .then(data => {
      if(!data.meals){
         notfoundDiv.innerHTML = 'Recipe not found, please try another search !'
         notfoundDiv.style.display = 'block';
      }
      else{
         data.meals.forEach(meal =>{
            const card = document.createElement('div');
            card.classList.add('recipe-card');

            card.innerHTML = `
            <img src="${meal.strMealThumb}" alt = "${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p>${meal.strCategory}</p>
            <p>${meal.strArea}</p>
            <p>${meal.strTags ? meal.strTags.split(',').join(', ') : 'No tags available'}</p>
            <p>${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a>` : 'No video available'}</p>
            <p>${meal.strSource ? `<a href="${meal.strSource}" target="_blank">Source</a>` : 'No source available'}</p>  
            <button onclick="viewrecipe('${meal.idMeal}')">View Recipes</button>
            `;

            recipeDiv.appendChild(card);
         });
      }
   })   
}

function viewrecipe(mealId){
   const popupCard = document.getElementById('popupCard');
   const recipeTitle = document.getElementById('recipeTitle');
   const recipeDetails = document.getElementById('recipeDetails');   
   const recipeItems = document.getElementById('recipeItems');
   fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
   .then(response => response.json())

   .then(data => {
      const meal = data.meals[0];
      recipeTitle.innerText = meal.strMeal;
      
      recipeItems.innerHTML = meal.strIngredient1 ?
         `<ul>
            ${Object.keys(meal).filter(key => key.startsWith('strIngredient') && meal[key]).map(key => `<li>${meal[key]} - ${meal[`strMeasure${key.slice(-1)}`]}</li>`).join('')}
         </ul>` : 'No ingredients available';
   
      recipeDetails.innerHTML = meal.strInstructions; 
      popupCard.style.display = 'block';

   })
}

function closeRecipe() {
   document.getElementById('popupCard').style.display = 'none';      
}