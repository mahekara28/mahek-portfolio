import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('..',import.meta.url));
const html=await readFile(path.join(root,'index.html'),'utf8');
const css=await readFile(path.join(root,'styles.css'),'utf8');
const content=JSON.parse(await readFile(path.join(root,'content.json'),'utf8'));
const paths=new Set([...html.matchAll(/(?:src|href)="\.\/([^"#?]+)"/g)].map(m=>m[1]));
for(const match of css.matchAll(/url\(['"]?\.\/([^)'"?#]+)['"]?\)/g))paths.add(match[1]);
for(const local of paths)await access(path.join(root,local));
const projectIds=content.projects.map(p=>p.id);
assert.equal(projectIds.length,new Set(projectIds).size,'Project ids must be unique');
assert.equal(content.notes.length,new Set(content.notes.map(n=>n.slug)).size,'Article slugs must be unique');
for(const project of content.projects){
  assert.ok(project.title&&project.description&&project.approach&&project.boundary,`Incomplete project ${project.id}`);
  assert.equal(project.steps.length,3,`Three diagram steps expected for ${project.id}`);
  assert.match(project.github,/^https:\/\/github\.com\//);
}
const media={architecture:'context-relay/architecture.svg',demo:'context-relay/workflow.gif','agent-latency':'agent-latency/architecture.gif','agent-cloud-workload':'agent-cloud-workload/architecture.png'};
for(const note of content.notes){
  assert.equal(note.sections.length,new Set(note.sections.map(s=>s.id)).size,`Duplicate anchor in ${note.slug}`);
  for(const section of note.sections){if(section.media){assert.ok(media[section.media],`Unknown media: ${section.media}`);await access(path.join(root,'assets/images',media[section.media]));}}
}
await access(path.join(root,'assets/images/agent-latency/architecture.png'));
console.log(`Validated ${paths.size} local references, ${projectIds.length} projects, ${content.notes.length} articles, their anchors, and all reader illustrations.`);
