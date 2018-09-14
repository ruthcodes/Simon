//TODO implement strict/regular
//TODO implement counter

document.addEventListener("DOMContentLoaded", function(event) {

  let usersMoves = [];
  let simonsMoves = [];
  let gameOn = false;
  let userCanMove = false;
  let strictMode = false;
  let hasClicked = false;
  let compareIndex = 0;

  const counter = document.getElementById("counter");

  document.querySelectorAll('.colour').forEach(colour => {
    colour.addEventListener("click", (e) => {if (gameOn && userCanMove) selectMove(e)})
  })

  const selectMove = async (e) => {
    hasClicked = true;
    clearTimeout(waitForUser);
    usersMoves.push(e.target.id);
    await flash(e.target.id);
    if (!compare(e.target.id)){

      return wrongMove();
    }
    if (usersMoves.length < simonsMoves.length){
      await usersTurn()
    } else {
      //wait 2 seconds and then start next turn
      usersMoves = [];
      compareIndex = 0;
      userCanMove = false;
      setTimeout(()=> {play()},2000)
    }
  }

  document.querySelector('input').addEventListener("click", () => {
    gameOn = !gameOn;
    toggleStrictMode();
    turnOn()
  })

  document.querySelector('#strict').addEventListener("click", (e) => toggleStrictMode(e))
  //e only true when called by strict button press
  toggleStrictMode = (e) => {
    strictMode = gameOn && e ? !strictMode : false
    document.getElementById("strictLight").style.visibility = strictMode ? "visible" : "hidden";
  }

  chooseSimonsMoves = () => {
    const colours = ["red", "yellow", "green", "blue"];
    let move = colours[Math.floor(Math.random()*colours.length)];
    simonsMoves.push(move);
  }

  compare = (colour) => {
    if (colour === simonsMoves[compareIndex]){
      compareIndex +=1;
      return true
    } else {
      compareIndex = 0;
      return false;
    }
  }

  document.querySelector('#start').addEventListener("click", () => {if (gameOn) play()})

  const flash = async (colour, speed) => {

    if (gameOn){
      switch(colour) {
        case "red":
          defaultColor = 'linear-gradient(#BB2825 0%, #CF2824 5%, #C91B1C 50%, #CF2824 100%)';
          file = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
          break;
        case "green":
          defaultColor = "linear-gradient(#038845 0%, #27AD60 5%, #00974A 50%,#27AD60 95%, #038845 100%";
          file="https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
          break;
        case "yellow":
          defaultColor = "linear-gradient(#D7C017 0%, #DAC014 5%, #D7BE19 50%, #DAC014 100%";
          file="https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
          break;
        case "blue":
          defaultColor = "linear-gradient(#0066B2 0%, #0292D0 5%, #0278BE 50%, #0292D0 100%";
          file="https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
          break;
      }
      let audio = new Audio(file);
      document.getElementById(colour).style.background = colour;
      //flash colour and play sound simultaneously
      setTimeout(() => {document.getElementById(colour).style.background = defaultColor}, 100)
      audio.play();
      await new Promise((resolve) => setTimeout(() => {resolve()}, speed));
    }
  }

  const playSimonsMoves = async () => {
    for (move in simonsMoves){
      await flash(simonsMoves[move], 800)
    }
  }

  const turnOn = async () => {
    await flash("green", 300);
    await flash("red", 300);
    await flash("blue", 300);
    await flash("yellow", 300);
  }

  const play = async () => {
    usersCanMove = false;
    chooseSimonsMoves();
    await playSimonsMoves();
    usersTurn()
  }

  const usersTurn = async () => {
    userCanMove = true;
    hasClicked = false;
    // timeout cleared on user click
    waitForUser = setTimeout(()=> {
      wrongMove();
    }, 2000)
  }

  const wrongMove = () => {
    counter.innerHTML = "! !"
    counter.classList.add("flash");
    setTimeout(()=> counter.classList.remove("flash"), 4000)
    let wrongNoise = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
    wrongNoise.playbackRate = 0.25;
    wrongNoise.play();
    reset();
  }

  reset = () => {
    usersMoves = [];
    simonsMoves = [];
    userCanMove = false;
    hasClicked = false;
    compareIndex = 0;
    if (waitForUser) clearTimeout(waitForUser);
  }

});
