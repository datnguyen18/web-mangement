import React, { Component } from "react";

import { firebaseApp } from "../../config/Firebase";
import FileUploader from "react-firebase-file-uploader";
import { Row, Col, Card, CardHeader, CardBlock, Button } from "reactstrap";
import "./Recipes.css";
import { forEach } from "@firebase/util";

class Recipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: "",
      imageUrl: "",
      isSoftDrink: false,
      category: "",
      inputIngredient: ["input"],
      ingredientNames: [],
      ingredient: [{ name: "", quantity: "" }],
      drinksNotOnRecipes: [],
      recipe: []
    };
    this.itemRef = firebaseApp.database().ref("Warehouse");
    this.itemRefRecipes = firebaseApp.database().ref("Recipes");
    this.itemRefDrinks = firebaseApp.database().ref("Drink");
  }

  componentWillMount() {
    let array = [];
    this.itemRef.child("Ingredients").once("value", snapshot => {
      snapshot.forEach(e => {
        array.push({ name: e.key });
      });
      this.setState({
        ingredientNames: array
      });
    });
    let array2 = [];
    let array3 = [];

    // this.itemRefRecipes
    //   .on("child_added", snapshot => {
    //     if (snapshot.val().category != 'SoftDrink') {
    //       array2 = []
    //       array3 = []
    //       for (var i in snapshot.val().ingredient) {
    //         var listIngre = snapshot.val().ingredient[i]
    //         for (var j in listIngre) {
    //           // console.log(listIngre[j])
    //           array2.push({
    //             name: j,
    //             quantity: listIngre[j]
    //           })
    //         }

    //       }
    //       array3.push({
    //         name: snapshot.key,
    //         ingredients: array2
    //       })
    //       this.setState({
    //         recipe: this.state.recipe.concat(array3)
    //       })
    //     }

    //   })
    this.itemRefRecipes.on("value", snapshot => {
      array3 = [];
      snapshot.forEach(e => {
        array2 = [];
        var ingredient = e.val().ingredient;
        ingredient.forEach(i => {
          for (var key in i) {
            array2.push({
              name: key,
              quantity: i[key]
            });
          }
        });
        array3.push({
          name: e.key,
          ingredients: array2
        });
      });
      this.setState({
        recipe: array3
      });
    });
    let drinkNames = []
    this.itemRefDrinks.once("value", snapshot => {
      snapshot.forEach(e => {
        drinkNames.push(e.key)
      })
     
      this.itemRefRecipes.on("value", snapshot => {
        let drinksNotAvailableOnRecipes = []
        drinkNames.forEach(e => {
          if(!snapshot.hasChild(e)){
            drinksNotAvailableOnRecipes.push(e)
          }
        })
        this.setState({
          drinksNotOnRecipes: drinksNotAvailableOnRecipes
        })
      })
    })
  }
  handleUploadError = error => {
    alert(error);
  };
  handleUploadDrink = () => {
    let array = [];
    this.state.ingredient.forEach(e => {
      array.push({ [e.name]: e.quantity });
    });
    this.itemRefRecipes.child(this.state.name).set({
      ingredient: array
    });
    
  };
  handleChange(selectorFiles) {
    this.state.fileImage = selectorFiles[0];
  }

  handleSelect = event => {
    this.setState({
      inputIngredient: ["input"]
    });
    if (event.target.value === "SoftDrink") {
      this.setState({
        isSoftDrink: true
      });
    } else {
      this.setState({
        isSoftDrink: false,
        category: event.target.value
      });
    }
  };

  addInput = () => {
    this.setState({
      inputIngredient: this.state.inputIngredient.concat(["a"]),
      ingredient: this.state.ingredient.concat([{ name: "", quantity: "" }])
    });
  };
  handleChangeSelect = (e, index) => {
    this.state.ingredient[index].name = e.target.value;
  };

  handleChangeInput = (e, index) => {
    this.state.ingredient[index].quantity = e.target.value;
  };

  render() {
    console.log("aaaa",this.state.drinksNotOnRecipes);
    let ingredients = null;
    if (!this.state.isSoftDrink) {
      ingredients = (
        <div className="form-group row">
          <label for="inputPassword" class="col-sm-2 col-form-label">
            Add Ingredient
          </label>
          <div className="col-sm-10">
            {this.state.inputIngredient.map((input, index) => {
              return (
                <div className="group-add-ingredient form-row">
                  <div className="col-sm-5">
                    <select
                      className="form-control"
                      onChange={e => this.handleChangeSelect(e, index)}
                    >
                      <option value="select" selected>
                        Select
                      </option>
                      {this.state.ingredientNames.map((e, i) => {
                        return <option value={e.name}>{e.name}</option>;
                      })}
                    </select>
                  </div>

                  <div className="col-sm-5">
                    <input
                      onChange={e => this.handleChangeInput(e, index)}
                      type="text"
                      class="form-control"
                    />
                  </div>
                  <div className="col-sm-2">
                    <Button onClick={this.addInput} color="primary" id="add">
                      +
                    </Button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="container col-sm-6">
          <form>
            <div class="form-group row">
              <label for="staticEmail" class="col-sm-2 col-form-label">
                Name
              </label>
              <div class="col-sm-10">
                {/* <input
                  onChange={e => {
                    this.setState({ name: e.target.value });
                  }}
                  type="text"
                  class="form-control"
                /> */}
                <select className="form-control" onChange={e => {this.setState({name:e.target.value})}}>
                  {this.state.drinksNotOnRecipes.map((e,i) => {
                    return <option value={e}>{e}</option>
                  })}
                </select>
              </div>
            </div>
            {ingredients}
            <div class="button-add col-sm-12 text-center">
              <Button color="primary" onClick={this.handleUploadDrink}>
                Add Recipes
              </Button>
            </div>
          </form>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Recipe</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {this.state.recipe.map((item, index) => {
              return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>
                    {item.ingredients.map(item => {
                      return (
                        <p>
                          {item.name}: {item.quantity}{" "}
                        </p>
                      );
                    })}
                  </td>
                  <td />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Recipes;
