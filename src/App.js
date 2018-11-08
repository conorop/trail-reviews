import React, { Component } from 'react';
import logo from './trailbrainlogo.png';
import './App.css';
import firebase, {auth, provider} from './firebase-config';

class App extends Component {
  constructor () {
    super();
    this.state = {
      username: '',
      trail: '',
      review: '1',
      reviewDetails: '',
      reviews: [],
      trails: [],
      trailsFollowing: ['Como'],
      users: [],
      user: null // will user if people are logged in
    }
    this.getReviews = this.getReviews.bind(this);
    this.getTrails = this.getTrails.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
    this.login = this.login.bind(this); 
    this.logout = this.logout.bind(this); 
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  logout() {
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

  }
  handleFollow(e) {
    // add uid to following array for trail
    const { trailId } = e.target.dataset;
    firebase
      .firestore()
      .collection('trails')
      .doc(trailId)
      .update({
        followers: firebase.firestore.FieldValue.arrayUnion(this.state.user.uid)
      })
      .then(this.getTrails);
    // setState of trailsFollowing to add new trail
  }
  handleUnfollow(e) {
    // add uid to following array for trail
    const { trailId } = e.target.dataset;
    firebase
      .firestore()
      .collection('trails')
      .doc(trailId)
      .update({
        followers: firebase.firestore.FieldValue.arrayRemove(this.state.user.uid)
      })
      .then(this.getTrails);
    // setState of trailsFollowing to add new trail
  }
  handleSubmit(e) {
    e.preventDefault();
    const item = {
      review: this.state.review,
      trail: this.state.trail,
      reviewDetails: this.state.reviewDetails,
      authorId: this.state.user.uid
    }
    firebase
      .firestore()
      .collection('reviews')
      .add(item);

    this.setState({
      review: '1',
      reviewDetails: '',
      trail: ''
    });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });
    
    this.getReviews();
    this.getTrails();
    this.getUsers();
    // firebase.firestore().collection('users').doc({user.uid}).get().then(querySet =>
    //   const newState = [];
    //   querySet.forEach(doc => 
    //   )
    //   this.setState({
    //     username: 
    //   });
    // });
  }

  getReviews() {
    firebase.firestore().collection('reviews').get().then(querySet => {
      const newState = [];
      querySet.forEach(doc => {
        if (doc.exists) {
          const review = doc.data()
          newState.push(review);
        }
      });
      this.setState({
        reviews: newState
      });
    });
  }

  getTrails() {
    firebase.firestore().collection('trails').get().then(querySet => {
      const newState = [];
      querySet.forEach(doc => {
        if (doc.exists) {
          const trail = doc.data();
          trail.uid = doc.id;
          newState.push(trail);
        }
      });
      this.setState({
        trails: newState
      });
    });
  }

  getUsers() {
    firebase.firestore().collection('users').get().then(querySet => {
      const newState = [];
      querySet.forEach(doc => {
        if (doc.exists) {
          const user = doc.data();
          user.uid = doc.id;
          newState.push(user);
        }
      });
      this.setState({
        users: newState
      } );
    });
  }

  
  /* removeItem(reviewId) {
    const reviewRef = firebase.database().ref(`/reviews/${reviewId}`);
    removeRef.remove();
  } */
  render() {
    return (
      <div className="container">
      {this.state.user ?
        <header className="App-header">
            <img className="logo" src={logo} alt="Trail Brain logo" />
            <div className="navButtons">
              <button className="loginButton" onClick={this.logout}>Log Out</button>
              <button className="action" onClick="">+ Checkin</button>
            </div>            
        </header>
        :
        <header className="App-header">
            <img className="logo" src={logo} alt="Trail Brain logo" />
            <nav>
              <button className="loginButton" onClick={this.login}>Log In</button>
            </nav>
        </header>
      }
        {this.state.user ?
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <h2>Add a review</h2>
           
            <input placeholder='Trail Name' name='trail' onChange={this.handleChange}  value={this.state.trail} />
            <select value={this.state.review} name='review' onChange={this.handleChange}>
              <option value="1">Great conditions</option>
              <option value="2">It was skiable</option>
              <option value="3">Not worth it</option>
            </select>
            <input name='reviewDetails' onChange={this.handleChange}  value={this.state.reviewDetails} />
            <button>Add Review</button>
          </form>
          <section className='display-item'>
            <div className="wrapper">
              <ul>
                {this.state.reviews.map((review) => {
                  const user = this.state.users.find(user => user.uid === review.authorId)
                  return (
                    <div className="review">

                        <h3>{review.trail} reviewed by {user && user.username}</h3>
                        <p>{review.review}</p>
                        <p>{review.reviewDetails}</p>
                     
                    </div>
                  )
                })}
              </ul>
            </div>
          </section>
          <section className='display-item'>
            <div className="wrapper">
              <ul>
                {this.state.trails.map((trail) => {
                  return (
                    <div>
                      <h3>{trail.trailName} is in {trail.stateLocated}</h3>
                      { trail.trailTypes.includes('classic') &&
                          <p>Has a classic course</p>
                      }
                      { trail.trailTypes.includes('skate') &&
                          <p>Has as skate course</p>
                      }
                      { trail.followers.includes(this.state.user.uid) ? (
                        <button data-trail-id={trail.uid} className="followButton" onClick={this.handleUnfollow}>Following</button>
                      ) : (
                        <button data-trail-id={trail.uid} className="followButton" onClick={this.handleFollow}>Follow</button>
                      ) } 
                    </div>
                  )
                })}
              </ul>
            </div>
          </section>
        </div>
        :
        <div className="wrapper">
        Welcome to TrailBrain
        </div>
        }
      </div>
    );
  }
}

export default App;
