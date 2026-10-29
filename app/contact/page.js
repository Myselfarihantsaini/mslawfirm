import {firm} from '../content';
import Form from './form';
export const metadata={title:'Contact the Practice'};
export default function Contact(){
  return (
    <main id="main" className="section">
      <p className="eyebrow">PROFESSIONAL ENQUIRIES</p>
      <h1 className="page-title">Contact the Practice</h1>
      <div className="contact-grid">
        <div className="contact-chambers-card">
          <h2>Adv. Bhavesh Saini</h2>
          <p className="contact-chambers-subtitle">MS Advocates & Solicitors</p>
          <div className="contact-method-group">
            <span className="contact-method-label">Chambers Email</span>
            <a className="text-link" href={'mailto:'+firm.email}>{firm.email}</a>
          </div>
          <div className="contact-method-group">
            <span className="contact-method-label">Primary Telephone</span>
            <a className="text-link" href="tel:+918168814917">+91 81688 14917</a>
          </div>
          <div className="contact-method-group">
            <span className="contact-method-label">Secondary Telephone</span>
            <a className="text-link" href="tel:+919812827624">+91 98128 27624</a>
          </div>
          <div className="contact-method-group">
            <span className="contact-method-label">Chambers Address</span>
            <p style={{margin:0,fontSize:'15px',color:'#2c3644',lineHeight:'1.6'}}>{firm.address}</p>
          </div>
          <div className="contact-method-group">
            <span className="contact-method-label">Consultation Hours</span>
            <p style={{margin:0,fontSize:'15px',color:'#2c3644',lineHeight:'1.6'}}>{firm.hours}</p>
          </div>
          <p className="muted" style={{marginTop:'32px',lineHeight:'1.7'}}>
            Initial communication is handled in strict accordance with professional standards. Please avoid sharing confidential documents prior to engagement.
          </p>
        </div>
        <div>
          <h2>General enquiry</h2>
          <p style={{fontSize:'16px',color:'#556070',marginBottom:'24px',lineHeight:'1.7'}}>
            Please share a brief, general description. Do not include confidential information or case documents.
          </p>
          <Form enabled={true}/>
          <div style={{marginTop:'24px'}}>
            <a className="text-link" href="/privacy-policy">How enquiries are handled ↗</a>
          </div>
        </div>
      </div>
    </main>
  );
}
