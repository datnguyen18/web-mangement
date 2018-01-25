import React, { Component } from 'react';
import './App.css';
import { firebaseApp } from "./config/Firebase";

import Dashboard from './Components/Dashboard'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "admin@gmail.com",
      password: "admin123",
      loginStatus: false,
      success: false,
      loading: false,

    }
  }

  login = () => {

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(() => {
        console.log("dang nhap thanh cong")
        this.setState({
          loginStatus: false,
          success: true,
          loading: true
        })
      })
      .catch(error => {
        this.setState({
          loginStatus: true
        })
      })

  }

  render() {
    let errorMessage = null;
    console.log(this.state.success)
    if (this.state.loginStatus) {
      errorMessage = (
        <div>
          <h3>Invalid username or password</h3>
        </div>
      )
    }

    return (
      <div>
        {this.state.success === false ?
          <div className="App d-flex align-items-center flex-column">
            <div>
              <h2>Web-management</h2>
            </div>
            <form className="form form-control col-lg-6 d-flex align-items-center flex-column">
              <div className="form-group col-sm-8">
                <label for="usr">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.target.value })} />
              </div>
              <div className="form-group col-sm-8">
                <label for="pwd">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })} />
              </div>
              <button
                type="button"
                class="btn btn-warning"
                onClick={this.login}>
                Login
              </button>
              {errorMessage}

            </form>
          </div>
          : <Dashboard />
        }
      </div>
    );
  }
}

export default App;
