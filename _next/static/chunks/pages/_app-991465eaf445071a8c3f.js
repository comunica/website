_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[8],{1:function(e,t,n){n("GcxT"),e.exports=n("nOHt")},"1OyB":function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}n.d(t,"a",(function(){return r}))},"1TCz":function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.r(t),n.d(t,"default",(function(){return y}));var o=n("nKUr"),a=n("1OyB"),i=n("vuIU"),c=n("Ji7U"),u=n("md7G"),s=n("foSv"),f=(n("WMMs"),n("LEOp"),n("WOCw")),l=n.n(f),p=n("q1tI");function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function g(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=Object(s.a)(e);if(t){var o=Object(s.a)(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Object(u.a)(this,n)}}var y=function(e){Object(c.a)(n,e);var t=g(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"render",value:function(){var e=this.props,t=e.Component,n=e.pageProps;return Object(o.jsx)(t,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},n))}},{key:"componentDidMount",value:function(){l.a.initialize("G-HT178MX8JL"),l.a.send({hitType:"pageview",page:window.location.pathname});var e=document.querySelector("nav");document.querySelector(".toggle-nav").addEventListener("click",(function(t){return e.classList.contains("active")?e.classList.remove("active"):e.classList.add("active"),t.preventDefault(),!1}),!1)}}]),n}(n.n(p).a.Component)},GcxT:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return n("1TCz")}])},Ji7U:function(e,t,n){"use strict";function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function o(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&r(e,t)}n.d(t,"a",(function(){return o}))},LEOp:function(e,t,n){},LYU8:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=e||"";t&&(r=o(e));n&&(r=a(r));return r};var r=/^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;function o(e){return e.toString().trim().replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g,(function(e,t,n){return t>0&&t+e.length!==n.length&&e.search(r)>-1&&":"!==n.charAt(t-2)&&("-"!==n.charAt(t+e.length)||"-"===n.charAt(t-1))&&n.charAt(t-1).search(/[^\s-]/)<0?e.toLowerCase():e.substr(1).search(/[A-Z]|\../)>-1?e:e.charAt(0).toUpperCase()+e.substr(1)}))}function a(e){return"string"===typeof(t=e)&&-1!==t.indexOf("@")?(console.warn("This arg looks like an email address, redacting."),"REDACTED (Potential Email Address)"):e;var t}},PMtR:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r;"undefined"!==typeof window&&("undefined"===typeof window.gtag&&(window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)}),(r=window).gtag.apply(r,t))};t.default=r},WMMs:function(e,t,n){},WOCw:function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.ReactGAImplementation=void 0;var o=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!==r(e)&&"function"!==typeof e)return{default:e};var n=a(t);if(n&&n.has(e))return n.get(e);var o={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var c in e)if("default"!==c&&Object.prototype.hasOwnProperty.call(e,c)){var u=i?Object.getOwnPropertyDescriptor(e,c):null;u&&(u.get||u.set)?Object.defineProperty(o,c,u):o[c]=e[c]}o.default=e,n&&n.set(e,o);return o}(n("btLC"));function a(e){if("function"!==typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(a=function(e){return e?n:t})(e)}var i=o.GA4;t.ReactGAImplementation=i;var c=o.default;t.default=c},btLC:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.GA4=void 0;var r=u(n("PMtR")),o=u(n("LYU8")),a=["eventCategory","eventAction","eventLabel","eventValue","hitType"],i=["title","location"],c=["page","hitType"];function u(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e){return function(e){if(Array.isArray(e))return v(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||y(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){m(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function g(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,a,i,c=[],u=!0,s=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;u=!1}else for(;!(u=(r=a.call(n)).done)&&(c.push(r.value),c.length!==t);u=!0);}catch(f){s=!0,o=f}finally{try{if(!u&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(s)throw o}}return c}}(e,t)||y(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function y(e,t){if(e){if("string"===typeof e)return v(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(e,t):void 0}}function v(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function b(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,_(r.key),r)}}function m(e,t,n){return(t=_(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _(e){var t=function(e,t){if("object"!==f(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==f(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===f(t)?t:String(t)}var h=function(){function e(){var t=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),m(this,"reset",(function(){t.isInitialized=!1,t._testMode=!1,t._currentMeasurementId,t._hasLoadedGA=!1,t._isQueuing=!1,t._queueGtag=[]})),m(this,"_gtag",(function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];t._testMode||t._isQueuing?t._queueGtag.push(n):r.default.apply(void 0,n)})),m(this,"_loadGA",(function(e,n){if("undefined"!==typeof window&&"undefined"!==typeof document&&!t._hasLoadedGA){var r=document.createElement("script");r.async=!0,r.src="https://www.googletagmanager.com/gtag/js?id=".concat(e),n&&r.setAttribute("nonce",n),document.body.appendChild(r),window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)},t._hasLoadedGA=!0}})),m(this,"_toGtagOptions",(function(e){if(e){var t={cookieUpdate:"cookie_update",cookieExpires:"cookie_expires",cookieDomain:"cookie_domain",cookieFlags:"cookie_flags",userId:"user_id",clientId:"client_id",anonymizeIp:"anonymize_ip",contentGroup1:"content_group1",contentGroup2:"content_group2",contentGroup3:"content_group3",contentGroup4:"content_group4",contentGroup5:"content_group5",allowAdFeatures:"allow_google_signals",allowAdPersonalizationSignals:"allow_ad_personalization_signals",nonInteraction:"non_interaction",page:"page_path",hitCallback:"event_callback"};return Object.entries(e).reduce((function(e,n){var r=g(n,2),o=r[0],a=r[1];return t[o]?e[t[o]]=a:e[o]=a,e}),{})}})),m(this,"initialize",(function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e)throw new Error("Require GA_MEASUREMENT_ID");var r="string"===typeof e?[{trackingId:e}]:e;t._currentMeasurementId=r[0].trackingId;var o=n.gaOptions,a=n.gtagOptions,i=n.nonce,c=n.testMode,u=void 0!==c&&c;if(t._testMode=u,u||t._loadGA(t._currentMeasurementId,i),t.isInitialized||(t._gtag("js",new Date),r.forEach((function(e){var n=d(d(d({},t._toGtagOptions(d(d({},o),e.gaOptions))),a),e.gtagOptions);Object.keys(n).length?t._gtag("config",e.trackingId,n):t._gtag("config",e.trackingId)}))),t.isInitialized=!0,!u){var s=l(t._queueGtag);for(t._queueGtag=[],t._isQueuing=!1;s.length;){var f=s.shift();t._gtag.apply(t,l(f)),"get"===f[0]&&(t._isQueuing=!0)}}})),m(this,"set",(function(e){e?"object"===f(e)?(0===Object.keys(e).length&&console.warn("empty `fieldsObject` given to .set()"),t._gaCommand("set",e)):console.warn("Expected `fieldsObject` arg to be an Object"):console.warn("`fieldsObject` is required in .set()")})),m(this,"_gaCommandSendEvent",(function(e,n,r,o,a){t._gtag("event",n,d(d({event_category:e,event_label:r,value:o},a&&{non_interaction:a.nonInteraction}),t._toGtagOptions(a)))})),m(this,"_gaCommandSendEventParameters",(function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];if("string"===typeof n[0])t._gaCommandSendEvent.apply(t,l(n.slice(1)));else{var o=n[0],i=o.eventCategory,c=o.eventAction,u=o.eventLabel,f=o.eventValue,p=(o.hitType,s(o,a));t._gaCommandSendEvent(i,c,u,f,p)}})),m(this,"_gaCommandSendTiming",(function(e,n,r,o){t._gtag("event","timing_complete",{name:n,value:r,event_category:e,event_label:o})})),m(this,"_gaCommandSendPageview",(function(e,n){if(n&&Object.keys(n).length){var r=t._toGtagOptions(n),o=r.title,a=r.location,c=s(r,i);t._gtag("event","page_view",d(d(d(d({},e&&{page_path:e}),o&&{page_title:o}),a&&{page_location:a}),c))}else e?t._gtag("event","page_view",{page_path:e}):t._gtag("event","page_view")})),m(this,"_gaCommandSendPageviewParameters",(function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];if("string"===typeof n[0])t._gaCommandSendPageview.apply(t,l(n.slice(1)));else{var o=n[0],a=o.page,i=(o.hitType,s(o,c));t._gaCommandSendPageview(a,i)}})),m(this,"_gaCommandSend",(function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];var o="string"===typeof n[0]?n[0]:n[0].hitType;switch(o){case"event":t._gaCommandSendEventParameters.apply(t,n);break;case"pageview":t._gaCommandSendPageviewParameters.apply(t,n);break;case"timing":t._gaCommandSendTiming.apply(t,l(n.slice(1)));break;case"screenview":case"transaction":case"item":case"social":case"exception":console.warn("Unsupported send command: ".concat(o));break;default:console.warn("Send command doesn't exist: ".concat(o))}})),m(this,"_gaCommandSet",(function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];"string"===typeof n[0]&&(n[0]=m({},n[0],n[1])),t._gtag("set",t._toGtagOptions(n[0]))})),m(this,"_gaCommand",(function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];switch(e){case"send":t._gaCommandSend.apply(t,r);break;case"set":t._gaCommandSet.apply(t,r);break;default:console.warn("Command doesn't exist: ".concat(e))}})),m(this,"ga",(function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];if("string"===typeof n[0])t._gaCommand.apply(t,n);else{var o=n[0];t._gtag("get",t._currentMeasurementId,"client_id",(function(e){t._isQueuing=!1;var n=t._queueGtag;for(o({get:function(n){return"clientId"===n?e:"trackingId"===n?t._currentMeasurementId:"apiVersion"===n?"1":void 0}});n.length;){var r=n.shift();t._gtag.apply(t,l(r))}})),t._isQueuing=!0}return t.ga})),m(this,"event",(function(e,n){if("string"===typeof e)t._gtag("event",e,t._toGtagOptions(n));else{var r=e.action,a=e.category,i=e.label,c=e.value,u=e.nonInteraction,s=e.transport;if(!a||!r)return void console.warn("args.category AND args.action are required in event()");var f={hitType:"event",eventCategory:(0,o.default)(a),eventAction:(0,o.default)(r)};i&&(f.eventLabel=(0,o.default)(i)),"undefined"!==typeof c&&("number"!==typeof c?console.warn("Expected `args.value` arg to be a Number."):f.eventValue=c),"undefined"!==typeof u&&("boolean"!==typeof u?console.warn("`args.nonInteraction` must be a boolean."):f.nonInteraction=u),"undefined"!==typeof s&&("string"!==typeof s?console.warn("`args.transport` must be a string."):(-1===["beacon","xhr","image"].indexOf(s)&&console.warn("`args.transport` must be either one of these values: `beacon`, `xhr` or `image`"),f.transport=s)),t._gaCommand("send",f)}})),m(this,"send",(function(e){t._gaCommand("send",e)})),this.reset()}var t,n,u;return t=e,(n=[{key:"gtag",value:function(){this._gtag.apply(this,arguments)}}])&&b(t.prototype,n),u&&b(t,u),Object.defineProperty(t,"prototype",{writable:!1}),e}();t.GA4=h;var w=new h;t.default=w},foSv:function(e,t,n){"use strict";function r(e){return(r=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}n.d(t,"a",(function(){return r}))},md7G:function(e,t,n){"use strict";function r(e){return(r="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){return!t||"object"!==r(t)&&"function"!==typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}n.d(t,"a",(function(){return o}))},vuIU:function(e,t,n){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function o(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}n.d(t,"a",(function(){return o}))}},[[1,0,1,2,3]]]);