import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../../services/api';
import MovieList from '../../components/MovieList/MovieList';
import Loader from '../../components/Loader/Loader';
import styles from './MoviesPage.module.css';

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const query = searchParams.get('query') || '';

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
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
        setError(
          `An error occurred while searching for movies: ${error.message}`,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ query });
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
          onChange={e => setSearchParams({ query: e.target.value })}
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
