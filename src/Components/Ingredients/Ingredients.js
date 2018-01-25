import React, { Component } from 'react';
import { firebaseApp } from '../../config/Firebase';

class Ingredients extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            quantity: "",
            arrayItems: []
        }
        this.itemRef = firebaseApp.database().ref("Warehouse");
    }

    addIngredient = () => {
        if (this.state.name == "" || this.state.quantity == "") {
            alert("Please input name & quantity!!")
        } else {
            this.itemRef.child("Ingredients")
                .child(this.state.name)
                .set({
                    quantity: this.state.quantity
                })
        }

    }
    addQuantity = () => {
        if (this.state.name == "" || this.state.quantity == "") {
            alert("Please input name & quantity!!")
        } else {
            this.itemRef.child("Ingredients")
            .child(this.state.name)
            .once("value", snapshot => {
                console.log(snapshot.val()["quantity"])
                this.itemRef.child("Ingredients")
                .child(this.state.name)
                .set({
                    quantity: this.state.quantity + snapshot.val()["quantity"]
                })
            })
           
        }
    }

    handleClick = (item) => {
        this.setState({
            name: item.name,
            quantity: item.quantity
        })
    }

    componentWillMount() {
        this.itemRef
            .child("Ingredients")
            .on("value", snapshot => {
                let array = []
                snapshot.forEach(e => {
                    array.push({
                        name: e.key,
                        quantity: e.val()["quantity"]
                    })
                })
                this.setState({
                    arrayItems: array
                })
            })
    }

    render() {
        return (
            <div className="container">
                <form>
                    <div class="form-group row">
                        <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
                        <div class="col-sm-10">
                            <input value={this.state.name} onChange={e => this.setState({ name: e.target.value })} type="text" class="form-control" id="inputPassword" placeholder="Name" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="inputPassword" class="col-sm-2 col-form-label">Quantity</label>
                        <div class="col-sm-10">
                            <input value={this.state.quantity} onChange={e => this.setState({ quantity: e.target.value })} type="number" class="form-control" placeholder="Quantity" />
                        </div>
                    </div>
                    <div class="row">
                        <button onClick={this.addIngredient} type="button" class="btn btn-danger">Add Ingredient</button>
                        <button onClick={this.addIngredient} type="button" class="btn btn-danger">Add Ingredient</button>
                        <button onClick={this.addQuantity} type="button" class="btn btn-danger">Add Quantity</button>
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
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Ingredients;