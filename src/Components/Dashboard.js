import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
  } from 'react-router-dom'
  

import Income from './Income';
import ManageItems from './ManageItems/ManageItems';
import Ingredients from './Ingredients/Ingredients';
import SoftDrink from './SoftDrink/SoftDrink';


class Dashboard extends Component {

    
    render() {  
        return (
            <Router>
                <div>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <Link to="/" class="nav-link" >Manage<span class="sr-only">(current)</span></Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/income" class="nav-link" >Income</Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/ingredients" class="nav-link" >Ingredients</Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/softdrink" class="nav-link" >Soft Drink</Link>
                            </li>
                        </ul>
                    </div>           
                </nav>
                <Route exact path="/" component={ManageItems}/>
                <Route path="/income" component={Income}/>
                <Route path="/ingredients" component={Ingredients}/>
                <Route path="/softdrink" component={SoftDrink}/>
                </div>
            </Router>
        );
    }
}

export default Dashboard;