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
const volumeSlider = document.getElementById("volume-slider");
const addSongBtn = document.getElementById('add-song-btn');
const addSongFile = document.getElementById('add-song-file');
const statsBtn = document.getElementById('stats-btn');
const statsModal = document.getElementById('stats-modal');
const closeStatsModal = document.getElementById('close-stats-modal');
const statsList = document.getElementById('stats-list');
const favouritesBtn = document.getElementById('favourites-btn');
const favouritesModal = document.getElementById('favourites-modal');
const closeFavouritesModal = document.getElementById('close-favourites-modal');
const favouritesList = document.getElementById('favourites-list');
const recentlyDeletedBtn = document.getElementById('recently-deleted-btn');
const recentlyDeletedModal = document.getElementById('recently-deleted-modal');
const closeRecentlyDeletedModal = document.getElementById('close-recently-deleted-modal');
const recentlyDeletedList = document.getElementById('recently-deleted-list');

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

// Update progress bar as audio plays
audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + '%';
});

// Seek on click or drag
progressContainer.addEventListener('click', (e) => {
  seek(e);
});

let isDragging = false;

progressContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  seek(e);
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    seek(e, true);
  }
});

document.addEventListener('mouseup', (e) => {
  if (isDragging) {
    seek(e, true);
    isDragging = false;
  }
});

// Touch support (optional)
progressContainer.addEventListener('touchstart', (e) => {
  isDragging = true;
  seek(e.touches[0], true);
});
document.addEventListener('touchmove', (e) => {
  if (isDragging) {
    seek(e.touches[0], true);
  }
});
document.addEventListener('touchend', (e) => {
  if (isDragging) {
    isDragging = false;
  }
});


function seek(e, isGlobal = false) {
  const rect = progressContainer.getBoundingClientRect(); 
  const offsetX = isGlobal ? e.clientX - rect.left : e.offsetX;
  const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);
  audio.currentTime = percent * audio.duration;
  progress.style.width = percent * 100 + '%';
}

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

  // Increment play count for stats
  song.playCount = (song.playCount || 0) + 1;

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  updateButtonAriaLabels();
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

const stopSong = () => {
  audio.pause();
  audio.currentTime = 0;
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  // Reset progress bar and timer
  progress.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  // Reset visualizer bars
  const visualizerBars = visualizer.querySelectorAll("div");
  visualizerBars.forEach((bar) => {
    bar.style.height = "0%";
  });

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

function renderSongs(array) {
  playlistSongs.innerHTML = array.map(song => `
    <li class="playlist-song" id="song-${song.id}">
      <div class="playlist-song-info" onclick="playSong(${song.id})">
        <span class="playlist-song-title">${song.title}</span>
        <span class="playlist-song-artist">${song.artist}</span>
        <span class="playlist-song-duration">${song.duration}</span>
      </div>
      <button class="star-song-btn" onclick="toggleFavourite(${song.id}); event.stopPropagation();" aria-label="Star song">
        <i class="fa${song.favourite ? 's' : 'r'} fa-star"></i>
      </button>
      <button class="delete-song-btn" onclick="deleteSong(${song.id})" aria-label="Delete song">
        <i class="fa fa-trash"></i>
      </button>
    </li>
  `).join('');
}

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

audio.volume = volumeSlider.value;

volumeSlider.addEventListener("input", (event) => {
  audio.volume = event.target.value;
});
// Update progress bar and countdown timer as the song plays
audio.addEventListener("timeupdate", () => {
  if (!userData.currentSong) return; // Only update if a song is loaded

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

  const visualizerBars = visualizer.querySelectorAll("div");
  visualizerBars.forEach((bar) => {
    const randomHeight = Math.random() * 100; // Random height for bars
    bar.style.height = `${randomHeight}%`;
  });
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

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

if (addSongBtn && addSongFile) {
  addSongBtn.addEventListener('click', () => {
    addSongFile.click();
  });

  addSongFile.addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    // Extract metadata
    let title = file.name.replace(/\.[^/.]+$/, "");
    let artist = "Unknown Artist";
    let cover = "./defaults/4673541.jpg"; // Default cover

    try {
      const metadata = await window.musicMetadata.parseBlob(file);
      if (metadata.common.title) title = metadata.common.title;
      if (metadata.common.artist) artist = metadata.common.artist;

      // Extract album art if available
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const picture = metadata.common.picture[0];
        const blob = new Blob([picture.data], { type: picture.format });
        cover = URL.createObjectURL(blob);
      }
    } catch (err) {
      // Ignore errors, use defaults
    }

    // Get duration using Audio API
    const src = URL.createObjectURL(file);
    const tempAudio = new Audio();
    tempAudio.src = src;
    tempAudio.addEventListener('loadedmetadata', function () {
      const durationSec = tempAudio.duration;
      const minutes = Math.floor(durationSec / 60);
      const seconds = Math.floor(durationSec % 60);
      const duration = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

      // Find the highest current id and increment
      const maxId = userData.songs.length
        ? Math.max(...userData.songs.map(song => song.id))
        : 0;
      const newId = maxId + 1;

      const newSong = {
        id: newId,
        title,
        artist,
        src,
        duration,
        cover
      };
      userData.songs.push(newSong);
      savePlaylistToStorage();
      renderSongs(userData.songs);
      addSongFile.value = "";
    });
  });
}

