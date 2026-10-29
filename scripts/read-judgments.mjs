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

export async function readJudgments(){
  if(!process.env.GH_TOKEN || !process.env.GH_REPOSITORY) return [];
  let posts=[];
  try{
    for(let page=1;;page++){
      const r=await fetch(`https://api.github.com/repos/${process.env.GH_REPOSITORY}/issues?state=open&labels=judgment&per_page=100&page=${page}`,{
        headers:{
          Authorization:`Bearer ${process.env.GH_TOKEN}`,
          Accept:'application/vnd.github+json',
          'User-Agent':'msadvocates-build'
        }
      });
      if(!r.ok){
        console.warn('GitHub issues fetch notice:', r.status, await r.text());
        return posts;
      }
      const rows=await r.json();
      posts.push(...rows.filter(i=>!i.pull_request&&['OWNER','MEMBER','COLLABORATOR'].includes(i.author_association)).map(parseJudgment).filter(Boolean));
      if(rows.length<100) break;
    }
  }catch(err){
    console.warn('Error loading judgment posts from GitHub:', err.message);
  }
  return posts;
}
