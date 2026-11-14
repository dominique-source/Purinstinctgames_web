// Operator check only. Runtime OIDC deliberately cannot initialize/delete documents.
import {firestoreStore} from '../lib/calendar/store.js';
if(!process.argv.includes('--verify-existing-calendar'))throw new Error('Requires --verify-existing-calendar. Initialization is an operator-only migration, never a runtime permission.');
await firestoreStore().read();
console.log('Existing calendar is readable. No data changed.');
