// A moving volume of stars over an original procedural nebula.
// The entire scene is generated locally: no images, services or API calls.
export function createUniverse(isPaused) {
  const canvas = document.querySelector('#starfield');
  const context = canvas.getContext('2d');
  let width=innerWidth,height=innerHeight,stars=[],meteors=[],sparks=[],last=0,frame=0,nebulaFrame=0,clock=0;
  let pointer={x:0,y:0},camera={x:0,y:0},target={x:0,y:0},warp=0,nextMeteor=1400;
  const colors=['203,214,255','240,219,239','231,207,182','174,195,246'];
  const positions={universe:[0,0],work:[.65,-.3],about:[-.7,.15],notes:[.4,.65],contact:[-.3,-.65]};
  const rand=(a,b)=>a+Math.random()*(b-a);
  const nebula=createNebula(isPaused);
  function resize(){
    width=innerWidth;height=innerHeight;
    const dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    context?.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(2300,Math.max(650,Math.round(width*height/650)));
    stars=Array.from({length:count},(_,i)=>{
      const x=rand(-width*1.7,width*1.7);
      return{x,y:i%3===0?-x*.4+rand(-height*.55,height*.55):rand(-height*1.5,height*1.5),z:rand(.4,3),size:Math.pow(Math.random(),3)*1.1+.2,alpha:rand(.2,.8),phase:rand(0,6.3),color:colors[Math.floor(Math.random()*colors.length)]};
    });
    render(performance.now(),0);nebula.resize();
  }
  function shoot(){
    if(isPaused())return;
    const speed=Math.max(280,width*rand(.55,.85));
    meteors.push({x:rand(-.1,.4)*width,y:rand(.05,.44)*height,vx:speed,vy:speed*rand(.24,.42),age:0,max:rand(1300,1850),tail:Math.min(300,Math.max(130,width*.22))});
  }
  function burst(x,y){if(isPaused())return;for(let i=0;i<16;i++){const angle=i*Math.PI*2/16;sparks.push({x,y,dx:Math.cos(angle)*rand(.5,2.2),dy:Math.sin(angle)*rand(.5,2.2),age:0,max:rand(30,55)});}}
  function jumpTo(scene){const p=positions[scene]||positions.universe;target={x:p[0],y:p[1]};if(isPaused()){camera={...target};nebula.setCamera(camera.x,camera.y);render(performance.now(),0);}else warp=1;}
  function render(now,dt){
    if(!context)return;
    const ctx=context,paused=isPaused();
    ctx.clearRect(0,0,width,height);
    camera.x+=(target.x-camera.x)*(paused?1:.028);camera.y+=(target.y-camera.y)*(paused?1:.028);
    const px=paused?0:pointer.x*20,py=paused?0:pointer.y*15;
    for(const s of stars){
      if(!paused)s.z-=dt*(.00009+warp*.0028);
      if(s.z<.25){s.z=3;s.x=rand(-width*1.7,width*1.7);s.y=rand(-height*1.5,height*1.5);}
      const z=s.z;
      const x=width*.5+(s.x-camera.x*width*.19+px)/z*.65;
      const y=height*.5+(s.y-camera.y*height*.15+py)/z*.65;
      if(x<0||y<0||x>width||y>height)continue;
      const r=Math.max(.35,Math.min(2.2,s.size/z)),twinkle=paused?1:.75+.25*Math.sin(clock*.0004+s.phase);
      const alpha=Math.min(.85,s.alpha*twinkle*(.85/z));
      ctx.fillStyle=`rgba(${s.color},${alpha})`;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      if(warp>.08&&!paused){
        ctx.strokeStyle=`rgba(${s.color},${alpha*warp*.5})`;ctx.lineWidth=Math.max(.3,r*.45);
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-(x-width*.5)*warp*.045,y-(y-height*.5)*warp*.045);ctx.stroke();
      }else if(r>1.2){
        const glow=ctx.createRadialGradient(x,y,0,x,y,r*7);glow.addColorStop(0,`rgba(${s.color},${alpha*.3})`);glow.addColorStop(1,`rgba(${s.color},0)`);ctx.fillStyle=glow;ctx.fillRect(x-r*7,y-r*7,r*14,r*14);
        ctx.strokeStyle=`rgba(${s.color},${alpha*.3})`;ctx.lineWidth=.45;ctx.beginPath();ctx.moveTo(x-r*4,y);ctx.lineTo(x+r*4,y);ctx.moveTo(x,y-r*5);ctx.lineTo(x,y+r*5);ctx.stroke();
      }
    }
    if(paused){meteors=[];sparks=[];return;}
    for(const m of meteors){
      m.age+=dt;m.x+=m.vx*dt/1000;m.y+=m.vy*dt/1000;
      const a=Math.max(0,Math.sin(m.age/m.max*Math.PI));
      const tx=m.x-m.tail,ty=m.y-m.tail*m.vy/m.vx;
      const gradient=ctx.createLinearGradient(m.x,m.y,tx,ty);
      gradient.addColorStop(0,`rgba(255,242,233,${a})`);gradient.addColorStop(.3,`rgba(187,206,255,${a*.65})`);gradient.addColorStop(1,'rgba(183,183,247,0)');
      ctx.save();ctx.shadowBlur=9;ctx.shadowColor=`rgba(176,196,255,${a*.55})`;
      ctx.strokeStyle=gradient;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(tx,ty);ctx.stroke();
      ctx.fillStyle=`rgba(255,249,243,${a})`;ctx.beginPath();ctx.arc(m.x,m.y,1.7,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    meteors=meteors.filter(m=>m.age<m.max);
    for(const p of sparks){p.age+=dt/16.7;p.x+=p.dx*dt/16.7;p.y+=p.dy*dt/16.7;ctx.fillStyle=`rgba(232,203,237,${Math.max(0,1-p.age/p.max)})`;ctx.beginPath();ctx.arc(p.x,p.y,.8,0,6.3);ctx.fill();}
    sparks=sparks.filter(p=>p.age<p.max);warp*=.94;
    nebula.setCamera(camera.x+pointer.x*.08,camera.y+pointer.y*.05);
  }
  function tick(now){
    if(document.hidden||isPaused()){last=now;}
    else if(now-frame>32){
      const dt=Math.min(now-last||33,70);last=now;frame=now;
      clock+=dt;render(now,dt);
      // The clouds drift slowly; keep the stars smooth without redrawing the
      // expensive nebula shader at the same rate, especially on mobile GPUs.
      if(now-nebulaFrame>(warp>.1?80:180)){nebula.render(clock);nebulaFrame=now;}
      if(clock>nextMeteor){shoot();nextMeteor=clock+rand(3500,6500);}
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('pointermove',e=>{pointer={x:e.clientX/width-.5,y:e.clientY/height-.5};},{passive:true});
  resize();requestAnimationFrame(tick);
  return{shoot,burst,jumpTo,render(){render(performance.now(),0);nebula.render(clock,true);}};
}

function createNebula(isPaused){
  const canvas=document.querySelector('#nebula');
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  const fallback={resize(){},render(){},setCamera(){}};
  if(!gl)return fallback;
  const vertex=`attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.,1.);}`;
  const fragment=`
    precision highp float;
    uniform vec2 u_resolution;
    uniform vec2 u_camera;
    uniform float u_time;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
    float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(.8,-.6,.6,.8);for(int i=0;i<6;i++){v+=a*noise(p);p=m*p*2.07+17.3;a*=.5;}return v;}
    void main(){
      vec2 uv=(gl_FragCoord.xy-.5*u_resolution)/min(u_resolution.x,u_resolution.y);
      vec2 p=uv+u_camera*.13;
      p.x+=u_time*.000004;
      vec2 warp=vec2(fbm(p*2.4+3.7),fbm(p*2.4+9.2));
      float n=fbm(p*3.4+warp*2.2);
      float fine=fbm(p*15.+warp*2.);
      float lane=p.y-p.x*.52+.12+sin(p.x*3.1)*.13;
      float band=exp(-lane*lane*6.5);
      float cloud=pow(max(0.,n-.23)*2.1,2.2)*band;
      float ridge=pow(max(0.,fine-.28)*1.6,2.4)*band;
      float darkDust=pow(fbm(p*6.+warp*3.),4.)*3.8*band;
      float warm=smoothstep(-.1,.85,p.x+p.y*.3);
      vec3 blue=vec3(.12,.23,.42);
      vec3 amber=vec3(.45,.24,.25);
      vec3 light=mix(blue,amber,warm);
      vec3 color=vec3(.022,.027,.067);
      color+=light*cloud*.7;
      color+=mix(vec3(.16,.2,.39),vec3(.43,.29,.34),warm)*ridge*.45;
      color*=1.-clamp(darkDust,0.,.62);
      float blueGlow=exp(-length(p-vec2(-.65,-.2))*2.4);
      color+=vec3(.015,.037,.10)*blueGlow;
      float dust=hash(gl_FragCoord.xy+u_time*.01)*.009;
      color+=dust;
      gl_FragColor=vec4(color,1.);
    }`;
  function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('Nebula shader unavailable');return s;}
  try{
    const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))return fallback;
    gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const resolution=gl.getUniformLocation(program,'u_resolution'),time=gl.getUniformLocation(program,'u_time'),camera=gl.getUniformLocation(program,'u_camera');
    let cx=0,cy=0,lost=false;
    function render(t=0){if(lost)return;gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform2f(camera,cx,cy);gl.uniform1f(time,t);gl.drawArrays(gl.TRIANGLES,0,6);}
    function resize(){canvas.width=Math.round(innerWidth*.8);canvas.height=Math.round(innerHeight*.8);gl.viewport(0,0,canvas.width,canvas.height);render();}
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;document.querySelector('.cosmos').classList.remove('webgl-ready');});
    resize();document.querySelector('.cosmos').classList.add('webgl-ready');
    return{resize,render,setCamera(x,y){cx=x;cy=y;}};
  }catch{return fallback;}
}
