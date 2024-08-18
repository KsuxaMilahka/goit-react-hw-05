import { useEffect, useState } from 'react';
import {
  useParams,
  Link,
  Outlet,
  // useNavigate,
  useLocation,
} from 'react-router-dom';
import { getMovieDetails } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import styles from './MovieDetailsPage.module.css';

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isLoading) {
    return <Loader />;
  }

  const backLink = location.state?.from ?? '/movies';

  return (
    <div className={styles.container}>
      <Link className={styles.goBack} to={backLink}>
        Go back
      </Link>

      {movie && (
        <div className={styles.movieDetails}>
          <img
            className={styles.moviePoster}
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
          />
          <div className={styles.movieInfo}>
            <h2 className={styles.movieTitle}>
              {movie.title} ({movie.year})
            </h2>
            <p className={styles.movieScore}>User Score: {movie.score}%</p>
            <h3>Overview</h3>
            <p className={styles.movieOverview}>{movie.overview}</p>
          </div>
        </div>
      )}

      {movie && (
        <div className={styles.additionalInfo}>
          <h3>Additional information</h3>
          <ul>
            <li>
              <Link to="cast" state={{ from: location.pathname }}>
                Cast
              </Link>
            </li>
            <li>
              <Link to="reviews" state={{ from: location.pathname }}>
                Reviews
              </Link>
            </li>
          </ul>
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;
