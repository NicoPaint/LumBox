window.addEventListener('DOMContentLoaded', navigator, false);  //se agrega un event listener para cuando se carga el DOM y aplique la funcion navigator
window.addEventListener('hashchange', navigator, false);  //se agrega un event listener para cada vez que se cambie el hash se aplique la funcion navigator.

//esta funcion va a determinar que vista mostrar segun el hash.
function navigator(){
    console.log({ location });

    if(location.hash.startsWith('#trends')){
        trendsPage();
    }
    else if(location.hash.startsWith('#search=')){
        searchPage();
    }
    else if(location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }
    else if(location.hash.startsWith('#category=')){
        categoriesPage();
    }
    else {
        homePage();
    }
}

// estas son las funciones segun la pagina. Estas van a determinar que mostrar y ejecutar en cada una de ellas.

function trendsPage(){
    console.log('Trends!!!');
}

function searchPage(){
    console.log('Search!!!');
}

function movieDetailsPage(){
    console.log('MovieDetails!!!');
}

function categoriesPage(){
    console.log('Categories!!!');
}

function homePage(){
    console.log('Home!!!');

    getTrendingMovies(); //se llama esta función para mostrar las peliculas en tendencia. El archivo esta en main.js
    getCategoriesMovies();  //se llama esta función para mostrar las categorias de peliculas. El archivo esta en main.js
}