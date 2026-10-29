'use client';
import {useEffect,useState} from 'react';

const fileUrl='https://api.github.com/repos/Myselfarihantsaini/mslawfirm/contents/app/judgments-data.json';
const draftKey='ms-judgment-draft';
const blank={title:'',court:'',date:'',citation:'',sourceUrl:'',summary:'',body:'',author:'Adv. Bhavesh Saini',category:'Case note'};
function encode(text){return btoa(Array.from(new TextEncoder().encode(text),b=>String.fromCharCode(b)).join(''));}
function decode(text){return new TextDecoder().decode(Uint8Array.from(atob(text.replace(/\s/g,'')),c=>c.charCodeAt(0)));}

export default function StaticPanel(){
  const [post,setPost]=useState(blank);
  const [token,setToken]=useState('');
  const [posts,setPosts]=useState([]);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [preview,setPreview]=useState(false);
  useEffect(()=>{
    // Remove credentials saved by the previous editor. Credentials now remain in memory only.
    localStorage.removeItem('ms_gh_token');
    sessionStorage.removeItem('ms_admin_auth');
    try{const saved=JSON.parse(localStorage.getItem(draftKey));if(saved)setPost({...blank,...saved});}catch{}
  },[]);
  async function readPosts(){
    const response=await fetch(`${fileUrl}?ref=main`,{cache:'no-store',headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json'}});
    if(!response.ok)throw new Error('Unable to load judgments. Check that your publishing key has access to this repository.');
    const file=await response.json();
    const entries=JSON.parse(decode(file.content));
    if(!Array.isArray(entries))throw new Error('The judgments file could not be read. No changes were made.');
    return {entries,sha:file.sha};
  }
  async function loadPosts(){
    setBusy(true);setMessage('');
    try{const {entries}=await readPosts();setPosts(entries);setMessage('Judgments loaded. Select a post below to edit it.');}
    catch(error){setMessage(error.message);}finally{setBusy(false);}
  }
  function saveDraft(){
    try{localStorage.setItem(draftKey,JSON.stringify(post));setMessage('Draft saved in this browser. It is not published.');}
    catch{setMessage('This browser could not save the draft. Keep this page open.');}
  }
  async function publish(event){
    event.preventDefault();setMessage('');
    if(!token.trim()){setMessage('Enter your publishing key below to publish. You can still save a draft without it.');return;}
    setBusy(true);
    try{
      const {entries,sha}=await readPosts();
      const entry={...post,id:post.id||crypto.randomUUID(),status:'published',publishedDate:post.publishedDate||new Date().toISOString().slice(0,10)};
      const updated=entries.some(p=>p.id===entry.id)?entries.map(p=>p.id===entry.id?entry:p):[entry,...entries];
      const response=await fetch(fileUrl,{method:'PUT',headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','Content-Type':'application/json'},body:JSON.stringify({message:`Publish judgment: ${entry.title}`,content:encode(JSON.stringify(updated,null,2)+'\n'),sha,branch:'main'})});
      if(!response.ok)throw new Error(response.status===409?'Another update was saved first. Please publish again to retry.':'Publishing failed. Check your publishing key has Contents read and write permission for mslawfirm.');
      setPost(entry);setPosts(updated);localStorage.removeItem(draftKey);
      setMessage('Judgment saved. The live website will update after its deployment completes, usually within a few minutes.');
    }catch(error){setMessage(error.message);}finally{setBusy(false);}
  }
  const field=(name,label,type='text')=><label key={name}>{label}<input type={type} required={name!=='sourceUrl'} value={post[name]} onChange={e=>setPost({...post,[name]:e.target.value})}/></label>;
  return <div className="judgment-workspace">
    <p>Write, preview and publish judgments here. Published posts appear in the website’s Judgments section.</p>
    {message&&<p role="status" className="editor-message">{message}</p>}
    <form onSubmit={publish}>
      <div className="editor-fields">
        {field('title','Post title')}{field('court','Court')}{field('date','Decision date','date')}{field('citation','Citation')}{field('sourceUrl','Official judgment link (optional)','url')}{field('author','Author')}
      </div>
      <label>Summary<textarea required rows={3} value={post.summary} onChange={e=>setPost({...post,summary:e.target.value})}/></label>
      <label>Article<textarea required rows={14} value={post.body} onChange={e=>setPost({...post,body:e.target.value})}/></label>
      <div className="editor-actions"><button type="button" className="button" onClick={saveDraft}>Save draft</button><button type="button" className="button" onClick={()=>setPreview(!preview)}>{preview?'Hide preview':'Preview post'}</button><button className="button gold" disabled={busy}>{busy?'Saving…':post.id?'Publish changes':'Publish judgment'}</button></div>
      <details className="editor-connection"><summary>Publishing connection</summary><p>The website uses your existing GitHub hosting in the background. Enter a fine-grained access token restricted to Myselfarihantsaini/mslawfirm with Contents read and write permission. The key stays in this tab’s memory and is cleared when you reload or disconnect. Do not share it in chat.</p><label>Publishing key<input type="password" autoComplete="off" value={token} onChange={e=>setToken(e.target.value)} /></label><div className="editor-actions"><button type="button" className="button" disabled={busy||!token} onClick={loadPosts}>Load existing judgments</button><button type="button" className="button" onClick={()=>{setToken('');setPosts([]);setMessage('Publishing key cleared.');}}>Disconnect</button></div></details>
    </form>
    {preview&&<article className="editor-preview"><p className="eyebrow">Post preview · {post.court}</p><h2>{post.title||'Post title'}</h2><p>{post.citation} · {post.date}</p><p><strong>{post.summary}</strong></p><div style={{whiteSpace:'pre-wrap'}}>{post.body}</div><p>{post.author}</p></article>}
    {posts.length>0&&<section><h2>Existing judgments</h2>{posts.map(p=><button className="editor-post" type="button" key={p.id} onClick={()=>{setPost({...blank,...p});setPreview(false);setMessage('Post loaded for editing.');window.scrollTo({top:0,behavior:'smooth'});}}>{p.title} — Edit</button>)}</section>}
    <button type="button" className="text-link" onClick={()=>{setPost(blank);setPreview(false);setMessage('New judgment started.');}}>Start a new judgment</button>
  </div>;
}
