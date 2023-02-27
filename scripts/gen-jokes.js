const API_URL = 'https://icanhazdadjoke.com/';
const MAX_JOKES = 5;

let favJokes = [
    // {
    //     joke: "This is a sample Joke",
    //     date: "03/05/2022"
    // },
    // {
    //     joke: "This is a sample Joke",
    //     date: "03/05/2022"
    // },
    // {
    //     joke: "This is a sample Joke",
    //     date: "03/05/2022"
    // }
]


async function getJoke(){
try{
    let response = await axios.get(API_URL,{
        headers: {
            "Accept": "application/json",
        },
    });
    let jokeText = document.querySelector(".generator__text");
    jokeText.innerText = response.data.joke;
    
} catch(error){
    console.error(error);
}
}

let generateJoke = document.querySelector(".generator__new-joke");
let favouriteButton = document.querySelector(".generator__add-to-favourites");
let searchJoke = document.querySelector(".search");

generateJoke.addEventListener("click",(event)=>{
    let searchResults = document.querySelector('.generator__search-results')
    searchResults.innerHTML= '<h3 class="generator__text"></h3>'
    let originalFav = document.getElementById('original');
    if(originalFav.classList.contains("generator__add-to-favourites--search")){
        originalFav.classList.remove("generator__add-to-favourites--search");
    }
    getJoke();
})

favouriteButton.addEventListener("click",event=>{
    let currentJoke = document.querySelector(".generator__text").innerText;
    addFavorites(currentJoke);
    genFavJokes();
    getJoke();
});

searchJoke.addEventListener("submit",event=>{
    event.preventDefault();
    document.querySelector(".generator__text").innerText ="";
    searchJokes(event.target[0].value)
    .then(()=>{
        searchFavourites();
    });
});



function addFavorites(dadJoke) {
	let favouriteJoke = {
		joke: dadJoke,
		date: new Date().toLocaleDateString("en-us"),
	};

    favJokes.unshift(favouriteJoke);
}


async function searchJokes(searchTerm){
    try{
        let response = await axios.get(`${API_URL}/search?term=${searchTerm}&limit=${MAX_JOKES}`,{
            headers: {
                "Accept": "application/json",
            },
        });
        document.querySelector('.generator__search-results').innerText="";
        let originalFav = document.getElementById('original');
        originalFav.classList.add("generator__add-to-favourites--search")
        response.data.results.forEach(resjoke => {
            genSearchJokes(resjoke);
        });
        
    } catch(error){
        console.error(error);
    }
}



let favs = document.querySelector('.favourite')
function genFavJokes(){
    //this is reset whenever we generate a new dad joke
    favs.innerHTML =  '<h1 class="favourite__header">Favourite Jokes</h1>'
    for (const joke of favJokes){
        //this is where we are creating the elements
        let jokesContainer = document.createElement('div')
        let favJoke = document.createElement('p')
        let favJokeDate = document.createElement('p')
        jokesContainer.classList.add('favourite__joke-container')
        favJoke.classList.add('favourite__joke')
        favJokeDate.classList.add('favourite__joke-date')
        favJoke.innerHTML = joke.joke
        favJokeDate.innerHTML = "This joke was saved on :" + joke.date
        jokesContainer.appendChild(favJoke)
        jokesContainer.appendChild(favJokeDate)
        favs.appendChild(jokesContainer)
    }
}


function searchFavourites(){
    let favourites = document.querySelectorAll(".searchSave");
    favourites.forEach(favourite=>{
        favourite.addEventListener("click",(event)=>{
            let selector = event.target.id.split("__")[1];
            let selectedJoke = document.getElementById(selector);
            addFavorites(selectedJoke.innerText);
            genFavJokes();
        });
    });
}


let searchResults = document.querySelector('.generator__search-results')
function genSearchJokes(jokes){
    let divJoke = document.createElement('div')
    let jokeResult = document.createElement('h3')
    let saveJokeButton = document.createElement('button')
    divJoke.classList.add('generator__search-result')
    jokeResult.classList.add('generator__text')
    saveJokeButton.classList.add('generator__add-to-favourites')
    saveJokeButton.classList.add('searchSave');
    saveJokeButton.innerText="Save Joke"
    jokeResult.setAttribute('id', jokes.id)
    jokeResult.innerText=jokes.joke;
    saveJokeButton.setAttribute('id', `id__${jokes.id}`)
    divJoke.appendChild(jokeResult)
    divJoke.appendChild(saveJokeButton)
    searchResults.appendChild(divJoke)
}