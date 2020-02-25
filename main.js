function immigrateNewBirds(){
	newYear();
	for(var i = 0; i < immigrationNum; i++){
		birds.push(new Bird());
	}
	moveExistingBirds();
}
function moveExistingBirds(){
	for(var i = 0; i < birds.length; i++){
		if(birds[i].territory == -1){
			immigrate(birds[i]);
		}
	}
	cleanBirds();
}
function immigrate(bird){
	if(!birdMoveRandomCheck.checked()){
		var myX, myY;
		//find starting point with parent
		if(bird.parentTerritory){
			for(var r = 0; r < territories.length; r++){
				for(var c = 0; c < territories.length; c++){
					if(territories[r][c] == bird.parentTerritory){
						myX = r;
						myY = c;
					}
				}
			}
		}
		//starting point without parent
		else{
			myX = floor(random(0,territories.length));
			myY = floor(random(0,territories.length));
		}
		//move
		var foundSpot = false;
		var dirx = floor(random(-1,2));
		var diry = floor(random(-1,2));
		var myK;
		count = 0;
		while(!foundSpot && count < maxTries){
			if(!(dirx == 0 && diry == 0) && isInGrid(myX+dirx, myY+diry)){
				myX = myX+dirx;
				myY = myY+diry;
				if(territories[myX][myY].fire > 0){myK = burnk;}
				else{myK = habitatk;}
				if(random() < Math.pow(territories[myX][myY].h,myK) && territories[myX][myY].bird == -1){
					foundSpot = true;
					bird.territory = territories[myX][myY]; 
					territories[myX][myY].bird = bird;
				}
			}
			dirx = floor(random(-1,2));
			diry = floor(random(-1,2));
			count++;
		}
		if(count == maxTries){bird.territory = -1;}
	}
	else{
		var currentNumTries = 0;
		bird.territory = -1;
		while(currentNumTries < maxTries){
			var currenti= floor(random(0,territories.length));
			var currentj = floor(random(0,territories.length));
			var currentTerritory = territories[currenti][currentj];
			if(currentTerritory.fire > 0 && random() < Math.pow(currentTerritory.h, burnk) && currentTerritory.bird == -1){
				bird.territory = currentTerritory;
				currentTerritory.bird = bird;
				return;
			}
			if(random() < Math.pow(currentTerritory.h,habitatk) && currentTerritory.bird == -1){
				bird.territory = currentTerritory;
				currentTerritory.bird = bird;
				return;
			}
			currentNumTries++;
		}
	}
}

function cleanBirds(){
	for(var i = 0; i < birds.length; i++){
		if(birds[i].territory == -1){
			console.log("Bird left");
			birds.splice(i,1);
			i--;
		}
	}
}

function turnKidsToAdults(){
	for(var i = 0; i < birds.length; i++){
		if(!birds[i].adult){
			birds[i].adult = true;
		}
		birds[i].parentTerritory = null;
	}
}

function reproduce(){
	var numNewBirds = 0;
	var adultBirdNumber = birds.length;
	for(var i = 0; i < adultBirdNumber; i++){
		var myMean = lamdba*pow(birds[i].territory.h,reproductionk)
		if(birds[i].territory.fire > 0){myMean *= fireMult;}
		var myBabies = getRandomPoisson(myMean);
		for(var j = 0; j < myBabies; j++){
			var b = new Bird();
			b.adult = false;
			b.parentTerritory = birds[i].territory;
			birds.push(b);
		}
		numNewBirds += myBabies;
	}
	console.log("Number born: " + numNewBirds);
}

function isInGrid(i,j){
	return!(i < 0 || i >= territories.length|| j < 0 || j >= territories.length)
}
function fires(){
	var poissonFires = getRandomPoisson(numFires);
	//console.log("This year there will be " + poissonFires + " fires");
	for(var fire = 0; fire < poissonFires; fire++){
		var firei = floor(random(0,territories.length));
		var firej = floor(random(0,territories.length));
		var poissonSize = getRandomPoisson(sizeFire);
		//console.log("Fire number " + fire + " is size " + poissonSize);
		for(var numFireCells = 0; numFireCells < poissonSize; numFireCells++){
			var fireTerritory = territories[firei][firej];
			if(fireTerritory.bird != -1 && fireMoveCheck.checked()){immigrate(fireTerritory.bird); fireTerritory.bird = -1;}
			fireTerritory.fire = fireLength;
			var dirx = floor(random(-1,2));
			var diry = floor(random(-1,2));
			count = 0;
			while((dirx == 0 && diry == 0) || !isInGrid(firei+dirx,firej+diry) || territories[firei+dirx][firej+diry].fire && count < 20){
				dirx = floor(random(-1,2));
				diry = floor(random(-1,2));
				count++;
			}
			firei = firei+dirx;
			firej = firej+diry;
		}
	}
}

function winterSurvival(){
	var survivedBirds = new Array();
	for(var i = 0; i < birds.length; i++){
		if(birds[i].adult && random() < sa*Math.pow(birds[i].territory.h, surviveKa)){
			survivedBirds.push(birds[i]);
		}
		else if (!birds[i].adult && random() < sy*Math.pow(birds[i].territory.h, surviveKy)){
			survivedBirds.push(birds[i]);
		}
		else{birds[i].territory.bird = -1;}
	}
	console.log((birds.length-survivedBirds.length) + " died");
	birds = survivedBirds;
}

function newYear(){
	for(var i = 0; i < territories.length; i++){
		for(var j = 0; j < territories.length; j++){
			if(territories[i][j].fire > 0){territories[i][j].fire--;}
		}
	}
}