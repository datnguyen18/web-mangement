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
            ingredientNames: [],
            ingredient: [{ name: '', quantity: '' }]
        }
        this.itemRef = firebaseApp.database().ref("Warehouse");
    }

    componentWillMount() {
        let array = []
        this.itemRef
            .child("Ingredients")
            .once("value", snapshot => {
                snapshot.forEach(e => {
                    array.push({name: e.key})
                })
                this.setState({
                    ingredientNames: array
                })
            })
    }

    handleSelect = (event) => {
        this.setState({
            inputIngredient: ['input']
        })
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
    addInput = () => {
        this.setState({
            inputIngredient: this.state.inputIngredient.concat(['a']),
            ingredient: this.state.ingredient.concat([{name:'', quantity:''}])
        })
    }
    handleChangeSelect = (e, index) => {
        this.state.ingredient[index].name = e.target.value
    }

    handleChangeInput = (e, index) => {
        this.state.ingredient[index].quantity = e.target.value
    }
    render() {
        console.log(this.state.ingredient)
        let ingredients = null
        if (!this.state.isSoftDrink) {
           
            ingredients = (
                <div className="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">Add Ingredient</label>
                    <div className="col-sm-10">
                        {this.state.inputIngredient.map((input, index) => {
                            return (
                                <div className="form-row">
                                    <div className="col-sm-6">
                                        <select className="form-control" onChange={(e) => this.handleChangeSelect(e, index)}>
                                            {this.state.ingredientNames.map((e, i) => {
                                               return <option value={e.name}>{e.name}</option>
                                            })}
                                        </select>
                                    </div>

                                    <div className="col-sm-6">
                                        <input onChange={(e) => this.handleChangeInput(e,index)} type="text" class="form-control" />
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