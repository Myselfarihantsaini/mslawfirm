'use client';

export default function HomeLogo({children}){
  function goHome(event){
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    if(window.location.pathname==='/'&&!window.location.search&&!window.location.hash)window.location.reload();
    else window.location.assign('/');
  }
  return <a className="brand" href="/" title="Home" aria-label="MS Advocates & Solicitors — home and refresh" onClick={goHome}>{children}</a>;
}
