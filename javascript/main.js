/* 1. Search through Soundcloud*/
var UI = {};

UI.EnterPress = document.querySelector('.js-search').addEventListener('keyup', function(e) {
    var input = document.querySelector("input").value;

    if (e.which === 13) {
    SoundCloudAPI.getTrack(input);
    }

});

UI.SubmitClick = document.querySelector('.js-submit').addEventListener('click', function() {
  var input = document.querySelector('input').value;
  SoundCloudAPI.getTrack(input);
});

UI.ClearLocalStorage = document.querySelector('.clear-button').addEventListener('click', function() {
  SoundCloudAPI.removeTracks();
});

/* 2. Query Soundcould API */

var SoundCloudAPI = {};

SoundCloudAPI.init = function () {

  SC.initialize({
    client_id: 'PFKgz3x842ZzIRa7x1Pn98bf3PCMwb0M'
  });

}

SoundCloudAPI.init();

SoundCloudAPI.getTrack = function(inputValue) {
    // find all sounds of buskers licensed under 'creative commons share alike'
    SC.get('/tracks', {
      q: inputValue
    }).then(function(tracks) {
      console.log(tracks);
      SoundCloudAPI.renderTracks(tracks);
    });

}

/* 3. Display the cards */

SoundCloudAPI.renderTracks = function(tracks) {

    var searchResults = document.querySelector('.js-search-results');
    searchResults.innerHTML = "";

    tracks.forEach(function(track) {

      //card
      var card = document.createElement('div');
      card.classList.add("card");

      //image
      var imageDiv = document.createElement('div');
      imageDiv.classList.add("image");

      var image_img = document.createElement('img');
      image_img.classList.add("image_img");
      image_img.src = track.artwork_url || 'http://lorempixel.com/100/100/';

      imageDiv.appendChild(image_img);

      //Content
      var content = document.createElement('div');
      content.classList.add('content');

      var header = document.createElement('div');
      header.classList.add('header');
      header.innerHTML = '<a href=' + track.permalink_url + ' target="blank">' + track.title + '</a>';

      //button
      var button = document.createElement('div');
      button.classList.add("ui", "bottom", "attached", "button", "js-button");

      var icon = document.createElement('i');
      icon.classList.add("add", "icon");

      buttonText = document.createElement('span');
      buttonText.innerHTML = "Add to playlist";

      content.appendChild(header);

      button.appendChild(icon);
      button.appendChild(buttonText);

      button.addEventListener('click',function() {
        SoundCloudAPI.getEmbed(track.permalink_url);
      });

      card.appendChild(imageDiv);
      card.appendChild(content);
      card.appendChild(button);


      searchResults.appendChild(card);



    });

}


SoundCloudAPI.getEmbed = function (trackURL) {
  SC.oEmbed(trackURL, {
    auto_play: true
  }).then(function(embed){
    console.log('oEmbed response: ', embed);
    var sideBar = document.querySelector('.js-playlist');

    var box = document.createElement('div');
    box.innerHTML = embed.html;

    sideBar.insertBefore(box, sideBar.firstChild);
    localStorage.setItem("key", sideBar.innerHTML);

  });
}

SoundCloudAPI.storeTracks = function(){
    var sideBar = document.querySelector('.js-playlist');
    sideBar.innerHTML = localStorage.getItem("key");
};

SoundCloudAPI.storeTracks();

SoundCloudAPI.removeTracks = function() {
    window.localStorage.clear();
    var sideBar = document.querySelector('.js-playlist');
    sideBar.innerHTML = "";
};
