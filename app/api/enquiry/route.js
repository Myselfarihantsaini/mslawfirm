import {save} from '../../lib/store.js';
import {randomUUID} from 'node:crypto';
export async function POST(request){
 const reply=(message,status)=>Response.json({message},{status});
 if(!request.headers.get('origin')||new URL(request.headers.get('origin')).host!==request.headers.get('host'))return reply('Request not permitted.',403);
 if(!request.headers.get('content-type')?.includes('application/json'))return reply('Invalid request.',415);
 const raw=await request.text();if(raw.length>10000)return reply('Message too long.',413);
 let data;try{data=JSON.parse(raw)}catch{return reply('Invalid request.',400)}
 if(!data||typeof data!=='object')return reply('Invalid request.',400);
 if(data.website)return reply('Unable to accept this enquiry.',400);
 const {name,email,category,message,consent,phone,subject}=data;
 if((phone!==undefined&&(typeof phone!=="string"||phone.length>25||!/^[-+()0-9 .]*$/.test(phone)))||(subject!==undefined&&(typeof subject!=="string"||!subject.trim()||subject.length>150)))return reply("Please check phone and subject.",400);
 if(typeof name!=='string'||!name.trim()||name.length>100||typeof email!=='string'||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof message!=='string'||message.trim().length<10||message.length>2000||!['General enquiry','Availability of assistance','Administrative enquiry'].includes(category)||consent!=='on')return reply('Please check the enquiry fields.',400);
 save('enquiries',{id:randomUUID(),name,email,phone:phone||'',subject:subject||'',category,message,status:'new',createdAt:new Date().toISOString()});
 return reply('Your enquiry has been received by the practice.',200);

}
