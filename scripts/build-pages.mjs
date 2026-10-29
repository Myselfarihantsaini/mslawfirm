import {readJudgments} from './read-judgments.mjs';
import {cpSync,mkdirSync,rmSync,readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';

const dir=path.resolve('work/github-pages');
rmSync(dir,{recursive:true,force:true});
mkdirSync(dir,{recursive:true});

for(const name of ['app','public','package.json','postcss.config.mjs'])
  cpSync(name,path.join(dir,name),{recursive:true});

for(const name of ['api','lib','media','judgments'])
  rmSync(path.join(dir,'app',name),{recursive:true,force:true});

if(existsSync(path.join(dir,'app/admin/static-panel.js'))){
  cpSync(path.join(dir,'app/admin/static-panel.js'),path.join(dir,'app/admin/panel.js'));
  rmSync(path.join(dir,'app/admin/static-panel.js'),{force:true});
}

const update=(file,fn)=>{const p=path.join(dir,file);writeFileSync(p,fn(readFileSync(p,'utf8')))};

update('app/layout.js',s=>s
  .replace(/import WatermarkEditor[^\n]*\n/,'')
  .replace(/import watermark[^\n]*\n/,'')
  .replace(/import TextEditor[^\n]*\n/,'')
  .replace(/import textEdits[^\n]*\n/,'')
  .replace('<WatermarkEditor initial={watermark}/>','')
  .replace('<TextEditor saved={textEdits} enabled={false}/>','')
);

const watermark=JSON.parse(readFileSync('app/watermark.json'));
writeFileSync(
  path.join(dir,'app/globals.css'),
  readFileSync(path.join(dir,'app/globals.css'),'utf8')+`\n.editorial-hero::before{top:${watermark.top}px!important;right:${watermark.right}%!important;width:${watermark.width}%!important;opacity:${watermark.opacity/100}!important}header::before{top:calc(100% + ${watermark.top}px);right:${watermark.right}%;width:${watermark.width}%;opacity:.12}`
);

update('app/sections.js',s=>s
  .replace(/import \{list\}[^\n]*\n/,'')
  .replace(/import \{connection\}[^\n]*\n/,'')
  .replace("export async function Judgments(){await connection();const judgments=list('posts').filter(p=>p.status==='published');return","export function Judgments(){return")
  .replace(/<h3><a href=\{['"]\/judgments\/['"]\+j\.id\}>\{j\.title\}<\/a><\/h3>/g,'<h3><a href={/^https:\\/\\//i.test(j.sourceUrl)?j.sourceUrl:\'#\'} target="_blank" rel="noopener noreferrer">{j.title} ↗</a></h3>')
  .replace('<p>{j.summary}</p>','<p>{j.summary}</p><div className="article-body">{(j.body||"").split(/\\n\\s*\\n/).map((text,i)=><p key={i}>{text}</p>)}</div>')
  .replace('<a className="text-link judgment-read" href={\'/judgments/\'+j.id}>Read case note ↗</a>','')
);

let localJudgments=[];
if(existsSync(path.join(dir,'app/judgments-data.json'))){
  try{
    localJudgments=JSON.parse(readFileSync(path.join(dir,'app/judgments-data.json'),'utf8')).filter(p=>p.status==='published');
  }catch(e){}
}
const issueJudgments=await readJudgments();
const mergedMap=new Map();
for(const j of localJudgments) mergedMap.set(j.citation||j.id,j);
for(const j of issueJudgments) if(!mergedMap.has(j.citation||j.id)) mergedMap.set(j.citation||j.id,j);
const published=Array.from(mergedMap.values());

update('app/content.js',s=>s.replace('export const judgments = [];','export const judgments = '+JSON.stringify(published)+';'));
update('app/contact/page.js',s=>s.replace('enabled={true}','enabled={false}'));
update('app/[page]/page.js',s=>s+`\nexport function generateStaticParams(){return [...['about','practice-areas','legal-knowledge','judgments','privacy-policy','legal-disclaimer'],...practices.map(p=>p.slug),...draftArticles.map(p=>p.slug)].map(page=>({page}))}\n`);
update('app/robots.js',s=>"export const dynamic='force-static';\n"+s);
update('app/sitemap.js',()=>"export const dynamic='force-static';\nexport default function sitemap(){return []}\n");
writeFileSync(path.join(dir,'next.config.mjs'),"export default {output:'export',trailingSlash:true,images:{unoptimized:true},poweredByHeader:false,basePath:process.env.PAGES_BASE_PATH||''};\n");

const base=process.env.PAGES_BASE_PATH||'';
if(base)update('app/layout.js',s=>s.replace(/\['(\/[^']*)','/g,(_,url)=>"['"+base+url+"','"));

function walk(folder){
  for(const entry of readdirSync(folder,{withFileTypes:true})){
    const p=path.join(folder,entry.name);
    if(entry.isDirectory())walk(p);
    else if(/\.(js|css)$/.test(entry.name)&&base){
      let s=readFileSync(p,'utf8');
      s=s.replace(/(href=\{?['"])(\/(?!\/))/g,'$1'+base+'$2').replace(/(src=['"])(\/(?!\/))/g,'$1'+base+'$2').replace(/url\(['"]?(\/[^)'" ]+)/g,(m,url)=>m.replace(url,base+url));
      writeFileSync(p,s);
    }
  }
}
walk(path.join(dir,'app'));

execFileSync(path.resolve('node_modules/.bin/next'),['build','--webpack'],{cwd:dir,stdio:'inherit'});
