import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {CalendarError} from './model.js';
export async function localStore(file,initial){
 await mkdir(dirname(file),{recursive:true});try{await writeFile(file,JSON.stringify(initial),{flag:'wx',mode:0o600});}catch(e){if(e.code!=='EEXIST')throw e;}
 let queue=Promise.resolve();
 return {async read(){const state=JSON.parse(await readFile(file,'utf8'));return {state,tag:String(state.revision)};},write(state,tag){
  const run=queue.catch(()=>{}).then(async()=>{const previous=JSON.parse(await readFile(file,'utf8'));if(String(previous.revision)!==tag)throw new CalendarError('conflict',409);const temp=file+'.'+crypto.randomUUID()+'.tmp';await writeFile(temp,JSON.stringify(state),{mode:0o600});await rename(temp,file);});queue=run;return run;
 }};
}
