const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search Result for "${term}"</h2>`;

        if (data.meals == null) {
          resultHeading.innerHTML = `<h2>There are no search result. Please Try again!</h2>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class = "meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
              <div class= "meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div> `
            )
            .join("");
        }
      });
    // Clear search text
    search.value = "";
  } else {
    alert("Please enter a search term!");
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Fetch random meal
function randomMeal() {
  // Clear Meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  single_mealEl.innerHTML = `
    <div class="single-meal" id="single">
      <h1 class="mealTitle">${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${
          meal.strCategory ? `<h3> Meal Category: ${meal.strCategory}</h3>` : ""
        }
        ${meal.strArea ? `<h3> Origin: ${meal.strArea}</h3>` : ""}
      </div>
      <div class="main">
      <h2 class="ingredients">Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
        <h2 class="instructions">Instructions</h2>
        <p>${meal.strInstructions}</p>
      </div>
    </div>
  `;
  document.querySelector("#single").scrollIntoView({
    behavior: "smooth",
  });
}

//Event Listener
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);

meals.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
