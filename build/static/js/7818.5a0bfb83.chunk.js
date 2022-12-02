/*! For license information please see 7818.5a0bfb83.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkpruebas=self.webpackChunkpruebas||[]).push([[7818],{7818:function(t,e,r){r.r(e),r.d(e,{scopeCss:function(){return B}});var n=r(9388),s="-shadowcsshost",c="-shadowcssslotted",o="-shadowcsscontext",u=")(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)",i=new RegExp("(-shadowcsshost"+u,"gim"),a=new RegExp("(-shadowcsscontext"+u,"gim"),l=new RegExp("(-shadowcssslotted"+u,"gim"),f="-shadowcsshost-no-combinator",p=/-shadowcsshost-no-combinator([^\s]*)/,h=[/::shadow/g,/::content/g],g=/-shadowcsshost/gim,d=/:host/gim,v=/::slotted/gim,m=/:host-context/gim,x=/\/\*\s*[\s\S]*?\*\//g,w=/\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g,_=/(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g,b=/([{}])/g,S="%BLOCK%",O=function(t,e){var r=W(t),n=0;return r.escapedString.replace(_,(function(){for(var t=[],s=0;s<arguments.length;s++)t[s]=arguments[s];var c=t[2],o="",u=t[4],i="";u&&u.startsWith("{%BLOCK%")&&(o=r.blocks[n++],u=u.substring(S.length+1),i="{");var a={selector:c,content:o},l=e(a);return""+t[1]+l.selector+t[3]+i+l.content+u}))},W=function(t){for(var e=t.split(b),r=[],n=[],s=0,c=[],o=0;o<e.length;o++){var u=e[o];"}"===u&&s--,s>0?c.push(u):(c.length>0&&(n.push(c.join("")),r.push(S),c=[]),r.push(u)),"{"===u&&s++}return c.length>0&&(n.push(c.join("")),r.push(S)),{escapedString:r.join(""),blocks:n}},k=function(t,e,r){return t.replace(e,(function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];if(t[2]){for(var n=t[2].split(","),s=[],c=0;c<n.length;c++){var o=n[c].trim();if(!o)break;s.push(r(f,o,t[3]))}return s.join(",")}return f+t[3]}))},j=function(t,e,r){return t+e.replace(s,"")+r},C=function(t,e,r){return e.indexOf(s)>-1?j(t,e,r):t+e+r+", "+e+" "+t+r},E=function(t,e){var r=function(t){return t=t.replace(/\[/g,"\\[").replace(/\]/g,"\\]"),new RegExp("^("+t+")([>\\s~+[.,{:][\\s\\S]*)?$","m")}(e);return!r.test(t)},R=function(t,e,r){e=e.replace(/\[is=([^\]]*)\]/g,(function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return e[0]}));for(var n,s="."+e,c=function(t){var n=t.trim();if(!n)return"";if(t.indexOf(f)>-1)n=function(t,e,r){if(g.lastIndex=0,g.test(t)){var n="."+r;return t.replace(p,(function(t,e){return e.replace(/([^:]*)(:*)(.*)/,(function(t,e,r,s){return e+n+r+s}))})).replace(g,n+" ")}return e+" "+t}(t,e,r);else{var c=t.replace(g,"");if(c.length>0){var o=c.match(/([^:]*)(:*)(.*)/);o&&(n=o[1]+s+o[2]+o[3])}}return n},o=function(t){var e,r=[],n=0;return t=t.replace(/(\[[^\]]*\])/g,(function(t,e){var s="__ph-"+n+"__";return r.push(e),n++,s})),e=t.replace(/(:nth-[-\w]+)(\([^)]+\))/g,(function(t,e,s){var c="__ph-"+n+"__";return r.push(s),n++,e+c})),{content:e,placeholders:r}}(t),u="",i=0,a=/( |>|\+|~(?!=))\s*/g,l=!((t=o.content).indexOf(f)>-1);null!==(n=a.exec(t));){var h=n[1],d=t.slice(i,n.index).trim();u+=((l=l||d.indexOf(f)>-1)?c(d):d)+" "+h+" ",i=a.lastIndex}var v=t.substring(i);return u+=(l=l||v.indexOf(f)>-1)?c(v):v,function(t,e){return e.replace(/__ph-(\d+)__/g,(function(e,r){return t[+r]}))}(o.placeholders,u)},L=function t(e,r,n,s,c){return O(e,(function(e){var c=e.selector,o=e.content;return"@"!==e.selector[0]?c=function(t,e,r,n){return t.split(",").map((function(t){return n&&t.indexOf("."+n)>-1?t.trim():E(t,e)?R(t,e,r).trim():t.trim()})).join(", ")}(e.selector,r,n,s):(e.selector.startsWith("@media")||e.selector.startsWith("@supports")||e.selector.startsWith("@page")||e.selector.startsWith("@document"))&&(o=t(e.content,r,n,s)),{selector:c.replace(/\s{2,}/g," ").trim(),content:o}}))},T=function(t,e,r,n,u){var p=function(t,e){var r="."+e+" > ",n=[];return t=t.replace(l,(function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];if(t[2]){for(var s=t[2].trim(),c=t[3],o=r+s+c,u="",i=t[4]-1;i>=0;i--){var a=t[5][i];if("}"===a||","===a)break;u=a+u}var l=u+o,p=""+u.trimRight()+o.trim();if(l.trim()!==p.trim()){var h=p+", "+l;n.push({orgSelector:l,updatedSelector:h})}return o}return f+t[3]})),{selectors:n,cssText:t}}(t=function(t){return k(t,a,C)}(t=function(t){return k(t,i,j)}(t=function(t){return t.replace(m,o).replace(d,s).replace(v,c)}(t))),n);return t=function(t){return h.reduce((function(t,e){return t.replace(e," ")}),t)}(t=p.cssText),e&&(t=L(t,e,r,n)),{cssText:(t=(t=t.replace(/-shadowcsshost-no-combinator/g,"."+r)).replace(/>\s*\*\s+([^{, ]+)/gm," $1 ")).trim(),slottedSelectors:p.selectors}},B=function(t,e,r){var s=e+"-h",c=e+"-s",o=function(t){return t.match(w)||[]}(t);t=function(t){return t.replace(x,"")}(t);var u=[];if(r){var i=function(t){var e="/*!@___"+u.length+"___*/",r="/*!@"+t.selector+"*/";return u.push({placeholder:e,comment:r}),t.selector=e+t.selector,t};t=O(t,(function(t){return"@"!==t.selector[0]?i(t):t.selector.startsWith("@media")||t.selector.startsWith("@supports")||t.selector.startsWith("@page")||t.selector.startsWith("@document")?(t.content=O(t.content,i),t):t}))}var a=T(t,e,s,c);return t=(0,n.ev)([a.cssText],o).join("\n"),r&&u.forEach((function(e){var r=e.placeholder,n=e.comment;t=t.replace(r,n)})),a.slottedSelectors.forEach((function(e){t=t.replace(e.orgSelector,e.updatedSelector)})),t}}}]);
//# sourceMappingURL=7818.5a0bfb83.chunk.js.map