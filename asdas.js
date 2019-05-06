
    var game;
    var ball;
    var blocks;
    var goal;
    var accel;
    
    var numBlocks = 10;
    var blockCounter;
    
    Block = function(){
        tBlock = new Sprite(game, "block.png", 50, 50);
        tBlock.setSpeed(0);
        
        tBlock.setPosition(200, 200);
        
        tBlock.reset = function(){
            //don't let me overlap the goal or ball
            keepGoing = true;
            while(keepGoing){            
                newX = Math.random() * this.cWidth;
                newY = Math.random() * this.cHeight;
                
                this.setPosition(newX, newY);
                keepGoing = false;
                if (this.collidesWith(goal)){
                    keepGoing = true;
                } // end if
                if (this.distanceTo(ball)< 150){
                    keepGoing = true;
                } // end if
            } // end while loop
        } // end reset
        
        tBlock.reset();
        
        return tBlock;
    } // end Block
    
    function setupBlocks(){
        blocks = null;
        blocks = new Array(numBlocks)
        for (i = 0; i < numBlocks; i++){
            blocks[i] = new Block();
        } // end for
    } // end setupBlocks
    
    function updateBlocks(){
        for (i = 0; i < numBlocks; i++){
            if (blocks[i].collidesWith(ball)){
              //hide current block to prevent refresh bug.
              blocks[i].hide();
              alert("You lose");
              game.stop();
              //re-start game
              document.location.href = "";
            } // end if
            
            blocks[i].update();
        } // end for
        
        
    } // end updateBlocks
    
    Ball = function(){
        tBall = new Sprite(game, "redBall.png", 25, 25);
        tBall.setSpeed(0);
        tBall.setPosition(100, 100);
        
        tBall.reset = function(){
            newX = Math.random() * this.cWidth;
            newY = Math.random() * this.cHeight;
            
            this.setPosition(newX, newY);            
        } // end reset
    
        tBall.checkKeys = function(){
            //temporary function for testing
            if (keysDown[K_UP]){
                this.changeYby(-5);
            }
            
            if (keysDown[K_DOWN]){
                this.changeYby(5);
            }
            
            if (keysDown[K_LEFT]){
                this.changeXby(-5);
            }
            
            if (keysDown[K_RIGHT]){
                this.changeXby(5);
            }
        } // end checkKeys
        
        tBall.checkAccel = function(){
            //use the accelerometer to get input
            newDX = accel.getAY();
            newDY = accel.getAX();
            
            newDX *= -5;
            newDY *= -5;
            
            ball.setDX(newDX);
            ball.setDY(newDY);
        } // end checkAccel
        
        return tBall;
    } // end ball
    
    Goal = function(){
        tGoal = new Sprite(game, "goal.png", 50, 50);
        tGoal.setSpeed(0);
        
        tGoal.reset = function(){
            newX = Math.random() * this.cWidth;
            newY = Math.random() * this.cHeight;
            
            this.setPosition(newX, newY);
        } // end reset
        
        tGoal.reset();
        
        return tGoal;
    } // end goal
    
    function checkGoal(){
        if (ball.collidesWith(goal)){
            blocks = null;
            numBlocks++;
            blockCounter.innerHTML = "Blocks: " + numBlocks;
            goal.reset();
            setupBlocks();
        } // end if
    } // end check
    
    function init(){
        game = new Scene();
        ball = new Ball();
        goal = new Goal();
        setupBlocks();
        
        blockCounter = document.getElementById("blockCounter");
        accel = new Accel();
        
        game.start();
    } // end init
    
    function update(){
        game.clear();
        //get input from accelerometer or keyboard
        if (game.touchable){
            ball.checkAccel();            
        } else {
            ball.checkKeys();            
        }
        
        checkGoal();
        goal.update();
        ball.update();
        updateBlocks();
    } // end update
    
    