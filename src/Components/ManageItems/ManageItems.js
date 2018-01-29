import React, { Component } from "react";

import { firebaseApp } from "../../config/Firebase";
import FileUploader from "react-firebase-file-uploader";

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
      ingredient: [{ name: "", quantity: "" }]
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
  uploadFile = async (file) => {
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
  }
  handleUploadDrink = async () => {
    let array = [];
    var imgUrl = await this.uploadFile(this.state.fileImage);
    this.state.ingredient.forEach(e => {
      array.push({ [e.name]: e.quantity });
    });
    this.itemRefDrink.child(this.state.name).set({
      price: this.state.price,
      category: this.state.category,
      imageUrl: imgUrl,
      ingredient: array
    });
  };
  handleChange(selectorFiles) {
    this.state.fileImage = selectorFiles[0];
  }
  render() {
    return <h1> Load Item Board </h1>
  }
}

export default ManageItems;
