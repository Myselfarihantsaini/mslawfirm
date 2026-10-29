'use client';
import {usePathname} from 'next/navigation';

export default function PageWatermark(){
  const pathname=usePathname();
  if(pathname==='/')return null;
  return <>
    <style>{`
      body{position:relative}
      header::before,main::before{display:none!important}
      .inner-page-watermark{position:absolute;top:24px;right:4%;width:40%;max-width:560px;height:auto;opacity:.12;pointer-events:none;user-select:none;z-index:51}
      @media(max-width:900px){.inner-page-watermark{top:30px;right:4%;width:46%}}
      @media(max-width:600px){.inner-page-watermark{top:40px;right:4%;width:65%;opacity:.08}}
    `}</style>
    <img className="inner-page-watermark" src="/ms-monogram-watermark.png" alt="" aria-hidden="true"/>
  </>;
}
