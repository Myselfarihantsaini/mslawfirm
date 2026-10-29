import {notFound,permanentRedirect} from 'next/navigation';
import {practices,draftArticles} from '../content';
import {About,Practices,Knowledge,Judgments} from '../sections';

const policies={
  'privacy-policy':{
    title:'Privacy Policy',
    text:[
      'The enquiry form requests your name, email, optional phone number, subject and message. Please do not provide confidential information or case documents.',
      'Enquiries will be used to assess and respond to your request. Live delivery remains disabled until the chambers approves and configures a service provider.',
      'The visitor acknowledgement uses browser session storage. Before launch, the practice must confirm its privacy contact, retention period, service providers and procedures for access or deletion requests.'
    ]
  },
  'legal-disclaimer':{
    title:'Legal Disclaimer',
    text:[
      'This website provides general information, not advice on individual legal circumstances. Viewing it or sending an enquiry does not automatically establish an advocate–client relationship.',
      'Please do not submit confidential information before an appropriate professional relationship is established. No outcome is promised.',
      'The advocate must review the website against applicable professional rules before publication. The visitor acknowledgement is not a substitute for that review.'
    ]
  }
};

export async function generateMetadata({params}){
  const {page}=await params;
  return {
    title: policies[page]?.title ||
           practices.find(p=>p.slug===page)?.title ||
           draftArticles.find(a=>a.slug===page)?.title ||
           ({'about':'About the Advocate','practice-areas':'Practice Areas','legal-knowledge':'Legal Knowledge Centre','judgments':'Judgments'}[page]) ||
           'MS Advocates & Solicitors'
  };
}

export default async function Page({params}){
  const {page}=await params;
  if(page==='privacy')permanentRedirect('/privacy-policy');
  if(page==='disclaimer')permanentRedirect('/legal-disclaimer');
  if(page==='strategist')permanentRedirect('/legal-strategy');
  if(page==='judgments')return <main id="main"><Judgments/></main>;
  if(page==='about')return <main id="main"><About/></main>;
  if(page==='practice-areas')return <main id="main"><Practices/></main>;
  if(page==='legal-knowledge')return <main id="main"><Knowledge/></main>;

  const policy=policies[page];
  const practice=practices.find(p=>p.slug===page);
  const article=draftArticles.find(a=>a.slug===page);

  if(!policy&&!practice&&!article)notFound();

  return (
    <main id="main" className="section prose">
      <p className="eyebrow">MS ADVOCATES & SOLICITORS</p>
      <h1 className="page-title">{policy?.title||practice?.title||article?.title}</h1>
      {policy ? (
        policy.text.map(t=><p key={t}>{t}</p>)
      ) : practice ? (
        <>
          <p className="lead">{practice.description}</p>
          <h2>Practice overview</h2>
          <p>{practice.overview}</p>
          <h2>Points for initial assessment</h2>
          <ul className="practice-points">{practice.assessment.map(point=><li key={point}>{point}</li>)}</ul>
          <h2>Preparing your enquiry</h2>
          <p>{practice.preparation}</p>
          <h2>Professional engagement</h2>
          <p>{practice.engagement}</p>
          <p>This overview is general information. Availability of assistance depends on the particular matter and professional engagement. It does not imply specialist status or guarantee an outcome.</p>
          <a className="text-link" href="/contact">Contact the practice ↗</a>
        </>
      ) : article ? (
        <>
          <div className="article-meta" style={{display:'flex',gap:'16px',color:'#846d3e',fontSize:'13px',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'24px',flexWrap:'wrap'}}>
            <span>{article.category}</span>
            <span>•</span>
            <span>{article.readTime}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
          <p className="lead" style={{fontFamily:'Georgia, serif',fontSize:'20px',lineHeight:'1.7',color:'#2c3644',marginBottom:'32px'}}>
            {article.summary}
          </p>
          <div className="article-content" style={{lineHeight:'1.85',fontSize:'16px',color:'#1c2530'}}>
            {article.sections.map((sec, idx) => (
              <section key={idx} style={{marginBottom:'32px'}}>
                <h2 style={{fontFamily:'Georgia, serif',fontSize:'24px',marginBottom:'12px',color:'#101d32'}}>
                  {sec.heading}
                </h2>
                <p style={{margin:0}}>{sec.content}</p>
              </section>
            ))}
          </div>
          <div style={{marginTop:'48px',padding:'24px',borderLeft:'3px solid #b59a60',background:'#f4f1ea'}}>
            <p style={{margin:0,fontSize:'14px',color:'#556070',lineHeight:'1.6'}}>
              <strong>Educational & Informational Notice:</strong> This publication is compiled for general educational guidance only and does not constitute formal legal opinion or legal advice. Legal procedures may vary based on jurisdictional rules and statutory amendments. For specific legal assistance, consult a qualified advocate.
            </p>
          </div>
          <div style={{marginTop:'36px',display:'flex',gap:'24px',alignItems:'center',flexWrap:'wrap'}}>
            <a className="text-link" href="/legal-knowledge">← Back to Knowledge Centre</a>
            <a className="text-link" href="/contact">Contact the practice ↗</a>
          </div>
        </>
      ) : null}
    </main>
  );
}
