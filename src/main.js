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

//esta funcion se usa para traer las peliculas en tendencia y mostrarlas en la sección de tendencia, es asincrona porque se va a consumir una API.
async function getTrendingMovies(){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas en tendencia.
    const { data } = await api(`trending/movie/day?language=en-US`);  //se desestructura la respuesta de api para obtener los datos de una vez
    const movies = data.results; //movies es el objeto de peliculas en tendencia. tiene una total de 20 elementos.

    trendingPreviewMovieList.innerHTML = "";  //con esta linea se limpia el elemento cada vez que se llama la funcion para evitar cargas duplicadas
    
    //se itera por cada elemento en movies para sacar la informacion de cada una de las peliculas en tendencia
    movies.forEach(movie => {
    
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
        trendingPreviewMovieList.appendChild(movieContainer);  //trendingPreviewMovieList se trajo de node.js
    });
}

//esta funcion se usa para traer las categorias (generos) de las peliculas y mostrarlas en la sección de categories, es asincrona porque se va a consumir una API.
async function getCategoriesMovies(){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de generos de peliculas.
    const { data } = await api(`genre/movie/list?language=en-US`);  //se desestructura la respuesta de api para obtener los datos de una vez
    const categories = data.genres; //categories es el objeto de generos. tiene una total de 19 elementos.

    categoriesPreviewList.innerHTML = '';  //con esta linea se limpia el elemento cada vez que se llama la funcion para evitar cargas duplicadas
    
    //se itera por cada elemento en categories para sacar la informacion de cada una de los generos (id y nombre)
    categories.forEach(category => {

        //Se crean los componentes que forman parte de cada uno de los elementos de la lista y se le agregan los atributos que requieren, revisar index.html
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        
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