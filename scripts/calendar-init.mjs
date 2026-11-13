// Explicit operator command, never part of deployment/build. Never overwrite existing data.
import {seed} from '../lib/calendar/model.js';
import {firestoreStore} from '../lib/calendar/store.js';
if(!process.argv.includes('--initialize-dedicated-calendar'))throw new Error('Requires --initialize-dedicated-calendar after verifying the dedicated project.');
const store=firestoreStore();
try{await store.read();console.log('Already initialized. No changes.');}
catch(e){if(e.code!=='storage_uninitialized')throw e;await store.write(seed(),null);console.log('Initialized Vanier without dates and two cohorts.');}
