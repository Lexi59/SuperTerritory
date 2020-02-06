function immigrateNewBirds(){
	newYear();
	for(var i = 0; i < immigrationNum; i++){
		var newBird = new Bird();
		immigrate(newBird);
		birds.push(newBird);
	}
}
function moveExistingBirds(){
	for(var i = 0; i < birds.length; i++){
		if(birds[i].territory == -1){
			immigrate(birds[i]);
		}
	}
}
function immigrate(bird){
	var currentNumTries = 0;
	var spotFound = false;
	while(!spotFound && currentNumTries != maxTries){
		var currenti= floor(random(0,territories.length));
		var currentj = floor(random(0,territories.length));
		var currentTerritory = territories[currenti][currentj];
		console.log("Try number "+ currentNumTries+ " trying new spot");
		var r = random();
		if(r < Math.pow(currentTerritory.h,habitatk) && currentTerritory.bird == -1 && !currentTerritory.fire){
			spotFound = true;
			console.log("Bird found spot. r: "+ r+ " y: "+ Math.pow(currentTerritory.h,habitatk)+ " taken: "+ currentTerritory.bird+ " on fire: "+ currentTerritory.fire);
		}
		else{ console.log("Bird moved. r: "+ r+ " y: "+ Math.pow(currentTerritory.h,habitatk)+ " taken: "+ currentTerritory.bird+ " on fire: "+ currentTerritory.fire);}
		if(currentTerritory.bird == -1 && currentTerritory.fire==0){currentNumTries++;}
	}
	bird.territory = currentTerritory;
	currentTerritory.bird = bird;
}

function turnKidsToAdults(){
	for(var i = 0; i < birds.length; i++){
		if(!birds[i].adult){
			birds[i].adult = true;
		}
	}
}

function reproduce(){
	var numNewBirds = 0;
	for(var i = 0; i < birds.length; i++){
		numNewBirds += floor(lamdba*pow(birds[i].territory.h,reproductionk));
		console.log("Bird "+ i+ " had "+ floor(lamdba*pow(birds[i].territory.h, reproductionk)) + " kids in territory with " + birds[i].territory.h);
	}
	for(var i = 0; i < numNewBirds;i++){
		var b = new Bird();
		b.adult = false;
		birds.push(b);
	}
}

function isInGrid(i,j){
	return!(i < 0 || i >= territories.length|| j < 0 || j >= territories.length)
}
function fires(){
	for(var fire = 0; fire < numFires; fire++){
		var firei = floor(random(0,territories.length));
		var firej = floor(random(0,territories.length));
		for(var numFireCells = 0; numFireCells < sizeFire; numFireCells++){
			var fireTerritory = territories[firei][firej];
			if(fireTerritory.bird != -1){immigrate(fireTerritory.bird); fireTerritory.bird = -1;}
			fireTerritory.fire = fireLength;
			console.log("Fire started in cell " + firei + ","+firej);
			var dirx = floor(random(-1,2));
			var diry = floor(random(-1,2));
			while((dirx == 0 && diry == 0) || !isInGrid(firei+dirx,firej+diry) || territories[firei+dirx][firej+diry].fire){
				dirx = floor(random(-1,2));
				diry = floor(random(-1,2));
			}
			firei = firei+dirx;
			firej = firej+diry;
		}
	}
}

function winterSurvival(){
	var survivedBirds = new Array();
	for(var i = 0; i < birds.length; i++){
		if(birds[i].adult && random() > sa){survivedBirds.push(birds[i]);}
		else if (!birds[i].adult && random() > sy){survivedBirds.push(birds[i]);}
		else{birds[i].territory.bird = -1;}
	}
	console.log("Killed " + (birds.length-survivedBirds.length));
	birds = survivedBirds;
}

function newYear(){
	for(var i = 0; i < territories.length; i++){
		for(var j = 0; j < territories.length; j++){
			if(territories[i][j].fire > 0){territories[i][j].fire--;}
		}
	}
}