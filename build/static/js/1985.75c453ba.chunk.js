"use strict";(self.webpackChunkpruebas=self.webpackChunkpruebas||[]).push([[1985],{7979:function(t,n,e){e.d(n,{g:function(){return i}});var i=function(t,n,e,i,a){return r(t[1],n[1],e[1],i[1],a).map((function(r){return o(t[0],n[0],e[0],i[0],r)}))},o=function(t,n,e,i,o){return o*(3*n*Math.pow(o-1,2)+o*(-3*e*o+3*e+i*o))-t*Math.pow(o-1,3)},r=function(t,n,e,i,o){return a((i-=o)-3*(e-=o)+3*(n-=o)-(t-=o),3*e-6*n+3*t,3*n-3*t,t).filter((function(t){return t>=0&&t<=1}))},a=function(t,n,e,i){if(0===t)return function(t,n,e){var i=n*n-4*t*e;return i<0?[]:[(-n+Math.sqrt(i))/(2*t),(-n-Math.sqrt(i))/(2*t)]}(n,e,i);var o=(3*(e/=t)-(n/=t)*n)/3,r=(2*n*n*n-9*n*e+27*(i/=t))/27;if(0===o)return[Math.pow(-r,1/3)];if(0===r)return[Math.sqrt(-o),-Math.sqrt(-o)];var a=Math.pow(r/2,2)+Math.pow(o/3,3);if(0===a)return[Math.pow(r/2,.5)-n/3];if(a>0)return[Math.pow(-r/2+Math.sqrt(a),1/3)-Math.pow(r/2+Math.sqrt(a),1/3)-n/3];var s=Math.sqrt(Math.pow(-o/3,3)),h=Math.acos(-r/(2*Math.sqrt(Math.pow(-o/3,3)))),d=2*Math.pow(s,1/3);return[d*Math.cos(h/3)-n/3,d*Math.cos((h+2*Math.PI)/3)-n/3,d*Math.cos((h+4*Math.PI)/3)-n/3]}},1985:function(t,n,e){e.r(n),e.d(n,{ion_menu:function(){return l},ion_menu_button:function(){return v},ion_menu_toggle:function(){return y}});var i=e(9388),o=e(4792),r=e(2565),a=e(7979),s=e(1060),h=e(3652),d=e(385),u=e(2094),l=function(){function t(t){(0,o.r)(this,t),this.ionWillOpen=(0,o.e)(this,"ionWillOpen",7),this.ionWillClose=(0,o.e)(this,"ionWillClose",7),this.ionDidOpen=(0,o.e)(this,"ionDidOpen",7),this.ionDidClose=(0,o.e)(this,"ionDidClose",7),this.ionMenuChange=(0,o.e)(this,"ionMenuChange",7),this.lastOnEnd=0,this.blocker=s.G.createBlocker({disableScroll:!0}),this.isAnimating=!1,this._isOpen=!1,this.isPaneVisible=!1,this.isEndSide=!1,this.disabled=!1,this.side="start",this.swipeGesture=!0,this.maxEdgeStart=50}return t.prototype.typeChanged=function(t,n){var e=this.contentEl;e&&(void 0!==n&&e.classList.remove("menu-content-"+n),e.classList.add("menu-content-"+t),e.removeAttribute("style")),this.menuInnerEl&&this.menuInnerEl.removeAttribute("style"),this.animation=void 0},t.prototype.disabledChanged=function(){this.updateState(),this.ionMenuChange.emit({disabled:this.disabled,open:this._isOpen})},t.prototype.sideChanged=function(){this.isEndSide=(0,h.m)(this.side)},t.prototype.swipeGestureChanged=function(){this.updateState()},t.prototype.connectedCallback=function(){return(0,i.mG)(this,void 0,void 0,(function(){var t,n,o,a,s=this;return(0,i.Jh)(this,(function(i){switch(i.label){case 0:return void 0===this.type&&(this.type=r.c.get("menuType","overlay")),t=this.el,n=t.parentNode,void 0===this.contentId&&console.warn('[DEPRECATED][ion-menu] Using the [main] attribute is deprecated, please use the "contentId" property instead:\nBEFORE:\n  <ion-menu>...</ion-menu>\n  <div main>...</div>\n\nAFTER:\n  <ion-menu contentId="main-content"></ion-menu>\n  <div id="main-content">...</div>\n'),(o=void 0!==this.contentId?document.getElementById(this.contentId):n&&n.querySelector&&n.querySelector("[main]"))&&o.tagName?(this.contentEl=o,o.classList.add("menu-content"),this.typeChanged(this.type,void 0),this.sideChanged(),d.m._register(this),a=this,[4,Promise.resolve().then(e.bind(e,9444))]):(console.error('Menu: must have a "content" element to listen for drag events on.'),[2]);case 1:return a.gesture=i.sent().createGesture({el:document,gestureName:"menu-swipe",gesturePriority:30,threshold:10,blurOnStart:!0,canStart:function(t){return s.canStart(t)},onWillStart:function(){return s.onWillStart()},onStart:function(){return s.onStart()},onMove:function(t){return s.onMove(t)},onEnd:function(t){return s.onEnd(t)}}),this.updateState(),[2]}}))}))},t.prototype.componentDidLoad=function(){return(0,i.mG)(this,void 0,void 0,(function(){return(0,i.Jh)(this,(function(t){return this.ionMenuChange.emit({disabled:this.disabled,open:this._isOpen}),this.updateState(),[2]}))}))},t.prototype.disconnectedCallback=function(){this.blocker.destroy(),d.m._unregister(this),this.animation&&this.animation.destroy(),this.gesture&&(this.gesture.destroy(),this.gesture=void 0),this.animation=void 0,this.contentEl=this.backdropEl=this.menuInnerEl=void 0},t.prototype.onSplitPaneChanged=function(t){this.isPaneVisible=t.detail.isPane(this.el),this.updateState()},t.prototype.onBackdropClick=function(t){this._isOpen&&this.lastOnEnd<t.timeStamp-100&&(!!t.composedPath&&!t.composedPath().includes(this.menuInnerEl)&&(t.preventDefault(),t.stopPropagation(),this.close()))},t.prototype.isOpen=function(){return Promise.resolve(this._isOpen)},t.prototype.isActive=function(){return Promise.resolve(this._isActive())},t.prototype.open=function(t){return void 0===t&&(t=!0),this.setOpen(!0,t)},t.prototype.close=function(t){return void 0===t&&(t=!0),this.setOpen(!1,t)},t.prototype.toggle=function(t){return void 0===t&&(t=!0),this.setOpen(!this._isOpen,t)},t.prototype.setOpen=function(t,n){return void 0===n&&(n=!0),d.m._setOpen(this,t,n)},t.prototype._setOpen=function(t,n){return void 0===n&&(n=!0),(0,i.mG)(this,void 0,void 0,(function(){return(0,i.Jh)(this,(function(e){switch(e.label){case 0:return!this._isActive()||this.isAnimating||t===this._isOpen?[2,!1]:(this.beforeAnimation(t),[4,this.loadAnimation()]);case 1:return e.sent(),[4,this.startAnimation(t,n)];case 2:return e.sent(),this.afterAnimation(t),[2,!0]}}))}))},t.prototype.loadAnimation=function(){return(0,i.mG)(this,void 0,void 0,(function(){var t,n;return(0,i.Jh)(this,(function(e){switch(e.label){case 0:return(t=this.menuInnerEl.offsetWidth)===this.width&&void 0!==this.animation?[2]:(this.width=t,this.animation&&(this.animation.destroy(),this.animation=void 0),n=this,[4,d.m._createAnimation(this.type,this)]);case 1:return n.animation=e.sent(),r.c.getBoolean("animated",!0)||this.animation.duration(0),this.animation.fill("both"),[2]}}))}))},t.prototype.startAnimation=function(t,n){return(0,i.mG)(this,void 0,void 0,(function(){var e,o,a,s,h;return(0,i.Jh)(this,(function(i){switch(i.label){case 0:return e=!t,o=(0,r.b)(this),a="ios"===o?"cubic-bezier(0.32,0.72,0,1)":"cubic-bezier(0.0,0.0,0.2,1)",s="ios"===o?"cubic-bezier(1, 0, 0.68, 0.28)":"cubic-bezier(0.4, 0, 0.6, 1)",h=this.animation.direction(e?"reverse":"normal").easing(e?s:a).onFinish((function(){"reverse"===h.getDirection()&&h.direction("normal")})),n?[4,h.play()]:[3,2];case 1:return i.sent(),[3,3];case 2:h.play({sync:!0}),i.label=3;case 3:return[2]}}))}))},t.prototype._isActive=function(){return!this.disabled&&!this.isPaneVisible},t.prototype.canSwipe=function(){return this.swipeGesture&&!this.isAnimating&&this._isActive()},t.prototype.canStart=function(t){return!(!!document.querySelector("ion-modal.show-modal")||!this.canSwipe())&&(!!this._isOpen||!d.m._getOpenSync()&&p(window,t.currentX,this.isEndSide,this.maxEdgeStart))},t.prototype.onWillStart=function(){return this.beforeAnimation(!this._isOpen),this.loadAnimation()},t.prototype.onStart=function(){this.isAnimating&&this.animation?this.animation.progressStart(!0,this._isOpen?1:0):(0,h.l)(!1,"isAnimating has to be true")},t.prototype.onMove=function(t){if(this.isAnimating&&this.animation){var n=c(t.deltaX,this._isOpen,this.isEndSide)/this.width;this.animation.progressStep(this._isOpen?1-n:n)}else(0,h.l)(!1,"isAnimating has to be true")},t.prototype.onEnd=function(t){var n=this;if(this.isAnimating&&this.animation){var e=this._isOpen,i=this.isEndSide,o=c(t.deltaX,e,i),r=this.width,s=o/r,d=t.velocityX,u=r/2,l=d>=0&&(d>.2||t.deltaX>u),p=d<=0&&(d<-.2||t.deltaX<-u),m=e?i?l:p:i?p:l,f=!e&&m;e&&!m&&(f=!0),this.lastOnEnd=t.currentTime;var b=m?.001:-.001,g=s<0?.01:s;b+=(0,a.g)([0,0],[.4,0],[.6,1],[1,1],(0,h.j)(0,g,.9999))[0]||0;var v=this._isOpen?!m:m;this.animation.easing("cubic-bezier(0.4, 0.0, 0.6, 1)").onFinish((function(){return n.afterAnimation(f)}),{oneTimeCallback:!0}).progressEnd(v?1:0,this._isOpen?1-b:b,300)}else(0,h.l)(!1,"isAnimating has to be true")},t.prototype.beforeAnimation=function(t){(0,h.l)(!this.isAnimating,"_before() should not be called while animating"),this.el.classList.add(m),this.backdropEl&&this.backdropEl.classList.add(f),this.blocker.block(),this.isAnimating=!0,t?this.ionWillOpen.emit():this.ionWillClose.emit()},t.prototype.afterAnimation=function(t){(0,h.l)(this.isAnimating,"_before() should be called while animating"),this._isOpen=t,this.isAnimating=!1,this._isOpen||this.blocker.unblock(),t?(this.contentEl&&this.contentEl.classList.add(b),this.ionDidOpen.emit()):(this.el.classList.remove(m),this.contentEl&&this.contentEl.classList.remove(b),this.backdropEl&&this.backdropEl.classList.remove(f),this.animation&&this.animation.stop(),this.ionDidClose.emit())},t.prototype.updateState=function(){var t=this._isActive();this.gesture&&this.gesture.enable(t&&this.swipeGesture),!t&&this._isOpen&&this.forceClosing(),this.disabled||d.m._setActiveMenu(this),(0,h.l)(!this.isAnimating,"can not be animating")},t.prototype.forceClosing=function(){(0,h.l)(this._isOpen,"menu cannot be closed"),this.isAnimating=!0,this.animation.direction("reverse").play({sync:!0}),this.afterAnimation(!1)},t.prototype.render=function(){var t,n=this,e=this,i=e.isEndSide,a=e.type,s=e.disabled,h=e.isPaneVisible,d=(0,r.b)(this);return(0,o.h)(o.H,{role:"navigation",class:(t={},t[d]=!0,t["menu-type-"+a]=!0,t["menu-enabled"]=!s,t["menu-side-end"]=i,t["menu-side-start"]=!i,t["menu-pane-visible"]=h,t)},(0,o.h)("div",{class:"menu-inner",part:"container",ref:function(t){return n.menuInnerEl=t}},(0,o.h)("slot",null)),(0,o.h)("ion-backdrop",{ref:function(t){return n.backdropEl=t},class:"menu-backdrop",tappable:!1,stopPropagation:!1,part:"backdrop"}))},Object.defineProperty(t.prototype,"el",{get:function(){return(0,o.i)(this)},enumerable:!1,configurable:!0}),Object.defineProperty(t,"watchers",{get:function(){return{type:["typeChanged"],disabled:["disabledChanged"],side:["sideChanged"],swipeGesture:["swipeGestureChanged"]}},enumerable:!1,configurable:!0}),t}(),c=function(t,n,e){return Math.max(0,n!==e?-t:t)},p=function(t,n,e,i){return e?n>=t.innerWidth-i:n<=i},m="show-menu",f="show-backdrop",b="menu-content-open";l.style={ios:":host{--width:304px;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--background:var(--ion-background-color, #fff);left:0;right:0;top:0;bottom:0;display:none;position:absolute;contain:strict}:host(.show-menu){display:block}.menu-inner{left:0;right:auto;top:0;bottom:0;-webkit-transform:translate3d(-9999px,  0,  0);transform:translate3d(-9999px,  0,  0);display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:strict}[dir=rtl] .menu-inner,:host-context([dir=rtl]) .menu-inner{left:unset;right:unset;left:auto;right:0}[dir=rtl] .menu-inner,:host-context([dir=rtl]) .menu-inner{-webkit-transform:translate3d(calc(-1 * -9999px),  0,  0);transform:translate3d(calc(-1 * -9999px),  0,  0)}:host(.menu-side-start) .menu-inner{--ion-safe-area-right:0px;right:auto;left:0}:host(.menu-side-end) .menu-inner{--ion-safe-area-left:0px;right:0;left:auto;}ion-backdrop{display:none;opacity:0.01;z-index:-1}@media (max-width: 340px){.menu-inner{--width:264px}}:host(.menu-type-reveal){z-index:0}:host(.menu-type-reveal.show-menu) .menu-inner{-webkit-transform:translate3d(0,  0,  0);transform:translate3d(0,  0,  0)}:host(.menu-type-overlay){z-index:1000}:host(.menu-type-overlay) .show-backdrop{display:block;cursor:pointer}:host(.menu-pane-visible){width:var(--width);min-width:var(--min-width);max-width:var(--max-width)}:host(.menu-pane-visible) .menu-inner{left:0;right:0;width:auto;-webkit-transform:none !important;transform:none !important;-webkit-box-shadow:none !important;box-shadow:none !important}:host(.menu-pane-visible) ion-backdrop{display:hidden !important;}:host(.menu-type-push){z-index:1000}:host(.menu-type-push) .show-backdrop{display:block}",md:":host{--width:304px;--min-width:auto;--max-width:auto;--height:100%;--min-height:auto;--max-height:auto;--background:var(--ion-background-color, #fff);left:0;right:0;top:0;bottom:0;display:none;position:absolute;contain:strict}:host(.show-menu){display:block}.menu-inner{left:0;right:auto;top:0;bottom:0;-webkit-transform:translate3d(-9999px,  0,  0);transform:translate3d(-9999px,  0,  0);display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:strict}[dir=rtl] .menu-inner,:host-context([dir=rtl]) .menu-inner{left:unset;right:unset;left:auto;right:0}[dir=rtl] .menu-inner,:host-context([dir=rtl]) .menu-inner{-webkit-transform:translate3d(calc(-1 * -9999px),  0,  0);transform:translate3d(calc(-1 * -9999px),  0,  0)}:host(.menu-side-start) .menu-inner{--ion-safe-area-right:0px;right:auto;left:0}:host(.menu-side-end) .menu-inner{--ion-safe-area-left:0px;right:0;left:auto;}ion-backdrop{display:none;opacity:0.01;z-index:-1}@media (max-width: 340px){.menu-inner{--width:264px}}:host(.menu-type-reveal){z-index:0}:host(.menu-type-reveal.show-menu) .menu-inner{-webkit-transform:translate3d(0,  0,  0);transform:translate3d(0,  0,  0)}:host(.menu-type-overlay){z-index:1000}:host(.menu-type-overlay) .show-backdrop{display:block;cursor:pointer}:host(.menu-pane-visible){width:var(--width);min-width:var(--min-width);max-width:var(--max-width)}:host(.menu-pane-visible) .menu-inner{left:0;right:0;width:auto;-webkit-transform:none !important;transform:none !important;-webkit-box-shadow:none !important;box-shadow:none !important}:host(.menu-pane-visible) ion-backdrop{display:hidden !important;}:host(.menu-type-overlay) .menu-inner{-webkit-box-shadow:4px 0px 16px rgba(0, 0, 0, 0.18);box-shadow:4px 0px 16px rgba(0, 0, 0, 0.18)}"};var g=function(t){return(0,i.mG)(void 0,void 0,void 0,(function(){var n,e;return(0,i.Jh)(this,(function(i){switch(i.label){case 0:return[4,d.m.get(t)];case 1:return n=i.sent(),(e=n)?[4,n.isActive()]:[3,3];case 2:e=i.sent(),i.label=3;case 3:return[2,!!e]}}))}))},v=function(){function t(t){var n=this;(0,o.r)(this,t),this.visible=!1,this.disabled=!1,this.autoHide=!0,this.type="button",this.onClick=function(){return(0,i.mG)(n,void 0,void 0,(function(){return(0,i.Jh)(this,(function(t){return[2,d.m.toggle(this.menu)]}))}))}}return t.prototype.componentDidLoad=function(){this.visibilityChanged()},t.prototype.visibilityChanged=function(){return(0,i.mG)(this,void 0,void 0,(function(){var t;return(0,i.Jh)(this,(function(n){switch(n.label){case 0:return t=this,[4,g(this.menu)];case 1:return t.visible=n.sent(),[2]}}))}))},t.prototype.render=function(){var t,n=this.color,e=this.disabled,i=(0,r.b)(this),a=r.c.get("menuIcon","ios"===i?"menu-outline":"menu-sharp"),s=this.autoHide&&!this.visible,h={type:this.type};return(0,o.h)(o.H,{onClick:this.onClick,"aria-disabled":e?"true":null,"aria-hidden":s?"true":null,class:(0,u.c)(n,(t={},t[i]=!0,t.button=!0,t["menu-button-hidden"]=s,t["menu-button-disabled"]=e,t["in-toolbar"]=(0,u.h)("ion-toolbar",this.el),t["in-toolbar-color"]=(0,u.h)("ion-toolbar[color]",this.el),t["ion-activatable"]=!0,t["ion-focusable"]=!0,t))},(0,o.h)("button",Object.assign({},h,{disabled:e,class:"button-native",part:"native","aria-label":"menu"}),(0,o.h)("span",{class:"button-inner"},(0,o.h)("slot",null,(0,o.h)("ion-icon",{part:"icon",icon:a,mode:i,lazy:!1,"aria-hidden":"true"}))),"md"===i&&(0,o.h)("ion-ripple-effect",{type:"unbounded"})))},Object.defineProperty(t.prototype,"el",{get:function(){return(0,o.i)(this)},enumerable:!1,configurable:!0}),t}();v.style={ios:':host{--background:transparent;--color-focused:currentColor;--border-radius:initial;--padding-top:0;--padding-bottom:0;color:var(--color);text-align:center;text-decoration:none;text-overflow:ellipsis;text-transform:none;white-space:nowrap;-webkit-font-kerning:none;font-kerning:none}.button-native{border-radius:var(--border-radius);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;border:0;outline:none;background:var(--background);line-height:1;cursor:pointer;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.button-native{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;z-index:1}ion-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;pointer-events:none}:host(.menu-button-hidden){display:none}:host(.menu-button-disabled){cursor:default;opacity:0.5;pointer-events:none}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}.button-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:"";opacity:0}@media (any-hover: hover){:host(:hover) .button-native{color:var(--color-hover)}:host(:hover) .button-native::after{background:var(--background-hover);opacity:var(--background-hover-opacity, 0)}}:host(.ion-color) .button-native{color:var(--ion-color-base)}:host(.in-toolbar:not(.in-toolbar-color)){color:var(--ion-toolbar-color, var(--color))}:host{--background-focused:currentColor;--background-focused-opacity:.1;--border-radius:4px;--color:var(--ion-color-primary, #3880ff);--padding-start:5px;--padding-end:5px;height:32px;font-size:31px}:host(.ion-activated){opacity:0.4}@media (any-hover: hover){:host(:hover){opacity:0.6}}',md:':host{--background:transparent;--color-focused:currentColor;--border-radius:initial;--padding-top:0;--padding-bottom:0;color:var(--color);text-align:center;text-decoration:none;text-overflow:ellipsis;text-transform:none;white-space:nowrap;-webkit-font-kerning:none;font-kerning:none}.button-native{border-radius:var(--border-radius);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;border:0;outline:none;background:var(--background);line-height:1;cursor:pointer;overflow:hidden;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.button-native{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.button-inner{display:-ms-flexbox;display:flex;position:relative;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;z-index:1}ion-icon{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;pointer-events:none}:host(.menu-button-hidden){display:none}:host(.menu-button-disabled){cursor:default;opacity:0.5;pointer-events:none}:host(.ion-focused) .button-native{color:var(--color-focused)}:host(.ion-focused) .button-native::after{background:var(--background-focused);opacity:var(--background-focused-opacity)}.button-native::after{left:0;right:0;top:0;bottom:0;position:absolute;content:"";opacity:0}@media (any-hover: hover){:host(:hover) .button-native{color:var(--color-hover)}:host(:hover) .button-native::after{background:var(--background-hover);opacity:var(--background-hover-opacity, 0)}}:host(.ion-color) .button-native{color:var(--ion-color-base)}:host(.in-toolbar:not(.in-toolbar-color)){color:var(--ion-toolbar-color, var(--color))}:host{--background-focused:currentColor;--background-focused-opacity:.12;--background-hover:currentColor;--background-hover-opacity:.04;--border-radius:50%;--color:initial;--padding-start:8px;--padding-end:8px;width:48px;height:48px;font-size:24px}:host(.ion-color.ion-focused)::after{background:var(--ion-color-base)}@media (any-hover: hover){:host(.ion-color:hover) .button-native::after{background:var(--ion-color-base)}}'};var y=function(){function t(t){var n=this;(0,o.r)(this,t),this.visible=!1,this.autoHide=!0,this.onClick=function(){return d.m.toggle(n.menu)}}return t.prototype.connectedCallback=function(){this.visibilityChanged()},t.prototype.visibilityChanged=function(){return(0,i.mG)(this,void 0,void 0,(function(){var t;return(0,i.Jh)(this,(function(n){switch(n.label){case 0:return t=this,[4,g(this.menu)];case 1:return t.visible=n.sent(),[2]}}))}))},t.prototype.render=function(){var t,n=(0,r.b)(this),e=this.autoHide&&!this.visible;return(0,o.h)(o.H,{onClick:this.onClick,"aria-hidden":e?"true":null,class:(t={},t[n]=!0,t["menu-toggle-hidden"]=e,t)},(0,o.h)("slot",null))},t}();y.style=":host(.menu-toggle-hidden){display:none}"},2094:function(t,n,e){e.d(n,{c:function(){return r},g:function(){return a},h:function(){return o},o:function(){return h}});var i=e(9388),o=function(t,n){return null!==n.closest(t)},r=function(t,n){var e;return"string"===typeof t&&t.length>0?Object.assign(((e={"ion-color":!0})["ion-color-"+t]=!0,e),n):n},a=function(t){var n={};return function(t){return void 0!==t?(Array.isArray(t)?t:t.split(" ")).filter((function(t){return null!=t})).map((function(t){return t.trim()})).filter((function(t){return""!==t})):[]}(t).forEach((function(t){return n[t]=!0})),n},s=/^[a-z][a-z0-9+\-.]*:/,h=function(t,n,e,o){return(0,i.mG)(void 0,void 0,void 0,(function(){var r;return(0,i.Jh)(this,(function(i){return null!=t&&"#"!==t[0]&&!s.test(t)&&(r=document.querySelector("ion-router"))?(null!=n&&n.preventDefault(),[2,r.push(t,e,o)]):[2,!1]}))}))}}}]);
//# sourceMappingURL=1985.75c453ba.chunk.js.map