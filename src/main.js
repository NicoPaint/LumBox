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

let infiniteScrolling;  //con esta variable se va a manejar el infinite scrolling en cada sección.

//Utils
 
//se creó una instancia de un intersection observer para implementar el lazy loading a las imagénes de la app. Este se aplicó todo el HTML por eso no tiene argumento de options (ver documentación).
const lazyLoader = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        //si el target entra al campo de visión del observador se van a cargar las imagenes.
        if(entry.isIntersecting){
            const imgURL = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', imgURL);
        }
    })
})

//Esta funcion se utiliza para crear la lista y visualizar las peliculas en la seccion que se requiera.
function createMovies({
    movies,
    container,
    movieModificator,
    clean = true,
}={})
{
    if(clean) container.innerHTML = '';  //con esta linea se limpia el elemento cada vez que se llama la funcion para evitar cargas duplicadas

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
            'data-img', //se guarda la URL en este atributo para extraerlo después para el lazy loading.
            `${imagesBaseURL}${movieImgSize}${movie.poster_path}`
        );
        //Se le agrega un event listener a cada imagen para ejecutar una acción si aparece algún error al traer el archivo de la API
        movieImg.addEventListener('error', () => {
            //si no carga la imagen de la API, se va a mostrar una imagen por defecto y se mostrará el titulo de la pelicula en la mitad de dicha imagen, por lo que se crea un span y un div que contenga ese span para mostrar el titulo y se estila según lo anterior.
            const movieImgAlt = document.createElement('span');
            movieImgAlt.textContent = movieImg.getAttribute('alt');
            movieImgAlt.style.fontWeight = 'bold';
            movieImgAlt.style.color = '#212A3E';

            const movieAltDiv = document.createElement('div');
            movieAltDiv.style.minWidth = '70%';
            movieAltDiv.style.maxWidth = '70%';
            movieAltDiv.style.position = 'absolute';
            movieAltDiv.style.padding = '25% 0';
            movieAltDiv.style.left = '15%';
            movieAltDiv.style.top = '30%';
            movieAltDiv.style.textAlign = 'center';

            movieImg.setAttribute('src', '../img/default-movie-img.png');  //se agrega la imagen por defecto como la imagen de la pelicula

            movieAltDiv.appendChild(movieImgAlt);
            movieContainer.appendChild(movieAltDiv);  //al final se agrega el span como hijo al contenedor de la pelicula y se vuelve hermano de la imagen.
        });

        lazyLoader.observe(movieImg);  //se marcó cada imagen para el que lazy loader las monitoree.

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
    let page = 1;  //Esta variable controla la páginación de la API.

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

    //Cargar mas contenido

    //primero se valida que no exista una funcion infinite scrolling, y si si lo hay se elimina.
    if(infiniteScrolling){
        genericListSection.removeEventListener('scroll', infiniteScrolling);
        infiniteScrolling = undefined;
        console.log('test');
    }

    //Se asigna la función especifíca de la sección al infinite scrolling.
    infiniteScrolling = () => {
        const isUserAtBottom = genericListSection.scrollTop + genericListSection.clientHeight >= genericListSection.scrollHeight - 5;
        const isOutOfPages = page == data.total_pages;

        //Se hace la validación si el usuario alcanzó el fondo de la pantalla, y no ha alcanzado el máximo de páginas.
        if(isUserAtBottom && !isOutOfPages){
            page++;  //Se suma uno a la página

            //Se invoca la función de paginación con los respectivos parametros de la sección.
            getPaginatedMovies({
            url: 'discover/movie',
            params: {
                'language': 'en-US',
                'with_genres': id,
            },
            page,
            container: genericMovieList,
            })
        }
    }


    genericListSection.addEventListener('scroll', infiniteScrolling);
}

//esta funcion se usa para traer las peliculas según la búsqueda del usuario y mostrarlas en la sección de búsqueda, es asincrona porque se va a consumir una API.
async function getMovieBySearch(query){
    let page = 1;  //Esta variable controla la páginación de la API.

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

    //Cargar mas contenido

    //primero se valida que no exista una funcion infinite scrolling, y si si lo hay se elimina.
    if(infiniteScrolling){
        genericListSection.removeEventListener('scroll', infiniteScrolling);
        infiniteScrolling = undefined;
        console.log('test');
    }

    //Se asigna la función especifíca de la sección al infinite scrolling.
    infiniteScrolling = () => {
        const isUserAtBottom = genericListSection.scrollTop + genericListSection.clientHeight >= genericListSection.scrollHeight - 5;
        const isOutOfPages = page == data.total_pages;

        //Se hace la validación si el usuario alcanzó el fondo de la pantalla, y no ha alcanzado el máximo de páginas.
        if(isUserAtBottom && !isOutOfPages){
            page++;  //Se suma uno a la página

            //Se invoca la función de paginación con los respectivos parametros de la sección.
            getPaginatedMovies({
            url: 'search/movie',
            params: {
                'language': 'en-US',
                query,
            },
            page,
            container: genericMovieList,
            })
        }
    }


    genericListSection.addEventListener('scroll', infiniteScrolling);
}

