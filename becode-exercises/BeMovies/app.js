import { returnKey } from "./return-key.js";

// Appeler la fonction returnKey pour obtenir l'API key.
returnKey();

document.querySelector(".btn-search").addEventListener("click", fetchData);

async function fetchData() {
  document.querySelector(".search-result-container").classList.remove("hidden");
  let search = document.getElementById("search").value;
  let output = `
    <div class="swiper swiper-search">
        <div class="swiper-wrapper swiper-wrapper1">
    `;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        search
      )}&api_key=${returnKey()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }

    const data = await response.json();

    for (const element of data.results) {
      const date = element.release_date.substring(0, 4);
      const genres = await getGenres(element.genre_ids);
      const movieUrl = `https://api.themoviedb.org/3/movie/${
        element.id
      }?api_key=${returnKey()}`;

      output += `
                <div class="swiper-slide">
                    <div class="div-imgfilm">
                    <img src="https://image.tmdb.org/t/p/w500/${
                      element.poster_path
                    }" class="imgfilm">
                    </div>
                
                    <div class="hoverContent" data-url="${movieUrl}">
                        <H1>${element.title}</H1>
                        <H2>${date}</H2>
                        <p>${genres.join(" / ")}</p>
                        <img src="star.png" alt="">
                        <H3>${parseFloat(element.vote_average.toFixed(1))}</H3>
                    </div>
                </div>
            `;
    }

    output += `
            </div> <!-- Closing swiper-wrapper -->
            <div class="swiper-button-prev swiper-button-prev-search"><img src="./left.png" /></div>
            <div class="swiper-button-next swiper-button-next-search"><img src="./right.png" /></div>
            <div class="swiper-scrollbar swiper-scrollbar-search"></div>        
        </div> <!-- Closing swiper -->
        `;
    document.querySelector(".search-result").innerHTML = output;

    // Initialize Swiper
    new Swiper(".swiper-search", {
      slidesPerView: 4,
      navigation: {
        nextEl: ".swiper-button-next-search",
        prevEl: ".swiper-button-prev-search",
      },
      scrollbar: {
        el: ".swiper-scrollbar-search",
      },
    });
    openModalFilm();
  } catch (err) {
    console.log("error", err);
  }
}

async function getGenres(genreIds) {
  const genres = [];
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${returnKey()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(response.statusText);
      return genres;
    }

    const data = await response.json();

    genreIds.forEach((genreId) => {
      const genre = data.genres.find((g) => g.id === genreId);
      if (genre) {
        genres.push(genre.name);
      }
    });
    openModalFilm();
  } catch (err) {
    console.log("error", err);
  }
  return genres;
}

// Funcrion latest
fetchDatalatest();

async function fetchDatalatest() {
  let output = ``;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${returnKey()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }

    const data = await response.json();

    for (const element of data.results) {
      const date = element.release_date.substring(0, 4);
      const genres = await getGenres(element.genre_ids);
      const movieUrl = `https://api.themoviedb.org/3/movie/${
        element.id
      }?api_key=${returnKey()}`;

      output += `
            <div class="swiper-slide slides2">
                <div class="div-imgfilm">
                    <img src="https://image.tmdb.org/t/p/w500/${
                      element.poster_path
                    }" class="imgfilm">
                </div>
                <div class="hoverContent" data-url="${movieUrl}">
                    <H1>${element.title}</H1>
                    <H2>${date}</H2>
                    <p>${genres.join(" / ")}</p>
                    <img src="star.png" alt="">
                    <H3>${parseFloat(element.vote_average.toFixed(1))}</H3>
                </div>
            </div>
            
            `;
    }
    document.querySelector(".swiper-wrapper2").innerHTML = output;

    // Initialize Swiper
    new Swiper(".swiper-latest", {
      slidesPerView: 4,
      navigation: {
        nextEl: ".swiper-button-next-latest",
        prevEl: ".swiper-button-prev-latest",
      },
      scrollbar: {
        el: ".swiper-scrollbar-latest",
      },
    });
    openModalFilm();
  } catch (err) {
    console.log("error", err);
  }
}

function setupGenreListeners() {
  let comedy = 35;
  let drama = 18;
  let action = 28;
  let romance = 10749;
  let fantasy = 14;
  let animation = 16;
  document
    .querySelector(".comedy")
    .addEventListener("click", () => fetchDatagenres(comedy));
  document
    .querySelector(".drama")
    .addEventListener("click", () => fetchDatagenres(drama));
  document
    .querySelector(".action")
    .addEventListener("click", () => fetchDatagenres(action));
  document
    .querySelector(".romance")
    .addEventListener("click", () => fetchDatagenres(romance));
  document
    .querySelector(".fantasy")
    .addEventListener("click", () => fetchDatagenres(fantasy));
  document
    .querySelector(".animation")
    .addEventListener("click", () => fetchDatagenres(animation));
}
fetchDatagenres(35);

document.addEventListener("DOMContentLoaded", () => {
  setupGenreListeners();
  fetchDatagenres(35);
});

