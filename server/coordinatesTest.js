// index.js
// Required modules
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
var turf = require('@turf/turf');

// Initialize Express application
const app = express();

// Define paths
const clientPath = path.join(__dirname, '..', 'client/src');
const dataPath = path.join(__dirname, 'data', 'flights.json');
const serverPublic = path.join(__dirname, 'public');
// Middleware setup
app.use(express.static(clientPath)); // Serve static files from client directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies


async function getFrom(city, state) {
    const url = "https://api.mapbox.com/search/geocode/v6/forward?q=" + city + "%20" + state + "&proximity=ip&access_token=pk.eyJ1IjoiY21hbGNvNzA5IiwiYSI6ImNtMXk3eW0zOTE2YTIybXExdjBlOTdnb3QifQ.NLUWCxQsJmH5c1OBjx3z5g";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      fromLong = json.features[0].geometry.coordinates[0]
      fromLat = json.features[0].geometry.coordinates[1];
      return [fromLat, fromLong]
    } catch (error) {
      console.error(error.message);
    }
  }
  

  async function getTo(city, state) {
    const url = "https://api.mapbox.com/search/geocode/v6/forward?q=" + city + "%20" + state + "&proximity=ip&access_token=pk.eyJ1IjoiY21hbGNvNzA5IiwiYSI6ImNtMXk3eW0zOTE2YTIybXExdjBlOTdnb3QifQ.NLUWCxQsJmH5c1OBjx3z5g";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      toLong = json.features[0].geometry.coordinates[0]
      toLat = json.features[0].geometry.coordinates[1];
      return [toLat, toLong]
    } catch (error) {
      console.error(error.message);
    }
    
  }
  
  async function calculateMiles(fromCity, fromState, toCity, toState){
    const fromCoord = await getFrom(fromCity, fromState)
    const toCoord = await getTo(toCity, toState)
    var from = turf.point(fromCoord);
    var to = turf.point(toCoord);
    var options = { units: "miles" };
    var distance = turf.distance(from, to, options)
    console.log(distance + " miles")
  }
calculateMiles("avonale", "az", "lincoln", "nebraska");