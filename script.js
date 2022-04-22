//Global Constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [0, 0, 0, 0, 0, 0];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.3;
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var numOfMistakes = 0;


function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  numOfMistakes = 0;
  
  //the following code swaps the "start" and "stop" buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  generatePattern();
  console.log(pattern);
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 578,
  6: 650
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")

}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    clueHoldTime-=40;
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
  clueHoldTime = 1000;
}

function winGame(){
  stopGame();
  alert("Congratulations! You won!")
  clueHoldTime = 1000;
}

function guess(btn){
  console.log("User guessed: " + btn)
  console.log("Answer: " + pattern[guessCounter])
  if(!gamePlaying){
    return;
  }
  if(btn==pattern[guessCounter]){
    //check if game needs to end
    if(guessCounter == progress){
      if(progress == pattern.length -1){
        winGame();
      }else{
        progress+=1;
        playClueSequence();
      }
    }else{
      guessCounter+=1;
    }
  }else{
      numOfMistakes+=1
    if(numOfMistakes > 2){
      loseGame();
    }
  }
  console.log("Number of Mistakes: " + numOfMistakes)
}

function generatePattern(){
  /* Declaring local variables */
  var min = 1;
  var max = 6;
  for(let i = 0; i < pattern.length; i++){
      pattern[i] = Math.floor(Math.random() * (max - min + 1) + min)
  }
}