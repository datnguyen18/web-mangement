import React, { Component } from 'react';

import { firebaseApp } from '../../config/Firebase';
import FileUploader from 'react-firebase-file-uploader';

class ManageItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name:'',
            price:'',
            imageUrl:'',
            isSoftDrink: false,
            category: "",
            inputIngredient: ['input'],
            ingredientNames: [],
            ingredient: [{ name: '', quantity: '' }]
        }
        this.itemRef = firebaseApp.database().ref("Warehouse");
        this.itemRefDrink = firebaseApp.database().ref("Drink");
    }

    componentWillMount() {
        let array = []
        this.itemRef
            .child("Ingredients")
            .once("value", snapshot => {
                snapshot.forEach(e => {
                    array.push({ name: e.key })
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
                isSoftDrink: false,
                category: event.target.value
            })
        }
    }
    addInput = () => {
        this.setState({
            inputIngredient: this.state.inputIngredient.concat(['a']),
            ingredient: this.state.ingredient.concat([{ name: '', quantity: '' }])
        })
    }
    handleChangeSelect = (e, index) => {
        this.state.ingredient[index].name = e.target.value
    }

    handleChangeInput = (e, index) => {
        this.state.ingredient[index].quantity = e.target.value
    }
    handleUploadError= (error) => {
        alert(error)
    }

    handleUploadSuccess =(filename) => {
        firebaseApp
        .storage()
        .ref('img').child(filename).getDownloadURL().then(url => this.setState({avatarURL: url}));
    }

    handleUploadDrink = () => {
        let array = []
        this.state.ingredient.forEach(e => {
            array.push({[e.name]:e.quantity})
        })
        this.itemRefDrink
       .child(this.state.name)
       .set({
           price: this.state.price,
           category: this.state.category,
           imageUrl: this.state.imageUrl,
           ingredient: array
       })
    }
    render() {
        console.log(this.state.imageUrl)
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
                                            <option value='select' selected>Select</option>
                                            {this.state.ingredientNames.map((e, i) => {
                                                return <option value={e.name}>{e.name}</option>
                                            })}
                                        </select>
                                    </div>

                                    <div className="col-sm-6">
                                        <input onChange={(e) => this.handleChangeInput(e, index)} type="text" class="form-control" />
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
                            <input onChange={e => {this.setState({name:e.target.value})}} type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="inputPassword" class="col-sm-2 col-form-label">Price</label>
                        <div class="col-sm-10">
                            <input onChange={e => {this.setState({price:e.target.value})}} type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="inputPassword" class="col-sm-2 col-form-label">Image</label>
                        <div class="col-sm-10">
                            <FileUploader
                                accept="image/*"
                                name="avatar"
                                randomizeFilename
                                storageRef={firebaseApp.storage().ref('img')}
                                onUploadError={this.handleUploadError}
                                onUploadSuccess={this.handleUploadSuccess}
                            />
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
                        class="btn btn-danger"
                        onClick={this.handleUploadDrink}>
                        Add Drink
                    </button>
                </form>
            </div>
        )
    }
}

export default ManageItems;