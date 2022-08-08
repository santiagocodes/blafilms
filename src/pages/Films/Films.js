import React, { useState, useEffect } from 'react'
import { fetchFilms } from '../../services/apiManager'
import { ReactComponent as ChevronLeft } from '../../assets/chevron-left.svg'
import { ReactComponent as ChevronRight } from '../../assets/chevron-right.svg'
import FilmItem from './FilmItem'

const Films = () => {
    const [searchResult, setSearchResult] = useState()
    const [pageParam, setPageParam] = useState(1)
    const [searchParam, setSearchParam] = useState('king')
    const [lastPage, setLastPage] = useState(1)
    const limit = 10
  
    useEffect(() => {
      searchParam ? searchForFilms() : alert('Looks like you are missing a search term. Please add one before trying again.')
    }, [pageParam])

    const saveFilteredFilmsResponse = (filmsResponse) => {
      let newFilmsResponse = { ...filmsResponse }
      
      // Remove duplicate IDs
      let filteredSeachFilmsResponse = []
      newFilmsResponse.Search?.forEach(film => {
        const indexFound = filteredSeachFilmsResponse.findIndex(filteredFilm => filteredFilm.imdbID == film.imdbID)
        if (indexFound <= -1) filteredSeachFilmsResponse.push(film)
      })

      newFilmsResponse.Search = filteredSeachFilmsResponse

      setSearchResult(newFilmsResponse)
    }

    const saveLastPage = (totalResults) => {
      const lastPage = Math.ceil(totalResults / limit)
      setLastPage(lastPage)
    }

    const saveFilmsResponse = (filmsResponse) => {
      saveLastPage(filmsResponse.totalResults)
      setSearchResult(filmsResponse)
      saveFilteredFilmsResponse(filmsResponse)
    }
  
    const checkFilmsResponse = (filmsResponse) => {
      if (filmsResponse?.Response === 'True') {
        saveFilmsResponse(filmsResponse)
      } else {
        console.error(filmsResponse?.Error ? filmsResponse.Error : 'No response from server')
        alert(`Oops! No films found. You may want to try another search.`)
      }
    }
  
    const searchForFilms = async () => {
      try {
        const filmsResponse = await fetchFilms(pageParam, searchParam)
        checkFilmsResponse(filmsResponse)
      } catch (error) {
        console.error(error)
      }
    }
  
    const handleFetchResults = () => {  
      pageParam === 1 ? searchForFilms() : setPageParam(1)
    }
  
    const handleOnEnterFetchSearch = (e) => {
      if (e.key === "Enter") handleFetchResults()
    }
  
    const handleOnChangeSearchParam = (value) => {
      setSearchParam(value)
    }
  
    const handleOnChangeDecreasePageParam = () => {
      if (pageParam > 1) setPageParam(prevState => prevState - 1) 
    }
  
    const handleOnChangeIncreasePageParam = () => {
      if (pageParam < lastPage) setPageParam(prevState => prevState + 1) 
    }

    return (
        <>
            <div className="search">
                <input 
                type="text" 
                placeholder="Search..." 
                value={searchParam}
                onChange={(e) => handleOnChangeSearchParam(e.target.value)}
                onKeyPress={(e) => handleOnEnterFetchSearch(e)}
                />
                <button onClick={() => handleFetchResults(searchParam)}>Search</button>
            </div>
            {!searchResult ? (
                <p>No results</p>
            ) : (
                <div className="search-results">
                  <div className={`chevron ${pageParam === 1 ? 'disabled' : ''}`}>
                      <ChevronLeft onClick={handleOnChangeDecreasePageParam}/>
                  </div>
                  <div className="search-results-list">
                      {searchResult?.Search?.length > 0 && searchResult.Search?.map(film => (
                        <FilmItem film= {film} />
                      ))}
                  </div>
                  <div className={`chevron ${pageParam >= lastPage ? 'disabled' : ''}`}>
                      <ChevronRight onClick={handleOnChangeIncreasePageParam}/>
                  </div>
                </div>
            )}
        </>
    )
}

export default Films