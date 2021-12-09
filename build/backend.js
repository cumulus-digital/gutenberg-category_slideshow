!function(){"use strict";var t={n:function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,{a:n}),n},d:function(e,n){for(var a in n)t.o(n,a)&&!t.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:n[a]})},o:function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}},e=window.wp.element,n=window.jQuery;const a=t.n(n)().noConflict();a.fn.crsgCategorySlideshow=function(t){return this.each((function(){const e=this,n=a(this);function o(t,e){return void 0===e?n.attr(t):n.attr(t,e)}function i(t,n){return void 0===n?a.data(e,t):a.data(e,t,n)}const s=o("data-category"),r=1e3*o("data-timeout");if(i("lastswap",null),window.cancelAnimationFrame(i("anim")),n.html(a("<div/>",{class:"crsg-category_slideshow-loading"})),s)return n.data("loading")&&n.data("loading").abort&&n.data("loading").abort(),n.data("loading",a.ajax({url:t,data:{action:"get_media_by_category",category:s},type:"POST",dataType:"jsonp"}).done((function(t){const e=[];if(t.forEach((function(t,n){if(t.hasOwnProperty("guid"))try{const o=new URL(t.guid).pathname;e.push(a("<img/>",{alt:t.hasOwnProperty("post_title")?t.post_title:"",src:o,class:n<1?"current":""}))}catch(e){console.warn("Category Slideshow","Chosen category contains an invalid image",t)}})),e.length){const t=a("<div/>");t.append(e),n.html(t),i("anim",window.requestAnimationFrame(c))}else n.html('<div class="crsg-category_slideshow-error">No images found.</div>')}))),this;function c(){if(i("lastswap")||i("lastswap",(new Date).getTime()),(new Date).getTime()-i("lastswap")>r){const t=n.find(".current");let e=t.next("img");e.length||(e=t.siblings("img").eq(0)),t.removeClass("current"),e.addClass("current"),i("lastswap",(new Date).getTime())}i("anim",window.requestAnimationFrame(c))}n.html('<div class="crsg-category_slideshow-error">No category defined.</div>')}))};const{__:__}=wp.i18n,{registerBlockType:o}=wp.blocks,{PanelBody:i,PanelRow:s,SelectControl:r,RangeControl:c}=wp.components,{InspectorControls:l}=wp.blockEditor,{Component:d}=wp.element,u=(t,e)=>"object"==typeof t&&Object.keys(t).length>0?Object.keys(t).length===Object.keys(e).length&&Object.keys(t).every((n=>u(t[n],e[n]))):t===e;o("cumulus-gutenberg/category-slideshow",{title:__("Category Slideshow"),description:__("Gutenberg block which displays a slideshow of media in a specified category."),keywords:[__("slideshow"),__("slider"),__("image"),__("category")],supports:{anchor:!0,html:!1},category:"common",icon:{src:"images-alt2",foreground:"#3399cc"},attributes:{category:{attribute:"string",default:null},timeout:{attributes:"integer",default:2}},edit:class extends d{constructor(){super(...arguments),this.onChangeContent=this.onChangeContent.bind(this),this.componentDidUpdate=this.componentDidUpdate.bind(this),this.componentDidMount=this.componentDidMount.bind(this),this.state={},this.initSlider=()=>{jQuery("#block-"+this.props.clientId+" > div").crsgCategorySlideshow(window.ajaxurl)}}componentDidUpdate(t){u(this.props.attributes,t.attributes)||this.initSlider()}componentDidMount(){this.props.attributes.category&&this.initSlider()}onChangeContent(t){this.props.setAttributes({content:t})}render(){const t=this.props;return(0,e.createElement)("div",{className:t.className,"data-category":t.attributes.category,"data-timeout":t.attributes.timeout},(0,e.createElement)("div",{className:"crsg-category_slideshow-loading"}),(0,e.createElement)(l,null,(0,e.createElement)(i,{title:"Slideshow Options"},(0,e.createElement)(s,null,(0,e.createElement)(r,{label:"Media Category:",value:t.attributes.category,options:(()=>{const t=wp.data.select("core").getEntityRecords("taxonomy","category");return t&&t.length?t.map((t=>({label:t.name,value:t.id}))):[{label:"No categories defined!"}]})(),onChange:e=>{t.setAttributes({category:e})}}))),(0,e.createElement)(i,{title:"Timer"},(0,e.createElement)("h3",null,"Seconds between slides"),(0,e.createElement)(s,null,(0,e.createElement)(c,{value:t.attributes.timeout,onChange:e=>{t.setAttributes({timeout:e})},min:0,max:20})))))}},save:t=>(0,e.createElement)("div",{className:t.className,"data-category":t.attributes.category,"data-timeout":t.attributes.timeout})})}();