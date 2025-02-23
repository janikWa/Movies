import React from "react"
import Search from "./components/Search.jsx"
import Spinner from "./components/Spinner.jsx"
import { useState } from "react";
import { useEffect } from "react";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { useRef } from "react";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";
import Pagination from "./components/Pagination.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3"; 

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 

const API_OPTIONS = {
    method: "GET", 
    headers: {
        accept: "application/json", 
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(""); 
    const [movieList, setMovieList] = useState([]); 
    const [isLoading, setIsLoading] = useState(false); 
    const [debouncedSearchTerm, setDebouncedSeatchTerm] = useState(""); 
    const [trendingMovies, setTrendingMovies] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1); 

    useDebounce(() => setDebouncedSeatchTerm(searchTerm), 500, [searchTerm]); 

    const scrollPosition = useRef(0); 

    const fetchMovies = async (query="", page=1) => {

        scrollPosition.current = window.scrollY; 
        setIsLoading(true); 
        setErrorMessage(""); 

        try{
            const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`; 

            const response = await fetch(endpoint, API_OPTIONS); 

            if(!response.ok){
                throw new Error("Failed to fetch movies!"); 
            }

            const data = await response.json(); 

            if(data.Response == "False") {
                setErrorMessage(data.Error || "Failes to fetch movies"); 
                setMovieList([]); 
                return; 
            }

            setMovieList(data.results || []); 
            
            if(query && data.results.length > 0 ){
                await updateSearchCount(query, data.results[0]); 
            }

        } catch (error) {
            console.error(`Error fetching movies: ${error.message}`)
            setErrorMessage("Error fetching movies. Please try again later."); 

        } finally {
            setIsLoading(false); 
        }
    }; 

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies(); 
            setTrendingMovies(movies); 
        } catch (error){
            console.log(`Error fetching trending movies: ${error}`); 
        }
    } 

    useEffect(() => {
        if (!isLoading) {
            window.scrollTo(0, scrollPosition.current);
        }
    }, [movieList, isLoading]);

    useEffect(()=> {
        fetchMovies(debouncedSearchTerm); 
    }, [debouncedSearchTerm]); 

    useEffect(() =>{
        loadTrendingMovies(); 
    }, []);  


    return(
        <main>
            <div className="pattern" />
            <div className="wrapper"> 
                <header>
                    <img src="./hero.png" alt="Hero Banner"/>
                <h1> Find <span className="text-gradient">Movies</span>  You'll Enjoy Without the Hassle</h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                            <li key={movie.$id}>
                                <p>{index +1}</p>
                                <img src={movie.poster_url} alt={movie.title}/>
                            </li>))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">

                    <h2> All Movies</h2>
                    
                    {isLoading ? (
                        <Spinner />
                    ): errorMessage ? (
                        <p className="text-red-500"> {errorMessage}</p>
                    ): (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )
                    }
                </section>

                <section className="pagination">
                    <Pagination />
                </section>
            </div>
        </main>
    )
}

export default App