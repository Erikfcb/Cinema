import { SET_GENRES_LIST } from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case SET_GENRES_LIST: {
      return { ...state, genres: action.payload.genres };
    }
    default:
      return state;
  }
};
