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
	var currentNumTries = 0;
	bird.territory = -1;
	while(currentNumTries < maxTries){
		var currenti= floor(random(0,territories.length));
		var currentj = floor(random(0,territories.length));
		var currentTerritory = territories[currenti][currentj];
		if(random() < Math.pow(currentTerritory.h,habitatk) && currentTerritory.bird == -1){
			bird.territory = currentTerritory;
			currentTerritory.bird = bird;
			return;
		}
		currentNumTries++;
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
	}
}

function reproduce(){
	var numNewBirds = 0;
	for(var i = 0; i < birds.length; i++){
		var myMean = lamdba*pow(birds[i].territory.h,reproductionk)
		if(birds[i].territory.fire > 0){myMean *= fireMult;}
		var myBabies = getRandomPoisson(myMean);
		numNewBirds += myBabies;
		//console.log("Bird "+ i+ " had "+ myBabies + " kids in territory with " + birds[i].territory.h + " and fire " + birds[i].territory.fire);
	}
	console.log("Number born: " + numNewBirds);
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
	var poissonFires = getRandomPoisson(numFires);
	var poissonSize = getRandomPoisson(sizeFire);
	console.log("This year there will be " + poissonFires + " fires with size "+ poissonSize);
	for(var fire = 0; fire < poissonFires; fire++){
		var firei = floor(random(0,territories.length));
		var firej = floor(random(0,territories.length));
		for(var numFireCells = 0; numFireCells < poissonSize; numFireCells++){
			var fireTerritory = territories[firei][firej];
			//if(fireTerritory.bird != -1){immigrate(fireTerritory.bird); fireTerritory.bird = -1;}
			fireTerritory.fire = fireLength;
			//console.log("Fire started in cell " + firei + ","+firej);
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
		if(birds[i].adult && random() < sa){survivedBirds.push(birds[i]);}
		else if (!birds[i].adult && random() < sy){survivedBirds.push(birds[i]);}
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