

const favBtn = document.querySelector(".fav-btn");
const favLightBox = document.querySelector("#fav-lightBox");
const closeFavList = document.querySelector("#fav-lightBox > span a");
const submit = document.querySelector("button");
const input = document.getElementById("input-box");
const movieContainer = document.querySelector(".movie-list");
const detailLightBox = document.querySelector("#detail-lightBox");
const closeDetailList = document.querySelector("#detail-lightBox > span a");
const boxDetail = document.querySelector(".details-box");
let movieCount = document.querySelector(".movie-counter");

let favMovies = [];

favBtn.addEventListener('click',()=>{
    favLightBox.classList.add('active');
});

closeFavList.addEventListener('click',()=>{
    favLightBox.classList.remove('active');
});

closeDetailList.addEventListener('click',()=>{
    detailLightBox.classList.remove('active');
});



// the below code will fetch data and show the different movies on the basis of name input by the user.
const getResult = async (e) => {
    const url = `https://www.omdbapi.com/?apikey=e2dc9c94&s=${input.value}&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    movieContainer.innerHTML = "";
    data.Search.forEach((item, id) => {
        console.log(item.Title);
        movieData = {
            name: item.Title,
            year: item.Year,
            img: item.Poster
        }
        const div = document.createElement('div');
        div.classList.add('box');
        div.innerHTML = `
        <img src=${movieData.img} alt="">
                <button class="movie-btn">

                    <span>
                        ${movieData.name}
                    </span>
                    <span>
                    ${movieData.year}
                    </span>
                </button>
        `;
        movieContainer.appendChild(div);
    });
};

input.addEventListener('keyup', getResult);




// the below code will create the movie detail page
const getDetail = async (name, year) => {
    const url1 = `https://www.omdbapi.com/?apikey=e2dc9c94&t=${name}&y=${year}&plot=full`;
    const newResponse = await fetch(url1);
    const newData = await newResponse.json();
    console.log(newData);
    return newData;
};

movieContainer.addEventListener("click", async (e) => {
    const clickedElement = e.target;
    // getting clicked item and opening the movie detail page
    if (clickedElement.classList.contains('movie-btn') || clickedElement.tagName === "IMG" || clickedElement.tagName === "SPAN") {
        const closestBox = clickedElement.closest('.box'); // Find the closest box element
        
        if (closestBox) {
            let name = closestBox.querySelector('span:nth-child(1)').textContent;
            let year = closestBox.querySelector('span:nth-child(2)').textContent;
            let movieDetail = {
                name: name.trim(),
                year: year.trim()
            };
        // removing the lightBox display from none to block by adding class active
        detailLightBox.classList.add('active');
        console.log(movieDetail);
        let movieData = await getDetail(movieDetail.name, movieDetail.year);
        console.log(movieData.Actors);
        boxDetail.innerHTML = "";
        let div = document.createElement('div');
        div.classList.add('movieDetails');
        div.innerHTML = `
        <div class="img-container">
                        <img src="${movieData.Poster}" alt="">
                        <button class="btn add-fav-btn">Add To Favotite</button>
                    </div>
                    <div class="title-container">
                        <h2 style="text-transform:uppercase">${movieData.Title} <span>${movieData.Year}</span></h2>
                        <p><b style="color:#ff7373">ACTORS</b> : ${movieData.Actors}</p>
                        <p><b style="color:#ff7373">GENRE</b> : ${movieData.Genre}, <span><b style="color:#ff7373">RELEASED DATE</b> : ${movieData.Released}</span></p> <p><b style="color:#ff7373">IMDb Rating</b> : ${movieData.imdbRating}<span><b style="color:#ff7373">IMDb Votes</b> : ${movieData.imdbVotes}</span></p>
                        <p><b style="color:#ff7373">WRITER</b> : ${movieData.Writer}, <span><b style="color:#ff7373">DIRECTOR</b>  : ${movieData.Director}</span></p> 
                        <p><b style="color:#ff7373">BOX OFFICE</b> : ${movieData.BoxOffice}, <span><b style="color:#ff7373">RUNTIME</b>  : ${movieData.Runtime}</span></p> <p><b style="color:#ff7373">LANGUAGE</b> : ${movieData.Language}</p>
                        <p><b style="color:#ff7373">AWARDS</b> : ${movieData.Awards}</p>
                        <div class="plot">
                            <p><b style="color:#ff7373">PLOT</b> </p>
                            <p>${movieData.Plot}</p>
                        </div>
                    </div>
        `;
        boxDetail.appendChild(div);
        const addButton = document.querySelector(".add-fav-btn")
        addButton.addEventListener('click', () => {
            favMovies.push(movieData);
            localStorage.setItem('favMovies', JSON.stringify(favMovies));
            updateFavoriteList();
            console.log('favMovies:', favMovies);
            console.log('localStorage favMovies:', JSON.parse(localStorage.getItem('favMovies')));
            
        });
        }
    }
});


function updateFavoriteList(){
    let favMovieContainer = document.querySelector('.fav-container');
    favMovieContainer.innerHTML = "";

    favMovies.forEach((movie)=>{
        let favMovieList = document.createElement('li');
        favMovieList.classList.add('fav-movie-list');
        favMovieList.innerHTML = `
        <img src="${movie.Poster}" alt="movie-image">
        <p>${movie.Title} <span>${movie.Year}</span></p>
        `
        // adding a delete button for list
        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.classList.add('delete-button');
        favMovieList.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", () => {
            const movieIndex = favMovies.indexOf(movie);
            if (movieIndex !== -1) {
                favMovies.splice(movieIndex, 1);
                localStorage.setItem('favMovies', JSON.stringify(favMovies));
                updateFavoriteList();
            }
        });
        
        favMovieContainer.appendChild(favMovieList);
    });

    // Update the movie count
    let countElement = document.getElementById("fav-count");
    countElement.textContent = favMovies.length;
    console.log(favMovies.length);
}
document.addEventListener("click", (e)=>{
    if (e.target.classList.contains("fav-movie-list")){
        detailLightBox.classList.add("active");
    }
});

function getStoredFavoriteMovies() {
    const storedMovies = localStorage.getItem('favMovies');
    if (storedMovies) {
        return JSON.parse(storedMovies);
    } else {
        return [];
    }
}
  


window.onload = ()=>{
    favMovies = getStoredFavoriteMovies()
    updateFavoriteList();
};
window();
