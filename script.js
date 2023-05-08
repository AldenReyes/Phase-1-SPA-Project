/* 
Outline of functions
1. DONE dynamically populate video + info from db.json on page load
2. DONE create a function that plays video on play button press
3. DONE create a randomizer function that returns a random movie object when passed db.json
4. DONE Connect html id = "randomizer" button to randomizer function
5. Create another "like" button that saves a video to a sidebar with an id of "saved-videos"
6. After clicking a video on the side bar, populate main info + video element with video selected
7. Connect movie select dropdown to allow for users to adjust the video returned from randomizer button to a specific movie with the default behavior being all movies
*/
const URL = [
  "http://localhost:3000/clips",
];

const fetchAllVideos = async (URL) => {
  let all = []
  const response = await fetch(URL)
  const movies = await response.json()
  all.push(movies)
  return all
}

const videoLoad = (video) => {
  const videoInfo = document.getElementById("video-info")
  const h2 = videoInfo.querySelector("h2")
  const img = document.getElementById("poster").querySelector("img")
  const videoPlayer = document.getElementById("video-player")
  h2.textContent = `${video.movie} - ${video.year} - Wow #${video.current_wow_in_movie} of ${video.total_wows_in_movie}`
  img.setAttribute("src", video.poster)
  videoPlayer.setAttribute("src", video.video["360p"])
  return video
}

const videoPlay = () => {
  const video = document.getElementById("video-player")
  video.play()
}

const videoRandomize = (URL) => {
  const randomMovieIndex = Math.floor(Math.random() * URL[0].length)
  return URL[0][randomMovieIndex]
}

const videoLike = () => {
  console.log("like")
}

const populateDropdown = (URL) => {
  const select = document.getElementById("movie-select")
  URL[0].forEach(movie => {
    const option = document.createElement("option")
    option.textContent = movie["movie"]
    select.appendChild(option)
  })
  return URL
}

//event listeners
document.getElementById("play").addEventListener("click", videoPlay)
document.getElementById("randomize").addEventListener("click", () => (fetchAllVideos(URL).then(videos => videoRandomize(videos)).then(movie => videoLoad(movie)).then(videoPlay)))
document.getElementById("like").addEventListener("click", videoLike)

//call functions
fetchAllVideos(URL).then(videos => populateDropdown(videos)).then(videos => videoRandomize(videos)).then(video => videoLoad(video))

