import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import "./MovieCard.css";

class MovieCard extends Component {
  render() {
    const backgroundImage =
      this.props.movie.poster_path === null ||
      this.props.movie.poster_path === undefined
        ? "url('https://images.unsplash.com/photo-1458053688450-eef5d21d43b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2104&q=80')"
        : "url('https://image.tmdb.org/t/p/original/" +
          this.props.movie.poster_path +
          "')";

    return (
      <div
        className="movieCard"
        style={{
          backgroundImage
        }}
      >
        <button
          className="getMovieBtn"
          onClick={() => {
            this.props.setMovie(this.props.movie.id);
            this.props.setPopupDisplay(true);
          }}
        />
        <div className="movieTitle">{this.props.movie.title}</div>
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(MovieCard);
