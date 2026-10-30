import {list} from './lib/store';
import {connection} from 'next/server';
import Image from 'next/image';
import {bio,biography,firm,practices,articles,judgments} from './content';

export function About(){
  return (
    <section className="section about" id="about">
      <figure className="advocate-frame">
        <div className="advocate-photo">
          <Image src="/bhavesh-saini-v2.png" alt="Adv. Bhavesh Saini in advocate attire" fill sizes="(max-width:768px) 90vw, 36vw" style={{objectFit:'cover',objectPosition:'center 38%'}}/>
        </div>
        <figcaption>Adv. Bhavesh Saini<small>ADVOCATE</small></figcaption>
      </figure>
      <div>
        <p className="eyebrow">THE ADVOCATE</p>
        <h2>A Practice Grounded in Knowledge and Responsibility.</h2>
        <p>{bio}</p>
        <p className="qualifications">
          B.A. LL.B. &nbsp; / &nbsp; LL.M.<br/>
          PGDC in Corporate Law and Management<br/>
          <span>Silver Medalist</span>
        </p>
        <div className="advocate-meta" style={{margin:'24px 0',fontSize:'14px',lineHeight:'1.8',color:'#2c3644'}}>
          <p style={{margin:'6px 0'}}><strong>Bar Enrolment:</strong> {biography['Bar enrolment details']}</p>
          <p style={{margin:'6px 0'}}><strong>Courts of Practice:</strong> {biography['Courts of practice']}</p>
        </div>
        <a className="text-link" href="/contact">Enquire with chambers ↗</a>
      </div>
    </section>
  );
}

export function Practices(){
  return (
    <section className="section practice practice-gallery" id="practice">
      <div className="section-head">
        <div>
          <p className="eyebrow">AREAS OF PRACTICE</p>
          <h2>Clarity in complex matters.</h2>
        </div>
        <p>An overview of the legal matters addressed by the practice, subject to the nature and requirements of each engagement.</p>
      </div>
      <div className="practice-rows">
        {practices.map((p,i)=>(
          <a href={'/'+p.slug} key={p.slug}>
            <span className="number">0{i+1}</span>
            <div className="practice-copy">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <ul className="practice-card-points">
                {p.assessment.slice(0,2).map(point=><li key={point}>{point}</li>)}
              </ul>
              <span className="practice-detail">Explore practice <span aria-hidden="true">↗</span></span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Knowledge(){
  return (
    <section className="section" id="knowledge">
      <div className="section-head">
        <div>
          <p className="eyebrow">PERSPECTIVES & PUBLICATIONS</p>
          <h2>Legal Knowledge Centre</h2>
        </div>
        <p>Procedural guides and legal insights prepared to provide general educational clarity on common legal processes in India.</p>
      </div>
      <div className="knowledge-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',gap:'32px'}}>
        {articles.map(a => (
          <article key={a.slug} style={{borderTop:'1px solid #b5966260',paddingTop:'24px',display:'flex',flexDirection:'column'}}>
            <p className="eyebrow" style={{marginBottom:'12px'}}>{a.category} · {a.readTime}</p>
            <h3 style={{fontSize:'22px',lineHeight:'1.35',marginBottom:'14px'}}>
              <a href={'/' + a.slug}>{a.title}</a>
            </h3>
            <p style={{color:'#556070',lineHeight:'1.65',fontSize:'15px',flexGrow:1,marginBottom:'20px'}}>
              {a.summary}
            </p>
            <div>
              <a className="text-link" href={'/' + a.slug}>Read educational guide ↗</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export async function Judgments(){
  await connection();
  const judgments=list('posts').filter(p=>p.status==='published');
  return (
    <section className="section judgments" id="judgments">
      <div className="section-head">
        <div>
          <p className="eyebrow">CASE LAW & JUDICIAL DEVELOPMENTS</p>
          <h2>Judgments</h2>
        </div>
        <p>A considered reading of judicial decisions, with references to the original court records.</p>
      </div>
      {judgments.length?(
        <div className="judgment-list">
          {judgments.map(j=>(
            <article key={j.citation}>
              <p className="eyebrow">{j.court} · <time dateTime={j.date}>{j.date}</time></p>
              {j.coverImage&&<img className="judgment-cover" src={j.coverImage} alt={j.coverAlt||''}/>}
              <h3><a href={'/judgments/'+j.id}>{j.title}</a></h3>
              <p className="muted">{j.author} · {j.publishedDate}</p>
              <p className="muted">{j.citation}</p>
              <p>{j.summary}</p>
              {j.sourceUrl&&<a className="text-link" href={/^https:\/\//i.test(j.sourceUrl)?j.sourceUrl:'#'} target="_blank" rel="noopener noreferrer">Read official judgment ↗</a>}
              <a className="text-link judgment-read" href={'/judgments/'+j.id}>Read case note ↗</a>
            </article>
          ))}
        </div>
      ):(
        <div className="empty-state">
          <p>Decisions that inform.<br/>Context that matters.</p>
          <span>Reviewed case notes will be added here with the case name, court, decision date, citation and a link to the official judgment. No judgments have been published yet.</span>
        </div>
      )}
    </section>
  );
}
