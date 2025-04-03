import React from "react";

const MovieDetailsCard = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content bg-dark-100 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto text-white relative">
        <button className="absolute top-2 right-2 bg-red-500 px-3 py-1 rounded-lg text-white" onClick={onClose}>
          Close
        </button>
        <h2 className="text-3xl font-bold">{movie.title}</h2>
        <p className="text-gray-400 text-sm">{movie.release_date} • {movie.status}</p>

        <div className="flex gap-4 mt-4">
          <img
            className="rounded-lg w-48 h-auto object-cover"
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="flex-1">
            <p className="text-gray-300">{movie.overview}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <p><strong>Runtime:</strong> {movie.runtime} min</p>
          <p><strong>Language:</strong> {movie.original_language.toUpperCase()}</p>
          <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
          <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
        </div>

        <div className="mt-6">
          <a
            href={movie.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-500 px-5 py-2 rounded-lg text-white hover:bg-purple-600"
          >
            Visit Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsCard;
