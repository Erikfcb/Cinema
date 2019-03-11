import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import "./Categories.css";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "popular"
    };
    this.createCategoriesList = this.createCategoriesList.bind(this);
  }

  // In order to show popular movies as default when entering to the page
  componentDidMount() {
    // Get popular movies
    this.props.getPopular();
  }

  // Creates the list of categories
  createCategoriesList() {
    const {
      genres,
      getByGenre,
      getPopular,
      getTopRated,
      setCategory,
      category
    } = this.props;

    // Creates category divs from genres list
    const genresCat = genres
      ? genres.map(genre => {
          const chosen =
            category === genre.name ? "category chosenCategory" : "category";

          return (
            <div
              key={genre.id}
              className={chosen}
              onClick={() => {
                this.props.setPopupDisplay(false);
                getByGenre(genre.id);
                setCategory(genre.name);
              }}
            >
              {genre.name}
            </div>
          );
        })
      : [];

    let popularCategoryClass = "category";
    let topRatedCategoryClass = "category";

    if (category === "Popular")
      popularCategoryClass = "category chosenCategory";
    if (category === "Top Rated")
      topRatedCategoryClass = "category chosenCategory";

    // Creates 'popular' and 'top rated' category divs separately because they are not included in genres list
    const categories = [
      <div
        key={1}
        className={popularCategoryClass}
        onClick={() => {
          this.props.setPopupDisplay(false);
          getPopular();
          setCategory("Popular");
        }}
      >
        Popular
      </div>,
      <div
        key={2}
        className={topRatedCategoryClass}
        onClick={() => {
          this.props.setPopupDisplay(false);
          getTopRated();
          setCategory("Top Rated");
        }}
      >
        Top Rated
      </div>,
      ...genresCat
    ];

    return categories;
  }

  render() {
    return <div className="categories">{this.createCategoriesList()}</div>;
  }
}

function mapStateToProps({ genres, category }) {
  return { genres: genres.genres, category: category.category };
}

export default connect(
  mapStateToProps,
  actions
)(Categories);
