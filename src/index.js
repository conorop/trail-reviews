import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import firebase from 'firebase';
import registerServiceWorker from './registerServiceWorker';
import config from './firebase-config';

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
