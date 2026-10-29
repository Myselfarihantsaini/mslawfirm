export default function StaticPanel(){
  return (
    <div className="admin-panel">
      <div style={{background:'rgba(181, 154, 96, 0.08)', border:'1px solid rgba(181, 154, 96, 0.35)', padding:'22px 26px', borderRadius:'3px', marginBottom:'40px'}}>
        <p style={{margin:'0 0 6px', fontWeight:600, fontSize:'16px', color:'#101d32'}}>
          Chambers Live Publishing & Administration Portal
        </p>
        <p style={{margin:0, color:'#556170', fontSize:'14px', lineHeight:'1.7'}}>
          Welcome to the MS Advocates & Solicitors administration portal. This interface allows Adv. Bhavesh Saini and authorized collaborators to draft, publish, and update judicial case notes live on <strong>msadvocates.co.in</strong>.
        </p>
      </div>

      <div className="contact-grid">
        <section>
          <h2>Judgment Publishing</h2>
          <p style={{color:'#556170', marginBottom:'24px'}}>
            Write and review case notes in GitHub. Approved posts are automatically published with their supplied citations and source links.
          </p>

          <div style={{display:'flex', flexDirection:'column', gap:'16px', alignItems:'flex-start'}}>
            <a 
              className="button gold" 
              href="https://github.com/Myselfarihantsaini/mslawfirm/issues/new?template=judgment.yml" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{textDecoration:'none'}}
            >
              + Publish New Judgment ↗
            </a>

            <a 
              className="text-link" 
              href="https://github.com/Myselfarihantsaini/mslawfirm/issues?q=is%3Aissue+label%3Ajudgment" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{marginTop:'6px'}}
            >
              View & Edit Published Judgments on GitHub ↗
            </a>
          </div>

          <div style={{marginTop:'45px', borderTop:'1px solid #dcdedb', paddingTop:'28px'}}>
            <h3 style={{fontSize:'20px', marginBottom:'16px'}}>How Publishing Works</h3>
            <ol style={{paddingLeft:'20px', lineHeight:'2', color:'#455160'}}>
              <li>Click <strong>Publish New Judgment</strong> to open the structured template.</li>
              <li>Fill in the Court, Decision Date, Citation, Official Source URL, Summary, and Article text.</li>
              <li>Check the publication approval box only after reviewing the post.</li>
              <li>Click <strong>Submit new issue</strong>. GitHub Actions automatically rebuilds and deploys the live case note after a successful deployment.</li>
              <li>To update or correct text, edit the issue. To unpublish or archive, uncheck publication approval or close the issue.</li>
            </ol>
          </div>
        </section>

        <section>
          <h2>Client Inquiries & Dispatch</h2>
          <p style={{color:'#556170', marginBottom:'20px'}}>
            Prospective client communications are routed directly to chambers verified channels:
          </p>

          <div style={{background:'#ffffff', border:'1px solid #e2ded5', padding:'24px', borderRadius:'3px', marginBottom:'28px'}}>
            <p style={{margin:'0 0 12px'}}>
              <strong style={{color:'#101d32'}}>Primary WhatsApp:</strong>{' '}
              <a className="text-link" href="https://wa.me/918168814917" target="_blank" rel="noopener noreferrer">+91 81688 14917</a>
            </p>
            <p style={{margin:'0 0 12px'}}>
              <strong style={{color:'#101d32'}}>Chambers Telephone:</strong>{' '}
              <a className="text-link" href="tel:+919812827624">+91 98128 27624</a>
            </p>
            <p style={{margin:0}}>
              <strong style={{color:'#101d32'}}>Chambers Email:</strong>{' '}
              <a className="text-link" href="mailto:MSlegal1996@outlook.com">MSlegal1996@outlook.com</a>
            </p>
          </div>

          <div style={{background:'#f6f4ee', border:'1px solid #dfd9cb', padding:'22px', borderRadius:'3px'}}>
            <p className="eyebrow" style={{marginBottom:'10px'}}>REGULATORY COMPLIANCE</p>
            <h3 style={{fontSize:'17px', margin:'0 0 10px'}}>Bar Council of India Rule 36</h3>
            <p className="muted" style={{margin:0, lineHeight:'1.7'}}>
              All case law analysis and knowledge commentary published through this portal must remain strictly educational and factual. Verification of official court citations and standard statutory disclaimers are mandatory before publication.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
