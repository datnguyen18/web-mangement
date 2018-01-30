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
      drink: []
    };
    this.itemRef = firebaseApp.database().ref("Warehouse");
    this.itemRefDrink = firebaseApp.database().ref("Drink");
  }

  componentWillMount() {
    this.itemRefDrink.on('value', snapshot =>{
      var array = [];
      snapshot.forEach(e =>{
        var val = e.val();
        array.push({
          name : e.key,
          category : val.category,
          imgUrl : val.imageUrl,
          price : val.price
        });
      });
      this.setState({
        drink : array
      });
    });
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
        .then(async function(result) {
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
            <div class="button-add col-sm-12 text-center">
              <Button color="primary" onClick={this.handleUploadDrink}>
                Add Drink
              </Button>
            </div>
          </form>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {this.state.drink.map((item, index) => {
              return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td><img src={item.imgUrl} id="img"></img></td>
                  <td>{item.category}</td>    
                  <td>{item.price}đ</td>           
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ManageItems;
