//Create variables here
  var dog;
  var dogImage, dogImage1;
  var database;
  var foodS, foodStock;
  var feed, addFood;
  var fedTime, lastFed;
  var foodObj;
  var gameState, readGameState;
  var bedroomImg, washroomImg, gardenImg;

function preload() {
  //loading images here
    dogImage = loadImage("images/dogImg.png");
    dogImage1 = loadImage("images/dogImg1.png");
    bedroomImg = loadImage("images/Bed Room.png");
    washroomImg = loadImage("images/Wash Room.png");
    gardenImg = loadImage("images/Garden.png");
}

function setup() {
  //assigning variable to database
    database = firebase.database();

  //creating canvas
    createCanvas(700,700);

  //object for Food class
    foodObj = new FoodStock ();

  //reading the value of food from database
    foodStock = database.ref('Food');
    foodStock.on("value",readStock);
    
  //reading the value of food from database
    readGameState = database.ref('gameState');
    readGameState.on("value",function(data){
      gameState = data.val();
    })

  //creating buttons for feeding the dog and adding food
    feed = createButton("Feed the Dog");
    feed.position(700,95);
    feed.mousePressed(feedDog);

    addFood = createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods); 
  
  //creating dog sprite
    dog = createSprite(550,500,10,10);
    dog.addImage(dogImage);
    dog.scale = 0.3;
}

function draw() {  
  //background colour
    background(46,139,87);

  //reading the last fed time
    /*fedTime = database.ref('FeedTime');
    fedTime.on("value",function(data) {
      lastFed = data.val();
    })*/

  //changing gameStates
    currentTime = hour();
  
    if(currentTime===(lastFed+1)){
      update("Playing");
      foodObj.garden();
    }else if(currentTime===(lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();
    }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
      foodObj.washroom();
    }else{
      update("Hungry")
      foodObj.display();
    }
   
   if(gameState!=="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImage);
   }

  //drawing sprites  
    drawSprites();
}

//function for reading the value of food from database
  function readStock(data) {
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  }  

//function for feeding the dog  
  function feedDog() {
    dog.addImage(dogImage1);

    if(foodObj.getFoodStock()<= 0){
      foodObj.updateFoodStock(foodObj.getFoodStock()*0);
    }else{
      foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    }

    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour(),
      gameState:"Hungry"
    })
  }

//function for adding food  
  function addFoods() {
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }

//function for updating gameState
  function update(state) {
    database.ref('/').update({
      gameState:state
    })
  }  
