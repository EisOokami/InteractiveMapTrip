// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './style/index.scss'

// console.log("Welcome to the **Tourist Interactive Map** project! This application is designed to help tourists find points of interest and plan their routes. The interactive map allows users to search for locations, view details about various attractions, and create customized travel itineraries. The main goal of this project is the open use of this interactive map for all people who need inspiration or help. This project is open source, but with differences, such as using **project-osrm demo server** for the project, if you are going to use this project for your own purposes, please refer to this [link.](https://github.com/Project-OSRM/osrm-backend/wiki/Api-usage-policy)")

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <>
    <App />
  </>,
)
