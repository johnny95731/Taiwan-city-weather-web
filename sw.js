if(!self.define){let e,n={};const i=(i,r)=>(i=new URL(i+".js",r).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let t={};const l=e=>i(e,o),c={module:{uri:o},exports:t,require:l};n[o]=Promise.all(r.map((e=>c[e]||l(e)))).then((e=>(s(...e),t)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"index-BKYwO0j2.css",revision:null},{url:"index-BNV9YtnV.js",revision:null},{url:"index.html",revision:null},{url:"registerSW.js",revision:null},{url:"icon@192.png",revision:"ca5a5e7027d0697a74ee537564a14e71"},{url:"icon@512.png",revision:"f6fe91039e7a2c4b8f610cc44bda3290"},{url:"manifest.webmanifest",revision:"e800b1f99c48569c665b9751cdac8268"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
