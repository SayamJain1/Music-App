import SHAZAM_API from "./apikey.js";

//  song Container
let songContainer = document.querySelector(".song-container");

let scImg = document.querySelector(".scImg");
let scSongName = document.querySelector(".scSongName");
let scSongArtist = document.querySelector(".scSongArtist");

// player
let playerSongName = document.querySelector(".playerSongName");
let musicPlayer = document.querySelector(".music-player");

// buttons
let prevBtn = document.querySelector("#prev");
let playBtn = document.querySelector("#play");
let nextBtn = document.querySelector("#next");

// sliders
let volumeSlide = document.querySelector(".volume-slider");
let seekSlide = document.querySelector(".seek-slider");

let durationTime = document.querySelector(".total-duration");
let currentTimeEl = document.querySelector(".current-time");

// Globle
let currAudio = document.querySelector("audio");
let songIndex = 0;
let isPlaying = false;
songContainer.innerHTML = "Loading Songs...";

// Fetching DATA

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": SHAZAM_API,
    "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
  },
};

fetch("https://shazam-core.p.rapidapi.com/v1/charts/world", options)
  .then((response) => response.json())
  .then((response) => {
    // console.log(response)
    if (response) {
      songContainer.innerText = "";
    }
    response.map((songs, i) => {
      let mainDiv = document.createElement("div");
      mainDiv.classList = "song-card";
      mainDiv.id = i;
      let imgDiv = document.createElement("div");
      imgDiv.classList = "img-div";
      let img = document.createElement("img");
      img.src = songs?.images?.coverart ? songs.images.coverart : "default.png";
      let h3 = document.createElement("h3");
      h3.classList = "song-name";
      h3.innerText = songs.title;
      let h5 = document.createElement("h5");
      h5.classList = "song-title";
      h5.innerText = songs.subtitle;

      mainDiv.appendChild(imgDiv);
      imgDiv.appendChild(img);
      mainDiv.appendChild(h3);
      mainDiv.appendChild(h5);
      songContainer.appendChild(mainDiv);
    });

    // play
    const playMusic = () => {
      isPlaying = true;

      currAudio.src = response[songIndex].hub.actions[1].uri;
      currAudio.play();
      playerSongName.innerHTML = response[songIndex].title;
      play.classList.replace("fa-play-circle", "fa-pause-circle");
    };

    // pause
    const pauseMusic = () => {
      isPlaying = false;

      currAudio.src = response[songIndex].hub.actions[1].uri;
      currAudio.pause();
      play.classList.replace("fa-pause-circle", "fa-play-circle");
    };

    playBtn.addEventListener("click", () => {
      if (isPlaying) pauseMusic();
      else playMusic();
    });

    const next = () => {
      if (songIndex < response.length - 1) {
        songIndex++;
      } else songIndex = 0;

      currAudio.src = response[songIndex].hub.actions[1].uri;
      playMusic();
    };

    const prev = () => {
      songIndex = (songIndex - 1 + response.length) % response.length;

      currAudio.src = response[songIndex].hub.actions[1].uri;
      playMusic();
    };

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    volumeSlide.addEventListener("change", () => {
      currAudio.volume = volumeSlide.value / 100;
    });

    // click to song
    document.querySelectorAll(".song-card").forEach((ele) =>
      ele.addEventListener("click", () => {
        musicPlayer.classList.remove("hidden");
        songIndex = ele.id;
        currAudio.src = response[songIndex].hub.actions[1].uri;
        playMusic();
      })
    );

    const getTime = (time) =>
      `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;

    currAudio.addEventListener("timeupdate", () => {
      seekSlide.value = parseInt(
        (currAudio.currentTime / currAudio.duration) * 100
      );
      currentTimeEl.innerText = getTime(currAudio.currentTime);
      if (!isNaN(currAudio.duration)) {
        durationTime.innerText = getTime(currAudio.duration);
      } else {
        durationTime.innerText = "0:00";
      }
    });

    currAudio.addEventListener("ended", next);

    seekSlide.addEventListener("change", () => {
      currAudio.currentTime = (seekSlide.value * currAudio.duration) / 100;
    });
  })
  .catch((err) => {
    let h2 = document.createElement("h2");
    // h2.innerText = "Something went wrong please try again!";
    h2.innerText = "⚠️In Maintenance (API isn't working) i'm on it!";
    songContainer.appendChild(h2);
  });
