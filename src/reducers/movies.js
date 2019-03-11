import {
  SET_MOVIES,
  DISPLAY_MOVIE,
  DELETE_MOVIE,
  EDIT_ADD_MOVIE
} from "../actions/types";

const initialState = {
  movieId: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MOVIES: {
      return {
        ...state,
        movies: action.payload
      };
    }
    case DISPLAY_MOVIE: {
      return { ...state, movieId: action.payload };
    }
    case DELETE_MOVIE: {
      delete state.movies[action.payload];
      return { ...state };
    }
    case EDIT_ADD_MOVIE: {
      const newMovies = {
        ...state.movies,
        ...action.payload
      };
      return { ...state, movies: newMovies };
    }
    default:
      return state;
  }
};
