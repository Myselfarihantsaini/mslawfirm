'use client';
import {usePathname} from 'next/navigation';

export default function PageWatermark(){
  const pathname=usePathname();
  if(pathname==='/')return null;
  return <style>{`
    header::before{display:none!important}
    main{position:relative;isolation:isolate}
    main::before{content:'';position:absolute;top:32px;right:4%;width:clamp(220px,38vw,520px);aspect-ratio:3/4;background:url('/ms-monogram-watermark.png') center/contain no-repeat;opacity:.10;pointer-events:none;z-index:0}
    main>*{position:relative;z-index:1}
    @media(max-width:600px){main::before{top:24px;right:4%;width:65%;max-width:280px;opacity:.06}}
  `}</style>;
}
