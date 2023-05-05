/* 
Outline of functions
1. dynamically populate video + info from db.json on page load
2. DONE create a function that plays video on play button press
3. create a randomizer function that returns a random movie object when passed db.json
4. Connect html id = "randomizer" button to randomizer function
5. Create another "like" button that saves a video to a sidebar with an id of "saved-videos"
6. After clicking a video on the side bar, populate main info + video element with video selected
7. Connect movie select dropdown to allow for users to adjust the video returned from randomizer button to a specific movie with the default behavior being all movies
*/
const URLS = [
  "http://localhost:3000/1996",
  "http://localhost:3000/1999",
  "http://localhost:3000/2000",
  "http://localhost:3000/2001",
  "http://localhost:3000/2002",
  "http://localhost:3000/2003",
  "http://localhost:3000/2004",
  "http://localhost:3000/2005",
  "http://localhost:3000/2006",
  "http://localhost:3000/2007",
  "http://localhost:3000/2008",
  "http://localhost:3000/2010",
  "http://localhost:3000/2011",
  "http://localhost:3000/2013",
  "http://localhost:3000/2014",
  "http://localhost:3000/2015",
  "http://localhost:3000/2017",
];

const loadVideo = (video) => {
  const videoInfo = document.getElementById("video-info")
  const h2 = videoInfo.querySelector("h2")
  const p = videoInfo.querySelector("p")
  const img = videoInfo.querySelector("img")
  const videoPlayer = document.getElementById("video-player")
  h2.textContent = `${video.movie} - ${video.year}`
  p.textContent = `Character: ${video.character} | Wow #${video.current_wow_in_movie} of ${video.total_wows_in_movie}`
  img.setAttribute("src", video.poster)
  videoPlayer.setAttribute("src", video.video["360p"])
}

//2
const videoPlay = () => {
  const video = document.getElementById("video-player")
  video.play()
}

//3
const videoRandomize = async (URLS) => {
  //returns a random video
  const randomUrlIndex = Math.floor(Math.random() * URLS.length)
  const url = URLS[randomUrlIndex]
  const response = await fetch(url)
  const movies = await response.json()
  const randomMovieIndex = Math.floor(Math.random() * movies.length)
  return movies[randomMovieIndex]
}

const videoLike = () => {
  console.log("like")
}

//event listeners
document.addEventListener("DOMContentLoaded", (videoRandomize(URLS).then(movie => loadVideo(movie))))
document.getElementById("play").addEventListener("click", videoPlay)
document.getElementById("randomize").addEventListener("click", () => (videoRandomize(URLS).then(movie => loadVideo(movie)).then(videoPlay)))
document.getElementById("like").addEventListener("click", videoLike)
//call functions


