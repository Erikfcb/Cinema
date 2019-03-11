import { combineReducers } from "redux";
import category from "./category";
import movies from "./movies";
import popup from "./popup";
import genres from "./genres";

export default combineReducers({
  category,
  movies,
  popup,
  genres
});