//esta funcion se usa para traer las peliculas en tendencia y mostrarlas en la sección de tendencia, es asincrona porque se va a consumir una API.
async function getTrendingMovies(){
    let page = 1; //Esta variable controla la páginación de la API.

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

    //Cargar mas contenido

    //primero se valida que no exista una funcion infinite scrolling, y si si la hay se elimina.
    if(infiniteScrolling){
        genericListSection.removeEventListener('scroll', infiniteScrolling);
        infiniteScrolling = undefined;
        console.log('test');
    }

    //Se asigna la función especifíca de la sección al infinite scrolling.
    infiniteScrolling = () => {
        const isUserAtBottom = genericListSection.scrollTop + genericListSection.clientHeight >= genericListSection.scrollHeight - 5;
        const isOutOfPages = page == data.total_pages;

        //Se hace la validación si el usuario alcanzó el fondo de la pantalla, y no ha alcanzado el máximo de páginas.
        if(isUserAtBottom && !isOutOfPages){
            page++;  //Se suma uno a la página

            //Se invoca la función de paginación con los respectivos parametros de la sección.
            getPaginatedMovies({
            url: 'trending/movie/day',
            params: {
                'language': 'en-US',
            },
            page,
            container: genericMovieList,
            })
        }
    }


    genericListSection.addEventListener('scroll', infiniteScrolling);
}

//Esta funcion se usa para traer la información de un película en especifico utilizando su ID. Esta se va usar para llenar la sección de detalle de una película.
async function getMovieById(id){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de pelicula según el Id.
    const { data: movie, status } = await api(`movie/${id}`,{
        params:{
            'language': 'en-US',
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez

    //Si la solicitud es exitosa, entonces se van a remover los loading skeletons de los textos en la sección de detalle.
    if(status == 200){
        movieDetailTitle.classList.remove('movieDetail-title--loading', 'animation');
        movieDetailScore.classList.remove('movieDetail-score--loading', 'animation');
        movieDetailCategories.classList.remove('movieDetail-categories--loading', 'animation');
        movieDetailOverview.classList.remove('movieDetail-overview--loading', 'animation');
    }

    //se llenan los elementos con la información que se trajo de la API. 
    movieDetailTitle.textContent = movie.title;
    movieDetailScore.textContent = movie.vote_average.toFixed(1);
    movieDetailOverview.textContent = movie.overview;

    const movieImgSize = '/w500'  //esto se sacó segun la documentacion de TMDB API. https://developer.themoviedb.org/reference/configuration-details
    
    //Se agrega la imagen de la película como fondo del header para dar el efecto deseado.
    header.style.background = `
        linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
        top/cover no-repeat url(${imagesBaseURL}${movieImgSize}${movie.poster_path})
    `;
    
    //Se extrae la info de los géneros para mostrarlo en una sola línea.
    const movieCategories = movie.genres.map(genre => genre.name);
    movieDetailCategories.textContent = movieCategories.join(', ')

    getRelatedMoviesById(id); //se invoca esta función para mostar las películas relacionadas a la película mostrada en detalle.
}

//Esta función se usa para mostrar las películas relacionadas en la sección de detalle de una película.
async function getRelatedMoviesById(id){
    //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas según la recomendación de la película en detalle.
    const { data } = await api(`movie/${id}/recommendations`,{
        params:{
            'language': 'en-US',
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez

    const relatedMovies = data.results;
    console.log(relatedMovies);

    //se llama a la funcion createMovies para visualizar las peliculas relacionadas
    createMovies({
        movies: relatedMovies,
        container: movieDetailMovieList,
        movieModificator: '',
    })

    //Esta sección se ejecuta si por alguna razón no hay ninguna recomendación de películas al ID que se pasó inicialmente. Trae las películas mas populares en la API.
    if(relatedMovies.length == 0){
        //se hace la solicitud GET con la instancia de AXIOS para traer el objeto de peliculas populares.
        const { data } = await api(`movie/popular`, {
            params:{
                'language': 'en-US',
            }
        });  //se desestructura la respuesta de api para obtener los datos de una vez
        const movies = data.results; //movies es el objeto de peliculas populares. tiene una total de 20 elementos.

        //se llama a la funcion createMovies para visualizar las peliculas populares
        createMovies({
            movies,
            container: movieDetailMovieList,
            movieModificator: '',
        })
    }

    html.scrollTop = 0;
    movieDetailMovieList.scrollLeft = 0;
}

//Esta funcion se usa para mostrar mas resultados de peliculas para las vistas de tendencias, categorias y búsqueda.
async function getPaginatedMovies({
    url,
    params,
    page,
    container
} = {})
{   
    const { data } = await api(url, {
        params:{
            ...params,
            page,
        }
    });  //se desestructura la respuesta de api para obtener los datos de una vez
    const movies = data.results; //movies es el objeto de peliculas según los datos iniciales. tiene una total de 20 elementos.
    console.log(movies);

    //se llama a la funcion createMovies para visualizar las peliculas según los datos iniciales
    createMovies({
        movies,
        container,
        movieModificator: '--small',
        clean: false,
    })
}