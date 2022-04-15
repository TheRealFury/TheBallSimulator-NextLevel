// Declares variable 'mode' which will decide several things later on.
var mode = 'follow';

// Decides the initial horizontal and vertical speed of the ball.
var horizontalconstant = 70;
var verticalconstant = 10;

// Decides the gravity constant during the gameplay.
var gravitationalconstant = 1;

// Decides the vertical bounce efficiency.
var verticalBounceEfficiency = 0.5;
var horizontalBounceEfficiency = 0.5;

// Variable for air resistance.
var airResistance = 1/50;

function setup(){
  
  // Set the stage - the canvas.
  createCanvas(1350,600);

  // Create all the sprites necessary for the simulator.
  ball = createSprite(300, 100, 10, 10);
  ball.visible = false;
  surface = createSprite(windowWidth/4, 595, windowWidth/2, 10);
  wall1 = createSprite(windowWidth/2, windowHeight/2, 10, windowHeight - 10);
  wall2 = createSprite(5, windowHeight/2, 10, windowHeight - 10);
  ceiling = createSprite(surface.x, surface.y - 585, surface.width, surface.height);

  // Creates the input boxes.
  gravityInput = createInput(str(gravitationalconstant));
  gravityInput.position(wall1.x + 300, 150);
  vBounceInput = createInput(str(verticalBounceEfficiency));
  vBounceInput.position(gravityInput.x, gravityInput.y + 50);
  hBounceInput = createInput(str(horizontalBounceEfficiency));
  hBounceInput.position(vBounceInput.x, vBounceInput.y + 50);
  horizontalInput = createInput(str(horizontalconstant));
  horizontalInput.position(hBounceInput.x, hBounceInput.y + 50);
  verticalInput = createInput(str(verticalconstant));
  verticalInput.position(horizontalInput.x, horizontalInput.y + 50);
  airResistanceInput = createInput(str(airResistance));
  airResistanceInput.position(verticalInput.x, verticalInput.y + 50);

  // Creates the button to save changes.
  submit = createButton('Run');
  submit.position(vBounceInput.x, 500);
  submit.mousePressed(changeValues)
}

function draw(){

  // The background colour.
  background(255);

  // Text displayed beside the inputs.
  fill(0);
  textSize(20);
  text("Gravity : ", gravityInput.x - 275, gravityInput.y + 15);
  text("Vertical Bounce Efficiency : ", gravityInput.x - 275, vBounceInput.y + 15);
  text("Horizontal Bounce Efficiency : ", gravityInput.x - 275, hBounceInput.y + 15);
  text("Initial Horizontal Velocity : ", gravityInput.x - 275, horizontalInput.y + 15);
  text("Initial Vertical Velocity : ", gravityInput.x - 275, verticalInput.y + 15);
  text("Air Resistance : ", gravityInput.x - 275, airResistanceInput.y + 15);

  // The initial mode where ball follows the mouse.
  if(mode == 'follow' && (mouseX < (wall1.x - 10)) && (mouseX > (wall2.x + 10))){

    // Ball follows the mouse.
    ball.x = mouseX;
    ball.y = mouseY;
  }

  // This mode has all the functions that decide the in-game play.
  if(mode == 'run'){

    //  IF FUNCTION that makes sure that the ball remains on top of the surface and controls the vertical bounce efficiency.
    if(ball.y - surface.y > -10 || ball.y - ceiling.y < 10){

      
      if(ball.y - ceiling.y < 10){

        // Set's the ball's position on top of the surface.
        ball.y = ceiling.y = 10;
      }
      
      else if(ball.y - surface.y > -10){

        // Set's the ball's position on top of the surface.
        ball.y = surface.y - 10;
      }

      // Reverses ball's vertical velocity and deducts a value based on the efficiency of the bounce.
      ball.velocityY = -1 * (ball.velocityY * (verticalBounceEfficiency));
    }

    // ELSE FUNCTION that determines everything else.
    else{

      // Add's an artificial gravity's effect on the ball, which pulls it down.
      ball.velocityY += gravitationalconstant;

      // IF CONDITION that sees if the ball in between the two walls, and is not touching them.
      if((wall1.x - ball.x > 10) && (wall2.x - ball.x < 10) && (ball.velocityX != 0)){

        // Add's an artificial air resistance's effect on the ball, which slows it's horizontal movement.
        ball.velocityX -= (ball.velocityX * (airResistance));
      }

      // ELSE CONDITION for if the ball is touching either of the walls.
      else{

        // Wall1
        if(wall1.x - ball.x <= 10){

          // Resets the ball's position to just touching the wall.
          ball.x = wall1.x - 11;

          // Reverses the ball's horizontal velocity.
          ball.velocityX = -1 * (ball.velocityX * (horizontalBounceEfficiency));
        }

        //Wall2
        if(wall2.x - ball.x >= 10){
          
          // Resets the ball's position to just touching the wall.
          ball.x = wall2.x + 11;

          // Reverses the ball's horizontal velocity.
          ball.velocityX = -1 * (ball.velocityX * (horizontalBounceEfficiency));
        }
      }
    }
  }

  // The end-game mode.
  if(mode == 'result'){

    // Set's ball's position to just above the surface.
    ball.y = surface.y - 10;
  }

  // IF CONDITION that enables the click-run function.
  if(mouseIsPressed && (mouseX < (wall1.x - 10)) && (mouseX > (wall2.x + 10))){

    // Change mode so that all on-going logic is first stopped.
    mode = 'follow';

    // Sets ball position to mouse position (to fix the bug that ball does not go to mouse position when mode is simply changed to 'follow').
    ball.x = mouseX;
    ball.y = mouseY;

    // Gives initial velocities to the ball (X and Y).
    ball.velocityX = horizontalconstant;
    ball.velocityY = verticalconstant;

    // Saves the changed values (if any) to the game.
    changeValues();

    // Starts game with logic.
    mode = 'run';
  }

  // Draws a circle where the sprite should be;
  fill('grey');
  circle(ball.x, ball.y, 10);

  // Draws the sprites after all the logic has taken place.
  drawSprites();
}

// In-built function that detects if any key has been pressed.
function keyPressed() {

  // Checks if the spacebar has been pressed.
  if(keyCode == 32){

    // Checks if it's either the start or end of the game, i.e. 'result' or 'follow' respectively.
    if(mode == 'result' || mode == 'follow'){

      // Set's the ball's initial horizontal acceleration.
      ball.velocityX = horizontalconstant;

      // Set's the ball's initial vertical acceleration.
      ball.velocityY = verticalconstant;

      // Changes the mode to 'run', which starts the game logic.
      mode = 'run';
    }
  }
}

// Function to change the values in-game.
function changeValues(){

  // Change gravitational constant.
  gravitationalconstant = parseFloat(gravityInput.value(), 10);
  
  // Change vertical bounce efficiency.
  verticalBounceEfficiency = parseFloat(vBounceInput.value(), 10);

  // Change horizontal bounce efficiency.
  horizontalBounceEfficiency = parseFloat(hBounceInput.value(), 10);

  // Change horizontal constant.
  horizontalconstant = parseFloat(horizontalInput.value(), 10);
  
  // Change vertical constant.
  verticalconstant = parseFloat(verticalInput.value(), 10);

  // Change air resistance constant.
  airResistance = parseFloat(airResistanceInput.value(), 10);

  // Reset the game.
  mode = 'follow';
}