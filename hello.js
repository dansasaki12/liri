console.log("hello");
require("dotenv").config();
const keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);
var params = {screen_name: 'blahtwittter123'};
twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
       if (!error) {
         console.log(JSON.stringify(tweets.map(m => { return { id: m.id , text : m.text}})));
       } else {
         throw "Error getting tweets";
       }
   });

var GetSpotify = function(search) {
   // console.log(spotify);
   spotify.search({ type: 'track', query: search, limit : 1}, function(err, data) {
       console.log(JSON.stringify(
           data,
           null,
           4
       ));
       if (err) {
         return console.log('Error occurred: ' + err);
       }
   });
}
GetSpotify('Hello')