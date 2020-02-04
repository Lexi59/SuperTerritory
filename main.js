//visualization variables
let canvasDiv, canvas, gridsize, inputDiv, inputSize;
let running = -1, step = 0, status;
//input variables
let kInput, sizeInput, lamdbaInput, syInput, saInput, superCutoffInput;
let maxTriesInput, immigrationNumInput, numFiresInput, sizeFireInput, yearsInput;
//world variables
let k,size,lamdba,sy,sa,superCutoff,maxTries,immigrationNum,numFires,sizeFire, years;
//territory variables
let territories;
//bird variables
let birds;
//data variables
let tableData;

function setup(){
	//create canvas
	gridsize = min(windowWidth/2, windowHeight);
	canvasDiv = createDiv();
	canvasDiv.size(gridsize,gridsize);
	canvasDiv.style('float','left');
	canvasDiv.style('display','inline-block');
	canvas = createCanvas(gridsize,gridsize);
	canvas.parent(canvasDiv);
	frameRate(1);

	//create inputs
	inputDiv = createDiv();
	inputDiv.size(175,20*23);
	inputDiv.style('display','inline-block');
	inputDiv.style('padding','20px');

	status = createP('Waiting for input').parent(inputDiv);

	kp = createElement('label',"k:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	kInput = createInput();
	kInput.parent(inputDiv);
	kInput.attribute('placeholder', '1');
	createElement('br').parent(inputDiv);
	//bigger number here means more picky

	kp = createElement('label',"size:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	sizeInput = createInput();
	sizeInput.parent(inputDiv);
	sizeInput.attribute('placeholder', '8');
	createElement('br').parent(inputDiv);

	kp = createElement('label',"lamdba:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	lamdbaInput = createInput();
	lamdbaInput.parent(inputDiv);
	lamdbaInput.attribute('placeholder', '2');
	createElement('br').parent(inputDiv);

	kp = createElement('label',"sy:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	syInput = createInput();
	syInput.parent(inputDiv);
	syInput.attribute('placeholder', '.4');
	createElement('br').parent(inputDiv);

	kp = createElement('label',"sa:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	saInput = createInput();
	saInput.parent(inputDiv);
	saInput.attribute('placeholder', '.6');
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Super Territory Cutoff:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	superCutoffInput = createInput();
	superCutoffInput.parent(inputDiv);
	superCutoffInput.attribute('placeholder', '.85');
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Maximum Tries to move:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	maxTriesInput = createInput();
	maxTriesInput.parent(inputDiv);
	maxTriesInput.attribute('placeholder', '50% of cells');
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Number to Immigrate:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	immigrationNumInput = createInput();
	immigrationNumInput.parent(inputDiv);
	immigrationNumInput.attribute('placeholder', '10');
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Number of Fires:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	numFiresInput = createInput();
	numFiresInput.parent(inputDiv);
	numFiresInput.attribute('placeholder', '1');
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Size of Fire:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	sizeFireInput = createInput();
	sizeFireInput.parent(inputDiv);
	sizeFireInput.attribute('placeholder', '10% of cells');
	createElement('br').parent(inputDiv);

	kp = createElement('label',"years:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	yearsInput = createInput();
	yearsInput.parent(inputDiv);
	yearsInput.attribute('placeholder','1');
	createElement('br').parent(inputDiv);

	//create Button
	submitBtn = createButton('Submit');
	submitBtn.parent(inputDiv);
	submitBtn.mousePressed(buttonPressed);
}
function draw(){
	if(running > -1 && running < years){
		if(step == 0){immigrateNewBirds(); status.html('Immigrating new birds');}
		if(step == 1){recordNumbers(); status.html('Recording Numbers');}
		if(step == 2){turnKidsToAdults(); status.html('turning kids into adults');}
		if(step == 3){reproduce(); status.html('reproducing');}
		if(step == 4){moveExistingBirds(); status.html('Dispersing children');}
		if(step == 5){fires(); status.html('Starting fires');}
		if(step == 6){winterSurvival(); status.html('winter');}
		if(step == 7){adjustHabitatQuality(); status.html('adjusting Habitat Qualities');}
		if(step == 8){running++; step = 0;}	
		step++;
	}
	else{
		status.html('Waiting for input');
	}
	if(running == years){
		outputData();  
		running = -1;
	}
	drawTerritories();
	drawBirds();
}
function drawTerritories(){
	if(!territories){return;}
	//draw normal cells
	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			var t = territories[i][j];
			stroke(0);
			strokeWeight(2);
			if (t.fire){fill(255,0,0);}
			else{fill(map(t.h,0,1,0,255));}
			rect(t.x, t.y, t.s, t.s);
		}
	}
	//draw super territories
	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			var t = territories[i][j];
			if(t.h >= superCutoff){
				strokeWeight(4);
				stroke(212,175,55);
				if(t.fire){fill(255,0,0);}
				else{fill(map(t.h,0,1,0,255))};
				rect(t.x, t.y, t.s, t.s);
			}
		}
	}
}
function drawBirds(){
	stroke(0);
	strokeWeight(2);
	if(!birds){return;}
	for(var i = 0; i < birds.length; i++){
		var t = birds[i].territory;
		if(birds[i].adult){fill(255,0,255);}
		else{fill(0,0,255);}
		ellipse(t.x+t.s/2,t.y+t.s/2,t.s/2,t.s/2);
	}
}
function buttonPressed(){
	//reset values
	territories = new Array();
	birds = new Array();
	tableData = new Array();

	//fill in new values
	if(int(kInput.value()) > 0){k = int(kInput.value());}
	else{k = 1; kInput.value(k);}
	if(int(sizeInput.value()) > 0){size = sizeInput.value();}
	else{size = 8; sizeInput.value(size);}
	if(int(lamdbaInput.value()) > 0){lamdba = lamdbaInput.value();}
	else{lamdba = 2; lamdbaInput.value(lamdba);}
	if(syInput.value() > 0 ){sy = syInput.value();}
	else{sy = .4; syInput.value(sy);}
	if(saInput.value() > 0){sa = saInput.value();}
	else{sa = .6; saInput.value(sa);}
	if(superCutoffInput.value() > 0){superCutoff = superCutoffInput.value();}
	else{superCutoff = .85; superCutoffInput.value(superCutoff);}
	if(int(maxTriesInput.value()) > 0){maxTries = int(maxTriesInput.value());}
	else{maxTries = floor(.5*(size*size)); maxTriesInput.value(maxTries);}
	if(int(immigrationNumInput.value()) > 0){immigrationNum = immigrationNumInput.value();}
	else{immigrationNum = 10; immigrationNumInput.value(immigrationNum);}
	if(int(numFiresInput.value()) > 0){numFires = numFiresInput.value();}
	else{numFires = 1; numFiresInput.value(numFires);}
	if(int(sizeFireInput.value()) > 0){sizeFire = sizeFireInput.value();}
	else{sizeFire = floor(.1*(size*size)); sizeFireInput.value(sizeFire);}
	if(int(yearsInput.value()) > 0){years = yearsInput.value();}
	else{years = 1; yearsInput.value(years);}

	//algorithm
	initializeTerritories();
	running = 0;
	step = 0;
}
function initializeTerritories(){
	var s = gridsize/size;
	for(var i = 0; i < size; i++){
		var temp = new Array();
		for(var j = 0; j < size; j++){
			temp.push(new Territory(j*s, i*s, s, random()));
		}
		territories.push(temp);
	}
}

function immigrateNewBirds(){
	for(var i = 0; i < immigrationNum; i++){
		var newBird = new Bird();
		immigrate(newBird);
		birds.push(newBird);
	}
}

function immigrate(bird){
	var currentNumTries = 0;
	var spotFound = false;
	while(!spotFound && currentNumTries != maxTries){
		var currenti= floor(random(0,territories.length));
		var currentj = floor(random(0,territories.length));
		var currentTerritory = territories[currenti][currentj];
		if(random() < Math.pow(currentTerritory.h,k) && currentTerritory.bird == -1 && !currentTerritory.fire){
			spotFound = true;
		}
		if(currentTerritory.bird != -1 && !currentTerritory.fire){currentNumTries++;}
		bird.territory = currentTerritory;
	}
	currentTerritory.bird = bird;
}

function recordNumbers(){
	var data = new Array();
	var sum = 0;
	for(var i = 0; i < territories.length; i++){
		for(var j = 0; j < territories.length; j++){
			if(territories[i][j].bird != -1){sum++;}
		}
	}
	data.push(sum);
	//check if there is enough cells to split into 4's
	if(territories.length >= 2){
		var sum = new Array(4);
		for(var i = 0; i < 4; i++){sum[i] = 0;}
		for(var i = 0; i < territories.length; i++){
			for(var j = 0; j < territories.length; j++){
				if(territories[i][j].bird != -1){
					if(i < territories.length/2 && j < territories.length/2){sum[0]++;}
					else if(i < territories.length && j < territories.length/2){sum[1]++;}
					else if(i < territories.length/2 && j < territories.length){sum[2]++;}
					else if(i < territories.length && j < territories.length){sum[3]++;}
				}
			}
		}
		for(var i = 0; i < 4; i++){data.push(sum[i]);}
	}
	//check if there is enough cells to split into 16's
	if(territories.length >= 4){
		var sum = new Array(16);
		for(var i = 0; i < 16; i++){sum[i] = 0;}
		for(var i = 0; i < territories.length; i++){
			for(var j = 0; j < territories.length; j++){
				if(territories[i][j].bird != -1){
					if(i < territories.length/4 && j < territories.length/4){sum[0]++;}
					else if(i < 2*territories.length/4 && j < territories.length/4){sum[1]++;}
					else if(i < 3*territories.length/4 && j < territories.length/4){sum[2]++;}
					else if(i < territories.length && j < territories.length/4){sum[3]++;}
					else if(i < territories.length/4 && j < 2*territories.length/4){sum[4]++;}
					else if(i < 2*territories.length/4 && j < 2*territories.length/4){sum[5]++;}
					else if(i < 3*territories.length/4 && j < 2*territories.length/4){sum[6]++;}
					else if(i < territories.length && j < 2*territories.length/4){sum[7]++;}
					else if(i < territories.length/4 && j < 3*territories.length/4){sum[8]++;}
					else if(i < 2*territories.length/4 && j < 3*territories.length/4){sum[9]++;}
					else if(i < 3*territories.length/4 && j < 3*territories.length/4){sum[10]++;}
					else if(i < territories.length && j < 3*territories.length/4){sum[11]++;}
					else if(i < territories.length/4 && j < territories.length){sum[12]++;}
					else if(i < 2*territories.length/4 && j < territories.length){sum[13]++;}
					else if(i < 3*territories.length/4 && j < territories.length){sum[14]++;}
					else if(i < territories.length && j < territories.length){sum[15]++;}
				}
			}
		}
		for(var i = 0; i < 16; i++){data.push(sum[i]);}
	}
	//check if there is enough cells to split into 64's
	if(territories.length >= 8){
		var sum = new Array(64);
		for(var i = 0; i < 64; i++){sum[i] = 0;}
		for(var i = 0; i < territories.length; i++){
			for(var j = 0; j < territories.length; j++){
				if(territories[i][j].bird != -1){
					if(i < territories.length/8 && j < territories.length/8){sum[0]++;}
					else if(i < 2*territories.length/8 && j < territories.length/8){sum[1]++;}
					else if(i < 3*territories.length/8 && j < territories.length/8){sum[2]++;}
					else if(i < 4*territories.length/8 && j < territories.length/8){sum[3]++;}
					else if(i < 5*territories.length/8 && j < territories.length/8){sum[4]++;}
					else if(i < 6*territories.length/8 && j < territories.length/8){sum[5]++;}
					else if(i < 7*territories.length/8 && j < territories.length/8){sum[6]++;}
					else if(i < territories.length && j < territories.length/8){sum[7]++;}
					else if(i < territories.length/8 && j < 2*territories.length/8){sum[8]++;}
					else if(i < 2*territories.length/8 && j < 2*territories.length/8){sum[9]++;}
					else if(i < 3*territories.length/8 && j < 2*territories.length/8){sum[10]++;}
					else if(i < 4*territories.length/8 && j < 2*territories.length/8){sum[11]++;}
					else if(i < 5*territories.length/8 && j < 2*territories.length/8){sum[12]++;}
					else if(i < 6*territories.length/8 && j < 2*territories.length/8){sum[13]++;}
					else if(i < 7*territories.length/8 && j < 2*territories.length/8){sum[14]++;}
					else if(i < territories.length && j < 2*territories.length/8){sum[15]++;}
					else if(i < territories.length/8 && j < 3*territories.length/8){sum[16]++;}
					else if(i < 2*territories.length/8 && j < 3*territories.length/8){sum[17]++;}
					else if(i < 3*territories.length/8 && j < 3*territories.length/8){sum[18]++;}
					else if(i < 4*territories.length/8 && j < 3*territories.length/8){sum[19]++;}
					else if(i < 5*territories.length/8 && j < 3*territories.length/8){sum[20]++;}
					else if(i < 6*territories.length/8 && j < 3*territories.length/8){sum[21]++;}
					else if(i < 7*territories.length/8 && j < 3*territories.length/8){sum[22]++;}
					else if(i < territories.length && j < 3*territories.length/8){sum[23]++;}
					else if(i < territories.length/8 && j < 4*territories.length/8){sum[24]++;}
					else if(i < 2*territories.length/8 && j < 4*territories.length/8){sum[25]++;}
					else if(i < 3*territories.length/8 && j < 4*territories.length/8){sum[26]++;}
					else if(i < 4*territories.length/8 && j < 4*territories.length/8){sum[27]++;}
					else if(i < 5*territories.length/8 && j < 4*territories.length/8){sum[28]++;}
					else if(i < 6*territories.length/8 && j < 4*territories.length/8){sum[29]++;}
					else if(i < 7*territories.length/8 && j < 4*territories.length/8){sum[30]++;}
					else if(i < territories.length && j < 4*territories.length/8){sum[31]++;}
					else if(i < territories.length/8 && j < 5*territories.length/8){sum[32]++;}
					else if(i < 2*territories.length/8 && j < 5*territories.length/8){sum[33]++;}
					else if(i < 3*territories.length/8 && j < 5*territories.length/8){sum[34]++;}
					else if(i < 4*territories.length/8 && j < 5*territories.length/8){sum[35]++;}
					else if(i < 5*territories.length/8 && j < 5*territories.length/8){sum[36]++;}
					else if(i < 6*territories.length/8 && j < 5*territories.length/8){sum[37]++;}
					else if(i < 7*territories.length/8 && j < 5*territories.length/8){sum[38]++;}
					else if(i < territories.length && j < 5*territories.length/8){sum[39]++;}
					else if(i < territories.length/8 && j < 6*territories.length/8){sum[40]++;}
					else if(i < 2*territories.length/8 && j < 6*territories.length/8){sum[41]++;}
					else if(i < 3*territories.length/8 && j < 6*territories.length/8){sum[42]++;}
					else if(i < 4*territories.length/8 && j < 6*territories.length/8){sum[43]++;}
					else if(i < 5*territories.length/8 && j < 6*territories.length/8){sum[44]++;}
					else if(i < 6*territories.length/8 && j < 6*territories.length/8){sum[45]++;}
					else if(i < 7*territories.length/8 && j < 6*territories.length/8){sum[46]++;}
					else if(i < territories.length && j < 6*territories.length/8){sum[47]++;}
					else if(i < territories.length/8 && j < 7*territories.length/8){sum[48]++;}
					else if(i < 2*territories.length/8 && j < 7*territories.length/8){sum[49]++;}
					else if(i < 3*territories.length/8 && j < 7*territories.length/8){sum[50]++;}
					else if(i < 4*territories.length/8 && j < 7*territories.length/8){sum[51]++;}
					else if(i < 5*territories.length/8 && j < 7*territories.length/8){sum[52]++;}
					else if(i < 6*territories.length/8 && j < 7*territories.length/8){sum[53]++;}
					else if(i < 7*territories.length/8 && j < 7*territories.length/8){sum[54]++;}
					else if(i < territories.length && j < 7*territories.length/8){sum[55]++;}
					else if(i < territories.length/8 && j < territories.length){sum[56]++;}
					else if(i < 2*territories.length/8 && j < territories.length){sum[57]++;}
					else if(i < 3*territories.length/8 && j < territories.length){sum[58]++;}
					else if(i < 4*territories.length/8 && j < territories.length){sum[59]++;}
					else if(i < 5*territories.length/8 && j < territories.length){sum[60]++;}
					else if(i < 6*territories.length/8 && j < territories.length){sum[61]++;}
					else if(i < 7*territories.length/8 && j < territories.length){sum[62]++;}
					else if(i < territories.length && j < territories.length){sum[63]++;}
				}
			}
		}
		for(var i = 0; i < 64; i++){data.push(sum[i]);}
	}
	tableData.push(data);
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
		numNewBirds += floor(lamdba*pow(birds[i].territory.h,k));
	}
	for(var i = 0; i < numNewBirds;i++){
		var b = new Bird();
		b.adult = false;
		birds.push(b);
	}
}

function moveExistingBirds(){
	for(var i = 0; i < birds.length; i++){
		if(birds[i].territory == -1){
			immigrate(birds[i]);
		}
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
			fireTerritory.fire = true;
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
	var Adults = new Array();
	var Youth = new Array();
	for(var i = 0; i < birds.length; i++){
		if(birds[i].adult){Adults.push(birds[i]);}
		else{Youth.push(birds[i]);}
	}
	var numYouthRemove = floor(Youth.length - (sy*Youth.length));
	var numAdultsRemove = floor(Adults.length - (sy*Adults.length));
	for(var i = 0; i < numYouthRemove; i++){
		var r = floor(random(0,Youth.length));
		while(Youth[r].adult){
			r = floor(random(0,Youth.length));
		}
		Youth[r].territory.bird = -1;
		Youth.splice(r,1);
	}
	for(var i = 0; i < numAdultsRemove; i++){
		var r = floor(random(0,Adults.length));
		while(!Adults[r].adult){
			r = floor(random(0,Adults.length));
		}
		Adults[r].territory.bird = -1;
		Adults.splice(r,1);
	}
	birds = Adults.concat(Youth);

}
function adjustHabitatQuality(){
	for(var i = 0; i < territories.length; i++){
		for(var j = 0; j < territories.length; j++){
			if(territories[i][j].fire){territories[i][j].fire = false;}
			if(territories[i][j].h >= superCutoff){
				territories[i][j].h = random(territories[i][j].h, 1);
			}
			else{
				territories[i][j].h = randomGaussian(territories[i][j].h,.2);
			}
			if(territories[i][j].h > 1){territories[i][j].h = 1;}
			if(territories[i][j].h < 0){territories[i][j].h = 0;}
		}
	}
}
function outputData(){
	var strings = new Array();
	for(var i = 0; i < tableData.length; i++){
		strings.push(tableData[i].toString());
	}
	console.log(strings);
	saveStrings(strings,'data','csv');
}
