
class Easel{
  constructor(){
    let activated = false;

    if(!!window.CanvasRenderingContext2D){ //cast existence to boolean
      this.activated = true;
      this.setGlobalVariables();
      this.acquireViewportSize();
      this.background = '#000';
      this.started = false;
      D.body.appendChild(C);
      {
        let d = document.createElement('style');
        
        d.type = 'text/css';
        d.rel = 'stylesheet';
        d.innerHTML = `
        body{
          background-color: ${this.background};
          margin:0;
        }
        canvas{
          position:fixed;
          left:0;top:0;right:0;bottom:0;
        }`;
        D.querySelector('head').appendChild(d);
        this.setCanvasSize();
      }
      activated = true;
    } //end if
    return activated;
  }
  setGlobalVariables(){
    window.W = window;
    window.D = document;
    window.M = Math;
    window.C = document.createElement('canvas');
    window.ctx = C.getContext('2d');
    window.R=(f,g,e)=>{
      f=!g?0*(g=f):f>g?g+(d=f)-g:f;
      e=e||0;
      g=M.random()*(g-f)+f;
      return e?g|0:g;
    };
    window.V = this.acquireViewportSize();
    window.onresize = ()=>{
      V = this.acquireViewportSize();
      this.setCanvasSize();
      this.config()
      this.redraw();
    };
  }
  redraw(){
    if(!this.started){
      this.config();
      this.started = true;
    } //end if
    this.beforeDraw();
    this.onDraw();
  }
  config(){ return true; }
  beforeDraw(){ ctx.fillStyle = this.background; ctx.fillRect(0,0,V.w,V.h); }
  onDraw(){ return true; }
  setCanvasSize(){ C.width = V.w; C.height = V.h; }
  acquireContext(){ return W.ctx = C.getContext('2d'); }
  acquireViewportSize(){
    let d = W, b = 'inner';
    
    if(!(d.innerWidth)){
      b = 'client';
      d = D.documentElement || D.body;
    } //end if
    return {
      w: d[b+'Width'],
      h: d[b+'Height']
    };
  }
}

class Particle{
  constructor(){
    this.x = R(0,V.w,1);
    this.y = R(0,V.h,1);
    this.z = R(0,3,1);
    this.currentColor = this.generateColor();
    this.targetColor = this.generateColor();
    this.size = R(1,3,1);
  }
  move(){
    if(this.x>0&&R(0,2,1)>0){
      this.x--;
    }else if(this.x<V.w){
      this.x++;
    } //end if
    if(this.y>0&&R(0,2,1)>0){
      this.y--;
    }else if(this.y<V.h){
      this.y++;
    } //end if
    ctx.fillStyle=this.getColor(false);
    ctx.fillRect(this.x,this.y,this.size,this.size);
  }
  getColor(change){
    let r,g,b,tc = this.targetColor, cc = this.currentColor; //brevity

    if(change){
      r=tc.r!==cc.r?(this.targetColor.r=tc.r>cc.r?tc.r-1:tc.r+1):false;
      g=tc.g!==cc.g?(this.targetColor.g=tc.g>cc.g?tc.g-1:tc.g+1):false;
      r=tc.b!==cc.b?(this.targetColor.b=tc.b>cc.b?tc.b-1:tc.b+1):false;
      if(!(r&g&b)) this.targetColor = this.generateColor();
    } //end if
    return `rgba(${tc.r},${tc.g},${tc.b},${tc.a})`
  }
  generateColor(){
    return {
      r: R(50,250,1),
      g: R(50,250,1),
      b: R(50,250,1),
      a: 1
    };
  }
}

// to skip rendering logic and do something more appropriate as a fallback
let easel = new Easel(),
    particle = new Particle,
    initialized = false;

if(easel){
  easel.config = ()=> easel.background = '#003';
  main();
} //end if

function main(){
  ctx.fillStyle='rgba(0,0,0,0.02)';
  ctx.fillRect(0,0,V.w,V.h);
  for(let i=0;i<5000;i++) particle.move();
  if(R(0,100,1)<5) particle.getColor(true); //graduate color
  requestAnimationFrame(main);
} //end main()
