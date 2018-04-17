require("dotenv").config();
const keys = require("./keys.js");
var Twitter = require('twitter');
var request = require('request');
var fs    = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(x){
      spotifySong(x);
    } else{
      spotifySong("ace of base, the sign");
    }
  break;

  case "movie-this":
    if(x){
      omdbData(x)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doIt();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function showTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name: 'blahtwittter123', count: 20};
  twitter.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for (var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log(JSON.stringify("@blahtwittter123: " + tweets[i].text + " Created At: " + date.substring(0, 19)));
        console.log("-----------------------");
      }
    }else{
      console.log('Error occurred');
    }
  });
}

function spotifySong(song){
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

function omdbData(movie){
  var queryURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true&apikey=d4169413';

  request(queryURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);


    } else{
      console.log('Error occurred.')
    }
  });

}

function doIt(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}