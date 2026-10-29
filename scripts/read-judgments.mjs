export function parseJudgment(issue){
  const fields={};
  for(const part of (issue.body||'').split(/^### /m).slice(1)){
    const [label,...lines]=part.split('\n');
    fields[label.trim()]=lines.join('\n').trim();
  }
  const source=fields['Official judgment URL'];
  if(!/^https:\/\//.test(source||'')) return null;
  return {
    id: String(issue.number),
    title: (issue.title||'').replace(/^Judgment:\s*/i,'').trim(),
    court: fields.Court || '',
    date: fields['Decision date'] || '',
    citation: fields.Citation || '',
    author: fields.Author || 'MS Advocates & Solicitors',
    summary: fields.Summary || '',
    body: fields.Article || '',
    sourceUrl: source,
    publishedDate: (issue.created_at || '').slice(0, 10)
  };
}

export function isPublished(issue){return !issue.pull_request&&['OWNER','MEMBER','COLLABORATOR'].includes(issue.author_association)&&/^Judgment:/i.test(issue.title||'')&&(/- \[x\] I have reviewed this post and approve publication on the website\./i.test(issue.body||'')||issue.labels?.some(l=>l.name==='judgment'))}
export async function readJudgments(){
 if(!process.env.GH_TOKEN||!process.env.GH_REPOSITORY)return [];
 const posts=[];
 for(let page=1;;page++){
 const r=await fetch(`https://api.github.com/repos/${process.env.GH_REPOSITORY}/issues?state=open&per_page=100&page=${page}`,{headers:{Authorization:`Bearer ${process.env.GH_TOKEN}`,Accept:'application/vnd.github+json','User-Agent':'msadvocates-build'}});
 if(!r.ok)throw Error('Judgment retrieval failed; previous deployment is preserved.');
 const rows=await r.json();posts.push(...rows.filter(isPublished).map(parseJudgment).filter(Boolean));if(rows.length<100)break;
 }return posts;
}
