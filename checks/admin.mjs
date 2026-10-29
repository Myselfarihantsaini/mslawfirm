import assert from 'node:assert/strict';
const base='http://127.0.0.1:3000';
assert.equal((await fetch(base+'/api/admin')).status,401);
assert.equal((await fetch(base+'/api/admin',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({action:'login',password:'disabled'})})).status,401);
const result=await fetch(base+'/api/auth/google',{redirect:'manual'});assert.equal(result.status,303);
console.log('Protected admin, disabled password login and Google redirect checks passed.');
