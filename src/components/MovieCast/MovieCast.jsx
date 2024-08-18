import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieCredits } from '../../services/api';

const MovieCast = () => {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchMovieCredits = async () => {
      if (!movieId) {
        return;
      }

      try {
        const credits = await getMovieCredits(movieId);
        setCast(credits);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchMovieCredits();
  }, [movieId]);

  return (
    <div>
      <ul>
        {cast.map(actor => (
          <li key={actor.id}>
            <p>
              {actor.name} as {actor.character}
            </p>
            <img
              src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
              alt={actor.name}
              width="100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieCast;
