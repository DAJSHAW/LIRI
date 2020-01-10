// _____________________________________
// DEPENDENCIES
// =====================================
// Read and set environment variables
require("dotenv").config();

// Import the API keys
var keys = require("./keys.js");

// Import the FS package for read/write.
var fs = require("fs");

// Import Axios
var axios = require("axios");

// Import the request npm package.
var request = require("request");

// Imports spotify from the keys file
var spotify = require("./keys.js");

// Import the node-spotify-api NPM package.
var Spotify = require('node-spotify-api');

// Initialize the spotify API client with keys
var spotify = new Spotify(keys.spotify);

// Import the moment NPM package.
var moment = require("moment");


// =====================================
// Function for running a Spotify Search
// _____________________________________
var callSpotifyAPI = function(songName) {
  if (songName === undefined) {
    songName = "The Sign";
  }
  spotify.search(
    {
      type: "track",
      query: songName,
      limit: 20
    },
    function(err, data) {
      if (err) {
        console.log("An error occurred: " + err);
        return;
      }
      var songs = data.tracks.items;
      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("Artist name: " + songs[i].artists[0].name);
        console.log("Song title: " + songs[i].name);
        console.log("Track number: " + songs[i].track_number);
        console.log("Album: " + songs[i].album.name);
        console.log("Release date: " + songs[i].album.release_date);
        console.log("Album type: " + songs[i].album.album_type);
        console.log("Preview song: " + songs[i].preview_url);
        console.log("----------------------------------------------------");
      }
    }
  );
};

// =====================================
// Function for running a OMDB Search
// _____________________________________
var callOMDBAPI = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr. Nobody";
  }
  var urlHit =
  "http://www.omdbapi.com/?t=" +
  movieName +
  "&y=&plot=full&tomatoes=true&apikey=trilogy";
  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);
      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  });
};

// =====================================
// Function for running a Concert Search
// _____________________________________
var callBandsInTown = function findConcerts(artist) {
  console.log("Finding your concerts now...");
  // default Public Enemy
  if (!artist) {
      artist = "Public Enemy"
  };

  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios({
      method:'get',
      url: queryURL
  })
  .then(function(res) {
      console.log("=========NEW SHOW LIST=========\n");
      console.log(`Catch ${artist} at: \n`);
      for (var i=0; i<res.data.length; i++) {
          var venue = res.data[i].venue.name;
          var location = res.data[i].venue.city + ", " + res.data[i].venue.region;
          var date = moment(res.data[i].datetime).format("MMMM DD, YYYY");
          console.log(`${venue} in ${location} on ${date}`);
      }
      console.log("\n===============================");
  });
}

// =====================================
// Function for determining which command is executed
// _____________________________________
var userCommand = function(caseData, functionData) {
  switch (caseData) {
    // use bands in town api
    case "my-concerts":
    callBandsInTown();
    break;
    // use spotify api
    case "spotify-this-song":
    callSpotifyAPI(functionData);
    break;
    // use omdb api
    case "movie-this":
    callOMDBAPI(functionData);
    break;

    case "do-what-it-says":
    doWhatItSays();
    break;
    default:
    console.log("LIRI doesn't understand, please try again!");
  }
};

// =====================================
// Function to take data from .txt file and send to another function when user enters "do-what-it-says"
// _____________________________________
var doWhatItSays = function () {
  fs.readFile('random.txt', 'utf8', function(error, data){
    console.log(data);
    var dataArr = data.split(',');
    if (dataArr.length ===  2) {
      userCommand(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      userCommand(dataArr[0]);
    }
  });
};

// =====================================
// Function which takes in command line arguments and executes switch statement accordigly
// _____________________________________
var cmdLnArgs = function(argOne, argTwo) {
  userCommand(argOne, argTwo);
};

// =====================================
// this takes in user input and assigns them as arguments
// _____________________________________
  cmdLnArgs(process.argv[2], process.argv[3]);

// Example:
// User Input: node runBonus rap
// Output: A rap band is Run DMC.
















