console.log('start.');
import modA from './module-a.mjs';
import {default as modA2} from './module-a.mjs';
console.log(modA, modA2);
console.log('end.');