const imagesBaseURL = "https://image.tmdb.org/t/p/";  //url de donde se sacan todas las imagenes en TMDB API

//esta funcion se usa para traer las peliculas en tendencia y mostrarlas en la sección de tendencia, es asincrona porque se va a consumir una API.
async function getTrendingMovies(){
    //se hace la solicitud GET con fetch para traer el objeto de peliculas en tendencia.
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=${API_KEY}`);  //API_KEY esta oculta en otro archivo, usa tu propia API_KEY.
    const data = await res.json();

    const movies = data.results; //movies es el objeto de peliculas en tendencia. tiene una total de 20 elementos.
    
    //se itera por cada elemento en movies para sacar la informacion de cada una de las peliculas en tendencia
    movies.forEach(movie => {
        //se selecciona el contenedor de toda la lista de peliculas del HTML por su clase 
        const trendingPreviewMoviesContainer = document.querySelector('.trendingPreview-container .trendingPreview-movieList');

        //Se crean los componentes que forman parte de cada uno de los elementos de la lista y se le agregan los atributos que requieren, revisar index.html
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        
        const movieImg = document.createElement('img');
        const movieImgSize = '/w342'  //esto se sacó segun la documentacion de TMDB API.
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src', 
            `${imagesBaseURL}${movieImgSize}${movie.poster_path}`
        );

        //se agregan cada un de los componentes como hijos según la herarquia para se mostrados en la pagina web. 
        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
    });
}

getTrendingMovies(); //se llama esta función para mostrar las peliculas en tendencia.