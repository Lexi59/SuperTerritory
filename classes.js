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
		this.fire = false;
	}
}