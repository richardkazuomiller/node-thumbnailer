var sinon = require('sinon')
var assert = require('power-assert')

describe('lib/thumbnailer',function(){
  beforeEach(function(){
    var Thumbnailer = require('../../lib/thumbnailer')
    this.thumbnailer = new Thumbnailer()
  })
  describe('constructor',function(){
    it('should include sharp if given',function(){
      var Thumbnailer = require('../../lib/thumbnailer')
      var sharp = {}
      var thumbnailer = new Thumbnailer({
        sharp : sharp
      })
      assert(thumbnailer.sharp == sharp)
    })
  })
  describe('create',function(){
    it('should just instantiate a thumbnailer',function(){
      var Thumbnailer = require('../../lib/thumbnailer')
      var thumbnailer = Thumbnailer.create()
      assert(thumbnailer instanceof Thumbnailer)
    })
  })
  describe('gm',function(){
    it('should wrap gm functions',function(){
      var gm = sinon.stub(this.thumbnailer.__proto__.constructor,'gm')
      this.thumbnailer.gm('foo.jpg')
      assert(gm.callCount == 1)
      assert(gm.getCall(0).args[0] == 'foo.jpg')
    })
  })
  describe('resize',function(){
    it('should gm.resize to width by height',function(){
      var write = sinon.stub()
      var resize = sinon.stub().returns({
        write : write
      })
      var gm = sinon.stub(this.thumbnailer,'gm').returns({
        resize : resize
      })
      var done = sinon.stub()
      this.thumbnailer.resize('input.jpg',1920,1080,'output.jpg',done)
      write.getCall(0).args[1]('an error')
      assert(gm.calledWith('input.jpg'))
      assert(resize.calledWith(1920,1080))
      assert(write.getCall(0).args[0] == 'output.jpg')
      assert(done.calledWith('an error'))
    })
  })
  describe('crop',function(){
    it('should gm.crop to width by height at x,y',function(){
      var write = sinon.stub()
      var crop = sinon.stub().returns({
        write : write
      })
      var gm = sinon.stub(this.thumbnailer,'gm').returns({
        crop : crop
      })
      var done = sinon.stub()
      this.thumbnailer.crop('input.jpg',1920,1080,50,100,'output.jpg',done)
      write.getCall(0).args[1]('an error')
      assert(gm.calledWith('input.jpg'))
      assert(crop.calledWith(1920,1080,50,100))
      assert(write.getCall(0).args[0] == 'output.jpg')
      assert(done.calledWith('an error'))
    })
  })
  describe('size',function(){
    it('should gm.size',function(){
      var size = sinon.stub()
      var gm = sinon.stub(this.thumbnailer,'gm').returns({
        size : size
      })
      var done = sinon.stub()
      this.thumbnailer.size('input.jpg',done)
      assert(gm.calledWith('input.jpg'))
      assert(size.getCall(0).calledWith(done))
    })
  })
  describe('cropMiddleSquare',function(){
    it('should crop a square out of a portrait',function(){
      var size = sinon.stub(this.thumbnailer,'size',function(path,done){
        done(null,{
          width : 1920,
          height : 1080
        })
      })
      var write = sinon.stub()
      var crop = sinon.stub().returns({
        write : write
      })
      var gm = sinon.stub(this.thumbnailer,'gm').returns({
        crop : crop
      })
      var done = sinon.stub()
      this.thumbnailer.cropMiddleSquare('input.jpg','output.jpg',done)
      write.getCall(0).args[1]('an error')
      assert(gm.calledWith('input.jpg'))
      assert(crop.calledWith(1080,1080,420,0))
      assert(write.getCall(0).args[0] == 'output.jpg')
      assert(done.calledWith('an error'))
    })
    it('should callback with size error',function(){
      sinon.stub(this.thumbnailer,'size',function(path,done){
        done('an error')
      })
      var done = sinon.stub()
      sinon.stub(this.thumbnailer,'gm')
      this.thumbnailer.cropMiddleSquare('input.jpg','output.jpg',done)
      assert(done.calledWith('an error'))
      assert(done.callCount == 1)
      assert(this.thumbnailer.gm.callCount == 0)
    })
  })
  describe('_sharp',function(){
    it('should call sharp',function(){
      this.thumbnailer.sharp = sinon.stub()
      this.thumbnailer._sharp(1,2,3)
      assert(this.thumbnailer.sharp.getCall(0).args[0] == 1)
      assert(this.thumbnailer.sharp.getCall(0).args[1] == 2)
      assert(this.thumbnailer.sharp.getCall(0).args[2] == 3)
    })
  })
})
