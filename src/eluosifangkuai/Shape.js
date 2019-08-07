//单独用一个构造函数存坐标
function Cell(r,c){
    this.r = r;//
    this.c = c;
}
function Shape(origin){
    this.origin = origin;
    this.num = 0;
}
Shape.prototype = {
   
    moveDown : function(){
        for(var i = 0; i < this.cells.length;i++){
            this.cells[i].r ++;
        }
    },
    moveLeft : function(){
        for(var i = 0; i < this.cells.length;i++){
            this.cells[i].c --;
        }
    }, 
    moveRight : function(){
        for(var i = 0; i < this.cells.length;i++){
            this.cells[i].c ++;
        }
    },
    rotateR :function() {
        this.num ++;
        if(this.num == this.states.length){
            this.num = 0;
        }
        this.rotate();
    },
    rotate : function() {
        var state = this.states[this.num];
        var orig = this.cells[this.origin];
        for(var i = 0;i <this.cells.length;i++){
            this.cells[i].r = orig.r + state[i].r;
            this.cells[i].c = orig.c + state[i].c;
        }
    }
}
function One(origin){
    Shape.call(this,1)
    this.cells = [
        new Cell(0,3),
        new Cell(0,4),
        new Cell(0,5),
        new Cell(0,6)
    ];
    this.states = [
        State(0,-1,0,0,0,1,0,2),
        State(-1,0,0,0,1,0,2,0)
    ]
}
inherited(One,Shape)
function Tian(origin){
    Shape.call(this,0)
    this.cells = [
        new Cell(0,4),
        new Cell(0,5),
        new Cell(1,4),
        new Cell(1,5)
    ]
    this.states = [
        State(0,0,0,1,1,0,1,1)
       
        
    ]
}

inherited(Tian,Shape)
function inherited(Target,origin){
    function Fn() {};
    Fn.prototype = origin.prototype;
    Target.prototype = new Fn();
    Target.prototype.constructor = Target;
}
function State(r0,c0,r1,c1,r2,c2,r3,c3){
    return [
        {r : r0,c : c0},
        {r : r1,c : c1},
        {r : r2,c : c2},
        {r : r3,c : c3}
    ]
}