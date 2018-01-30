import React, { Component } from "react";

import { firebaseApp } from "../../config/Firebase";
import FileUploader from "react-firebase-file-uploader";
import { Row, Col, Card, CardHeader, CardBlock, Button } from "reactstrap";
import "./ManageItems.css";

class ManageItems extends Component {
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
      recipe: []
    };
    this.itemRef = firebaseApp.database().ref("Warehouse");
    this.itemRefDrink = firebaseApp.database().ref("Drink");
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
    let array2 = []
    let array3 = []

    this.itemRefDrink
      .on("child_added", snapshot => {
        if (snapshot.val().category != 'SoftDrink') {
          array2 = []
          array3 = []
          for (var i in snapshot.val().ingredient) {
            var listIngre = snapshot.val().ingredient[i]
            for (var j in listIngre) {
              // console.log(listIngre[j])
              array2.push({
                name: j,
                quantity: listIngre[j]
              })
            }

          }
          array3.push({
            name: snapshot.key,
            ingredients: array2
          })
          this.setState({
            recipe: this.state.recipe.concat(array3)
          })
        }

      })


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
  handleUploadError = error => {
    alert(error);
  };

  handleUploadSuccess = filename => {
    firebaseApp
      .storage()
      .ref("img")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ imageUrl: url }));
  };
  uploadFile = async file => {
    return new Promise((resolve, reject) => {
      firebaseApp
        .storage()
        .ref("img")
        .child(file.name)
        .put(file)
        .then(async function (result) {
          await firebaseApp
            .storage()
            .ref("img")
            .child(file.name)
            .getDownloadURL()
            .then(url => resolve(url));
        });
    });
  };
  handleUploadDrink = async () => {
    let array = [];
    var imgUrl = await this.uploadFile(this.state.fileImage);
    this.itemRefDrink.child(this.state.name).set({
      price: this.state.price,
      category: this.state.category,
      imageUrl: imgUrl
    });
  };
  handleChange(selectorFiles) {
    this.state.fileImage = selectorFiles[0];
  }
  render() {
    console.log(this.state.recipe);
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
                <input
                  onChange={e => {
                    this.setState({ name: e.target.value });
                  }}
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-2 col-form-label">
                Price
            </label>
              <div class="col-sm-10">
                <input
                  onChange={e => {
                    this.setState({ price: e.target.value });
                  }}
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-2 col-form-label">
                Image
            </label>
              <div class="col-sm-10">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => this.handleChange(e.target.files)}
                  />
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-2 col-form-label">
                Category
            </label>
              <select style={{ marginLeft: 15 }} onChange={this.handleSelect}>
                <option value="Coffee">Coffee</option>
                <option value="Itanlian Soda">Italian Soda</option>
                <option value="Smoothies">Smoothies</option>
                <option value="SoftDrink">Soft Drink</option>
              </select>
            </div>
            {ingredients}
            <div class="button-add col-sm-12 text-center">
              <Button color="primary" onClick={this.handleUploadDrink}>
                Add Drink
            </Button>
            </div>
          </form>
        </div>
        <table className="table">
          <thead >
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
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
                        <p>{item.name}: {item.quantity} </p>
                      )
                    })}
                  </td>
                  <td>
                    
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    );
  }
}

export default ManageItems;
