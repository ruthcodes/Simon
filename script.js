document.addEventListener("DOMContentLoaded", function(event) {
  let usersMoves = [];
  let simonsMoves = [];
  let gameOn = false;
  let userCanMove = false;
  let strictMode = false;
  let hasClicked = false;
  let compareIndex = 0;
  let moveCounter = "00";
  const colours = ["red", "yellow", "green", "blue"];
  const counter = document.getElementById("counter");

  document.querySelectorAll('.colour').forEach(colour => {
    colour.addEventListener("click", (e) => {if (gameOn && userCanMove) selectMove(e)})
  })

  const selectMove = async (e) => {
    hasClicked = true;
    clearTimeout(waitForUser);
    if (usersMoves.length < 20){
      usersMoves.push(e.target.id);
      await flash(e.target.id);

      if (!compare(e.target.id)) return wrongMove();

      if (usersMoves.length < simonsMoves.length){
        await usersTurn()
      } else {
        if (usersMoves.length === 20){
          return setTimeout(()=> {userWon()}, 1000)
        }
        //wait 2 seconds and then start next turn
        setMoveCounter();
        usersMoves = [];
        compareIndex = 0;
        userCanMove = false;
        setTimeout(()=> {play()},2000)
      }
    }
  }

  document.querySelector('input').addEventListener("click", () => {
    gameOn = !gameOn;
    counter.style.color = gameOn ? "white" : "#58655C"
    toggleStrictMode();
    gameOn ? turnOn() : reset();
  })

  document.querySelector('#strict').addEventListener("click", (e) => toggleStrictMode(e))
  //e only true when called by strict button press
  const toggleStrictMode = (e) => {
    strictMode = gameOn && e ? !strictMode : false
    document.getElementById("strictLight").style.visibility = strictMode ? "visible" : "hidden";
  }

  const chooseSimonsMoves = () => {
    simonsMoves.push(colours[Math.floor(Math.random()*colours.length)]);
  }

  const compare = (colour) => {
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
      audio.play();
      setTimeout(() => {document.getElementById(colour).style.background = defaultColor}, 100)

      await new Promise((resolve) => setTimeout(() => {resolve()}, speed));
    }
  }

  const playSimonsMoves = async () => {
    for (move in simonsMoves){
      await flash(simonsMoves[move], 600)
    }
  }

  const turnOn = async () => {
    setMoveCounter()
    await flash("green", 300);
    await flash("red", 300);
    await flash("blue", 300);
    await flash("yellow", 300);
  }

  const play = async (replay) => {
    usersCanMove = false;
    compareIndex = 0;
    if(!replay){ chooseSimonsMoves()};
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

  const wrongMove = async () => {
    userCanMove = false;
    usersMoves = [];
    counter.innerHTML = "! !"
    counter.classList.add("flash");
    let wrongNoise = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
    wrongNoise.playbackRate = 0.25;
    wrongNoise.play();
    await setTimeout(()=> {
      counter.classList.remove("flash");
      setMoveCounter("wrong");
      strictMode ? reset() : play("replay")
    }, 4000)

  }

  const reset = () => {
    usersMoves = [];
    simonsMoves = [];
    userCanMove = false;
    hasClicked = false;
    compareIndex = 0;
    moveCounter = "00";
    if (gameOn) counter.innerHTML = "00";
    counter.classList.remove("flash");
    clearAllTimeouts();
  }

  const clearAllTimeouts = () =>{
    let id = window.setTimeout(null,0);
    while (id--) {
      window.clearTimeout(id);
    }
  };

  const setMoveCounter = (wrong) => {
    let len = simonsMoves.length;
    if (len > 0){
      if (wrong) {len -= 1}
      moveCounter = len < 10 ? "0"+ len : len.toString();
    }
    counter.style.color = "white";
    counter.innerHTML = moveCounter || "00"
  }

  const userWon = async () => {
    alert("You won!");
    await reset();
    setMoveCounter();
  }
});
