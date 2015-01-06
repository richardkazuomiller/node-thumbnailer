var Thumbnailer = function(options){
  if(options){
    this.sharp = options.sharp
  }
};

Thumbnailer.create = function(options){
  return new Thumbnailer(options)
}

Thumbnailer.gm = require('gm')
Thumbnailer.prototype.gm = function(){
  return Thumbnailer.gm.apply(GLOBAL,arguments)
}

Thumbnailer.prototype.resize = function(path,width,height,outfile,done){
  this.gm(path).resize(width,height).write(outfile,function(err){
    done(err)
  })
}

Thumbnailer.prototype.crop = function(path,width,height,x,y,outfile,done){
  this.gm(path).crop(width,height,x,y).write(outfile,function(err){
    done(err)
  })
}

Thumbnailer.prototype.cropMiddleSquare = function(path,outfile,done){
  var self = this;
  self.size(path,function(err,data){
    if(err){
      done(err)
      return
    }
    var width = data.width
    var height = data.height
    var squareSize = Math.min(width,height)
    var x = parseInt(width/2-squareSize/2)
    var y = parseInt(height/2-squareSize/2)
    self.gm(path).crop(squareSize,squareSize,x,y).write(outfile,function(err){
      done(err)
    })
  })
}

Thumbnailer.prototype.size = function(path,done){
  this.gm(path).size(done)
}

module.exports = Thumbnailer
