import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';

class App extends Component {
  constructor () {
    super();
    this.state = {
      username: '',
      trail: '',
      review: '1',
      reviewDetails: '',
      reviews: []
      // user: null -- will user this later to know if people are logged in
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.login = this.login.bind(this); 
    // this.logout = this.logout.bind(this); 
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  /* logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithPopup(provider).then((result) => {
      const user = result.user;
      this.setState({
        user
      });    
    });
  } */
  handleSubmit(e) {
    e.preventDefault();
    const reviewsRef = firebase.database().ref('reviews');
    const item = {
      review: this.state.review,
      trail: this.state.trail,
      reviewDetails: this.state.reviewDetails,
      username: this.state.username
    }
    reviewsRef.push(item);
    this.setState({
      review: '1',
      username: '',
      reviewDetails: '',
      trail: ''
    });

  }
  render() {
    return (
      <div className="container">
        <header className="App-header">
          <h1 className="App-title">We shall review some trails</h1>
        </header>
        <form onSubmit={this.handleSubmit}>
          <h2>Add a review</h2>
          <input placeholder='Username' name='username' onChange={this.handleChange} value={this.state.username} />
          <input placeholder='Trail Name' name='trail' onChange={this.handleChange}  value={this.state.trail} />
          <select value={this.state.review} name='review' onChange={this.handleChange}>
            <option value="1">Great conditions</option>
            <option value="2">It was skiable</option>
            <option value="3">Not worth it</option>
          </select>
          <input name='reviewDetails' onChange={this.handleChange}  value={this.state.reviewDetails} />
          <button>Add Review</button>
        </form>
      </div>
    );
  }
}

export default App;
