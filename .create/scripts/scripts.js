
$(function(){    
    Browser.init();
    Site.init();     	
});

var Site = new function () {
	 this.parseUrl = function() {
        switch (location.hash) {
        case "#callAnswer":
            $.magnificPopup.open({
                items: {
                    src: "#callAnswer"
                },
                type: "inline"
            }, 0)
        }
    }
	this.slickSlider = function(){
		var show_count = 4;
		var objW = $("body").width();		
		
        if (objW > 1024) { show_count = 2; } 
        else if (objW < 768)  { show_count = 1;}
//        else if (objW > 639)  { show_count = 2;}
        else show_count = 1;
		
		$('.multiple-items').slick({
            infinite: true,
            dots: false,
            slidesToShow: show_count,
            slidesToScroll: 1,
        });	 
	},
	this.twentytwenty = function(){		
      	$(".twentytwenty-container[data-orientation='vertical']").twentytwenty({default_offset_pct: 0.3, orientation: 'vertical'});
		
		var handle = $(".twentytwenty-handle");
		var before = $(".twentytwenty-before");
		handle.attr("style"," top:"+265+"px");
		before.css("clip","rect(0px 550px "+265+"px 0px)")	
		
		$(".block-wheel .item-col").bind("click", function(){
			var t = $(this);
			var a = "active";
			t.parent().find(".item-col").removeClass(a).filter(t).addClass(a);
			var index = "item"+(t.index()+1);		
			var top = 0;
			var bef = 0;
			t.closest(".block-wheel").find(".twentytwenty-overlay").removeClass("item1").removeClass("item2").removeClass("item3").removeClass("item4").removeClass("item5").addClass(index);			
			switch(t.index()+1)
			{
				case 1: { top = "46px"; bef = top; break;}
				case 2: { top = "159px"; bef = top; break;}
				case 3: { top = "265px"; bef = top; break;}
				case 4: { top = "388px"; bef = "265px"; break;}
				case 5: { top = "503px"; bef = top; break;}
				default: break;		
			}		
			handle.attr("style"," top:"+top);
			before.css("clip","rect(0px 550px "+bef+" 0px)")	
		});
		
	},	
    this.init = function(){
		this.parseUrl();
		this.slickSlider();		
		this.twentytwenty();
						
		$(".block-map").click(function() {
            $(this).find("#map").css("pointer-events", "auto")
        }),
        
		$(".show-number").bind("click", function(){
			$(this).animate({ "width": 0}, 500);
		});
		
	  	$('input[type=tel]').mask("+7(999) 999-9999");
               
     $(".call-back-form").each(function() {
            var it = $(this);
            it.validate({
                rules: {
                    name: {
                        required: true
                    },
                    phone: {
                        required: true
                    },
                    email: {
                        required: true
                    }
                },
                messages: {},
                errorPlacement: function(error, element) {},
                submitHandler: function(form) {
                    var thisForm = $(form);
                    
                    thisForm.find("input[type=tel]").removeClass("focus");
                    thisForm.find(".mask").removeClass("active");
                    
                    $(this).find("input").val("");
                    var value = [{
                        old: '.people',
                        id: "people"
                    }, {
                        old: '.phone',
                        id: "phone"
                    }, {
                        old: '.email',
                        id: "email"
                    }];
                    var temp = null;
                    for (i = 0; i < 3; i++) {
                        temp = thisForm.find(value[i].old);
                        if (temp != undefined) {
                            var newForm = thisForm.find(value[i].old).attr("id", value[i].id).attr("name", value[i].id);
                            thisForm.find(value[i].old).html(newForm);
                        }
                    }   
					                    					    					
                    $.ajax({
                        type: "POST",
                        url: "back-end/main.php",
                        data: thisForm.serialize()
                    }).done(function() {
                        
                        $(this).find("input").val("");                                                                   
                        if (thisForm.find("[type='submit']").data("successful") != undefined) {
                            thisForm.parent().animate({height: 0}, 500, function() {$(".thanks").show();});
                        } else  $('#callForm').modal({show: 'true'}).find(".call-answer").addClass("small-window");

                        setTimeout(function() {
                            $('.modal').modal('hide');
                            $.magnificPopup.close();
                        }, 3000);                    
                        $(".call-back-form").trigger("reset");
                    });
                    return false;
                },
                success: function() {},
                highlight: function(t, errorClass) {
                    $(t).addClass('error'); 
                },
                unhighlight: function(element, errorClass, validClass) {
                    $(element).removeClass('error');                    
                }
            })
        });
        
         $('.call').magnificPopup({
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 200,
            callbacks: {
                beforeOpen: function() {
                   this.st.mainClass = this.st.el.attr('data-effect');
                }
              },
              midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.            
        });  
        
    };
};

