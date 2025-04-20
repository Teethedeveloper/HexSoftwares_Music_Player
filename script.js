const playlistSongs = document.getElementById("playlist-songs");
const playPauseButton = document.getElementById("play-pause");
const stopButton = document.getElementById("stop");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const visualizer = document.getElementById("visualizer");
const errorMessage = document.getElementById("error-message");

const allSongs = [
  {
    id: 0,
    title: "20 something",
    artist: "SZA",
    duration: "3:19",
    src: "./defaults/tracks/music/SZA - 20 Something (Audio).mp3",
    cover: "./defaults/tracks/album-art/CTRL.jpg",
  },
  {
    id: 1,
    title: "Godspeed",
    artist: "Frank Ocean",
    duration: "2:57",
    src: "./defaults/tracks/music/Frank Ocean - Godspeed.mp3",
    cover: "./defaults/tracks/album-art/BLOND.jpg",
  },
  {
    id: 2,
    title: "Sandstorm",
    artist: "Mereba ft JID",
    duration: "2:59",
    src: "./defaults/tracks/music/YouTube [bPL8J4TFCcE].mp3",
    cover: "./defaults/tracks/album-art/AZEB.jpg",
  },
  {
    id: 3,
    title: "Take you there",
    artist: "H.E.R",
    duration: "4:03",
    src: "./defaults/tracks/music/H.E.R. - Take You There (Official Audio) [K5SbKV-Uz7A].mp3",
    cover: "./defaults/tracks/album-art/I USED KNOW HER.jpg",
  },
  {
    id: 4,
    title: "Fool for you",
    artist: "Snoh Aalegra",
    duration: "3:14",
    src: "./defaults/tracks/music/Fool For You [rhcla4RvwN0].mp3",
    cover: "./defaults/tracks/album-art/TEMPORARY HIGHS.jpg",
  },
  {
    id: 5,
    title: "Pimmies Dilemma",
    artist: "Partynextdoor, Drake, Pimmie",
    duration: "1:58",
    src: "./defaults/tracks/music/PARTYNEXTDOOR, Drake, Pimmie - PIMMIE'S DILEMMA [AQpH3Im6taU].mp3",
    cover: "./defaults/tracks/album-art/SOME SEXY SONGS 4 U.jpg",
  },
  {
    id: 6,
    title: "Yebba's Heartbreak",
    artist: "Yebba",
    duration: "2:13",
    src: "./defaults/tracks/music/Yebba’s Heartbreak [QIPPRSu2e9Q].mp3",
    cover: "./defaults/tracks/album-art/CLB.jpg",
  },
  {
    id: 7,
    title: "Freudian",
    artist: "Daniel Caesar",
    duration: "4:09",
    src: "./defaults/tracks/music/Daniel Caesar - Freudian, a Visual [e7b5hbWvWEQ].mp3",
    cover: "./defaults/tracks/album-art/FREUDIAN.jpg",
  },
  {
    id: 8,
    title: "Higher",
    artist: "Rihanna",
    duration: "2:00",
    src: "./defaults/tracks/music/Higher [zzOs66hec8U].mp3",
    cover: "./defaults/tracks/album-art/ANTI.jpg",
  },
  {
    id: 9,
    title: "God",
    artist: "Doechii",
    duration: "2:35",
    src: "./defaults/tracks/music/God [7cdBJ9cwxKI].mp3",
    cover: "./defaults/tracks/album-art/OH THE PLACES YOU'LL GO.jpg",
  },
];

const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

// Load playlist from local storage
const loadPlaylistFromStorage = () => {
  const storedSongs = JSON.parse(localStorage.getItem("playlistSongs"));
  if (storedSongs) {
    userData.songs = storedSongs;
  } else {
    userData.songs = [...allSongs]; // Default songs if no data in local storage
  }
};

// Save playlist to local storage
const savePlaylistToStorage = () => {
  localStorage.setItem("playlistSongs", JSON.stringify(userData.songs));
};

const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  if (!song) {
    showError(`Song not found.`);
    return;
  }
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  updateButtonAriaLabels()
  audio.play();

  playPauseButton.setAttribute("aria-label", "Pause");
  playPauseButton.innerHTML = '<i class="fa fa-pause"></i>';
  savePlaylistToStorage();
};

