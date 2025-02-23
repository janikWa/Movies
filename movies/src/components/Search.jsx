import React from "react";
import { X } from "lucide-react"; // Make sure you installed `lucide-react`

const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search" />

                <input
                    type="text"
                    placeholder="Search through thousands of movies"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />

                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2 text-gray-400 hover:text-gray-200 transition"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Search;
