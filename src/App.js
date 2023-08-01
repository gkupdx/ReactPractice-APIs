import React, { useState, useEffect, useCallback } from "react";

import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch movies list on BUTTON CLICK
  const fetchMoviesHandler = useCallback(() => {
    // to let the user know that their requested data is on the way
    setIsLoading(true);
    // clear any previous errors we might have gotten
    setError(null);

    fetch("https://react-http-fd65a-default-rtdb.firebaseio.com/movies.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        return res.json();
      })
      .then((data) => {
        const loadedMovies = [];

        for (const key in data) {
          loadedMovies.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate
          });
        }

        setMovies(loadedMovies);

        // ** ONLY USED WITH THE "STAR WARS" API ** //
        // // transforming the received API data into a format we want
        // // by giving the desired key-value pairs different property names
        // // (e.g. "episode_id" => id)
        // const transformedData = data.results.map((movieData) => {
        //   return {
        //     id: movieData.episode_id,
        //     title: movieData.title,
        //     openingText: movieData.opening_crawl,
        //     releaseDate: movieData.release_date
        //   };
        // });
        // setMovies(transformedData);
      })
      .catch((error) => {
        setError(error.message);
      });

    setIsLoading(false);
  }, []);

  // useEffect() to fetch movies WHENEVER "fetchMoviesHandler" is changed
  // (i.e. every new evaluation because functions are always different objects)
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  // Add new movie on button click
  const addMovieHandler = (movie) => {
    fetch("https://react-http-fd65a-default-rtdb.firebaseio.com/movies.json", {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to POST new movie.");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error.message));
  };

  // Rendering body
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
