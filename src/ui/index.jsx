import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ReactNotification from 'react-notifications-component';
import appReducer from '../reducers/app-reducer.js';
import { loadDiceRollSets } from '../reducers/action-creators.js';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications-component/dist/theme.css';

const store = createStore(appReducer);

const renderApp = () => {
	ReactDOM.render(
		<Provider store={store}>
			<ReactNotification />
			<App />
		</Provider>,
		document.getElementById('root')
	);
}

if (chrome && chrome.storage) {
	chrome.storage.sync.get(["gmdrsets"], function (results) {
		store.dispatch(loadDiceRollSets(results["gmdrsets"] || {}));
	});

	store.subscribe(() => {
		const state = store.getState();
		chrome.storage.sync.set({ "gmdrsets": state }, function () { });
	});

	renderApp();
}
else {
	//For development
	store.dispatch(loadDiceRollSets(JSON.parse(localStorage.getItem("gmdrsets") || "{}")));

	store.subscribe(() => {
		const state = store.getState();
		localStorage.setItem("gmdrsets", JSON.stringify(state));
	});

	renderApp();
}