var Browser = new function() {
    this.data = {};    
    this.getData = function() {
        return this.data;
    };
    this.init = function() {
        var t = this;
        var data = this.data;
        
        data.$b = $("body");
        data.navigator = navigator.userAgent.toLowerCase();
        data.clazz = {
            mobile : "mobile"
        };
        data.list = [
            {  tool:'ipad', clazz:'iPad'},
            {  tool:'android', clazz:'android'},
            {  tool:'ipod', clazz:'iPod'},
            {  tool:'iphone', clazz:'iPhone'},
            {  tool:'firefox', clazz:'firefox'},            
            {  tool:'msie 8.', clazz:'ie8'},
            {  tool:'msie 9.', clazz:'ie9'},
            {  tool:'msie 10.', clazz:'ie10'},
            {  tool:' opr/', clazz:'opera'}            
            ];
        
        for (i =0; i< data.list.length; i++)
            {
                if (data.navigator.indexOf(data.list[i].tool) > 0) 
                {
                    data.$b.addClass(data.list[i].clazz);
                    
                    if (data.list[i].tool=='android' || data.list[i].tool == 'iphone') 
                    {
                        t.orientation();
                        data.$b.addClass(data.clazz.mobile);
                    }
                }
            }                
        
        if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && !this.isIpad()) {
            data.$b.addClass("safari");
        } 
        else if ((data.navigator.indexOf('Trident') > 0) && (data.navigator.indexOf('rv:11.') > 0)) data.$b.addClass("ie11");                             
        
		if (navigator.userAgent.indexOf("Mac OS X") != -1) 	data.$b.addClass("mac");                             
        //this.viewPort();
    };
    this.isIpad = function() { return this.check(this.data.list[0]); };
    this.isAndroid = function() { return this.check(this.data.list[1]); };
    this.isIpod = function() { return this.check(this.data.list[2]); };
    this.isIphone = function() { return this.check(this.data.list[3]); };
    
    this.check = function(pos)
    {
        if (this.data.navigator.indexOf(pos.tool) > 0) this.data.$b.addClass(pos.clazz);
        return (this.data.$b.hasClass(pos.clazz));
    };        
    this.orientation = function() {
        var or = ["orX", "orY"];
        var data = this.data;
        var c = [data.$b.innerHeight(), data.$b.innerWidth()];
        (c[0] > c[1]) ? data.$b.removeClass(or[0]) : data.$b.removeClass(or[1]);
        (c[0] > c[1]) ? data.$b.addClass(or[1]) : data.$b.addClass(or[0]);            
    };
    this.viewPort = function() {
        var def = document.querySelector("meta[name=viewport]");
        var view = '<meta name="viewport" content="width=399px">';
        if (def != null) {            
            if (this.isIpad()) { 
                def.remove();
                view = '<meta name="viewport" content="maximum-scale=1.0, initial-scale=1.0, user-scalable=0">';
            } 
//            else 
//                if (this.isIPhone())
//                    {
//                        def.remove();
//                        view = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">';
//                    }
        };     
        jQuery('head').append(view);
    }
}