import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { firebaseApp } from '../../config/Firebase';

class ManageItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSoftDrink: false,
            category: "",
            inputIngredient: ['input'],
            ingredients:[]
        }
        this.itemRef = firebaseApp.database().ref("Warehouse");
    }

    componentWillMount() {
        let array= []
        this.itemRef
        .child("Ingredients")
        .once("value", snapshot => {
            snapshot.forEach(e => {
                array.push({name: e.key})
            })
            this.setState({
                ingredients: array
            })
        })
    }

    handleSelect = (event) => {
        if (event.target.value === "SoftDrink") {
            this.setState({
                isSoftDrink: true
            })
        } else {
            this.setState({
                isSoftDrink: false
            })
        }
    }
    addInput= () => {
        this.setState({
            inputIngredient: this.state.inputIngredient.concat(['a'])
        })
    }
    render() {
        console.log(this.state.ingredients)
        let ingredients = null
        if (!this.state.isSoftDrink) {
            ingredients = (
                <div className="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">Add Ingredient</label>
                    <div className="col-sm-10">
                        {this.state.inputIngredient.map(input => {
                            return(
                                <div className="form-row">
                                <div className="col-sm-6">
                                    <input placeholder="" id type="text" class="form-control" />
                                </div>

                                <div className="col-sm-6">
                                    <input type="text" class="form-control" />
                                </div>
                            </div>
                            )
                           
                        })}
                    </div>
                    <button onClick={this.addInput}
                        style={{ marginTop: 10, marginLeft: 10 }}
                        type="button"
                        class="btn btn-danger">
                        Add Ingredient
                    </button>
                </div>
            )
        }
        return (
            <div className="container col-sm-6">
                <form>
                    <div class="form-group row">
                        <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="inputPassword" class="col-sm-2 col-form-label">Price</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="inputPassword" class="col-sm-2 col-form-label">Image</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="inputPassword" class="col-sm-2 col-form-label">Category</label>
                        <select style={{ marginLeft: 15 }} onChange={this.handleSelect}>
                            <option value="Coffee">Coffee</option>
                            <option value="Itanlian Soda">Italian Soda</option>
                            <option value="Smoothies">Smoothies</option>
                            <option value="SoftDrink">Soft Drink</option>
                        </select>
                    </div>
                    {ingredients}
                    <button 
                        style={{ marginTop: 10 }}
                        type="button"
                        class="btn btn-danger">
                        Add Drink
                    </button>
                </form>
            </div>
        )
    }
}

export default ManageItems;