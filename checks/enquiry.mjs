import assert from 'node:assert/strict';
import {POST} from '../app/api/enquiry/route.js';
const request=(body,origin='http://localhost:3000')=>new Request('http://localhost:3000/api/enquiry',{method:'POST',headers:{origin,host:'localhost:3000','Content-Type':'application/json'},body:JSON.stringify(body)});
assert.equal((await POST(request({},'https://other.example'))).status,403);
assert.equal((await POST(request({}))).status,400);
assert.equal((await POST(request({website:'spam'}))).status,400);
delete process.env.ENQUIRY_WEBHOOK_URL;
assert.equal((await POST(request({name:'Test',email:'test@example.com',message:'A general enquiry',category:'General enquiry',consent:'on',phone:'invalid'}))).status,400);
console.log('Enquiry validation checks passed.');
