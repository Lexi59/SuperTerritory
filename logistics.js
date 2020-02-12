//visualization variables
let canvasDiv, canvas, gridsize, inputDiv, inputSize;
let running = -1, step = 0, status;
//input variables
let kInput, sizeInput, lamdbaInput, syInput, saInput, fireLengthInput, startingNumInput, fireMultInput;
let maxTriesInput, immigrationNumInput, numFiresInput, sizeFireInput, yearsInput, uniformInput, surviveKInput;
//world variables
let habitatk,size,reproductionk,lamdba,sy,sa,fireLength,maxTries, fireMult;
let immigrationNum,numFires,sizeFire, years, startingNum, surviveK;
//territory variables
let territories;
//bird variables
let birds;
//data variables
let tableData;

class Bird{
	constructor(){
		this.territory = -1;
		this.adult = true;
	}
}
class Territory{
	constructor(x, y, s, h){
		this.x = x;
		this.y = y;
		this.s = s;
		this.h = h;
		this.bird = -1;
		this.fire = 0;
	}
}
function setup(){
	//create canvas
	gridsize = min(windowWidth-200,windowHeight);
	canvasDiv = createDiv();
	canvasDiv.size(gridsize,gridsize);
	canvasDiv.style('float','left');
	canvasDiv.style('display','inline-block');
	canvas = createCanvas(gridsize,gridsize);
	canvas.parent(canvasDiv);
	frameRate(1);

	//create inputs
	inputDiv = createDiv();
	inputDiv.size(175,20*32);
	inputDiv.style('display','inline-block');
	inputDiv.style('padding','10px');

	status = createP('Waiting for input').parent(inputDiv);

	kp = createElement('label',"Habitat k:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	habitatkInput = createInput();
	habitatkInput.parent(inputDiv);
	createElement('br').parent(inputDiv);
	//bigger number here means more picky

	kp = createElement('label',"size:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	sizeInput = createInput();
	sizeInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Reproduction k:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	reproductionkInput = createInput();
	reproductionkInput.parent(inputDiv);
	createElement('br').parent(inputDiv);
	//bigger number here means more picky

	kp = createElement('label',"lamdba:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	lamdbaInput = createInput();
	lamdbaInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Survival k:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	surviveKInput = createInput();
	surviveKInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"sy:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	syInput = createInput();
	syInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"sa:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	saInput = createInput();
	saInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Burn Length:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	fireLengthInput = createInput();
	fireLengthInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Maximum Tries to move:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	maxTriesInput = createInput();
	maxTriesInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Number to Immigrate:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	immigrationNumInput = createInput();
	immigrationNumInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Number of Fires:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	numFiresInput = createInput();
	numFiresInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Size of Fire:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	sizeFireInput = createInput();
	sizeFireInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"years:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	yearsInput = createInput();
	yearsInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Starting Number:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	startingNumInput = createInput();
	startingNumInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	kp = createElement('label',"Fire Multiplier:".padEnd(14)).parent(inputDiv);
	createElement('br').parent(inputDiv);
	fireMultInput = createInput();
	fireMultInput.parent(inputDiv);
	createElement('br').parent(inputDiv);

	uniformInput = createInput();
	uniformInput.parent(inputDiv);
	uniformInput.attribute('placeholder','uniform');
	createElement('br').parent(inputDiv);

	//create Button
	submitBtn = createButton('Submit');
	submitBtn.parent(inputDiv);
	submitBtn.mousePressed(buttonPressed);
	stopBtn = createButton('Stop');
	stopBtn.parent(inputDiv);
	stopBtn.mousePressed(stopPressed);
}
function stopPressed(){
	running = -1;
}
function draw(){
	if(running > -1 && running < years){
		if(step == 0){immigrateNewBirds(); status.html(running + ': Immigrating new birds');}
		if(step == 1){recordNumbers(); status.html(running + ': Recording Numbers');}
		if(step == 2){turnKidsToAdults(); status.html(running + ': turning kids into adults');}
		if(step == 3){reproduce(); status.html(running + ': reproducing');}
		if(step == 4){moveExistingBirds(); status.html(running + ': Dispersing children');}
		if(step == 5){fires(); status.html(running + ': Starting fires');}
		if(step == 6){winterSurvival(); status.html(running + ': winter');}
		if(step == 7){running++; step = -1;}	
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
			strokeWeight(t.s/16);
			if (t.fire > 0){fill(255,0,0);}
			else{fill(map(t.h,0,1,127,255));}
			rect(t.x, t.y, t.s, t.s);
		}
	}
}
function drawBirds(){
	noStroke();
	if(!birds){return;}
	for(var i = 0; i < birds.length; i++){
		var t = birds[i].territory;
		if(birds[i].adult){fill(0,255,0);}
		else{fill(0,255,255);}
		ellipse(t.x+t.s/2,t.y+t.s/2,t.s,t.s);
	}
}
function buttonPressed(){
	//reset values
	territories = new Array();
	birds = new Array();
	tableData = new Array();

	//fill in new values
	habitatk = habitatkInput.value();
	size = sizeInput.value();
	reproductionk = reproductionkInput.value();
	lamdba = lamdbaInput.value();
	surviveK = surviveKInput.value();
	sy = syInput.value();
	sa = saInput.value();
	fireLength = fireLengthInput.value();
	maxTries = maxTriesInput.value();
	immigrationNum = immigrationNumInput.value();
	numFires = numFiresInput.value();
	sizeFire = sizeFireInput.value();
	years = yearsInput.value();
	startingNum = startingNumInput.value();
	fireMult = fireMultInput.value();

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
			if(uniformInput.value() > 0){temp.push(new Territory(j*s,i*s,s,parseFloat(uniformInput.value())));}
			else{temp.push(new Territory(j*s, i*s, s, random()));}
		}
		territories.push(temp);
	}
	for(var i = 0; i < startingNum; i++){
		birds.push(new Bird());
	}
	moveExistingBirds();
}
function recordNumbers(){
	console.log("Current number of birds: "+ birds.length);
	var data = new Array();
	data.push(birds.length);
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
function outputData(){
	var strings = new Array();
	for(var i = 0; i < tableData.length; i++){
		strings.push(tableData[i].toString());
	}
	console.log(strings);
	saveStrings(strings,'data','csv');
}

function getRandomPoisson(mean){
	var L = Math.exp(-mean);
	var p = 1.0;
	var k = 0;

	do {
	    k++;
	    p *= Math.random();
	} while (p > L);

	return k - 1;
}