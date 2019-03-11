import React, { Component } from "react";
import { connect } from "react-redux";
import MovieCard from "../MovieCard";
import Popup from "../Popup";
import * as actions from "../../actions";
import "./Board.css";

class Board extends Component {
  constructor(props) {
    super(props);
    this.createList = this.createList.bind(this);
    this.fetchMovies = this.fetchMovies.bind(this);
    this.openAddPopup = this.openAddPopup.bind(this);
  }

  // Get movies to show on board
  componentDidMount() {
    this.fetchMovies();
  }

  openAddPopup() {
    if (this.props.displayPopup === false) {
      this.props.setPopupMode("add");
      this.props.setPopupDisplay(true);
    }
  }

  // Creates the movies list to display on board
  createList(movies) {
    const list = [];
    for (let key in movies) {
      list.push(<MovieCard movie={movies[key]} key={key} />);
    }
    return list;
  }

  // Gets genre name and returns its ID
  findGenreId(category) {
    this.props.genres.forEach(element => {
      if (element.name === category) return element.id;
    });
  }

  // Get movies by categories
  fetchMovies() {
    const { category } = this.props;
    if (category !== "Popular" && category !== "Top Rated") {
      this.props.getByGenre(this.findGenreId(category));
    } else if (category === "Popular") {
      this.props.getPopular();
    } else {
      this.props.getTopRated();
    }
  }

  render() {
    const movies = this.props.movies.movies
      ? this.createList(this.props.movies.movies)
      : [];
    return (
      <div className="boardWrap">
        <div className="boardTitle">{this.props.category}</div>
        <div className="board" key={"998"}>
          {movies}
        </div>
        <Popup movie={this.props.displayMovie} />
        <i
          className="material-icons addButton"
          onClick={() => this.openAddPopup()}
        >
          add
        </i>
      </div>
    );
  }
}

function mapStateToProps({ movies, category, genres, popup }) {
  return {
    movies,
    category: category.category,
    displayMovie: movies.displayMovie,
    displayPopup: popup.displayPopup,
    genres: genres.genres
  };
}

export default connect(
  mapStateToProps,
  actions
)(Board);
