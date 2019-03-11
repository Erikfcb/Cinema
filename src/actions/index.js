import axios from "axios";
import {
  SET_MOVIES,
  SET_GENRES_LIST,
  DISPLAY_MOVIE,
  SET_CATEGORY,
  DELETE_MOVIE,
  EDIT_ADD_MOVIE,
  SET_MODE,
  SET_POPUP_DISPLAY
} from "../actions/types";
import { API_KEY } from "../keys";

const domain = "https://api.themoviedb.org/3";

// Fetch movie details
const getMovie = async id => {
  let movie = { id };
  const res = await axios.get(domain + "/movie/" + id + "?api_key=" + API_KEY);
  const title = res.data.original_title
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/[^a-zA-Z ]/g, "");

  if (title === "") movie.title = "Movie Title Not In English";
  else movie.title = title;

  movie.year = res.data.release_date.substring(0, 4);
  movie.runtime = res.data.runtime;
  movie.poster_path = res.data.poster_path;
  movie.genre = res.data.genres
    .map((genre, index, arr) => {
      return genre.name;
    })
    .join(" • ");

  const credits = await axios.get(
    domain + "/movie/" + id + "/credits?api_key=" + API_KEY
  );

  credits.data.crew.forEach(element => {
    if (element.job === "Director") movie.director = element.name;
  });

  return movie;
};

// Fetch popular movies
export const getPopular = () => async dispatch => {
  const res = await axios.get(domain + "/movie/popular?api_key=" + API_KEY);

  let movies = {};

  Promise.all(
    res.data.results.slice(0, 10).map(movie => getMovie(movie.id))
  ).then(function(values) {
    values.forEach(value => {
      movies[value.id] = value;
    });
    dispatch({
      type: SET_MOVIES,
      payload: movies
    });
  });
};

// Fetch top rated movies
export const getTopRated = () => async dispatch => {
  const res = await axios.get(domain + "/movie/top_rated?api_key=" + API_KEY);

  let movies = {};

  Promise.all(
    res.data.results.slice(0, 10).map(movie => getMovie(movie.id))
  ).then(function(values) {
    values.forEach(value => {
      movies[value.id] = value;
    });
    dispatch({
      type: SET_MOVIES,
      payload: movies
    });
  });
};

// Fetch movies by genre
export const getByGenre = id => async dispatch => {
  const res = await axios.get(
    domain +
      "/discover/movie?api_key=" +
      API_KEY +
      "&sort_by=popularity.desc&with_genres=" +
      id
  );

  let movies = {};

  Promise.all(
    res.data.results.slice(0, 10).map(movie => getMovie(movie.id))
  ).then(function(values) {
    values.forEach(value => {
      movies[value.id] = value;
    });
    dispatch({
      type: SET_MOVIES,
      payload: movies
    });
  });
};

// Fetch genres
export const getGenres = () => async dispatch => {
  const res = await axios.get(domain + "/genre/movie/list?api_key=" + API_KEY);
  dispatch({ type: SET_GENRES_LIST, payload: { genres: res.data.genres } });
};

// Set popup mode
export const setPopupMode = mode => dispatch => {
  dispatch({ type: SET_MODE, payload: mode });
};

// Show or hide popup
export const setPopupDisplay = display => dispatch => {
  dispatch({ type: SET_POPUP_DISPLAY, payload: display });
};

// Change category
export const setCategory = category => dispatch => {
  dispatch({ type: SET_CATEGORY, payload: category });
};

// Set movie to show in popup
export const setMovie = id => dispatch => {
  dispatch({ type: DISPLAY_MOVIE, payload: id });
};

export const deleteMovie = id => dispatch => {
  dispatch({ type: DELETE_MOVIE, payload: id });
};

// Edit/Add movie to the store
export const editAddMovie = newMovie => dispatch => {
  newMovie.title = newMovie.title
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/[^a-zA-Z ]/g, "");

  newMovie.genre = newMovie.genre.split(",").join(" • ");
  dispatch({ type: EDIT_ADD_MOVIE, payload: { [newMovie.id]: newMovie } });
};

// Search movie by keyword
export const search = keyword => async dispatch => {
  const res = await axios.get(
    domain + "/search/movie?api_key=" + API_KEY + "&query=" + keyword
  );

  let movies = {};

  Promise.all(
    res.data.results.slice(0, 5).map(movie => getMovie(movie.id))
  ).then(function(values) {
    values.forEach(value => {
      if (value.id) movies[value.id] = value;
    });
    dispatch({
      type: SET_MOVIES,
      payload: movies
    });
  });
};
