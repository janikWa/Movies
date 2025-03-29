import React from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import { useState, useEffect, useRef } from "react";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const scrollPosition = useRef(0);

    const fetchMovies = async (query = "", page = 1) => {
        scrollPosition.current = window.scrollY;
        setIsLoading(true);
        setErrorMessage("");

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) throw new Error("Failed to fetch movies!");

            const data = await response.json();
            setMovieList(data.results || []);
            setTotalPages(data.total_pages);
        } catch (error) {
            setErrorMessage("Error fetching movies. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(debouncedSearchTerm, currentPage);
    }, [debouncedSearchTerm, currentPage]);

    useEffect(() => {
        getTrendingMovies().then(setTrendingMovies).catch(console.error);
    }, []);

    const changePage = (page) => {
        setCurrentPage(page);
        setPageGroup(Math.floor((page - 1) / 5)); // Update page group dynamically
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);

            if (nextPage % 5 === 1) {
                setPageGroup((prevGroup) => prevGroup + 1);
            }
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);

            if (prevPage % 5 === 0) {
                setPageGroup((prevGroup) => Math.max(0, prevGroup - 1));
            }
        }
    };

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    <h2>All Movies</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>

                {/* Pagination */}
                <div className="pagination">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all ease-in-out duration-200 disabled:bg-gray-500 cursor-not-allowed opacity-60"
                    >
                        Prev
                    </button>

                    {[...Array(5)].map((_, i) => {
                        const page = pageGroup * 5 + i + 1;
                        if (page > totalPages) return null;
                        return (
                        <button
                            key={page}
                            onClick={() => changePage(page)}
                            className={`px-4 py-2 rounded-lg font-semibold text-white ${
                            currentPage === page
                                ? "bg-light-200 hover:bg-light-200"
                                : "bg-gray-700 hover:bg-gray-600"
                            } transition-all ease-in-out duration-200`}
                        >
                            {page}
                        </button>
                        );
                    })}

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all ease-in-out duration-200 disabled:bg-gray-500 cursor-not-allowed opacity-60"
                    >
                        Next
                    </button>
                    </div>
            </div>
        </main>
    );
};

export default App;
