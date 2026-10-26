// GERADO por scripts/portar-motion-logo.mjs a partir de _brandkit/motion/Fonte/motion-core.cjs. Não edite.
// Trocas em relação ao original (adaptação para fundo escuro): tinta branca, sem o fundo branco, viewBox recortada
// na área da marca com overflow visível, rótulo da LP e export de módulo ES. O resto é o código do brand kit.
/* ZERO7 V02 — continuous velocity, Gaussian motion blur and diagonal reflection. */
export function createMotion(A) {
  const W=1920,H=1440,duration=9,scale=1.18,ink='#FFFFFF';
  const logoX=(W-1306*scale)/2-150*scale;
  const logoY=(H-646*scale)/2-165*scale-12;
  const ticketCX=1196,ticketCY=350;
  const finalTX=logoX+ticketCX*scale,finalTY=logoY+ticketCY*scale;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,q)=>a+(b-a)*q;
  const smooth=u=>u*u*u*(u*(u*6-15)+10);
  // Beta(3,4) CDF: one speed peak, zero velocity and acceleration at both ends.
  const reveal=u=>20*u**3-45*u**4+36*u**5-10*u**6;
  const progress=(t,s,d,f=smooth)=>f(clamp((t-s)/d));
  const num=v=>Math.abs(v)<.000005?'0':Number(v.toFixed(4)).toString();

  function quintic(p0,p1,v0,v1,a0,a1,u,h) {
    const c0=p0,c1=v0*h,c2=a0*h*h/2;
    const r0=p1-c0-c1-c2;
    const r1=v1*h-c1-2*c2;
    const r2=a1*h*h-2*c2;
    const c3=10*r0-4*r1+.5*r2;
    const c4=-15*r0+7*r1-r2;
    const c5=6*r0-3*r1+.5*r2;
    return c0+c1*u+c2*u*u+c3*u**3+c4*u**4+c5*u**5;
  }
  const knots=[
    {t:.08,p:[2570,750,2.18,12],v:[0,0,0,0],a:[0,0,0,0]},
    {t:1.05,p:[1030,680,2.35,-6],v:[-650,-90,-.32,-4.0],a:[1800,-100,-.7,9]},
    {t:1.85,p:[1040,570,1.85,-4],v:[480,-100,-.65,4.0],a:[80,40,.18,-2]},
    {t:3.80,p:[finalTX,finalTY,1,0],v:[0,0,0,0],a:[0,0,0,0]}
  ];
  function poseBase(t) {
    let values;
    if(t<=knots[0].t)values=knots[0].p;
    else if(t>=knots[knots.length-1].t)values=knots[knots.length-1].p;
    else {
      const k=knots.findIndex((b,i)=>i>0&&t<=b.t);
      const a=knots[k-1],b=knots[k],h=b.t-a.t,u=(t-a.t)/h;
      values=a.p.map((p,i)=>quintic(p,b.p[i],a.v[i],b.v[i],a.a[i],b.a[i],u,h));
    }
    const window=progress(t,.08,.24)*(1-progress(t,2.8,1));
    const burst=Math.exp(-.5*((t-.61)/.23)**2)*window;
    const shakeX=.62*burst*Math.sin(2*Math.PI*8.5*t);
    const shakeY=.38*burst*Math.sin(2*Math.PI*6.8*t+.8);
    const flex=6.3*Math.sin(3.8*t+.3)*window;
    return {x:values[0]+shakeX,y:values[1]+shakeY,s:values[2]*scale,r:values[3],flex,phase:1.5*t,alpha:t<.08?0:1};
  }
  function pose(t) {
    const p=poseBase(t),e=.001;
    const a=poseBase(t-e),b=poseBase(t+e);
    p.vx=(b.x-a.x)/(2*e);p.vy=(b.y-a.y)/(2*e);
    // Rotation and changing scale also contribute to perceived image velocity.
    const vr=(b.r-a.r)/(2*e)*Math.PI/180*230*p.s;
    const vs=(b.s-a.s)/(2*e)*230;
    p.blurX=clamp(Math.hypot(p.vx,vr,vs)*.0036,0,9)/p.s;
    p.blurY=clamp(Math.hypot(p.vy,vr*.28,vs*.55)*.0027,0,3.1)/p.s;
    if(t>=3.8)p.blurX=p.blurY=0;
    return p;
  }
  function warpPath(d,amplitude,phase) {
    if(Math.abs(amplitude)<.0001)return d;
    return d.replace(/([MLCZ])([^MLCZ]*)/g,(match,cmd,body)=>{
      if(cmd==='Z')return 'Z';
      const v=(body.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
      for(let i=0;i<v.length;i+=2){
        const x=v[i],y=v[i+1],u=(x-967)/458,z=(y-ticketCY)/300;
        v[i]=x+amplitude*.15*Math.sin(Math.PI*u+phase)*z;
        v[i+1]=y+amplitude*Math.sin(2*Math.PI*u+phase)*(.86+.14*Math.cos(Math.PI*z));
      }
      return cmd+v.map(num).join(' ');
    });
  }
  const warpXML=(xml,a,p)=>xml.replace(/\bd="([^"]*)"/g,(m,d)=>'d="'+warpPath(d,a,p)+'"');
  function letterPose(t,i) {
    const top=i<5,index=top?i:i-5;
    const start=(top?1.48:1.98)+index*(top?.070:.061);
    const length=top?1.31:1.32;
    const u=clamp((t-start)/length),q=reveal(u);
    const du=60*u*u*(1-u)**3/length;
    const dx=(top?-215:195)*(1-q),dy=(top?46:74)*(1-q);
    const speed=Math.hypot(top?215:195,top?46:74)*du*scale;
    const burst=Math.exp(-.5*((u-.38)/.16)**2)*smooth(clamp(u/.10))*(1-smooth(clamp((u-.8)/.2)));
    const shake=.25*burst*Math.sin(2*Math.PI*8*t+i*.45);
    return {start,q,alpha:progress(t,start,.24),dx:dx+shake,dy:dy+shake*.5,r:(top?-3:2.1)*(1-q),blurX:clamp(speed*.0048,0,4.5)/scale,blurY:clamp(speed*.0018,0,1.6)/scale};
  }
  const pathGeometry=A.letters.map(p=>p.xml.replace(/\s+id="[^"]*"/g,'')).join('');
  function svg(t,options={}) {
    t=clamp(t,0,duration);
    const p=pose(t),blur=options.blur!==false;
    let filters='';
    function filter(id,x,y){
      if(!blur||Math.max(x,y)<.035)return '';
      filters+=`<filter id="${id}" x="-70%" y="-55%" width="240%" height="210%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${num(x)} ${num(y)}"/></filter>`;
      return ` filter="url(#${id})"`;
    }
    const letters=A.letters.map((letter,i)=>{
      const v=letterPose(t,i);
      if(t<=v.start)return '';
      const f=filter('letter-blur-'+i,v.blurX,v.blurY);
      return `<g opacity="${num(v.alpha)}" transform="translate(${num(v.dx)} ${num(v.dy)}) rotate(${num(v.r)} ${num(letter.cx)} ${num(letter.cy)})"${f}>${letter.xml}</g>`;
    }).join('');
    const lettering=`<g id="lettering-motion" transform="translate(${num(logoX)} ${num(logoY)}) scale(${scale})" fill="${ink}" fill-rule="evenodd">${letters}</g>`;
    const ticketFilter=filter('ticket-gaussian',p.blurX,p.blurY);
    const ticket=p.alpha?`<g id="ticket-motion" transform="translate(${num(p.x)} ${num(p.y)}) rotate(${num(p.r)}) scale(${num(p.s)}) translate(-${ticketCX} -${ticketCY})"${ticketFilter}>${warpXML(A.ticket,p.flex,p.phase)}</g>`:'';

    let shine='',shineDefs='';
    const shineStart=3.73,shineDuration=1.38;
    if(t>shineStart&&t<shineStart+shineDuration){
      const u=(t-shineStart)/shineDuration;
      const q=progress(t,shineStart,shineDuration);
      const bx=mix(-480,2440,q),by=mix(130,1590,q);
      const alpha=progress(u,0,.13)*(1-progress(u,.88,.12));
      const clips=pathGeometry.replace(/<path\b/g,`<path transform="translate(${num(logoX)} ${num(logoY)}) scale(${scale})" clip-rule="evenodd"`);
      shineDefs=`<clipPath id="wordmark-reflection-clip" clipPathUnits="userSpaceOnUse">${clips}</clipPath><linearGradient id="reflection-profile" x1="-130" y1="0" x2="130" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".22" stop-color="#FFFFFF" stop-opacity=".03"/><stop offset=".40" stop-color="#FFFFFF" stop-opacity=".31"/><stop offset=".53" stop-color="#FFFFFF" stop-opacity=".68"/><stop offset=".59" stop-color="#FFFFFF" stop-opacity=".48"/><stop offset=".76" stop-color="#FFFFFF" stop-opacity=".10"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient><filter id="reflection-softness" x="-40%" y="-10%" width="180%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="8"/></filter>`;
      shine=`<g id="diagonal-reflection" clip-path="url(#wordmark-reflection-clip)" opacity="${num(alpha)}"><g transform="translate(${num(bx)} ${num(by)}) rotate(30)"><rect x="-130" y="-1800" width="260" height="3600" fill="url(#reflection-profile)" filter="url(#reflection-softness)"/></g></g>`;
    }
    const defs=warpXML(A.defs,p.flex,p.phase);
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${num(logoX+150*scale)} ${num(logoY+165*scale)} ${num(1306*scale)} ${num(646*scale)}" width="100%" height="100%" overflow="visible" role="img" aria-label="Black Friday Zero7"><title>Black Friday Zero7</title>${defs}<defs>${filters}${shineDefs}</defs>${lettering}${shine}${ticket}</svg>`;
  }
  return {svg,pose,letterPose,duration,width:W,height:H,finalTX,finalTY,knots,reflection:{start:3.73,duration:1.38}};
}
