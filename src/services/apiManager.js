// refactor later by installing and using axios library

export const fetchFilms = (pageParam, searchParam) => {
    return fetch(`http://www.omdbapi.com/?apikey=a461e386&page=${pageParam}&s=${searchParam}`)
        .then(response => response.json())  
        .catch(err => console.error(err))
}