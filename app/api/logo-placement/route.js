import {writeFile} from 'node:fs/promises';
export async function POST(request){
 const url=new URL(request.url);
 if(process.env.NODE_ENV!=='development'||!['localhost','127.0.0.1'].includes(url.hostname)||request.headers.get('origin')!==url.origin)return new Response(null,{status:403});
 let v;try{v=await request.json()}catch{return new Response(null,{status:400})}
 if(!v||![[v.width,80,600],[v.x,-250,250],[v.y,-150,150]].every(([n,min,max])=>Number.isInteger(n)&&n>=min&&n<=max))return new Response(null,{status:400});
 await writeFile(process.cwd()+'/app/logo-placement.json',JSON.stringify({width:v.width,x:v.x,y:v.y})+'\n');
 return Response.json({saved:true});
}
