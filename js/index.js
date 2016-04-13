var Point2D = function(x, y) {
  this.x = x;
  this.y = y;
};

var Size2D = function(width, height) {
  this.width = width;
  this.height = height;
};

var Rect2D = function(x, y, width, height) {
  this.origin = new Point2D(x, y);
  this.size = new Size2D(width, height);
};

var Game = function(canvas, aspectRatio, framerate) {
  this.canvas = canvas;
  this.context2D = canvas.getContext("2d");
  this.framerate = framerate;
  this.updateInterval = null;
  this.running = false;
  this.lastMouse = new Point2D(0, 0);
  this.innerRect = new Rect2D(0, 0, this.canvas.width, this.canvas.height);
  this.aspectRatio = aspectRatio;
  
  this.draw = function(context) {
    var ctx = context;
    if(ctx == null) {
      ctx = this.context2D;
    }
    var rect = this.canvas.getBoundingClientRect();
    console.log("width: " + rect.width + ", height: " + rect.height + ", compared(width: " + this.canvas.width + ", height: " + this.canvas.height + ")");
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(this.innerRect.origin.x, this.innerRect.origin.y,
      this.innerRect.size.width, this.innerRect.size.height);
    
    ctx.beginPath();
    ctx.moveTo(this.innerRect.origin.x, this.innerRect.origin.y);
    ctx.lineTo(this.innerRect.size.width+this.innerRect.origin.x, this.innerRect.size.height+this.innerRect.origin.y);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.moveTo(this.innerRect.size.width+this.innerRect.origin.x, this.innerRect.origin.y);
    ctx.lineTo(this.innerRect.origin.x, this.innerRect.size.height+this.innerRect.origin.y);
    ctx.stroke();
    ctx.closePath();
    
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(this.lastMouse.x, this.lastMouse.y);
    ctx.fillRect(this.lastMouse.x, this.lastMouse.y, 4, 4);
    ctx.fill();
    ctx.closePath();
  };
  
  this.update = function(miliseconds) {
    this.draw(this.context2D);
  };
  
  this.mouseover = function(e) {
    console.log("mouseover");
  };
  
  this.mouseout = function(e) {
    console.log("mouseout");
  };
  
  this.mousemove = function(e) {
    var canRect = this.canvas.getBoundingClientRect();
    this.lastMouse.x = (((e.clientX - canRect.left) / (window.innerWidth - (canRect.left * 2))) * this.canvas.width);
    this.lastMouse.y = (((e.clientY - canRect.top) / (window.innerHeight - (canRect.top * 2))) * this.canvas.height);
    this.update(33);
    console.log("x: " + (e.clientX - canRect.left) + ", y: " + (e.clientY - canRect.top));
  };
  
  this.mouseclick = function(e) {
    console.log("mouseclick");
  };
  
  this.resize = function() {
    var rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    var innerWidth = rect.width;
    var innerHeight = rect.height;
    if(this.aspectRatio > (innerWidth/innerHeight)) {//trim the height
      innerHeight = innerWidth/this.aspectRatio;
    }
    else {//trim the width
      innerWidth = innerHeight*this.aspectRatio;
    }
    this.innerRect = new Rect2D((rect.width-innerWidth)/2, (rect.height-innerHeight)/2,
      innerWidth, innerHeight);
    console.log("dims: " + (rect.width-innerWidth) + ", " + (rect.height-innerHeight) + ", " +
      innerWidth + ", " + innerHeight);
    this.update(33);
  };
  
  this.start = function() {
    if(!this.running) {
      var self = this;
      this.running = true;
      this.updateInterval = setInterval(function(){
        self.update(self.framerate);
      }, 1000/self.framerate);
    }
  };
  
  this.stop = function() {
    if(this.running) {
      this.running = false;
      clearInterval(this.updateInterval);
    }
  };
  
  this.addEvents = function() {
    var self = this;
    this.canvas.addEventListener("click",
      function(e) {
        self.mouseclick(e);
      }
    );
    this.canvas.addEventListener("mouseover",
      function(e) {
        self.mouseover(e);
      }
    );
    this.canvas.addEventListener("mouseout",
      function(e) {
        self.mouseout(e);
      }
    );
    this.canvas.addEventListener("mousemove",
      function(e) {
        self.mousemove(e);
      }
    );
    window.addEventListener("resize",
      function() {
        self.resize();
      }
    );
  };
  this.resize();
  
  this.update(this.framerate);
  this.addEvents();
};