statsBtn.addEventListener('click', () => {
  // Only include songs with at least 1 play
  const topSongs = [...userData.songs]
    .filter(song => (song.playCount || 0) > 0)
    .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
    .slice(0, 5);

  if (topSongs.length === 0) {
    statsList.innerHTML = `<li>Play a song to see your stats!</li>`;
  } else {
    statsList.innerHTML = topSongs.map((song, i) =>
      `<li><strong>#${i + 1}:</strong> ${song.title} <em>by</em> ${song.artist} <span style="float:right;">${song.playCount} plays</span></li>`
    ).join('');
  }

  statsModal.style.display = 'block';
  statsModal.focus();
});

closeStatsModal.addEventListener('click', () => {
  statsModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === statsModal) {
    statsModal.style.display = 'none';
  }
})

closeStatsModal.addEventListener('click', () => {
  statsModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === statsModal) {
    statsModal.style.display = 'none';
  }
});

function toggleFavourite(id) {
  const song = userData.songs.find(song => song.id === id);
  if (!song) return;
  song.favourite = !song.favourite;
  savePlaylistToStorage();
  renderSongs(userData.songs);
}

favouritesBtn.addEventListener('click', () => {
  const favSongs = userData.songs.filter(song => song.favourite);
  if (favSongs.length === 0) {
    favouritesList.innerHTML = `<li>No favourite songs yet. Click the star on a song to add it!</li>`;
  } else {
    favouritesList.innerHTML = favSongs.map(song =>
      `<li class="favourite-song-item">
        <button class="play-song-btn" onclick="playSong(${song.id})" aria-label="Play song">
          <i class="fa fa-play"></i>
        </button>
        <span>${song.title} <em>by</em> ${song.artist}</span>
      </li>`
    ).join('');
  }
  favouritesModal.style.display = 'block';
  favouritesModal.focus();
});

closeFavouritesModal.addEventListener('click', () => {
  favouritesModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === favouritesModal) {
    favouritesModal.style.display = 'none';
  }
});

// --- Recently Deleted Logic ---

let recentlyDeleted = JSON.parse(localStorage.getItem('recentlyDeletedSongs') || '[]');

// Helper: Remove songs older than 5 days
function cleanRecentlyDeleted() {
  const now = Date.now();
  recentlyDeleted = recentlyDeleted.filter(song => now - song.deletedAt < 5 * 24 * 60 * 60 * 1000);
  localStorage.setItem('recentlyDeletedSongs', JSON.stringify(recentlyDeleted));
}

// Call this after any delete/retrieve
function updateRecentlyDeletedList() {
  cleanRecentlyDeleted();
  if (recentlyDeleted.length === 0) {
    recentlyDeletedList.innerHTML = `<li>No recently deleted songs.</li>`;
  } else {
    recentlyDeletedList.innerHTML = recentlyDeleted.map(song => `
      <li style="display:flex;align-items:center;gap:10px;">
        <span style="flex:1;">${song.title} <em>by</em> ${song.artist}</span>
        <button class="retrieve-song-btn" onclick="retrieveSong(${song.id})" aria-label="Retrieve song"><i class="fa fa-undo"></i></button>
        <button class="delete-song-btn" onclick="permanentlyDeleteSong(${song.id})" aria-label="Delete permanently"><i class="fa fa-trash"></i></button>
      </li>
    `).join('');
  }
}

// Show modal
recentlyDeletedBtn.addEventListener('click', () => {
  updateRecentlyDeletedList();
  recentlyDeletedModal.style.display = 'block';
  recentlyDeletedModal.focus();
});
closeRecentlyDeletedModal.addEventListener('click', () => {
  recentlyDeletedModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === recentlyDeletedModal) {
    recentlyDeletedModal.style.display = 'none';
  }
});

// When deleting a song, move it to recentlyDeleted
function deleteSong(id) {
  const songIndex = userData.songs.findIndex(song => song.id === id);
  if (songIndex === -1) return;

  const song = userData.songs[songIndex];
  // Clean up object URLs if needed
  if (song.src && song.src.startsWith('blob:')) URL.revokeObjectURL(song.src);
  if (song.cover && song.cover.startsWith('blob:')) URL.revokeObjectURL(song.cover);

  // Add to recentlyDeleted with timestamp
  const deletedSong = { ...song, deletedAt: Date.now() };
  recentlyDeleted.push(deletedSong);
  cleanRecentlyDeleted();
  localStorage.setItem('recentlyDeletedSongs', JSON.stringify(recentlyDeleted));

  userData.songs.splice(songIndex, 1);
  savePlaylistToStorage();
  renderSongs(userData.songs);
}

// Retrieve a song
window.retrieveSong = function(id) {
  const idx = recentlyDeleted.findIndex(song => song.id === id);
  if (idx === -1) return;
  const [restored] = recentlyDeleted.splice(idx, 1);
  delete restored.deletedAt;
  userData.songs.push(restored);
  savePlaylistToStorage();
  localStorage.setItem('recentlyDeletedSongs', JSON.stringify(recentlyDeleted));
  renderSongs(userData.songs);
  updateRecentlyDeletedList();
};

// Permanently delete a song
window.permanentlyDeleteSong = function(id) {
  recentlyDeleted = recentlyDeleted.filter(song => song.id !== id);
  localStorage.setItem('recentlyDeletedSongs', JSON.stringify(recentlyDeleted));
  updateRecentlyDeletedList();
};

renderSongs(sortSongs());
loadPlaylistFromStorage();
renderSongs(sortSongs());
setPlayButtonAccessibleText();
updateButtonAriaLabels();
playSong();
createVisualizerBars();
setPlayerDisplay();
highlightCurrentSong();
