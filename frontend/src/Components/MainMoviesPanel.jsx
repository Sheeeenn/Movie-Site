import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./MainMoviesPanel.css";
import FavoritesPanel from './FavoritesPanel';
import { useNavigate, Link } from 'react-router-dom';


axios.defaults.withCredentials = true;

const MainMoviesPanel = ({ movies, onWatch, onAddToFavorites }) => {
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const navigate = useNavigate();

    
    const searchMovie = async () => {
      try {
        const response = await axios.get('http://localhost/get_movies');
        if (response.data) {
          setResults(response.data);
        } else {
          setResults([]);
          setError('No results found.');
        }
        setError(null);
      } catch (err) {
        setError('Error fetching data. Please try again.');
        console.error(err);
      }
    };
  
    const handleAddToFavorites = (movie) => {
      setFavorites((prevFavorites) => [
        ...prevFavorites,
        { id: movie.movieId, title: movie.title, poster: `https://image.tmdb.org/t/p/w500${movie.posterPath}` }
      ]);
    };

    const handleAddMovie = () => {
      navigate("/admin_search");
    }

    const onDeleteMovie = async (movieId) => {
      console.log('Attempting to delete movie:', movieId);
      try {
        const response = await axios.delete(`http://localhost/delete_movie?movieId=${movieId}`);
        console.log('Server response:', response.data);
        if (response.data.success) {
          setResults((prevResults) => prevResults.filter(movie => movie.movieId !== movieId));
        } else {
          setError('Error deleting movie. Please try again.');
        }
      } catch (err) {
        setError('Error deleting movie. Please try again.');
        console.error(err);
      }
    }
  
    useEffect(() => {
      searchMovie();
    }, []);
  
    useEffect(() => {
      if (results.length > 0) {
        console.log('Results:', results);
      }
    }, [results]);

  return (
    <div className="main-movies-panel">
      {/* Header Section */}
      <div className='head'>
        <h2 className="movies-header">Movies</h2>
        <button className='addMovieBtn' onClick={handleAddMovie}>Add Movie</button>
      </div>
      

      {/* Movie Cards */}
      <div className="movies-cards">
            {results.length > 0 ? (
                results.map((movie) => (
                    <div key={movie.movieId} className="movie-card">
                        <img
                            src={`${movie.posterPath || 'default-poster.jpg'}`}
                            alt={movie.title}
                            className="movie-poster1"
                        />
                        <div className="movie-details">
                            <h3 className="movie-title">{movie.title}</h3>
                            <p className="movie-description">{movie.overview}</p>
                            <button
                                className="watch-button"
                                onClick={() => onWatch(movie.movieId)}
                            >
                                Watch
                            </button>
                            <button
                                className="watch-button"
                                onClick={() => onAddToFavorites(movie)}
                            >
                                Add to Favorites
                            </button>
                            <button
                                className="watch-button"
                                onClick={() => onDeleteMovie(movie.movieId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No movies available.</p>
            )}
        </div>
        {/* Favorites Panel */}
      {/* <FavoritesPanel favorites={favorites} /> */}
    </div>
  );
};

export default MainMoviesPanel;