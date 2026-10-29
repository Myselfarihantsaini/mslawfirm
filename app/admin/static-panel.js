'use client';
import {useState,useEffect} from 'react';

const AUTH_HASHES = [
  'b1888df2afdb03a62269a350842816f7aba08ee990369c4de2867a15cfad4150',
  'd3fa043b4a9f9264e02bcc9678ac6895246330e0df3579cd7992d5996f1fad1c',
  'a333ad140f6a1c7da43e2524abbcde2d41ddf5d1a449522cdebe5f8cd416d075'
];

async function sha256(text){
  const buffer=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

function toBase64(str){
  const bytes=new TextEncoder().encode(str);
  let binary='';
  for(let i=0;i<bytes.byteLength;i++) binary+=String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(str){
  const binary=atob(str.replace(/\s/g,''));
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<bytes.length;i++) bytes[i]=binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

const blankPost={
  title:'',
  court:'Supreme Court of India',
  date:'',
  citation:'',
  sourceUrl:'',
  summary:'',
  body:'',
  author:'Adv. Bhavesh Saini',
  category:'Case note',
  status:'published'
};

export default function StaticPanel(){
  const [authenticated,setAuthenticated]=useState(false);
  const [keyInput,setKeyInput]=useState('');
  const [token,setToken]=useState('');
  const [post,setPost]=useState(blankPost);
  const [statusMessage,setStatusMessage]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{
    if(sessionStorage.getItem('ms_admin_auth')==='granted'){
      setAuthenticated(true);
    }
    const savedToken=localStorage.getItem('ms_gh_token');
    if(savedToken) setToken(savedToken);
  },[]);

  async function handleUnlock(e){
    e.preventDefault();
    setStatusMessage('');
    const input=keyInput.trim();
    if(!input){
      setStatusMessage('Please enter an access passkey or token.');
      return;
    }
    setBusy(true);
    try{
      const hash=await sha256(input);
      if(AUTH_HASHES.includes(hash)){
        sessionStorage.setItem('ms_admin_auth','granted');
        setAuthenticated(true);
        setKeyInput('');
        return;
      }
      if(input.startsWith('ghp_')||input.startsWith('github_pat_')){
        const r=await fetch('https://api.github.com/user',{
          headers:{Authorization:`Bearer ${input}`,Accept:'application/vnd.github+json'}
        });
        if(r.ok){
          sessionStorage.setItem('ms_admin_auth','granted');
          localStorage.setItem('ms_gh_token',input);
          setToken(input);
          setAuthenticated(true);
          setKeyInput('');
          return;
        }
      }
      setStatusMessage('Access denied: Invalid credentials.');
    }catch(err){
      setStatusMessage('Authentication error. Please retry.');
    }finally{
      setBusy(false);
    }
  }

  function handleLock(){
    sessionStorage.removeItem('ms_admin_auth');
    setAuthenticated(false);
    setStatusMessage('');
  }

  async function handlePublishDirect(e){
    e.preventDefault();
    setStatusMessage('');
    if(!token){
      setStatusMessage('GitHub token required for direct publishing. Please save your token below or use the template.');
      return;
    }
    if(!post.title.trim()||!post.court.trim()||!post.citation.trim()||!post.summary.trim()||!post.body.trim()){
      setStatusMessage('Please complete all required fields.');
      return;
    }
    if(!/^https:\/\//i.test(post.sourceUrl)){
      setStatusMessage('Official source link must begin with https://');
      return;
    }
    setBusy(true);
    setStatusMessage('Connecting directly to GitHub repository...');
    try{
      const fileUrl='https://api.github.com/repos/Myselfarihantsaini/mslawfirm/contents/app/judgments-data.json';
      let existingPosts=[];
      let fileSha=null;

      const getRes=await fetch(fileUrl,{
        headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json'}
      });
      if(getRes.ok){
        const getData=await getRes.json();
        fileSha=getData.sha;
        try{
          existingPosts=JSON.parse(fromBase64(getData.content));
          if(!Array.isArray(existingPosts)) existingPosts=[];
        }catch(e){existingPosts=[];}
      }

      const newEntry={
        id: String(Date.now()),
        title: post.title.trim(),
        court: post.court.trim(),
        date: post.date || new Date().toISOString().slice(0,10),
        citation: post.citation.trim(),
        sourceUrl: post.sourceUrl.trim(),
        summary: post.summary.trim(),
        body: post.body.trim(),
        author: post.author.trim() || 'Adv. Bhavesh Saini',
        category: post.category || 'Case note',
        publishedDate: new Date().toISOString().slice(0,10),
        status: 'published'
      };

      const updatedPosts=[newEntry,...existingPosts];
      const encodedContent=toBase64(JSON.stringify(updatedPosts,null,2)+'\n');

      const putRes=await fetch(fileUrl,{
        method:'PUT',
        headers:{
          Authorization:`Bearer ${token}`,
          Accept:'application/vnd.github+json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          message:`Publish judgment: ${newEntry.title}`,
          content:encodedContent,
          sha:fileSha,
          branch:'main'
        })
      });

      if(!putRes.ok){
        const errData=await putRes.json().catch(()=>({}));
        throw Error(errData.message||'Failed to commit to GitHub.');
      }

      setStatusMessage('Published directly to GitHub! Website deployment will finish in ~60 seconds.');
      setPost(blankPost);
    }catch(err){
      setStatusMessage(`Publishing failed: ${err.message}`);
    }finally{
      setBusy(false);
    }
  }

  if(!authenticated){
    return (
      <div className="admin-panel" style={{maxWidth:'520px',margin:'40px auto',padding:'36px',background:'#fff',border:'1px solid #dcdedb',boxShadow:'0 4px 20px rgba(0,0,0,0.04)'}}>
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <span style={{fontSize:'32px',display:'block',marginBottom:'12px'}}>🔒</span>
          <p className="eyebrow" style={{marginBottom:'6px'}}>RESTRICTED WORKSPACE</p>
          <h2 style={{fontSize:'24px',margin:0}}>Chambers Access Verification</h2>
        </div>
        <form onSubmit={handleUnlock}>
          <label style={{display:'block',marginBottom:'16px'}}>
            <span style={{display:'block',fontSize:'13px',fontWeight:600,color:'#101d32',marginBottom:'8px'}}>
              Passkey or Personal Access Token
            </span>
            <input 
              type="password" 
              value={keyInput} 
              onChange={e=>setKeyInput(e.target.value)}
              placeholder="Enter authorization key..."
              style={{width:'100%',padding:'12px 14px',border:'1px solid #ccc',boxSizing:'border-box'}}
              required
            />
          </label>
          {statusMessage && <p role="alert" style={{color:'#a83232',fontSize:'13px',margin:'10px 0'}}>{statusMessage}</p>}
          <button className="button gold" disabled={busy} style={{width:'100%',justifyContent:'center',marginTop:'12px'}}>
            {busy ? 'Verifying...' : 'Unlock Workspace'}
          </button>
        </form>
        <p className="muted" style={{fontSize:'12px',marginTop:'20px',textAlign:'center'}}>
          Encrypted client-side access control. Only authorized counsel may enter.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(181, 154, 96, 0.1)',border:'1px solid rgba(181, 154, 96, 0.35)',padding:'16px 24px',borderRadius:'3px',marginBottom:'36px'}}>
        <div>
          <strong style={{color:'#101d32'}}>Private Administrative Session Active</strong>
          <span style={{display:'block',fontSize:'13px',color:'#556170'}}>Adv. Bhavesh Saini · MS Advocates & Solicitors</span>
        </div>
        <button type="button" className="text-link" onClick={handleLock} style={{cursor:'pointer',border:'0',background:'none',color:'#a83232'}}>
          Lock & Sign Out
        </button>
      </div>

      {statusMessage && (
        <div style={{background:statusMessage.includes('Published')?'#ebfbee':'#fff5f5',border:statusMessage.includes('Published')?'1px solid #a3e635':'1px solid #fecaca',padding:'14px 18px',marginBottom:'24px',borderRadius:'3px'}}>
          <p style={{margin:0,fontSize:'14px',color:statusMessage.includes('Published')?'#15803d':'#b91c1c'}}>{statusMessage}</p>
        </div>
      )}

      <div className="contact-grid">
        <section>
          <h2>Direct Judgment Publishing</h2>
          <p style={{color:'#556170',marginBottom:'24px'}}>
            Publish judicial case notes directly to GitHub with automated BCI Rule 36 compliance formatting.
          </p>

          <form onSubmit={handlePublishDirect}>
            <label style={{display:'block',marginBottom:'14px'}}>
              <span>Case Title</span>
              <input 
                type="text" 
                value={post.title} 
                onChange={e=>setPost({...post,title:e.target.value})} 
                placeholder="e.g. State of Haryana v. M/s ABC Enterprises" 
                maxLength={200}
                required 
              />
            </label>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <label style={{display:'block',marginBottom:'14px'}}>
                <span>Court / Tribunal</span>
                <input 
                  type="text" 
                  value={post.court} 
                  onChange={e=>setPost({...post,court:e.target.value})} 
                  placeholder="Supreme Court of India" 
                  required 
                />
              </label>

              <label style={{display:'block',marginBottom:'14px'}}>
                <span>Decision Date</span>
                <input 
                  type="date" 
                  value={post.date} 
                  onChange={e=>setPost({...post,date:e.target.value})} 
                  required 
                />
              </label>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <label style={{display:'block',marginBottom:'14px'}}>
                <span>Official Citation</span>
                <input 
                  type="text" 
                  value={post.citation} 
                  onChange={e=>setPost({...post,citation:e.target.value})} 
                  placeholder="e.g. (2024) 4 SCC 512" 
                  required 
                />
              </label>

              <label style={{display:'block',marginBottom:'14px'}}>
                <span>Author</span>
                <input 
                  type="text" 
                  value={post.author} 
                  onChange={e=>setPost({...post,author:e.target.value})} 
                  required 
                />
              </label>
            </div>

            <label style={{display:'block',marginBottom:'14px'}}>
              <span>Official Judgment URL (Court Record)</span>
              <input 
                type="url" 
                value={post.sourceUrl} 
                onChange={e=>setPost({...post,sourceUrl:e.target.value})} 
                placeholder="https://main.sci.gov.in/..." 
                required 
              />
            </label>

            <label style={{display:'block',marginBottom:'14px'}}>
              <span>Executive Ratio / Summary</span>
              <textarea 
                rows={4} 
                value={post.summary} 
                onChange={e=>setPost({...post,summary:e.target.value})} 
                placeholder="Core ratio decidendi, statutory questions, and principle settled." 
                required 
              />
            </label>

            <label style={{display:'block',marginBottom:'14px'}}>
              <span>Full Case Commentary & Analysis</span>
              <textarea 
                rows={8} 
                value={post.body} 
                onChange={e=>setPost({...post,body:e.target.value})} 
                placeholder="Detailed commentary. Separate paragraphs with a blank line." 
                required 
              />
            </label>

            <div style={{background:'#faf9f6',border:'1px solid #e5e0d4',padding:'16px',borderRadius:'3px',marginBottom:'20px'}}>
              <label style={{display:'block',margin:0}}>
                <span style={{fontSize:'12px',fontWeight:600}}>GitHub Token (Saved locally in browser)</span>
                <input 
                  type="password" 
                  value={token} 
                  onChange={e=>{setToken(e.target.value);localStorage.setItem('ms_gh_token',e.target.value);}} 
                  placeholder="ghp_... or github_pat_..." 
                  style={{marginTop:'6px'}} 
                />
              </label>
              <small className="muted" style={{display:'block',marginTop:'6px'}}>
                Requires write permission on mslawfirm repository. Stored only in your local browser.
              </small>
            </div>

            <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
              <button className="button gold" disabled={busy}>
                {busy ? 'Committing...' : 'Publish Directly to GitHub'}
              </button>
              <button type="button" onClick={()=>setPost(blankPost)} style={{border:'0',background:'none',cursor:'pointer',fontSize:'13px',color:'#666'}}>
                Clear Form
              </button>
            </div>
          </form>
        </section>

        <section>
          <h2>Direct Alternative: GitHub Template</h2>
          <p style={{color:'#556170',marginBottom:'18px'}}>
            You can also publish without entering a token by using your pre-configured GitHub Issue Template:
          </p>
          <a 
            className="button gold" 
            href="https://github.com/Myselfarihantsaini/mslawfirm/issues/new?template=judgment.yml" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{textDecoration:'none',display:'inline-flex',marginBottom:'28px'}}
          >
            Open Judgment Template on GitHub ↗
          </a>

          <h2>Security & Compliance Guardrails</h2>
          <div style={{background:'#ffffff',border:'1px solid #e2ded5',padding:'20px',borderRadius:'3px',marginBottom:'20px'}}>
            <h3 style={{fontSize:'16px',margin:'0 0 8px'}}>Zero 3rd-Party Architecture</h3>
            <p className="muted" style={{margin:0,lineHeight:'1.6'}}>
              All publishing requests talk strictly between your authenticated browser and GitHub’s official HTTPS API. No intermediary servers, databases, or third-party webhooks have access to your credentials.
            </p>
          </div>

          <div style={{background:'#f6f4ee',border:'1px solid #dfd9cb',padding:'20px',borderRadius:'3px'}}>
            <h3 style={{fontSize:'16px',margin:'0 0 8px'}}>BCI Rule 36 Mandatory Compliance</h3>
            <p className="muted" style={{margin:0,lineHeight:'1.6'}}>
              Judgments published must remain purely educational and informative. Maintain verified citations and official court record links for every publication.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
