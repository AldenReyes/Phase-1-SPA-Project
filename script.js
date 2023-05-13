/* 
Outline of functions
1. DONE dynamically populate video + info from db.json on page load
2. DONE create a function that plays video on play button press
3. DONE create a randomizer function that returns a random movie object when passed db.json
4. DONE Connect html id = "randomizer" button to randomizer function
5. DONE Create another "like" button that saves a video to a sidebar with an id of "saved-videos"
6. After clicking a video on the side bar, populate main info + video element with video selected
7. DONE Connect movie select dropdown to allow for users to adjust the video returned from randomizer button to a specific movie with the default behavior being all movies
8. Delete button on liked videos
*/
const URL = [
  "http://localhost:3000/clips",
];
const savedVideos = [
  "http://localhost:3000/savedclips"
]
let videoOnPage = null

const fetchVideos = async (URL, selectedName) => {
  const response = await fetch(URL)
  const movies = await response.json()
  if (selectedName) {
    return movies.filter(movie => movie.movie === selectedName)
  }
  return movies
}

const videoLoad = (video) => {
  const videoInfo = document.getElementById("video-info")
  const h2 = videoInfo.querySelector("h2")
  const img = document.getElementById("poster")
  const videoPlayer = document.getElementById("video-player")
  h2.textContent = `${video.movie} - ${video.year} - Wow #${video.current_wow_in_movie} of ${video.total_wows_in_movie}`
  img.setAttribute("src", video.poster)
  videoPlayer.setAttribute("src", video.video["360p"])
  videoOnPage = video
}

const videoPlay = () => {
  const video = document.getElementById("video-player")
  video.play()
}

const videoRandomize = (URL) => {
  const randomMovieIndex = Math.floor(Math.random() * URL.flat().length)
  return URL.flat()[randomMovieIndex]
}

const populateDropdown = (URL) => {
  const select = document.getElementById("movie-select")
  const uniqueNames = {}
  URL.map(movie => {
    //if name is not unique, continue
    if (!uniqueNames[movie["movie"]]){
    const option = document.createElement("option")
    option.setAttribute("value", movie["movie"])
    option.textContent = `${movie["movie"]} - ${movie["total_wows_in_movie"]} total`
    select.appendChild(option)
    uniqueNames[movie["movie"]] = true
  }})
  return URL
}

const videoDelete = async (id) => {
  try {
    await fetch(`http://localhost:3000/savedclips/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      },
    })
  } catch (error) {
    alert("Could not delete, please try again!")
  }
}

const createSidebarElement = (video) => {
  const entry = document.createElement("button")
  const sidebarElement = document.getElementById("saved-videos-container").querySelector("ul")
  entry.setAttribute("id", `${video.id}`)
  entry.textContent = `${video.movie} - #${video.current_wow_in_movie}`
  entry.setAttribute("class", "controls-side")
  sidebarElement.appendChild(entry)
  entry.addEventListener("click", (e) => {
    fetchVideos(`${URL}/${e.target.id}`)
    .then(video => videoLoad(video))
    .then(videoPlay)
  })
}

const loadSidebar = (videos) => {
  document.getElementById("saved-videos-container").querySelector("ul").innerHTML = ""
  videos.map(video =>  createSidebarElement(video))
  return videos
}

const initialFetch = () => {
  fetchVideos(URL)
  .then(videos => populateDropdown(videos))
  .then(videos => videoRandomize(videos))
  .then(video => videoLoad(video))
}



// handlers
const handleSidebarAfterSave = async () => {
    await handleSave()
    fetchVideos(savedVideos)
    .then(videos => loadSidebar(videos))
}

const handleSave = async () => {
  try {
    const response = await fetch(savedVideos, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(videoOnPage)
})
  const savedVideo = await response.json()
} catch (error) {
  alert("You've already added this clip to your liked videos!")
}}

const handleRandomizeBtn = () => {
  const selectedNameValue = document.getElementById("movie-select").value
  fetchVideos(URL, selectedNameValue)
  .then(videos => videoRandomize(videos))
  .then(movie => videoLoad(movie))
  .then(videoPlay)
}

const handleKeydown = (e) => {
  if (e.key === "p") {
    videoPlay()
  }
  if (e.key === "r") {
    handleRandomizeBtn()
  }
  if (e.key === "s") {
    handleSidebarAfterSave()
  }
}

//call functions

initialFetch()
fetchVideos(savedVideos)
.then(videos => loadSidebar(videos))

//event listeners
document.addEventListener("keydown", handleKeydown)
document.getElementById("play").addEventListener("click", videoPlay)
document.getElementById("like").addEventListener("click", handleSidebarAfterSave)
document.getElementById("randomize").addEventListener("click", handleRandomizeBtn)
// document.getElementById("poster").addEventListener("mouseenter", (e) => console.log(e))
// document.getElementById("poster").addEventListener("mouseleave", (e) => console.log(e))
