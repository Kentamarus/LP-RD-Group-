(function($){$.fn.twentytwenty=function(options){var options=$.extend({default_offset_pct:0.5,orientation:'horizontal'},options);return this.each(function(){var sliderPct=options.default_offset_pct;var container=$(this);var sliderOrientation=options.orientation;var beforeDirection=(sliderOrientation==='vertical')?'down':'left';var afterDirection=(sliderOrientation==='vertical')?'up':'right';container.wrap("<div class='twentytwenty-wrapper twentytwenty-"+sliderOrientation+"'></div>");container.append("<div class='twentytwenty-overlay'></div>");var beforeImg=container.find("img:first");var afterImg=container.find("img:last");container.append("<div class='twentytwenty-handle'></div>");var slider=container.find(".twentytwenty-handle");slider.append("<span class='twentytwenty-"+beforeDirection+"-arrow'></span>");slider.append("<span class='twentytwenty-"+afterDirection+"-arrow'></span>");container.addClass("twentytwenty-container");beforeImg.addClass("twentytwenty-before");afterImg.addClass("twentytwenty-after");var overlay=container.find(".twentytwenty-overlay");overlay.append("<div class='twentytwenty-before-label'></div>");overlay.append("<div class='twentytwenty-after-label'></div>");var calcOffset=function(dimensionPct){var w=beforeImg.width();var h=beforeImg.height();return{w:w+"px",h:h+"px",cw:(dimensionPct*w)+"px",ch:(dimensionPct*h)+"px"};};var adjustContainer=function(offset){if(sliderOrientation==='vertical'){beforeImg.css("clip","rect(0,"+offset.w+","+offset.ch+",0)");}else{beforeImg.css("clip","rect(0,"+offset.cw+","+offset.h+",0)");}container.css("height",offset.h);};var adjustSlider=function(pct){var offset=calcOffset(pct);slider.css((sliderOrientation==="vertical")?"top":"left",(sliderOrientation==="vertical")?offset.ch:offset.cw);adjustContainer(offset);}
$(window).on("resize.twentytwenty",function(e){adjustSlider(sliderPct);});var offsetX=0;var imgWidth=0;slider.on("movestart",function(e){if(((e.distX>e.distY&&e.distX<-e.distY)||(e.distX<e.distY&&e.distX>-e.distY))&&sliderOrientation!=='vertical'){e.preventDefault();}else if(((e.distX<e.distY&&e.distX<-e.distY)||(e.distX>e.distY&&e.distX>-e.distY))&&sliderOrientation==='vertical'){e.preventDefault();}container.addClass("active");offsetX=container.offset().left;offsetY=container.offset().top;imgWidth=beforeImg.width();imgHeight=beforeImg.height();});slider.on("moveend",function(e){container.removeClass("active");});var getResult=function(){var index=-1;var a="active";var clazz=null;var obj=$(".block-wheel .item-col");var item=["item1","item2","item3","item4","item5"]
if(0.08<sliderPct&&sliderPct<0.09){index=0;}else
if(0.29<sliderPct&&sliderPct<0.31){index=1;}else
if(0.48<sliderPct&&sliderPct<0.5){index=2;}else if(0.72<sliderPct&&sliderPct<0.73){index=3;}else if(0.93<sliderPct&&sliderPct<1){index=4;}else index=-1;console.log("sliderPct="+sliderPct);index!=-1?obj.removeClass(a).eq(index).addClass(a):undefined;index!=-1?$(".twentytwenty-overlay").removeClass("item1").removeClass("item2").removeClass("item3").removeClass("item4").removeClass("item5").addClass(item[index]):undefined;if(index==-1){obj.removeClass(a);$(".twentytwenty-overlay").removeClass("item1").removeClass("item2").removeClass("item3").removeClass("item4").removeClass("item5");};}
slider.on("move",function(e){if(container.hasClass("active")){sliderPct=(sliderOrientation==='vertical')?(e.pageY-offsetY)/imgHeight:(e.pageX-offsetX)/imgWidth;getResult(sliderPct);if(sliderPct<0){sliderPct=0;}if(sliderPct>1){sliderPct=1;}adjustSlider(sliderPct);}});container.find("img").on("mousedown",function(event){event.preventDefault();});$(window).trigger("resize.twentytwenty");});};})(jQuery);