const togglePlayPause = () => {
  if (audio.paused || userData.currentSong === null) {
    if (userData.currentSong === null) {
      playSong(userData.songs[0].id);
    } else {
      audio.play();
    }
    playPauseButton.setAttribute("aria-label", "Pause");
    playPauseButton.innerHTML = '<i class="fa fa-pause"></i>';
  } else {
    userData.songCurrentTime = audio.currentTime;
    audio.pause();
    playPauseButton.setAttribute("aria-label", "Play");
    playPauseButton.innerHTML = '<i class="fa fa-play"></i>';
  }
};

const setPlayButtonAccessibleText = () => {
  if (audio.paused || userData.currentSong === null) {
    playPauseButton.setAttribute("aria-label", "Play");
  } else {
    playPauseButton.setAttribute("aria-label", "Pause");
  }
};

const updateButtonAriaLabels = () => {
  if (userData.currentSong) {
    const currentIndex = getCurrentSongIndex();
    const nextSong = userData.songs[currentIndex + 1];
    const previousSong = userData.songs[currentIndex - 1];

    if (nextSong) {
      nextButton.setAttribute("aria-label", `Play next song: ${nextSong.title}`);
    } else {
      nextButton.setAttribute("aria-label", "No next song available");
    }

    if (previousSong) {
      previousButton.setAttribute("aria-label", `Play previous song: ${previousSong.title}`);
    } else {
      previousButton.setAttribute("aria-label", "No previous song available");
    }
  } else {
    nextButton.setAttribute("aria-label", "Play next song");
    previousButton.setAttribute("aria-label", "Play previous song");
  }
};

const stopSong = () => {
  audio.pause();
  audio.currentTime = 0;
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  // Reset progress bar and timer
  progress.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  setPlayerDisplay();
  playPauseButton.innerHTML = '<i class="fa fa-play"></i>';
  setPlayButtonAccessibleText();
};

const playNextSong = () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSong = userData?.songs[currentSongIndex + 1];
  if (!nextSong) {
    showError("No next song available.");
    return;
  }
  playSong(nextSong.id);
};

const playPreviousSong = () => {
  const currentSongIndex = getCurrentSongIndex();
  const previousSong = userData?.songs[currentSongIndex - 1];
  if (!previousSong) {
    showError("No previous song available.");
    return;
  }
  playSong(previousSong.id);
};

const renderSongs = (array) => {
  const songsHTML = array
    .map(
      (song) => `
      <li id="song-${song.id}" class="playlist-song">
        <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
        </button>
      </li>
    `
    )
    .join("");

  playlistSongs.innerHTML = songsHTML;
};

const sortSongs = () => {
  return userData.songs.sort((a, b) => a.title.localeCompare(b.title));
};

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const albumArt = document.getElementById("player-album-art").querySelector("img");

  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;
  const currentCover = userData?.currentSong?.cover;

  playingSong.textContent = currentTitle || "Song Title";
  songArtist.textContent = currentArtist || "Artist Name";
  albumArt.src = currentCover || "./defaults/4673541.jpg";
};

// Update progress bar and countdown timer as the song plays
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Calculate remaining time (countdown)
    const remainingTime = audio.duration - audio.currentTime;
    const remainingMinutes = Math.floor(remainingTime / 60);
    const remainingSeconds = Math.floor(remainingTime % 60);

    currentTimeEl.textContent = `${remainingMinutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;

    // Display total duration
    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration % 60);
    durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? "0" : ""}${durationSeconds}`;
  }
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

const createVisualizerBars = () => {
  for (let i = 0; i < 10; i++) {
    const bar = document.createElement("div");
    visualizer.appendChild(bar);
  }
};

const highlightCurrentSong = () => {
  const allSongsElements = document.querySelectorAll(".playlist-song");
  allSongsElements.forEach((songElement) => {
    songElement.classList.remove("highlighted");
  });

  if (userData.currentSong) {
    const currentSongElement = document.getElementById(`song-${userData.currentSong.id}`);
    if (currentSongElement) {
      currentSongElement.classList.add("highlighted");
    }
  }
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

const showError = (message) => {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";

  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 5000);
};

playPauseButton.addEventListener("click", togglePlayPause);
stopButton.addEventListener("click", stopSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", () => {
  userData.songs.sort(() => Math.random() - 0.5);
  savePlaylistToStorage(); // Save the shuffled playlist
  renderSongs(userData.songs);
});
audio.addEventListener("ended", playNextSong);

loadPlaylistFromStorage();
renderSongs(sortSongs());
setPlayButtonAccessibleText();
updateButtonAriaLabels();
playSong();
createVisualizerBars();
setPlayerDisplay();
highlightCurrentSong();
