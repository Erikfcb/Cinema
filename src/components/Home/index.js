import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import "./Home.css";
import Board from "../Board";
import Categories from "../Categories";

class Home extends Component {
  componentDidMount() {
    // Get list of all genres form api, in order to be able to creates the categories sidebar
    this.props.getGenres();
  }

  render() {
    return (
      <div className="home">
        <Categories />
        <Board />
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(Home);
