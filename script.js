document.addEventListener("DOMContentLoaded", function(event) {

  let usersMoves = [];
  let simonsMoves = [];
  let gameOn = false;
  let strictMode = false;

  document.querySelectorAll('.colour').forEach(colour => {
    colour.addEventListener("click", (e) => {
      usersMoves.push(e.target.id);
      flash(e.target.id);
    })
  })

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
    console.log(simonsMoves);
  }

  document.querySelector('#start').addEventListener("click", () => chooseSimonsMoves())

  const flash = async (colour) => {
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
      audio.play();
      await new Promise((resolve) => setTimeout(() => {
        document.getElementById(colour).style.background = defaultColor;
        resolve();
      }, 500));
    }
  }

  const turnOn = async () => {
    await flash("red");
    await flash("blue");
    await flash("yellow");
    await flash("green");
  }


});
