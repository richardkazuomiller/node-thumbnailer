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

Thumbnailer.prototype._sharp = function(){
  return this.sharp.apply(GLOBAL,arguments)
}

Thumbnailer.prototype.resize = function(path,width,height,outfile,done){
  var callback = function(err){
    done(err)
  }
  if(this.sharp){
    var sharp = this._sharp(path)
    width && (sharp = sharp.resize(width,null))
    height && (sharp = sharp.resize(null,height))
    sharp.toFile(outfile,callback)
  }
  else{
    this.gm(path).resize(width,height).write(outfile,callback)
  }
}

Thumbnailer.prototype.crop = function(path,width,height,x,y,outfile,done){
  var callback = function(err){
    done(err)
  }
  if(this.sharp){
    this._sharp(path).extract(y,x,width,height).toFile(outfile,callback)
  }
  else{
    this.gm(path).crop(width,height,x,y).write(outfile,callback)
  }
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
    self.crop(path,squareSize,squareSize,x,y,outfile,function(err){
      done(err)
    })
  })
}

Thumbnailer.prototype.size = function(path,done){
  if(this.sharp){
    this._sharp(path).metadata(done)
  }
  else{
    this.gm(path).size(done)
  }
}

module.exports = Thumbnailer
