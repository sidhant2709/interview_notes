import withFetch from './HigherOrderComponents';

const MovieList = props => {
  const { movies } = props;
  return (
    <div className="movie-container">
      <h2>Movies List with HOC</h2>
      {
        <ul>
          {movies.map((movie, index) => (
            <li key={index}>
              <img src={movie.poster} alt={movie.title} />
              <span>{movie.title}</span>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default withFetch(MovieList);
