import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const dist=path.join(root,'dist');
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const entry of ['index.html','styles.css','refinements.css','app.js','sky.js','content.json','assets'])await cp(path.join(root,entry),path.join(dist,entry),{recursive:true});
console.log('Static site exported to dist/. No packages or API keys required.');
