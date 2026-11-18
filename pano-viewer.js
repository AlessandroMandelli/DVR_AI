/* V.I.S.T.A. 2.2 - visualizzatore equirettangolare offline e annotazioni */
(()=>{'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const wrap=x=>((x%1)+1)%1;
const PI=Math.PI;
const VERT=`attribute vec2 pos; varying vec2 uv; void main(){ uv=pos*.5+.5; gl_Position=vec4(pos,0.0,1.0); }`;
const FRAG=`precision highp float;
varying vec2 uv; uniform sampler2D photo; uniform float aspect; uniform float fov; uniform float yaw; uniform float pitch;
void main(){
float halfF=tan(radians(fov)*.5);
vec3 d=normalize(vec3((uv.x*2.0-1.0)*aspect*halfF,(uv.y*2.0-1.0)*halfF,1.0));
float cp=cos(pitch),sp=sin(pitch),cy=cos(yaw),sy=sin(yaw);
d=vec3(d.x, cp*d.y+sp*d.z,-sp*d.y+cp*d.z);
d=vec3(cy*d.x+sy*d.z,d.y,-sy*d.x+cy*d.z);
float lon=atan(d.x,d.z); float lat=asin(clamp(d.y,-1.0,1.0));
vec2 coord=vec2(fract(.5+lon/6.28318530718),.5-lat/3.14159265359);
gl_FragColor=texture2D(photo,vec2(coord.x,1.0-coord.y));
}`;
function shader(gl,type,src){const obj=gl.createShader(type);gl.shaderSource(obj,src);gl.compileShader(obj);if(!gl.getShaderParameter(obj,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(obj));return obj}
function setupGL(canvas,img){const gl=canvas.getContext('webgl',{antialias:true,alpha:false,preserveDrawingBuffer:true})||canvas.getContext('experimental-webgl');if(!gl)throw Error('WebGL non disponibile');const pr=gl.createProgram();gl.attachShader(pr,shader(gl,gl.VERTEX_SHADER,VERT));gl.attachShader(pr,shader(gl,gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw Error('Shader non supportato');gl.useProgram(pr);
const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const attr=gl.getAttribLocation(pr,'pos');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
const tex=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
// REPEAT is unsupported for non-power-of-two equirectangular photographs in WebGL 1.
if((img.naturalWidth & (img.naturalWidth-1)) || (img.naturalHeight & (img.naturalHeight-1)))gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.uniform1i(gl.getUniformLocation(pr,'photo'),0);
return {gl,pr,loc:{aspect:gl.getUniformLocation(pr,'aspect'),fov:gl.getUniformLocation(pr,'fov'),yaw:gl.getUniformLocation(pr,'yaw'),pitch:gl.getUniformLocation(pr,'pitch')},dispose(){gl.deleteTexture(tex);gl.deleteProgram(pr);gl.deleteBuffer(buf)}}}
class MediaViewer{
 constructor(host,opt){this.host=host;this.opt=opt;this.mode='explore';this.pano=!!opt.pano;this.stage=host.querySelector('.media-stage');this.svg=host.querySelector('.media-overlay');this.img=host.querySelector('img');this.canvas=host.querySelector('canvas');this.regions=opt.regions||[];this.active=opt.active||'';this.yaw=Number(opt.pose?.yaw)||0;this.pitch=Number(opt.pose?.pitch)||0;this.fov=Number(opt.pose?.fov)||70;this.pointers=new Map();this.drag=null;this.draft=null;this.glInfo=null;this.dead=false;
 this.onDown=e=>this.pointerDown(e);this.onMove=e=>this.pointerMove(e);this.onUp=e=>this.pointerUp(e);this.onWheel=e=>this.wheel(e);this.onResize=()=>this.draw();this.stage.addEventListener('pointerdown',this.onDown);this.stage.addEventListener('pointermove',this.onMove);this.stage.addEventListener('pointerup',this.onUp);this.stage.addEventListener('pointercancel',this.onUp);this.stage.addEventListener('wheel',this.onWheel,{passive:false});
 this.ro=window.ResizeObserver?new ResizeObserver(this.onResize):null;this.ro?.observe(this.stage);this.img.onload=()=>this.initImage();if(this.img.complete&&this.img.naturalWidth)this.initImage();}
 initImage(){if(this.dead)return;if(this.pano){this.img.style.display='none';try{this.glInfo=setupGL(this.canvas,this.img)}catch(e){console.warn('Vista panoramica non disponibile:',e);this.pano=false;this.canvas.style.display='none';this.img.style.display='block';this.stage.classList.add('flat-stage');}}
 if(!this.pano){this.stage.style.aspectRatio=`${this.img.naturalWidth||16} / ${this.img.naturalHeight||9}`;this.img.style.display='block'}this.draw()}
 dispose(){this.dead=true;this.ro?.disconnect();this.glInfo?.dispose();this.stage.removeEventListener('pointerdown',this.onDown);this.stage.removeEventListener('pointermove',this.onMove);this.stage.removeEventListener('pointerup',this.onUp);this.stage.removeEventListener('pointercancel',this.onUp);this.stage.removeEventListener('wheel',this.onWheel)}
 setMode(mode){this.mode=mode;this.stage.dataset.mode=mode;}
 setActive(id){this.active=id;this.drawOverlay()}
 setRegions(regions){this.regions=regions;this.drawOverlay()}
 focusRegion(a){if(!a)return;this.active=a.id;if(this.pano){const u=a.x+a.w/2,v=a.y+a.h/2;this.yaw=(u-.5)*2*PI;this.pitch=clamp((.5-v)*PI,-1.40,1.40)}this.draw()}
 getRect(){return this.stage.getBoundingClientRect()}
 normalizedXY(e){const r=this.getRect();return{x:clamp((e.clientX-r.left)/r.width,0,1),y:clamp((e.clientY-r.top)/r.height,0,1)}}
 uvFromXY(x,y){if(!this.pano)return {u:clamp(x,0,1),v:clamp(y,0,1)};
 const rect=this.getRect(),aspect=rect.width/Math.max(1,rect.height),tan=Math.tan(this.fov*PI/360);let dx=(x*2-1)*aspect*tan,dy=(1-y*2)*tan,dz=1;const inv=1/Math.hypot(dx,dy,dz);dx*=inv;dy*=inv;dz*=inv;
 const cp=Math.cos(this.pitch),sp=Math.sin(this.pitch),cy=Math.cos(this.yaw),sy=Math.sin(this.yaw);let py=cp*dy+sp*dz,pz=-sp*dy+cp*dz;let px=cy*dx+sy*pz,wz=-sy*dx+cy*pz;return{u:wrap(.5+Math.atan2(px,wz)/(2*PI)),v:clamp(.5-Math.asin(clamp(py,-1,1))/PI,.01,.99)};
 }
 project(u,v){if(!this.pano)return{x:u,y:v,visible:true};const rect=this.getRect(),aspect=rect.width/Math.max(1,rect.height),tan=Math.tan(this.fov*PI/360),lon=(u-.5)*2*PI,lat=(.5-v)*PI,clat=Math.cos(lat);let x=Math.sin(lon)*clat,y=Math.sin(lat),z=Math.cos(lon)*clat;
 const cy=Math.cos(this.yaw),sy=Math.sin(this.yaw);let tx=cy*x-sy*z,tz=sy*x+cy*z;const cp=Math.cos(this.pitch),sp=Math.sin(this.pitch);let ty=cp*y-sp*tz;let zz=sp*y+cp*tz;
 if(zz<=.04)return{x:0,y:0,visible:false};return{x:.5+.5*tx/(zz*aspect*tan),y:.5-.5*ty/(zz*tan),visible:true}}
 draw(){if(this.dead)return;const r=this.getRect();if(!r.width||!r.height)return;if(this.pano&&this.glInfo){const c=this.canvas;const ratio=Math.min(window.devicePixelRatio||1,2);let w=Math.round(r.width*ratio),h=Math.round(r.height*ratio);if(c.width!==w||c.height!==h){c.width=w;c.height=h}const {gl,loc}=this.glInfo;gl.viewport(0,0,w,h);gl.uniform1f(loc.aspect,r.width/r.height);gl.uniform1f(loc.fov,this.fov);gl.uniform1f(loc.yaw,this.yaw);gl.uniform1f(loc.pitch,this.pitch);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}this.drawOverlay();this.opt.onPose?.({yaw:this.yaw,pitch:this.pitch,fov:this.fov})}
 drawOverlay(){if(!this.svg)return;const r=this.getRect(),w=r.width,h=r.height;if(w<1||h<1)return;this.svg.setAttribute('viewBox',`0 0 ${w} ${h}`);const paths=[];for(let i=0;i<this.regions.length;i++){
 const a=this.regions[i],corners=[[a.x,a.y],[a.x+a.w,a.y],[a.x+a.w,a.y+a.h],[a.x,a.y+a.h]],pts=corners.map(v=>this.project(v[0],v[1]));if(pts.some(p=>!p.visible))continue;
 // Avoid drawing huge distorted boxes close to the panorama horizon.
 let xs=pts.map(p=>p.x*w),ys=pts.map(p=>p.y*h);if(Math.max(...xs)-Math.min(...xs)>w*.85||Math.max(...ys)-Math.min(...ys)>h*.85)continue;
 if(Math.max(...xs)<0||Math.min(...xs)>w||Math.max(...ys)<0||Math.min(...ys)>h)continue;
 const selected=this.active===a.id,poly=pts.map(p=>`${(p.x*w).toFixed(1)},${(p.y*h).toFixed(1)}`).join(' ');const badgeX=clamp(Math.min(...xs)+17,17,w-17),badgeY=clamp(Math.min(...ys)+17,17,h-17);
 paths.push(`<g data-rid="${a.id}" class="media-region ${selected?'selected':''}" role="button" aria-label="Area ${i+1}"><polygon data-rid="${a.id}" points="${poly}"/><circle data-rid="${a.id}" cx="${badgeX.toFixed(1)}" cy="${badgeY.toFixed(1)}" r="14"/><text data-rid="${a.id}" x="${badgeX.toFixed(1)}" y="${(badgeY+4.4).toFixed(1)}" text-anchor="middle">${i+1}</text></g>`)}
 if(this.draft){const d=this.draft;const corners=[[d.x,d.y],[d.x+d.w,d.y],[d.x+d.w,d.y+d.h],[d.x,d.y+d.h]].map(p=>this.project(...p));if(corners.every(p=>p.visible))paths.push(`<polygon class="media-region-draft" points="${corners.map(p=>`${p.x*w},${p.y*h}`).join(' ')}"/>`)}this.svg.innerHTML=paths.join('')}
 wheel(e){if(!this.pano)return;e.preventDefault();this.fov=clamp(this.fov+e.deltaY*.035,29,102);this.draw()}
 pointerDown(e){if(e.button!==0&&e.pointerType==='mouse')return;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});this.stage.setPointerCapture(e.pointerId);if(this.pointers.size===2&&this.pano){const p=[...this.pointers.values()];this.drag={type:'pinch',dist:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),fov:this.fov};return}
 const pos=this.normalizedXY(e),u=this.uvFromXY(pos.x,pos.y),target=e.target.closest('[data-rid]'),id=target?.dataset.rid,reg=this.regions.find(a=>a.id===id);if(reg){this.active=id;this.opt.onSelect?.(id);this.drawOverlay()}
 if(this.mode==='add'){this.drag={type:'add',from:u};this.draft={x:u.u,y:u.v,w:0,h:0};return}
 if((this.mode==='move'||this.mode==='resize')&&reg){this.drag={type:this.mode,id,from:u,orig:{...reg}};return}
 if(this.pano){this.drag={type:'pan',x:e.clientX,y:e.clientY,yaw:this.yaw,pitch:this.pitch};return}
 this.drag={type:'select'};
 }
 pointerMove(e){if(!this.pointers.has(e.pointerId))return;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const d=this.drag;if(!d)return;if(d.type==='pinch'&&this.pointers.size>=2){const p=[...this.pointers.values()];const cur=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);this.fov=clamp(d.fov*d.dist/Math.max(15,cur),29,102);this.draw();return}
 const pos=this.normalizedXY(e),u=this.uvFromXY(pos.x,pos.y);if(d.type==='pan'){const r=this.getRect();this.yaw=d.yaw-(e.clientX-d.x)/r.width*(this.fov*PI/180)*(r.width/r.height);this.pitch=clamp(d.pitch+(e.clientY-d.y)/r.height*this.fov*PI/180,-1.48,1.48);this.draw();return}
 if(d.type==='add'){let du=u.u-d.from.u;if(this.pano&&Math.abs(du)>.5)du+=du>0?-1:1;let endX=d.from.u+du;let x=Math.max(.005,Math.min(d.from.u,endX)),y=Math.max(.01,Math.min(d.from.v,u.v));this.draft={x,y,w:Math.min(.995-x,Math.max(.008,Math.abs(endX-d.from.u))),h:Math.min(.98-y,Math.max(.009,Math.abs(u.v-d.from.v)))};this.drawOverlay();return}
 if(d.type==='move'||d.type==='resize'){let du=u.u-d.from.u;if(this.pano&&du>.5)du-=1;if(this.pano&&du<-.5)du+=1;const dv=u.v-d.from.v,r=this.regions.find(a=>a.id===d.id);if(!r)return;
 if(d.type==='move'){r.x=clamp(d.orig.x+du,.002,1-r.w-.002);r.y=clamp(d.orig.y+dv,.004,1-r.h-.004)}
 else{r.w=clamp(d.orig.w+du,.045,.995-r.x);r.h=clamp(d.orig.h+dv,.045,.995-r.y)}this.drawOverlay();}
 }
 pointerUp(e){if(this.pointers.has(e.pointerId))this.pointers.delete(e.pointerId);if(this.drag?.type==='pinch'){if(this.pointers.size<2)this.drag=null;return}if(this.pointers.size>0)return;const d=this.drag;this.drag=null;if(!d)return;if(d.type==='add'){const a=this.draft;this.draft=null;if(a&&a.w>.015&&a.h>.015)this.opt.onAdd?.(a);else this.drawOverlay();return}if(d.type==='move'||d.type==='resize')this.opt.onChanged?.(this.regions);}
 fullscreen(){if(document.fullscreenElement===this.host)document.exitFullscreen?.();else this.host.requestFullscreen?.().catch(()=>{})}
 }
window.VistaMediaViewer=MediaViewer;
})();