async function fetchDatagenres(genreID) {
  let output = ``;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${returnKey()}&with_genres=${genreID}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const data = await response.json();

    for (const element of data.results) {
      const date = element.release_date.substring(0, 4);
      const genres = await getGenres(element.genre_ids);
      const movieUrl = `https://api.themoviedb.org/3/movie/${
        element.id
      }?api_key=${returnKey()}`;

      output += `
            <div class="swiper-slide slides3">
                <div class="div-imgfilm">
                    <img src="https://image.tmdb.org/t/p/w500/${
                      element.poster_path
                    }" class="imgfilm">
                </div>
                <div class="hoverContent" data-url="${movieUrl}">
                    <H1>${element.title}</H1>
                    <H2>${date}</H2>
                    <p>${genres.join(" / ")}</p>
                    <img src="star.png" alt="">
                    <H3>${parseFloat(element.vote_average.toFixed(1))}</H3>
                </div>
            </div>`;
    }
    document.querySelector(".swiper-wrapper3").innerHTML = output;

    // Initialize Swiper
    new Swiper(".swiper-genre", {
      slidesPerView: 4,
      navigation: {
        nextEl: ".swiper-button-next-genre",
        prevEl: ".swiper-button-prev-genre",
      },
      scrollbar: {
        el: ".swiper-scrollbar-genre",
      },
    });
    openModalFilm();
  } catch (err) {
    console.log("error", err);
  }
}

//function call Modal Login, close it and switch LOGIN -- SIGNUP

const modal = document.querySelector(".modalLogin");
const close = document.querySelector(".btn-close-login");
const signup = document.querySelector(".signup");
const login = document.querySelector(".login");
const firstButton = document.querySelector(
  ".signup-login-btns button:first-of-type"
);
const secondButton = document.querySelector(
  ".signup-login-btns button:nth-of-type(2)"
);
document
  .querySelectorAll(".signin")
  .forEach((ele) => ele.addEventListener("click", openModalLogin));
document
  .querySelectorAll(".register")
  .forEach((ele) => ele.addEventListener("click", openModalSignin));
firstButton.addEventListener("click", openModalSignin);
secondButton.addEventListener("click", openModalLogin);

close.addEventListener("click", closeModal);

function openModalLogin() {
  modal.classList.remove("hidden");
  document.querySelector(".overlay").classList.remove("hidden");
  signup.classList.add("hidden");
  login.classList.remove("hidden");
  secondButton.classList.add("signinBtnActive");
  secondButton.classList.remove("dark-btn");
  firstButton.classList.add("dark-btn");
  firstButton.classList.remove("signinBtnActive");
}

function closeModal() {
  modal.classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
  signup.classList.remove("hidden");
  login.classList.remove("hidden");
}

function openModalSignin() {
  modal.classList.remove("hidden");
  document.querySelector(".overlay").classList.remove("hidden");
  login.classList.add("hidden");
  signup.classList.remove("hidden");
  firstButton.classList.add("signinBtnActive");
  firstButton.classList.remove("dark-btn");
  secondButton.classList.remove("signinBtnActive");
  secondButton.classList.add("dark-btn");
}

//Function Open Modal Film

document
  .querySelector(".btn-close-movie")
  .addEventListener("click", closeModalMovie);

function openModalFilm() {
  document.querySelectorAll(".hoverContent").forEach((ele) => {
    ele.addEventListener("click", (e) => {
      document.querySelector(".overlay").classList.remove("hidden");
      document.querySelector(".modalMovie").classList.remove("hidden");
      const movieUrl = e.currentTarget.getAttribute("data-url");

      fetch(movieUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // Fetch movie credits to get the cast
          return fetch(
            `https://api.themoviedb.org/3/movie/${
              data.id
            }/credits?api_key=${returnKey()}`
          )
            .then(function (response2) {
              return response2.json();
            })
            .then(function (data2) {
              let casting = data2.cast
                .map((actor) => actor.original_name)
                .slice(0, 5)
                .join(", ");

              let outputImgFilm = `<img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" class="img-film">`;
              let outputContentFilm = `
                                <div class="modal-movie-content">
                                    <h1>${data.original_title}</h1>
                                    <h2>${data.release_date.substring(
                                      0,
                                      4
                                    )}</h2>
                                    <h3>${parseFloat(
                                      data.vote_average.toFixed(1)
                                    )}</h3>
                                    <img src="star.png" alt="">
                                    <h4>${data.genres
                                      .map((genre) => genre.name)
                                      .join(" / ")}</h4>
                                    <p>${data.overview}</p>
                                    <h4>CAST: </h4><p>${casting}</p>
                                </div>
                            `;
              document.querySelector(".movie-poster-container").innerHTML =
                outputImgFilm;
              document.querySelector(".movie-content").innerHTML =
                outputContentFilm;
            });
        })
        .catch(function (error) {
          console.error("Error fetching movie data:", error);
        });
    });
  });
}

function closeModalMovie() {
  document.querySelector(".modalMovie").classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
}
