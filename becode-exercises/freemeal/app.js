//#region DOM elements.
// Search.
const searchButton = document.querySelector(".btn-search");
const searchInput = document.querySelector("#search");
const searchResultText = document.querySelector(".search-result-text");
// Grid.
const grid = document.querySelector(".grid");

// Modal.
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".btn-close");
const mealTitle = document.querySelector(".meal-title");
const mealInstructions = document.querySelector(".meal-instructions");
const mealThumb = document.querySelector(".meal-thumb");
const mealIngredients = document.querySelector(".meal-ingredients");
//#endregion

//#region Events
// Close modal AND overlay events.
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});

overlay.addEventListener("click", () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});

// Search for meals events.
searchButton.addEventListener("click", searchMeals);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchMeals();
  }
});
//#endregion

//#region Search meal functionality
async function searchMeals() {
  const searchString = searchInput.value;
  const response = await getMeals(searchString);
  updateGrid(response);
  updateSearchResultText(searchString);
}

async function getMeals(searchString) {
  const uri = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchString}`;
  const response = await fetch(uri);
  const json = await response.json();
  return json["meals"];
}

function updateGrid(meals) {
  grid.innerHTML = "";

  meals.forEach((meal, index) => {
    const imageElem = createThumbImg(meal["strMealThumb"]);
    const gridItem = createGridItem(index);

    gridItem.appendChild(imageElem);

    const titleElem = createTitle(meal["strMeal"]);
    gridItem.appendChild(titleElem);

    addEvents(gridItem, meal, titleElem);

    grid.appendChild(gridItem);
  });
}

function createThumbImg(mealThumb) {
  let imageElem = document.createElement("img");
  imageElem.src = mealThumb;
  return imageElem;
}

function createGridItem(index) {
  const div = document.createElement("div");
  div.classList.add(`grid-item-${index}`);
  div.classList.add("grid-item");
  return div;
}

function createTitle(mealTitle) {
  let titleElem = document.createElement("h4");
  titleElem.classList.add("title");
  titleElem.classList.add("white-text");
  titleElem.innerText = mealTitle;
  return titleElem;
}

function addEvents(gridItem, meal, titleElem) {
  gridItem.addEventListener("click", () => openModal(meal));
  gridItem.addEventListener("mouseover", () => {
    titleElem.style.color = "black";
  });
  gridItem.addEventListener("mouseout", () => {
    titleElem.style.color = "white";
  });
}

function openModal(meal) {
  mealIngredients.innerHTML = "";

  mealTitle.innerText = meal["strMeal"];
  mealThumb.setAttribute("src", meal["strMealThumb"]);
  mealInstructions.innerText = meal["strInstructions"];

  // Declare array of ingredient objects.
  const ingredients = [];

  // Build the array.
  for (let i = 1; i <= 20; i++) {
    // End loop if there is no more ingredient in the array.
    if (
      meal[`strIngredient${i}`] === "" ||
      meal[`strIngredient${i}`] === null
    ) {
      break;
    } else {
      ingredients.push({
        name: meal[`strIngredient${i}`],
        quantity: meal[`strMeasure${i}`],
      });
    }
  }

  // Use the array to add each list item.
  ingredients.forEach((ingredient) => {
    const listItem = document.createElement("li");
    listItem.innerText = `${ingredient.quantity} of ${ingredient.name}`;
    mealIngredients.appendChild(listItem);
  });

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function updateSearchResultText(text) {
  searchResultText.innerText = `Results for "${text}" :`;
}
//#endregion
