function Game(row,col,unit){
    this.row = row;
    this.col = col;
    this.unit = unit;
    this.shape = null;
    this.nextShape = null;
    this.timer = null;
    this.wall = [];
    this.line = 0;
    this.score = 0;
    this.scorArr = [0,10,30,70,100,200];
    this.interval = 1000;
    this.state = 1;
}
Game.prototype = {
   
    init : function () {
        $(".pause").click(function(){
            if(this.state){
                clearInterval(this.timer);
                this.timer = null;
                this.state = !this.state;
            }
        }.bind(this));
        $(".start").click(function(){
            this.timer = setInterval(function(){
                this.moveDown();
            }.bind(this),this.interval);
            this.state = !this.state;
        }.bind(this));
        this.createMap();
        this.shape = this.randomShape();
        this.nextShape = this.randomShape();
        // console.log(this.shape);
        for(var i = 0;i < this.row;i++){
            this.wall.push(new Array(this.col));
         
        }
        $(document).keydown(function(e){
            e.preventDefault();
            e = e ||window.event;
            var key = e.keyCode;
            switch(key){
                case 37:
                    this.moveLeft();
                    break;
                case 39:
                    this.moveRight();
                    break;
                case 40:
                    this.moveDown();
                    break;
                case 38 :
                   this.rotateR();
                    break;
            }
        }.bind(this))
        // console.log(this.wall)
        this.timer = setInterval(function(){
            this.moveDown();
        }.bind(this),this.interval)
        this.paintShape();
        
    },
    rotateR : function(){
        this.shape.rotateR()
    },
    createMap : function(){
        var map = $("<div class='wrap'></div>").css({
            position: "relative",
            width : this.unit * this.col,
            height : this.unit * this.row,
            flaot:"left"
        }).appendTo(".box");
        for(var i = 0; i < this.col;i++){
            for(var j = 0;j < this.row;j++){
                var divs = $("<div></div>").css({
                    position : "absolute",
                    left : i * this.unit,
                    top : j * this.unit,
                    width : this.unit - 2,
                    height :this.unit -2,
                    background : "pink"
                }).appendTo(".wrap")
            }
        }
    },
    paintShape : function() {
        // console.log(this.row);
        for(var i = 0; i < this.shape.cells.length;i++){
            var cells = this.shape.cells[i]
            var div = $("<div class='cell'><div>").css({
                background : "red",
                position : "absolute",
                width : this.unit - 2,
                height :this.unit -2,
                left: cells.c * this.unit,
                top: cells.r * this.unit,
            }).appendTo(".wrap")
        }
    },
    canMove : function() {
        for(var i = 0;i<this.shape.cells.length;i++){
            var cells = this.shape.cells[i];
            if(cells.r == this.row - 1 || this.wall[cells.r + 1][cells.c]){
                return false;
            }
        }  
        return true;
    },
    paintWall : function() {
        for(var r = 0;r < this.row;r++){
           for(c = 0 ; c < this.col;c++){
               var cell = this.wall[r][c];
               if(cell){
                    var div = $("<div class='box1'></div>").css({
                        background : "black",
                        position : "absolute",
                        width : this.unit - 2,
                        height : this.unit - 2,
                        left : cell.c * this.unit,
                        top : cell.r * this.unit
                    }).appendTo(".wrap"); 
              }
           } 
        }
    },
    moveRight : function () {
        if(this.canRight()){
            this.shape.moveRight()
        }
    },
    canRight : function() {
        for(var i = 0;i < this.shape.cells.length;i++){
            var cells = this.shape.cells[i];
            if(cells.c == this.col - 1 || this.wall[cells.r][cells.c + 1] != null){
                return false
            }
        }
        return true
    },
    moveLeft : function () {
        if(this.canLeft()){
            this.shape.moveLeft()
        }
    },
    canLeft : function() {
        for(var i = 0;i < this.shape.cells.length;i++){
            var cells = this.shape.cells[i];
            if(cells.c == 0|| this.wall[cells.r][cells.c - 1] != null){
                return false
            }
        }
        return true
    },
    moveDown : function() {
       if(this.canMove()){
            this.shape.moveDown();
       }else{
           for(var i = 0 ; i <this.shape.cells.length;i++){
                var cells= this.shape.cells[i];
                this.wall[cells.r][cells.c] = cells;
           }
           if(!this.isOver()){
                this.shape = this.nextShape;
                this.nextShape = this.randomShape();
           }else{
               alert("游戏结束");
               clearInterval(this.timer)
           }
            var lines = this.romoveRows();
            this.line += lines;
            this.score += this.scorArr[lines];
            this.paintScore()
       }
       $(".wrap").find(".cell").remove(); 
       this.paintShape();
       this.paintWall();
       this.paintNextShape();
    },
    romoveRows : function() {
        //遍历wall的每一行，当是满各就消除；
        var lines = 0;
        for(var r = this.row - 1;r>= 0 ;r--){
            
            if(this.isFull(r)){
                //删除行
                this.removeRow(r);
                r++;
                lines ++;
               
            }
            
        }
        return lines;
    },
    removeRow : function(row) {
        for(var r = row;r >= 0;r--){
            this.wall[r] =this.wall[r - 1];
            this.wall[r - 1] = [];
           
            $(".wrap").find(".box1").remove();
            for(var c = 0;c < this.row;c++){
                if(this.wall[r][c]!= null){
                    this.wall[r][c].r++;
                }
            }
            if(this.wall[r - 2].join('') == ""){
                break;
            }
        }
    },
    isFull : function(row) {
        // 遍历wall每行每个元素，当前是否为有值；
        for(var c = 0;c <this.col;c++){
            if(this.wall[row][c] == null){
                return false;
            }
        }
        return true
    },
    isOver : function() {
        for(var i = 0; i < this.nextShape.cells.length;i++){
            var cells = this.nextShape.cells[i];
            if(this.wall[cells.r][cells.c] != null){
                return true
            }else{
                return false;
            }
        }
    },
    randomShape : function() {
        switch(Math.floor(Math.random() * 2)){
            case 0 :
                return new  One();
            case 1 :
                return new Tian();
        }
    },
    paintNextShape : function(){
        $(".nextshape").html(' ');
        for(var i = 0; i < this.nextShape.cells.length;i++){
            var cells = this.nextShape.cells[i]
            var div = $("<div class='cell'><div>").css({
                background : "red",
                position : "absolute",
                width : this.unit - 2,
                height :this.unit -2,
                left: cells.c * this.unit,
                top: cells.r * this.unit,
            }).appendTo(".nextshape")
        }
    },
    paintScore: function() {
        var spans = $(".score p span");
        spans.eq("0").html(this.line);
        spans.eq("1").html(this.score);
    },
}
window.onload = function(){
    var game = new Game(20,10,36);
    game.init();
}
