//se agregan los event listener a los siguientes elementos para cambiar la navegacion de la pagina a traves de clicks.
searchButton.addEventListener('click', () => location.hash = `#search=${searchInput.value}`);  //Aca se agraga el query del usuario al hash
trendingPreviewButton.addEventListener('click', () => location.hash = '#trends');
headerArrow.addEventListener('click', () => location.hash = '');

window.addEventListener('DOMContentLoaded', navigator, false);  //se agrega un event listener para cuando se carga el DOM y aplique la funcion navigator
window.addEventListener('hashchange', navigator, false);  //se agrega un event listener para cada vez que se cambie el hash se aplique la funcion navigator.

//esta funcion va a determinar que vista mostrar segun el hash. Según como empiece el hash (string) se va hacer la validación.
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


    //con esta linea se consigue que el scroll de estas secciones simepre empiece en la parte mas alta.
    categoriesPreviewList.scrollTop = 0;
    genericListSection.scrollTop = 0;
}

// estas son las funciones segun la pagina. Estas van a determinar que mostrar y ejecutar en cada una de ellas.

function trendsPage(){
    console.log('Trends!!!');

    //se agregan o remueven clases a los siguientes elementos para mostrar la pagina correspondiente
    body.classList.remove('body--movie-detail');

    header.classList.remove('header--movie-detail');
    headerArrow.classList.remove('inactive');
    headerArrow.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerTitleCategoryView.classList.remove('inactive');
    searchForm.classList.add('inactive');

    main.classList.remove('main--movie-detail');
    trendingSection.classList.add('inactive');
    categoriesSection.classList.add('inactive');
    genericListSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    footer.classList.remove('inactive');
}

function searchPage(){
    console.log('Search!!!');

    //se agregan o remueven clases a los siguientes elementos para mostrar la pagina correspondiente
    body.classList.remove('body--movie-detail');

    header.classList.remove('header--movie-detail');
    headerArrow.classList.remove('inactive');
    headerArrow.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerTitleCategoryView.classList.add('inactive');
    searchForm.classList.remove('inactive');

    main.classList.remove('main--movie-detail');
    trendingSection.classList.add('inactive');
    categoriesSection.classList.add('inactive');
    genericListSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    footer.classList.remove('inactive');

    //se saca la informacion del query del hash para poder hacer el llamado a la API
    const [ _ , query] = location.hash.split('=');

    getMovieBySearch(query);  //se ejecuta esta función pasandole el query del usuario.
}

function movieDetailsPage(){
    console.log('MovieDetails!!!');

    //se agregan o remueven clases a los siguientes elementos para mostrar la pagina correspondiente
    body.classList.add('body--movie-detail');

    header.classList.add('header--movie-detail');
    headerArrow.classList.remove('inactive');
    headerArrow.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerTitleCategoryView.classList.add('inactive');
    searchForm.classList.add('inactive');

    main.classList.add('main--movie-detail');
    trendingSection.classList.add('inactive');
    categoriesSection.classList.add('inactive');
    genericListSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    footer.classList.add('inactive');
}

function categoriesPage(){
    console.log('Categories!!!');

    //se agregan o remueven clases a los siguientes elementos para mostrar la pagina correspondiente
    body.classList.remove('body--movie-detail');

    header.classList.remove('header--movie-detail');
    headerArrow.classList.remove('inactive');
    headerArrow.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerTitleCategoryView.classList.remove('inactive');
    searchForm.classList.add('inactive');

    main.classList.remove('main--movie-detail');
    trendingSection.classList.add('inactive');
    categoriesSection.classList.add('inactive');
    genericListSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    footer.classList.remove('inactive');

    //se saca la informacion del id y el nombre de la categoria del hash para poder hacer el llamado a la API
    const [ _ , categoryInfo] = location.hash.split('=');
    const [ categoryId , urlName] = categoryInfo.split('-');
    const categoryName = decodeURI(urlName);  //con esta funcion se evita usar string codificados y se usa el string original. Cuando se usan caracteres raros para las URLs, como los espacios en blanco "", estos son codificados. Por lo que titulos con 2 palabras separados por un espacio en blanco seran codificados.

    headerTitleCategoryView.textContent = categoryName;  //se cambia el titulo de cada sección según la categoría.

    getMovieByCategory(categoryId); //se ejecuta esta funcion pasandole el id de la categoría.
}

function homePage(){
    console.log('Home!!!');

    //se agregan o remueven clases a los siguientes elementos para mostrar la pagina correspondiente
    body.classList.remove('body--movie-detail');

    header.classList.remove('header--movie-detail');
    headerArrow.classList.add('inactive');
    headerArrow.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerTitleCategoryView.classList.add('inactive');
    searchForm.classList.remove('inactive');

    main.classList.remove('main--movie-detail');
    trendingSection.classList.remove('inactive');
    categoriesSection.classList.remove('inactive');
    genericListSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    footer.classList.remove('inactive');

    getTrendingMovies(); //se llama esta función para mostrar las peliculas en tendencia. El archivo esta en main.js
    getCategoriesMovies();  //se llama esta función para mostrar las categorias de peliculas. El archivo esta en main.js
}