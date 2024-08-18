import { useState } from 'react';
import { searchMovies } from '../../services/api';
import MovieList from '../../components/MovieList/MovieList';
import Loader from '../../components/Loader/Loader';
import styles from './MoviesPage.module.css';

const MoviesPage = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNoResults(false);

    try {
      const searchResults = await searchMovies(query);
      if (searchResults.length === 0) {
        setNoResults(true);
      }
      setMovies(searchResults);
    } catch (error) {
      setError('An error occurred while searching for movies.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Search Movies</h1>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter movie name"
        />
        <button className={styles.searchButton} type="submit">
          Search
        </button>
      </form>

      {isLoading && <Loader />}

      {error && !isLoading && <p className={styles.error}>{error}</p>}

      {!isLoading && !error && noResults && (
        <p className={styles.noResults}>No movies found for your query.</p>
      )}

      {!isLoading && !error && movies.length > 0 && (
        <MovieList movies={movies} />
      )}
    </div>
  );
};

export default MoviesPage;
