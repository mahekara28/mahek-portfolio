import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.gif':'image/gif','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
const legacyRedirects=new Map([
  ['/about',['/?scene=about',302]],
  ['/projects',['/?scene=work',308]],
  ['/contact',['/?scene=contact',308]],
  ['/desktop',['/?scene=universe',302]],
  ['/blog',['/?scene=notes',308]],
  ['/blog/working-context',['/?note=context-relay',308]],
  ['/blog/decision-assumptions',['/?scene=notes',302]],
  ['/blog/inference-latency',['/?scene=notes',302]],
  ['/blog/verify-the-result',['/?scene=notes',302]],
  ['/blog/llm-routing',['/?scene=notes',302]],
  ['/blog/agent-cloud-workload',['/?note=agent-cloud-workload',308]],
  ['/blog/agent-latency',['/?note=agent-latency',308]],
  ['/blog/context-relay',['/?note=context-relay',308]],
]);
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const legacy=legacyRedirects.get(pathname.replace(/\/+$/,'')||'/');
    if(legacy){res.writeHead(legacy[1],{Location:legacy[0]}).end();return;}
    const target=path.resolve(root,'.'+pathname);
    const relative=path.relative(root,target);
    if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403).end('Forbidden');return;}
    const info=await stat(target);
    const file=info.isDirectory()?path.join(target,'index.html'):target;
    const content=await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(content);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Mahek’s universe is ready at http://127.0.0.1:${port}`));
