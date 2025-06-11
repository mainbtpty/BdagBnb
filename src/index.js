import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import { combineReducers } from 'redux';
import reportWebVitals from './reportWebVitals';
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import blockchainReducer from "./features/blockchain";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import Moralis from 'moralis'; // Import Moralis

// Initialize Moralis
Moralis.start({
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImM2OTY2NjY1LWJmNjQtNGZlMC1iM2M2LTQzMGYxMzRlMGJhNiIsIm9yZ0lkIjoiMzkwNDE0IiwidXNlcklkIjoiNDAxMTczIiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiI1NzJmNTQ5ZC0yMTQyLTQyMmMtYWJjMy0zZGE5ZDRjZDFkZDYiLCJpYXQiOjE3MTY3MjM3NTUsImV4cCI6NDg3MjQ4Mzc1NX0.6X-ZMKfs799dLgfOPSsIujCwx6tF5xq8-W4379j7au8', // Replace with your actual Moralis API key
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  blockchain: blockchainReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();