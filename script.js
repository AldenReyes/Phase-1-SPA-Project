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
const URL = [
  "http://localhost:3000/clips",
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
const videoRandomize = async (URL) => {
  //returns a random video
  const response = await fetch(URL)
  const movies = await response.json()
  const randomMovieIndex = Math.floor(Math.random() * movies.length)
  return movies[randomMovieIndex]
}

const videoLike = () => {
  console.log("like")
}

//event listeners
document.getElementById("play").addEventListener("click", videoPlay)
document.getElementById("randomize").addEventListener("click", () => (videoRandomize(URL).then(movie => loadVideo(movie)).then(videoPlay)))
document.getElementById("like").addEventListener("click", videoLike)
//call functions
videoRandomize(URL).then(movie => loadVideo(movie))

