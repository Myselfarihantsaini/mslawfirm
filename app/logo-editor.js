'use client';
import {useState,useEffect} from 'react';
export default function LogoEditor({initial}){
 const [value,setValue]=useState(initial),[status,setStatus]=useState('');
 useEffect(()=>{const logo=document.querySelector('.brand-logo');if(logo){logo.style.width=`${value.width}px`;logo.style.transform=`translate(${value.x}px, ${value.y}px)`}},[value]);
 return <details className="logo-editor"><summary>Adjust logo</summary><p>Move the sliders to place the header logo.</p>{[['width','Size',80,600],['x','Left / right',-250,250],['y','Up / down',-150,150]].map(([key,label,min,max])=><label key={key}>{label}: {value[key]} px<input type="range" min={min} max={max} value={value[key]} onChange={e=>{setValue({...value,[key]:Number(e.target.value)});setStatus('')}}/></label>)}<button type="button" className="button gold" onClick={async()=>{try{const r=await fetch('/api/logo-placement',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});setStatus(r.ok?'Saved. Tell me when you are ready for me to fix it in place.':'Could not save. Please try again.')}catch{setStatus('Could not save. Please try again.')}}}>Save placement</button><button type="button" className="logo-reset" onClick={()=>setValue({width:300,x:0,y:0})}>Reset</button><p role="status">{status}</p></details>
}
