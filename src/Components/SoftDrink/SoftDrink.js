import React, { Component } from "react";
import { firebaseApp } from "../../config/Firebase";
import { Row, Col, Card, CardHeader, CardBlock, Button } from "reactstrap";

class SoftDrink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      quantity: "",
      arrayItems: []
    };
    this.itemRef = firebaseApp.database().ref("Warehouse");
  }

  addSoftDrink = () => {
    if (this.state.name === "" || this.state.quantity === "") {
      alert("Please input name & quantity!!");
    } else {
      this.itemRef
        .child("SoftDrink")
        .child(this.state.name)
        .set({
          quantity: this.state.quantity
        });
    }
  };
  addQuantity = () => {
    if (this.state.name === "" || this.state.quantity === "") {
      alert("Please input name & quantity!!");
    } else {
      this.itemRef.child("SoftDrink").once("value", snapshot1 => {
        if (snapshot1.hasChild(this.state.name)) {
          this.itemRef
            .child("SoftDrink")
            .child(this.state.name)
            .once("value", snapshot => {
              this.itemRef
                .child("SoftDrink")
                .child(this.state.name)
                .set({
                  quantity:
                    parseInt(this.state.quantity) +
                    parseInt(snapshot.val()["quantity"])
                });
            });
        } else {
          alert("This drink does not exist on database");
        }
      });
    }
  };

  handleClick = item => {
    this.setState({
      name: item.name,
      quantity: item.quantity
    });
  };

  componentWillMount() {
    this.itemRef.child("SoftDrink").on("value", snapshot => {
      let array = [];
      snapshot.forEach(e => {
        array.push({
          name: e.key,
          quantity: e.val()["quantity"]
        });
      });
      this.setState({
        arrayItems: array
      });
    });
  }
  render() {
    return (
      <div className="container">
        <form>
          <div class="form-group row">
            <label for="staticEmail" class="col-sm-2 col-form-label">
              Name
            </label>
            <div class="col-sm-10">
              <input
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
                type="text"
                class="form-control"
                id="inputPassword"
                placeholder="Name"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-2 col-form-label">
              Quantity
            </label>
            <div class="col-sm-10">
              <input
                value={this.state.quantity}
                onChange={e => this.setState({ quantity: e.target.value })}
                type="number"
                class="form-control"
                placeholder="Quantity"
              />
            </div>
          </div>
          <div class="button-add col-sm-12 text-center">
            <Button onClick={this.addSoftDrink} color="primary">
              Add SoftDrink
            </Button>
          </div>
        </form>

        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {this.state.arrayItems.map((item, index) => {
              return (
                <tr onClick={() => this.handleClick(item)}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SoftDrink;
