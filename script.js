const URL = ["http://localhost:3000/clips"];
const savedVideos = ["http://localhost:3000/savedclips"];
let videoOnPage = null;

const fetchVideos = async (URL, selectedName) => {
  const response = await fetch(URL);
  const movies = await response.json();
  if (selectedName) {
    return movies.filter((movie) => movie.movie === selectedName);
  }
  return movies;
};

const videoLoad = (video) => {
  const videoInfo = document.getElementById("video-info");
  const h2 = videoInfo.querySelector("h2");
  const img = document.getElementById("poster");
  const videoPlayer = document.getElementById("video-player");
  h2.textContent = `${video.movie} - ${video.year} - Wow #${video.current_wow_in_movie} of ${video.total_wows_in_movie}`;
  img.setAttribute("src", video.poster);
  videoPlayer.setAttribute("src", video.video["360p"]);
  videoOnPage = video;
};

const videoPlay = () => {
  const video = document.getElementById("video-player");
  video.play();
};

const videoRandomize = (URL) => {
  const randomMovieIndex = Math.floor(Math.random() * URL.flat().length);
  return URL.flat()[randomMovieIndex];
};

const populateDropdown = (URL) => {
  const select = document.getElementById("movie-select");
  const uniqueNames = {};
  URL.map((movie) => {
    //if name is not unique, continue
    if (!uniqueNames[movie["movie"]]) {
      const option = document.createElement("option");
      option.setAttribute("value", movie["movie"]);
      option.textContent = `${movie["movie"]} - ${movie["total_wows_in_movie"]} total`;
      select.appendChild(option);
      uniqueNames[movie["movie"]] = true;
    }
  });
  return URL;
};

const videoDelete = async (id) => {
  try {
    await fetch(`http://localhost:3000/savedclips/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });
  } catch (error) {
    alert("Could not delete, please try again!");
  }
};

const createSidebarElement = (video) => {
  const entry = document.createElement("button");
  const sidebarElement = document
    .getElementById("saved-videos-container")
    .querySelector("ul");
  entry.setAttribute("id", `${video.id}`);
  entry.textContent = `${video.movie} - #${video.current_wow_in_movie}`;
  entry.setAttribute("class", "controls-side");
  sidebarElement.appendChild(entry);
  entry.addEventListener("click", (e) => {
    fetchVideos(`${URL}/${e.target.id}`)
      .then((video) => videoLoad(video))
      .then(videoPlay);
  });
};

const loadSidebar = (videos) => {
  document
    .getElementById("saved-videos-container")
    .querySelector("ul").innerHTML = "";
  videos.map((video) => createSidebarElement(video));
  return videos;
};

const initialFetch = () => {
  fetchVideos(URL)
    .then((videos) => populateDropdown(videos))
    .then((videos) => videoRandomize(videos))
    .then((video) => videoLoad(video));
};

const deleteAllFromDB = (videos) => {
  videos.map((video) => videoDelete(video.id));
};

const clearSidebar = () => {
  document
    .getElementById("saved-videos-container")
    .querySelector("ul").innerHTML = "";
};

// handlers
const handleSidebarAfterSave = async () => {
  await handleSave();
  fetchVideos(savedVideos).then((videos) => loadSidebar(videos));
};

const handleSave = async () => {
  try {
    await fetch(savedVideos, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(videoOnPage),
    });
  } catch (error) {
    alert("You've already added this clip to your liked videos!");
  }
};

const handleRandomizeBtn = () => {
  const selectedNameValue = document.getElementById("movie-select").value;
  fetchVideos(URL, selectedNameValue)
    .then((videos) => videoRandomize(videos))
    .then((movie) => videoLoad(movie))
    .then(videoPlay);
};

const showHotkeys = () => {
  document
    .getElementById("hotkeys")
    .querySelector("span")
    .removeAttribute("hidden");
};

const hideHotkeys = () => {
  document
    .getElementById("hotkeys")
    .querySelector("span")
    .setAttribute("hidden", "");
};

const handleClear = () => {
  fetchVideos(savedVideos)
    .then((video) => deleteAllFromDB(video))
    .then(clearSidebar);
};

const handleKeydown = (e) => {
  if (e.key === "p") {
    videoPlay();
  }
  if (e.key === "r") {
    handleRandomizeBtn();
  }
  if (e.key === "s") {
    handleSidebarAfterSave();
  }
  if (e.key === "c") {
    handleClear();
  }
};

//call functions on page load
initialFetch();
fetchVideos(savedVideos).then((videos) => loadSidebar(videos));

//event listeners
document.addEventListener("keydown", handleKeydown);
document.getElementById("play").addEventListener("click", videoPlay);
document
  .getElementById("like")
  .addEventListener("click", handleSidebarAfterSave);
document
  .getElementById("randomize")
  .addEventListener("click", handleRandomizeBtn);
document.getElementById("hotkeys").addEventListener("mouseenter", showHotkeys);
document.getElementById("hotkeys").addEventListener("mouseleave", hideHotkeys);
document
  .getElementById("clear-button")
  .querySelector("button")
  .addEventListener("click", handleClear);
