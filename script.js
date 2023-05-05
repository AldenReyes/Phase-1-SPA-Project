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


//2
const videoPlay = () => {
  const video = document.getElementById("video-player")
  video.play()
}

//3
const videoRandomize = () => {
  console.log("test")
}

const videoLike = () => {
  console.log("like")
}
//call functions
document.getElementById("play").addEventListener("click", videoPlay)
document.getElementById("randomize").addEventListener("click", videoRandomize)
document.getElementById("like").addEventListener("click", videoLike)
videoRandomize()
