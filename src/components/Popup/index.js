import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import "./Popup.css";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from "reactstrap";
import crypto from "crypto";

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      editModal: false,
      movieToEditAdd: {
        id: "",
        title: "",
        director: "",
        year: 0,
        runtime: 0,
        genre: ""
      },
      error: ""
    };

    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.createPopup = this.createPopup.bind(this);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.add = this.add.bind(this);
    this.titleExist = this.titleExist.bind(this);
  }

  // Show or hide 'delete' modal
  toggleDeleteModal() {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal
    }));
  }

  // Show or hide 'edit' modal
  toggleEditModal() {
    this.setState(prevState => ({
      editModal: !prevState.editModal
    }));
  }

  // Deletes movie by id
  delete(id) {
    this.props.setPopupDisplay(false);
    this.props.deleteMovie(id);
    this.setState({
      movieToEditAdd: {
        id: "",
        title: "",
        director: "",
        year: 0,
        runtime: 0,
        genre: "",
        poster_path: null
      }
    });
  }

  // Check if title already exists
  titleExist(title, id) {
    const { movies } = this.props;
    for (let key in movies)
      if (
        movies[key].title ===
          title
            .toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/[^a-zA-Z ]/g, "") &&
        id !== movies[key].id
      )
        return true;

    return false;
  }

  // Checks if details are valid and edit movie with new details
  edit() {
    const { movieToEditAdd } = this.state;
    if (
      movieToEditAdd.title === "" ||
      movieToEditAdd.director === "" ||
      movieToEditAdd.genre === "" ||
      movieToEditAdd.year === "" ||
      movieToEditAdd.runtime === ""
    )
      this.setState({ error: "Missing details." });
    else if (this.titleExist(movieToEditAdd.title, movieToEditAdd.id))
      this.setState({ error: "Title already exists." });
    else if (this.checkYear(movieToEditAdd.year) === false)
      this.setState({ error: "Invalid year." });
    else {
      this.props.editAddMovie(this.state.movieToEditAdd);
      this.setState({ error: "" });
      this.props.setPopupMode("details");
    }
  }

  // Check if year is valid
  checkYear(year) {
    if (year.length !== 4 || year > 2019 || year < 1800) return false;
    return true;
  }

  // Checks if details are valid and adds new movie to the redux store
  add() {
    const { movieToEditAdd } = this.state;
    if (
      movieToEditAdd.title === "" ||
      movieToEditAdd.director === "" ||
      movieToEditAdd.genre === "" ||
      movieToEditAdd.year === "" ||
      movieToEditAdd.runtime === ""
    )
      this.setState({ error: "Missing details." });
    else if (this.titleExist(movieToEditAdd.title, movieToEditAdd.id))
      this.setState({ error: "Title already exists." });
    else if (this.checkYear(movieToEditAdd.year) === false)
      this.setState({ error: "Invalid year." });
    else {
      const movie = {
        ...movieToEditAdd,
        id: crypto.randomBytes(5).toString("hex"),
        poster_path: null
      };
      this.setState({ error: "" });
      this.props.setPopupMode("details");
      this.props.editAddMovie(movie);
      this.props.setPopupDisplay(false);
    }
  }

  // Creates the popup depending on the popup 'mode' property in the redux store
  createPopup() {
    let movie = {
      id: "",
      title: "",
      director: "",
      runtime: "",
      date: 0,
      genre: ""
    };

    if (this.props.displayPopup === true) {
      const { movies, movieId } = this.props;
      for (let key in movies) {
        if (key === movieId.toString()) {
          movie = movies[key];
        }
      }
    }

    const display = this.props.displayPopup === true ? "show" : "hide";

    const popup =
      this.props.mode === "details" ? (
        <div className={"popup " + display}>
          <div
            className="poster"
            style={{
              backgroundImage:
                movie.poster_path === null
                  ? "url('https://images.unsplash.com/photo-1458053688450-eef5d21d43b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2104&q=80')"
                  : "url('https://image.tmdb.org/t/p/original/" +
                    movie.poster_path +
                    "')"
            }}
          />
          <div className="movieDetails">
            <div className="title">{movie.title}</div>
            <div className="movieGenre">{movie.genre}</div>
            <div className="movieId">
              <div className="detailLabel">Id: </div>
              {movie.id}.
            </div>
            <div className="movieRuntime">
              <div className="detailLabel">Runtime: </div>
              {movie.runtime} minutes.
            </div>
            <div className="movieDate">
              <div className="detailLabel">Year: </div>
              {movie.year}.
            </div>
            <div className="movieDirector">
              <div className="detailLabel">Director: </div>
              {movie.director}.
            </div>
            <Button
              color="danger"
              className="delete"
              onClick={this.toggleDeleteModal}
            >
              Delete
            </Button>
            <Modal
              isOpen={this.state.deleteModal}
              toggle={this.toggleDeleteModal}
              className={this.props.className}
            >
              <ModalBody>Are you sure you want to delete this movie?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => {
                    this.delete(movie.id);
                    this.toggleDeleteModal();
                  }}
                >
                  Yes
                </Button>{" "}
                <Button color="secondary" onClick={this.toggleDeleteModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
            <Button
              color="warning"
              className="edit"
              onClick={() => {
                this.props.setPopupMode("edit");
                this.setState({
                  movieToEditAdd: {
                    id: movie.id,
                    title: movie.title,
                    director: movie.director,
                    year: movie.year,
                    runtime: movie.runtime,
                    genre: movie.genre.replace(/ • /g, ","),
                    poster_path: movie.poster_path
                  }
                });
              }}
            >
              Edit
            </Button>
          </div>
          <i
            className="material-icons closeIcon"
            onClick={() => {
              this.props.setPopupDisplay(false);
              this.setState({
                movieToEditAdd: {
                  id: "",
                  title: "",
                  director: "",
                  year: 0,
                  runtime: 0,
                  genre: "",
                  poster_path: null
                }
              });
            }}
          >
            close
          </i>
        </div>
      ) : this.props.mode === "edit" ? (
        <div className={"popup " + display}>
          <i
            className="material-icons closeIcon"
            onClick={() => {
              this.props.setPopupDisplay(false);
              this.props.setPopupMode("details");
              this.setState({
                movieToEditAdd: {
                  id: "",
                  title: "",
                  director: "",
                  year: 0,
                  runtime: 0,
                  genre: "",
                  poster_path: null
                }
              });
            }}
          >
            close
          </i>
          <Form
            className="editForm"
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label className="label" for="year">Year: </Label>
                  <Input
                    type="number"
                    id="year"
                    onChange={e => {
                      {
                        const movieToEditAdd = {
                          ...this.state.movieToEditAdd,
                          year: e.target.value
                        };
                        this.setState({ movieToEditAdd });
                      }
                    }}
                    value={this.state.movieToEditAdd.year}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="label" for="runtime">Runtime: </Label>
                  <Input
                    type="number"
                    id="runtime"
                    onChange={e => {
                      {
                        const movieToEditAdd = {
                          ...this.state.movieToEditAdd,
                          runtime: e.target.value
                        };
                        this.setState({ movieToEditAdd });
                      }
                    }}
                    value={this.state.movieToEditAdd.runtime}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label className="label" for="genres">Genres: (seperated by comma)</Label>
              <Input
                type="text"
                id="genres"
                onChange={e => {
                  {
                    const movieToEditAdd = {
                      ...this.state.movieToEditAdd,
                      genre: e.target.value
                    };
                    this.setState({ movieToEditAdd });
                  }
                }}
                value={this.state.movieToEditAdd.genre}
              />
            </FormGroup>
            <FormGroup>
              <Label className="label" for="title">Title: </Label>
              <Input
                type="text"
                id="title"
                onChange={e => {
                  {
                    const movieToEditAdd = {
                      ...this.state.movieToEditAdd,
                      title: e.target.value
                    };
                    this.setState({ movieToEditAdd });
                  }
                }}
                value={this.state.movieToEditAdd.title}
              />
            </FormGroup>
            <FormGroup>
              <Label className="label" for="director">Director: </Label>
              <Input
                type="text"
                id="director"
                onChange={e => {
                  {
                    const movieToEditAdd = {
                      ...this.state.movieToEditAdd,
                      director: e.target.value
                    };
                    this.setState({ movieToEditAdd });
                  }
                }}
                value={this.state.movieToEditAdd.director}
              />
            </FormGroup>
            <div className="errorMessage">{this.state.error}</div>
            <Button
              onClick={this.toggleEditModal}
              color="primary"
              className="saveEditBtn"
            >
              Save
            </Button>
            <Button
              onClick={() => this.props.setPopupMode("details")}
              className="cancelEditBtn"
            >
              Cancel
            </Button>
            <Modal
              isOpen={this.state.editModal}
              toggle={this.toggleEditModal}
              className={this.props.className}
            >
              <ModalBody>Are you sure you want to edit this movie?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => {
                    this.edit();
                    this.toggleEditModal();
                  }}
                >
                  Yes
                </Button>{" "}
                <Button color="secondary" onClick={this.toggleEditModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Form>
        </div>
      ) : this.props.mode === "add" ? (
        <div className={"popup " + display}>
          <i
            className="material-icons closeIcon"
            onClick={() => {
              this.props.setPopupDisplay(false);
              this.props.setPopupMode("details");
            }}
          >
            close
          </i>
          <Form
            className="editForm"
            onSubmit={() => {
              this.add();
            }}
          >
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label className="label" for="year">Year: </Label>
                  <Input
                    type="number"
                    id="year"
                    onChange={e => {
                      {
                        const movieToEditAdd = {
                          ...this.state.movieToEditAdd,
                          year: e.target.value
                        };
                        this.setState({ movieToEditAdd });
                      }
                    }}
                    value={this.state.movieToEditAdd.year}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className="label" for="runtime">Runtime: </Label>
                  <Input
                    type="number"
                    id="runtime"
                    onChange={e => {
                      {
                        const movieToEditAdd = {
                          ...this.state.movieToEditAdd,
                          runtime: e.target.value
                        };
                        this.setState({ movieToEditAdd });
                      }
                    }}
                    value={this.state.movieToEditAdd.runtime}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label className="label" for="genres">Genres: (seperated by comma)</Label>
              <Input
                type="text"
                id="genres"
                onChange={e => {
                  {
                    const movieToEditAdd = {
                      ...this.state.movieToEditAdd,
                      genre: e.target.value
                    };
                    this.setState({ movieToEditAdd });
                  }
                }}
                value={this.state.movieToEditAdd.genre}
              />
            </FormGroup>
            <FormGroup>
              <Label className="label" for="title">Title: </Label>
              <Input
                type="text"
                id="title"
                onChange={e => {
                  {
                    const movieToEditAdd = {
                      ...this.state.movieToEditAdd,
                      title: e.target.value
                    };
                    this.setState({ movieToEditAdd });
                  }
                }}
                value={this.state.movieToEditAdd.title}
              />
            </FormGroup>

            <FormGroup>
              <Label className="label" for="director">Director: </Label>
              <Input
                type="text"
                id="director"
                onChange={e => {
                  {
                    const movieToEditAdd = {
                      ...this.state.movieToEditAdd,
                      director: e.target.value
                    };
                    this.setState({ movieToEditAdd });
                  }
                }}
                value={this.state.movieToEditAdd.director}
              />
            </FormGroup>
            <div className="errorMessage">{this.state.error}</div>
            <Button
            className="submitAddBtn"
              onClick={() => {
                this.add();
              }}
            >
              Submit
            </Button>
          </Form>
        </div>
      ) : (
        []
      );

    return popup;
  }

  render() {
    return this.createPopup();
  }
}

function mapStateToProps({ movies, popup }) {
  return {
    movieId: movies.movieId,
    movies: movies.movies,
    mode: popup.mode,
    displayPopup: popup.displayPopup
  };
}

export default connect(
  mapStateToProps,
  actions
)(Popup);
