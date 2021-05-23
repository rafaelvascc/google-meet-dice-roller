import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import appReducer from '../reducers/app-reducer.js'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const store = createStore(appReducer);

store.subscribe(() => {
  const state = store.getState();
  console.log("get state", state);
  localStorage.setItem("dice-roll-collection", JSON.stringify(state));
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);