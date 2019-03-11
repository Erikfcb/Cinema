import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import "./Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      formDisplay: false
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.changeFormDisplay = this.changeFormDisplay.bind(this);
    this.setFocus = this.setFocus.bind(this);
  }

  // When submiting a keyword in the search form,
  // This function calls the api and put results in the 'movies' property in the store.
  onFormSubmit(e) {
    e.preventDefault();
    this.props.search(this.state.keyword);
    this.props.setCategory('"' + this.state.keyword + '"');
  }

  // Show or hide search
  changeFormDisplay(bool) {
    this.setState({ formDisplay: bool });
  }

  // When focus out of the search closes
  setFocus() {
    this.nameInput.focus();
  }

  render() {
    const formDisplay = this.state.formDisplay ? "showInput" : "hideInput";
    const iconClass = this.state.formDisplay
      ? "material-icons searchIcon"
      : "material-icons searchIcon goRight";
    return (
      <div className="header">
        <div
          className="logo"
          onClick={() => {
            this.props.getPopular();
            this.props.setCategory("Popular");
          }}
        >
          Cinema
        </div>
        <div className="search">
          <i
            className={iconClass}
            onClick={() => {
              if (this.state.keyword !== "")
                this.props.search(this.state.keyword);
              this.changeFormDisplay(true);
              this.setFocus();
            }}
          >
            search
          </i>
          <form onSubmit={e => this.onFormSubmit(e)}>
            <input
              ref={input => {
                this.nameInput = input;
              }}
              type="text"
              placeholder="Search"
              className={formDisplay}
              onChange={e => this.setState({ keyword: e.target.value })}
              onBlur={() => {
                if (this.state.formDisplay === true)
                  setTimeout(() => {
                    this.changeFormDisplay(false);
                  }, 200);
              }}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(Navbar);
