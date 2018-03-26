$(document).ready(function(){
  var on = false;
  var gameRunning = false;
  var whosTurn = "computer";
  var userButtonClick;
  var compareIndex = 0;
  var counter = 0;
  var computerMoves = [];
  var userMoves = [];

  //four buttons in game
  var buttons = ["red", "yellow", "green", "blue"];
  var strictMode = false;

  //code to take user input
  $( ".colour" ).each(function() {
    $(this).on("click", function(event){
      if (on && gameRunning && whosTurn == "human"){
        var btnColour = $(this).attr('id');
        userMove(btnColour);
        flash(btnColour);
        playAudio(btnColour);
        clearTimeout(userButtonClick);
        if (btnColour == computerMoves[compareIndex]){
          compareIndex+=1;
          setTimeout(function(){usersTurn(btnColour);}, 4000);
          userButtonClick = setTimeout(function(){ wrongMove(); }, 5000);
        } else {
          compareIndex=0;
          wrongMove();
        }
      }
    });   
  });

  //on/off switch
  $('#onOff :checkbox').change(function() { 
    if (this.checked) {
      on = false;
      reset();
      gameRunning = false;
      clearAllTimeouts();
      $("#counter").css('color', '#58655C');
      $("#counter").text('00');
      strictMode = false;
      $(".fa").css('visibility', 'hidden');
    } else {
      on = true;
      $("#counter").css('color', 'white');
      flash("red");
      playAudio("red");
      setTimeout(function(){ flash("blue"); playAudio("blue"); }, 500);  
      setTimeout(function(){ flash("yellow"); playAudio("yellow"); }, 1000); 
      setTimeout(function(){ flash("green"); playAudio("green"); }, 1500); 
    }
  });

  $("#strict").on("click", function(e){
    if (on){
      if (!strictMode){
        strictMode = true;
        $(".fa").css('visibility', 'visible');
      } else {
        strictMode = false;
        $(".fa").css('visibility', 'hidden');
      }
    }
  });

  $("#start").on("click", function(e){
    if (on && !gameRunning){
      gameRunning = true;
      play();
    } else if (on && gameRunning){
      clearAllTimeouts()
      reset();
      setTimeout(function(){ $("#counter").text("00"); }, 500);
      setTimeout(function(){ play(); }, 2000);
    }
  });

  function flash(btnColor){
    if(on){
      var flashColor;
      var defaultColor;
      switch(btnColor) {
        case "red":
          flashColor = "red";
          defaultColor = 'linear-gradient(#BB2825 0%, #CF2824 5%, #C91B1C 50%, #CF2824 100%)';
          break;
        case "green":
          flashColor = "green";
          defaultColor = "linear-gradient(#038845 0%, #27AD60 5%, #00974A 50%,#27AD60 95%, #038845 100%";
          break;
        case "yellow":
          flashColor = "yellow";
          defaultColor = "linear-gradient(#D7C017 0%, #DAC014 5%, #D7BE19 50%, #DAC014 100%";
          break;
        case "blue":
          flashColor = "blue";
          defaultColor = "linear-gradient(#0066B2 0%, #0292D0 5%, #0278BE 50%, #0292D0 100%";
          break;
      }
      $('#' + btnColor).css('background', flashColor);
      setTimeout(function(){ $('#' + btnColor).css('background',defaultColor); }, 200);      
    }
  }

  function clearAllTimeouts(){
    var id = window.setTimeout(null,0);
    while (id--) {
      window.clearTimeout(id);
    }
  };

  function reset(){
    counter = 0;
    computerMoves = [];
    userMoves = [];
  }


  function play(skip){
    whosTurn="computer";
    if (on){

      if(skip === undefined){
        selectMove();
      }

      playMoves().done(function(){
        whosTurn = "human";
        compareIndex=0;
        userButtonClick = setTimeout(function(){ wrongMove(); }, 5000);
      });
    }
  }

  function wrongMove(){
    whosTurn = "computer";
    clearTimeout(userButtonClick);
    $("#counter").text("--");
    if (strictMode){
      counter = 0;
      setTimeout(function(){ $("#counter").text("00"); }, 500);
      clearAllTimeouts();
      computerMoves = [];
      userMoves = [];
    } else {
      userMoves = [];
      setTimeout(function(){ if (counter <10){
        $("#counter").text("0" + counter);
      } else {
        $("#counter").text(counter);
      }; }, 500); 
    }
    flash("red");
    flash("blue");
    flash("yellow");
    flash("green");
    playAudio("blue");

    if(strictMode){
      setTimeout(function(){ play(); }, 2000);
    }else{
      setTimeout(function(){ play("skip"); }, 2000);
    }
  }

  function selectMove(){
    var move = buttons[Math.floor(Math.random()*buttons.length)];

    computerMoves.push(move);
    counter +=1;
    if (counter <10){
      $("#counter").text("0" + counter);
    } else {
      $("#counter").text(counter);
    }
  }

  userMove = (entered) => { userMoves.push(entered); };
 /* function userMove(entered){
    userMoves.push(entered);
  }*/

  function usersTurn(move){
    if(userMoves.length == computerMoves.length){
      clearTimeout(userButtonClick);
      if (userMoves.length == 20){
        flash("red");
        flash("blue");
        flash("yellow");
        flash("green");
        playAudio("red");
        $("#counter").text("!!");
        reset();
        setTimeout(() =>{ $("#counter").text("00"); }, 500);
        setTimeout(() =>{ play(); }, 4000);
      } else {
        whosTurn="computer";
        play();
      }
    } 
  };

  function playAudio(colour){
    if (on){
      var file;
      switch(colour) {
        case "red":
          file="https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
          break;
        case "green":
          file="https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
          break;
        case "yellow":
          file="https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
          break;
        case "blue":
          file="https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
          break;
      }
      var audio = new Audio(file);
      audio.play();
    }
  }


  function playMoves(){
    userMoves = [];
    var promises = [];
    var promise = Promise.resolve();
    computerMoves.forEach(function(i){
      whosTurn="computer";
      promises.push(
        promise = promise.then(function () {
          flash(i);
          playAudio(i);
          return new Promise(function (resolve) {
            setTimeout(resolve, 1000);
          });
        })
      )
    })
    return Promise.all(promises);
  };

});
