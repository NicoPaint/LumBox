//se hizo la migración a AXIOS por lo que se crea un instancia de el para configurar los datos comunes y asi usarlos por todo el programa.
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,  //API_KEY esta oculta en otro archivo, usa tu propia API_KEY.
    }
}); 

const imagesBaseURL = "https://image.tmdb.org/t/p/";  //url de donde se sacan todas las imagenes en TMDB API

//Utils

//Esta funcion se utiliza para crear la lista y visualizar las peliculas en la seccion que se requiera.
function createMovies({
    movies,
    container,
    movieModificator
}){
    container.innerHTML = '';  //con esta linea se limpia el elemento cada vez que se llama la funcion para evitar cargas duplicadas

    movies.forEach(movie => {
    
        //Se crean los componentes que forman parte de cada uno de los elementos de la lista y se le agregan los atributos que requieren, revisar index.html
        const movieContainer = document.createElement('div');
        movieContainer.classList.add(`movie-container${movieModificator}`);
        movieContainer.addEventListener('click', () => location.hash = `#movie=${movie.id}`);
        
        const movieImg = document.createElement('img');
        const movieImgSize = '/w342'  //esto se sacó segun la documentacion de TMDB API. https://developer.themoviedb.org/reference/configuration-details
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src', 
            `${imagesBaseURL}${movieImgSize}${movie.poster_path}`
        );

        //se agregan cada un de los componentes como hijos según la herarquia para se mostrados en la pagina web. 
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);  //trendingPreviewMovieList se trajo de node.js
    });
}

//Llamados a la API

//esta funcion se usa para traer las peliculas en tendencia y mostrarlas en la sección de tendencia, es asincrona porque se va a consumir una API.
async function getTrendingMoviesPreview(){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas en tendencia.
    const { data } = await api(`trending/movie/day`, {
        params:{
            'language': 'en-US',
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez
    const movies = data.results; //movies es el objeto de peliculas en tendencia. tiene una total de 20 elementos.

    //se llama a la funcion createMovies para visualizar las peliculas en tendencia
    createMovies({
        movies,
        container: trendingPreviewMovieList,
        movieModificator: '',
    })
}

//esta funcion se usa para traer las categorias (generos) de las peliculas y mostrarlas en la sección de categories, es asincrona porque se va a consumir una API.
async function getCategoriesMovies(){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de generos de peliculas.
    const { data } = await api(`genre/movie/list`, {
        params:{
            'language': 'en-US',
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez
    const categories = data.genres; //categories es el objeto de generos. tiene una total de 19 elementos.

    categoriesPreviewList.innerHTML = '';  //con esta linea se limpia el elemento cada vez que se llama la funcion para evitar cargas duplicadas
    
    //se itera por cada elemento en categories para sacar la informacion de cada una de los generos (id y nombre)
    categories.forEach(category => {

        //Se crean los componentes que forman parte de cada uno de los elementos de la lista y se le agregan los atributos que requieren, revisar index.html
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        categoryContainer.addEventListener('click', () => location.hash = `#category=${category.id}-${category.name}`);  //se agrega un event listener para que cuando se haga click al elemento se cambie el hash segun la categoria. Ej: #category=0249-comedy. Y asi hacer el cambio en la navegación.
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', category.id);
        
        const categoryTitleText = document.createTextNode(category.name);  //se crea el texto para el h3.

        //se agregan cada un de los componentes como hijos según la herarquia para se mostrados en la pagina web.
        categoryTitle.appendChild(categoryTitleText); 
        categoryContainer.appendChild(categoryTitle);
        categoriesPreviewList.appendChild(categoryContainer); //categoriesPreviewList se trajo de node.js
    });
}

//esta funcion se usa para traer las peliculas según la categoria y mostrarlas en la sección de categorias, es asincrona porque se va a consumir una API.
async function getMovieByCategory(id){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas según la categoria.
    const { data } = await api(`discover/movie`,{
        params:{
            'language': 'en-US',
            'with_genres': id,
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez
    const movies = data.results; //movies es el objeto de peliculas según la categoria. tiene una total de 20 elementos.
    
    //se llama a la funcion createMovies para visualizar las peliculas segun la categoria.
    createMovies({
        movies,
        container: genericMovieList,
        movieModificator: "--small",
    })
}

//esta funcion se usa para traer las peliculas según la búsqueda del usuario y mostrarlas en la sección de búsqueda, es asincrona porque se va a consumir una API.
async function getMovieBySearch(query){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas según la búsqueda del usuario.
    const { data } = await api(`search/movie`,{
        params:{
            'language': 'en-US',
            query,
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez
    const movies = data.results; //movies es el objeto de peliculas según la categoria. tiene una total de 20 elementos.
    
    //se llama a la funcion createMovies para visualizar las peliculas segun la búsqueda del usuario.
    createMovies({
        movies,
        container: genericMovieList,
        movieModificator: "--small",
    })
}

//esta funcion se usa para traer las peliculas en tendencia y mostrarlas en la sección de tendencia, es asincrona porque se va a consumir una API.
async function getTrendingMovies(){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas en tendencia.
    const { data } = await api(`trending/movie/day`, {
        params:{
            'language': 'en-US',
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez
    const movies = data.results; //movies es el objeto de peliculas en tendencia. tiene una total de 20 elementos.

    //se llama a la funcion createMovies para visualizar las peliculas en tendencia
    createMovies({
        movies,
        container: genericMovieList,
        movieModificator: '--small',
    })
}

async function getMovieById(id){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas según la búsqueda del usuario.
    const { data: movie } = await api(`movie/${id}`,{
        params:{
            'language': 'en-US',
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez

    movieDetailTitle.textContent = movie.title;
    movieDetailScore.textContent = movie.vote_average.toFixed(1);
    movieDetailOverview.textContent = movie.overview;

    const movieImgSize = '/w500'  //esto se sacó segun la documentacion de TMDB API. https://developer.themoviedb.org/reference/configuration-details
    header.style.background = `
        linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
        top/cover no-repeat url(${imagesBaseURL}${movieImgSize}${movie.poster_path})
    `;
    
    const movieCategories = movie.genres.map(genre => genre.name);
    movieDetailCategories.textContent = movieCategories.join(', ')

    getRelatedMoviesById(id);
}

async function getRelatedMoviesById(id){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas según la búsqueda del usuario.
    const { data } = await api(`movie/${id}/recommendations`,{
        params:{
            'language': 'en-US',
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez

    const relatedMovies = data.results;
    console.log(relatedMovies);

    createMovies({
        movies: relatedMovies,
        container: movieDetailMovieList,
        movieModificator: '',
    })

    //
    if(relatedMovies.length == 0){
        //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas en tendencia.
        const { data } = await api(`movie/popular`, {
            params:{
                'language': 'en-US',
            }
        });  //se desestructura la respuesta de api para obtener los datos de una vez
        const movies = data.results; //movies es el objeto de peliculas en tendencia. tiene una total de 20 elementos.

        //se llama a la funcion createMovies para visualizar las peliculas en tendencia
        createMovies({
            movies,
            container: movieDetailMovieList,
            movieModificator: '',
        })
    }

    html.scrollTop = 0;
    movieDetailMovieList.scrollLeft = 0;
}