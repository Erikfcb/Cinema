import { SET_MODE, SET_POPUP_DISPLAY } from "../actions/types";

const initialState = {
  mode: "details",
  displayPopup: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MODE: {
      return { ...state, mode: action.payload };
    }
    case SET_POPUP_DISPLAY: {
      return { ...state, displayPopup: action.payload };
    }
    default:
      return state;
  }
};
