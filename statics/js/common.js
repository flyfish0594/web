/*
 * @author dashzhao
 * @update 2008.5.30 
 * @javascript base frameWork 1.3
 */
(function(){
	var dashzhao=window.dashzhao={
		extend:function(e, methods) {if(e.type=="textarea"){return false};
	for (property in methods) { 
		e[property] = methods[property];  }
	return e;},
		  getPos: function() {
		var el=this, valueT = 0, valueL = 0;
		do {
			valueT += el.offsetTop  || 0;
			valueL += el.offsetLeft || 0;
			el = el.offsetParent;
		} while (el);
		return [valueL, valueT];
    	},
	    Height:function(){return parseInt(this.offsetHeight)||parseInt(this.clientHeight);},
		Width:function(){return parseInt(this.offsetWidth)||parseInt(this.clientWidth);},
	    wrap:function(){this.style.display = (this.getStyle().display != 'none' ? 'none' : 'block' );return this},
		getStyle:function(){return this.currentStyle||document.defaultView.getComputedStyle(this,null)||this.style},
		css: function(val,key){if(key){this.style[val] = key;return this;} else { return this.style[val];}},
		setStyle:function(s){
            var sList = s.split(";");
            for (var i=0,j; j=sList[i]; i++){
                var k = j.split(":");
                this.style[k[0]] = k[1];
            }
            return this;
        },
		hasClassName:function(Name){
			var h = false;
		this.className.split(' ').each(function(s){
			if (s == Name) {h = true}
		});
		return h;
			}, 
		addClass:function(Name){if(!this.hasClassName(this,Name)){this.className+=" "+Name};return this;},
	    removeClass:function(Name){if(this.hasClassName(Name)){var cn=this.className.replace(Name,"").replace(/(^\s*)/g, "");this.className=cn;};return this;},
			//dom; 
		nextElement:function(){
            var n = this;
            for (var i=0,n; n = n.nextSibling; i++){
                if(n.nodeType==1) return n;
            }
            return null;
        },
		previousElement:function(){
            var n = this;
            for (var i=0,n; n = n.previousSibling; i++){
                if(n.nodeType==1)return n;
            }
            return null;
        },
		moveAhead:function(){
            if (this.previousElement()){
                this.parentNode.insertBefore(this,this.previousElement());
            }
            return this;
        },
		moveNext:function(){
            var n = this.nextElement();
            if (n){
                this.parentNode.removeChild(n);
                this.parentNode.insertBefore(n,this);
            }
            return this;
        },
		appendBefore:function(e){this.insertBefore(e,this.firstChild);return this;},
		html: function(v){if(v){this.innerHTML = v;return this;}else{return this}},
		remove:function(){this.parentNode.removeChild(this);},
		empty:function(){while(this.firstChild)this.removeChild( this.firstChild );return this;},
		//html deal;
		stripTags: function(){this.innerHTML=this.innerHTML.replace(/<\/?[^>]+>/gi, '');return this},
		addEventHandler:function (e,fn) {
               if (this.addEventListener) { this.addEventListener(e, fn, false);
                 } else if (this.attachEvent) { this.attachEvent("on" + e, fn);} 
	            else { this["on" + e] = fn;}
				return this
        },
		toString : function(){return ['QQ:8127174', 'Author: dashzhao', 'Email: dashzhao@163.com','Copy:ysyuan.com'].join(' ');}
	};
	
String.prototype.trim=function(type){//"l","r","";
  switch (type)
  {
  case "l": return this.replace(/(^\s*)/g,"");
  case "r": return this.replace(/(\s*common)/g,"");
  default : return this.replace(/(^\s*)|(\s*common)/g, "");
  }
};
Array.prototype.each=function(func){
	for(var i=0,l=this.length;i<l;i++) {func(this[i],i);dashzhao.extend(this[i],dashzhao)};
    };

var common=window.common=function(e){
    var elem = typeof(e)=="string"?document.getElementById(e):e;
    if (!elem){return null}
    else{
		dashzhao.extend(elem,dashzhao);
		if(dashzhao.methods){dashzhao.extend(elem,dashzhao.methods)};
		};
    return elem;
    };
//扩展create工具
common.create = function(){
	return function(){this.init.apply(this,arguments)};
};
common.plug = {};
common.c=function(array){var nArray = [];for (var i=0,l=array.length;i<l;i++) nArray.push(array[i]);return nArray;};
common.broswer=function(){var b = navigator.userAgent.toLowerCase();
    if(/webkit/.test(b)){return "safari";}
	if(/opera/.test(b)){return "opera";}
	if(/msie/.test(b) && !/opera/.test(b)){return "msie";}
	if(/mozilla/.test(b) && !/(compatible|webkit)/.test(b)){return "mozilla";} };
common.ajax= {
    xmlPool: [],
	length:0,
    pull: function ()
    {
        for (var i = 0,l=this.xmlPool.length; i <l; i ++)
        {
            if (this.xmlPool[i].readyState == 0 || this.xmlPool[i].readyState == 4)
            {
                return this.xmlPool[i];
            }
        }
        this.xmlPool[this.xmlPool.length] = this.create();
        return this.xmlPool[this.xmlPool.length - 1];
    },
    create: function ()
    {
        if (window.XMLHttpRequest)
        {
            var XMLHttp = new XMLHttpRequest();
        }
        else
        {
           var XMLHttp = new ActiveXObject(navigator.userAgent.indexOf("MSIE 5") >=0?"Microsoft.XMLHTTP":"MSXML2.XMLHTTP")
         }          
         
      return XMLHttp;
		if (!XMLHttp) {alert('XMLHTTP create failed');return false;};
    },
	request: function (config,data,args){
	   var setTime=setTimeout(function(){if(config.ontimeout){config.ontimeout()}},5*1000);//超时处理;
		if(config.onstart){config.onstart();}//add for ajax request start;
	    config.method=config.method||"GET";
		config.async=config.async||true;
		if(!data){data=null};
        var XMLHttp = this.pull();
        with(XMLHttp)
        {
            try
            {
                // random;
                if (config.url.indexOf("?") > 0)
                {
                    config.url += "&randnum=" + Math.random();
                }
                else
                {
                    config.url += "?randnum=" + Math.random();
                }
                open(config.method, config.url, config.async);
                setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
                send(data);
                onreadystatechange = function ()
                { 
                    if (XMLHttp.readyState == 4 && ((XMLHttp.status >= 200&&XMLHttp.status< 300) || XMLHttp.status == 304))
                    {
                     config.oncomplete(XMLHttp,args);XMLHttp=null;clearTimeout(setTime);
					
                    };										
                };
				 
            }
            catch(e)
            {
                alert("数据请求出错:"+e);if(config.error){config.error();};//error;
            };
			
        };
		//alert(XMLHttp)
    }
};
common.cookies={
   read : function(n){
        var dc = "; "+document.cookie+"; ";
        var coo = dc.indexOf("; "+n+"=");
        if (coo!=-1){
            var s = dc.substring(coo+n.length+3,dc.length);
            return unescape(s.substring(0, s.indexOf("; ")));
        }else{
            return null;
        }
    },
    set : function(name,value,expires){
        var expDays = expires*24*60*60*1000;
        var expDate = new Date();
        expDate.setTime(expDate.getTime()+expDays);
        var expString = expires ? "; expires="+expDate.toGMTString() : "";
        var pathString = ";path=/";
        document.cookie = name + "=" + escape(value) + expString + pathString;
    },
    del : function(n){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=this.get(n);
        if(cval!=null) {document.cookie= n + "="+cval+";expires="+exp.toGMTString()};
    }
};

})();



formToStr=function(fc) {
		var i,qs="",and="",ev="";
		for(i=0;i<fc.length;i++) {
			e=fc[i]; 
			if (e.name!='') {
				if (e.type=='select-one'&&e.selectedIndex>-1) ev=e.options[e.selectedIndex].value;
				else if (e.type=='checkbox' || e.type=='radio') {
					if (e.checked==false) continue;
					ev=e.value;
				}
				else ev=e.value;
				//ev=escape(ev);
				qs+=and+e.name+'='+ev;
				and="&";
			}
		}
		return qs;
	};


//内容滚动
function ScrollText(content,btnPrevious,btnNext,autoStart,timeout,isSmoothScroll){
    this.Speed = 10;
    this.Timeout = timeout;
	this.stopscroll =false;//是否停止滚动的标志位
	this.isSmoothScroll= isSmoothScroll;//是否平滑连续滚动
    this.LineHeight = 24;//默认高度。可以在外部根据需要设置
    this.NextButton = this.common(btnNext);
    this.PreviousButton = this.common(btnPrevious);
    this.ScrollContent = this.common(content);
    this.ScrollContent.innerHTML += this.ScrollContent.innerHTML;//为了平滑滚动再加一遍

	if(this.PreviousButton){
		this.PreviousButton.onclick = this.GetFunction(this,"Previous"); 
		this.PreviousButton.onmouseover = this.GetFunction(this,"MouseOver");
		this.PreviousButton.onmouseout = this.GetFunction(this,"MouseOut");
	}
	if(this.NextButton){
		this.NextButton.onclick = this.GetFunction(this,"Next");
		this.NextButton.onmouseover = this.GetFunction(this,"MouseOver");
		this.NextButton.onmouseout = this.GetFunction(this,"MouseOut");
    }
    this.ScrollContent.onmouseover = this.GetFunction(this,"MouseOver");
    this.ScrollContent.onmouseout = this.GetFunction(this,"MouseOut");
    if(autoStart){
        this.Start();
    }
}

ScrollText.prototype = {
	common:function(element){
		return document.getElementById(element);
	},
	Previous:function(){
		this.stopscroll = true;
		this.Scroll("up");
	},
	Next:function(){
		this.stopscroll = true;
		this.Scroll("down");
	},
	Start:function(){
		if(this.isSmoothScroll){
			this.AutoScrollTimer = setInterval(this.GetFunction(this,"SmoothScroll"), this.Timeout);
		}else{		
			this.AutoScrollTimer = setInterval(this.GetFunction(this,"AutoScroll"), this.Timeout);
		}
	},
	Stop:function(){
		clearTimeout(this.AutoScrollTimer);
		this.DelayTimerStop = 0;
	},
	MouseOver:function(){	
		this.stopscroll = true;
	},
	MouseOut:function(){
		this.stopscroll = false;
	},
	AutoScroll:function(){
		if(this.stopscroll) {
			return;
		}
		this.ScrollContent.scrollTop++;
		if(parseInt(this.ScrollContent.scrollTop) % this.LineHeight != 0){
			this.ScrollTimer = setTimeout(this.GetFunction(this,"AutoScroll"), this.Speed);
		}else{
			if(parseInt(this.ScrollContent.scrollTop) >= parseInt(this.ScrollContent.scrollHeight) / 2){
				this.ScrollContent.scrollTop = 0;
			}
			clearTimeout(this.ScrollTimer);
			//this.AutoScrollTimer = setTimeout(this.GetFunction(this,"AutoScroll"), this.Timeout);
		}
	},
	SmoothScroll:function(){
		if(this.stopscroll){
			return;
		}
		this.ScrollContent.scrollTop++;
		if(parseInt(this.ScrollContent.scrollTop) >= parseInt(this.ScrollContent.scrollHeight) / 2){
			this.ScrollContent.scrollTop = 0;
		}
	},
	Scroll:function(direction){
		if(direction=="up"){
			this.ScrollContent.scrollTop--;
		}else{
			this.ScrollContent.scrollTop++;
		}
		if(parseInt(this.ScrollContent.scrollTop) >= parseInt(this.ScrollContent.scrollHeight) / 2){
			this.ScrollContent.scrollTop = 0;
		}else if(parseInt(this.ScrollContent.scrollTop)<=0){
			this.ScrollContent.scrollTop = parseInt(this.ScrollContent.scrollHeight) / 2;
		}
		if(parseInt(this.ScrollContent.scrollTop) % this.LineHeight != 0){
			this.ScrollTimer = setTimeout(this.GetFunction(this,"Scroll",direction), this.Speed);
		}
	},
	GetFunction:function(variable,method,param){
		return function(){
			variable[method](param);
		}
	}
}
//内容滚动完

/** 填充一个frame **/
function applyFrame(){
	var dom = document.getElementById("_iframe_bg");
	if(dom == null){
		var frame = document.createElement("span");
			frame.innerHTML = '<div id="_iframe_bg" style="background:none;display:none;z-index:800;left:0;position:absolute;top:0;width:100%;height:100%"><iframe id="_iframe_cont" style="filter:alpha(opacity=0);width:100%;height:100%;opacity:0;background:#333" ></iframe></div>';
		document.body.appendChild(frame);
			frame = null;
			dom = document.getElementById("_iframe_bg");
	}
	var dis = dom.style.display == "none" ? "" : "none"; 
	dom.style.display = dis;

}

function setInnerHTML(id,str){
	document.getElementById(id).innerHTML = str;
}






if (!sele) var sele = {};
sele.addEvent = function(o, type, fn) {
    o.attachEvent ? o.attachEvent('on' + type, fn) : o.addEventListener(type, fn, false)
};
sele.delEvent = function(o, type, fn) {
    o.detachEvent ? o.detachEvent('on' + type, fn) : o.removeEventListener(type, fn, false)
};
sele.$ = function(o) {
    return document.getElementById(o)
};


function sim_select(o) {
    o = document.getElementById(o);//select
    o.style.display = 'none';
    var opts = o.options,
    parent = o.parentNode,
    self = this;
    this.isShow = false;
    this.div = document.createElement('div');
    this.ul = document.createElement('ul');
    this.h3 = document.createElement('h3');
    this.div.className = 'sim_select';
    parent.replaceChild(this.div, o);
    this.div.appendChild(o);
    this.ul.style.display = 'none';
    this.ul.style.top = this.h3.offsetHeight;
    this.h3.innerHTML = opts[o.selectedIndex].innerHTML;
    for (var i = 0, l = o.length; i < l; i++) {
        var li = document.createElement('li');
        li.innerHTML = opts[i].innerHTML;
        this.ul.appendChild(li);
        li.onmouseover = function() {
            this.className += ' over'
        };
        li.onmouseout = function() {
            this.className = this.className.replace(/over/gi, '')
        };
        li.onclick = (function(i) {
            return function() {
                self.hide();
                self.h3.innerHTML = this.innerHTML;
                o.selectedIndex = i;
                if (o.onchange) {
                    o.onchange()
                }
            }
        })(i)
    };
    this.div.appendChild(this.h3);
    this.div.appendChild(this.ul);
    this.ul.style.top = this.h3.offsetHeight + 'px';
    this.ul.style.width = this.h3.offsetWidth - 2 + 'px';
    this.init()
};
sim_select.prototype = {
    init: function() {
        var self = this;
        sele.addEvent(document.documentElement, 'click', 
        function(e) {
            self.close(e)
        });
        this.h3.onclick = function() {
            self.toggles()
        }
    },
    show: function() {
        this.ul.style.display = 'block';
        this.isShow = true
    },
    hide: function() {
        this.ul.style.display = 'none';
        this.isShow = false
    },
    close: function(e) {
        var t = window.event ? window.event.srcElement: e.target;
        do {
            if (t == this.div) {
                return
            } else if (t == document.documentElement) {
                this.hide();
                return
            } else {
                t = t.parentNode
            }
        }
        while (t.parentNode)
    },
    toggles: function() {
        this.isShow ? this.hide() : this.show()
    }
}

//滚动图片构造函数
//UI&UE Dept. mengjia
//version 1.45
function ScrollPic(scrollContId,arrLeftId,arrRightId,dotListId,listType){this.scrollContId=scrollContId;this.arrLeftId=arrLeftId;this.arrRightId=arrRightId;this.dotListId=dotListId;this.listType=listType;this.dotClassName="dotItem";this.dotOnClassName="dotItemOn";this.dotObjArr=[];this.listEvent="onclick";this.circularly=true;this.pageWidth=0;this.frameWidth=0;this.speed=10;this.space=10;this.upright=false;this.pageIndex=0;this.autoPlay=true;this.autoPlayTime=5;this._autoTimeObj;this._scrollTimeObj;this._state="ready";this.stripDiv=document.createElement("DIV");this.lDiv01=document.createElement("DIV");this.lDiv02=document.createElement("DIV")};ScrollPic.prototype={version:"1.45",author:"mengjia",pageLength:0,touch:true,scrollLeft:0,eof:false,bof:true,initialize:function(){var thisTemp=this;if(!this.scrollContId){throw new Error("必须指定scrollContId.");return};this.scDiv=this.$(this.scrollContId);if(!this.scDiv){throw new Error("scrollContId不是正确的对象.(scrollContId = \""+this.scrollContId+"\")");return};this.scDiv.style[this.upright?'height':'width']=this.frameWidth+"px";this.scDiv.style.overflow="hidden";this.lDiv01.innerHTML=this.scDiv.innerHTML;this.scDiv.innerHTML="";this.scDiv.appendChild(this.stripDiv);this.stripDiv.appendChild(this.lDiv01);if(this.circularly){this.stripDiv.appendChild(this.lDiv02);this.lDiv02.innerHTML=this.lDiv01.innerHTML;this.bof=false;this.eof=false};this.stripDiv.style.overflow="hidden";this.stripDiv.style.zoom="1";this.stripDiv.style[this.upright?'height':'width']="32766px";this.lDiv01.style.overflow="hidden";this.lDiv01.style.zoom="1";this.lDiv02.style.overflow="hidden";this.lDiv02.style.zoom="1";if(!this.upright){this.lDiv01.style.cssFloat="left";this.lDiv01.style.styleFloat="left"};this.lDiv01.style.zoom="1";if(this.circularly&&!this.upright){this.lDiv02.style.cssFloat="left";this.lDiv02.style.styleFloat="left"};this.lDiv02.style.zoom="1";this.addEvent(this.scDiv,"mouseover",function(){thisTemp.stop()});this.addEvent(this.scDiv,"mouseout",function(){thisTemp.play()});if(this.arrLeftId){this.alObj=this.$(this.arrLeftId);if(this.alObj){this.addEvent(this.alObj,"mousedown",function(e){thisTemp.rightMouseDown();e=e||event;thisTemp.preventDefault(e)});this.addEvent(this.alObj,"mouseup",function(){thisTemp.rightEnd()});this.addEvent(this.alObj,"mouseout",function(){thisTemp.rightEnd()})}};if(this.arrRightId){this.arObj=this.$(this.arrRightId);if(this.arObj){this.addEvent(this.arObj,"mousedown",function(e){thisTemp.leftMouseDown();e=e||event;thisTemp.preventDefault(e)});this.addEvent(this.arObj,"mouseup",function(){thisTemp.leftEnd()});this.addEvent(this.arObj,"mouseout",function(){thisTemp.leftEnd()})}};var pages=Math.ceil(this.lDiv01[this.upright?'offsetHeight':'offsetWidth']/this.frameWidth),i,tempObj;this.pageLength=pages;if(this.dotListId){this.dotListObj=this.$(this.dotListId);this.dotListObj.innerHTML="";if(this.dotListObj){for(i=0;i<pages;i++){tempObj=document.createElement("span");this.dotListObj.appendChild(tempObj);this.dotObjArr.push(tempObj);if(i==this.pageIndex){tempObj.className=this.dotOnClassName}else{tempObj.className=this.dotClassName};if(this.listType=='number'){tempObj.innerHTML=i+1}else if(typeof(this.listType)=='string'){tempObj.innerHTML=this.listType}else{tempObj.innerHTML=''};tempObj.title="第"+(i+1)+"页";tempObj.num=i;tempObj[this.listEvent]=function(){thisTemp.pageTo(this.num)}}}};this.scDiv[this.upright?'scrollTop':'scrollLeft']=0;if(this.autoPlay){this.play()};this._scroll=this.upright?'scrollTop':'scrollLeft';this._sWidth=this.upright?'scrollHeight':'scrollWidth';if(typeof(this.onpagechange)==='function'){this.onpagechange()};this.iPad()},leftMouseDown:function(){if(this._state!="ready"){return};var thisTemp=this;this._state="floating";clearInterval(this._scrollTimeObj);this._scrollTimeObj=setInterval(function(){thisTemp.moveLeft()},this.speed);this.moveLeft()},rightMouseDown:function(){if(this._state!="ready"){return};var thisTemp=this;this._state="floating";clearInterval(this._scrollTimeObj);this._scrollTimeObj=setInterval(function(){thisTemp.moveRight()},this.speed);this.moveRight()},moveLeft:function(){if(this._state!="floating"){return};if(this.circularly){if(this.scDiv[this._scroll]+this.space>=this.lDiv01[this._sWidth]){this.scDiv[this._scroll]=this.scDiv[this._scroll]+this.space-this.lDiv01[this._sWidth]}else{this.scDiv[this._scroll]+=this.space}}else{if(this.scDiv[this._scroll]+this.space>=this.lDiv01[this._sWidth]-this.frameWidth){this.scDiv[this._scroll]=this.lDiv01[this._sWidth]-this.frameWidth;this.leftEnd()}else{this.scDiv[this._scroll]+=this.space}};this.accountPageIndex()},moveRight:function(){if(this._state!="floating"){return};if(this.circularly){if(this.scDiv[this._scroll]-this.space<=0){this.scDiv[this._scroll]=this.lDiv01[this._sWidth]+this.scDiv[this._scroll]-this.space}else{this.scDiv[this._scroll]-=this.space}}else{if(this.scDiv[this._scroll]-this.space<=0){this.scDiv[this._scroll]=0;this.rightEnd()}else{this.scDiv[this._scroll]-=this.space}};this.accountPageIndex()},leftEnd:function(){if(this._state!="floating"&&this._state!='touch'){return};this._state="stoping";clearInterval(this._scrollTimeObj);var fill=this.pageWidth-this.scDiv[this._scroll]%this.pageWidth;this.move(fill)},rightEnd:function(){if(this._state!="floating"&&this._state!='touch'){return};this._state="stoping";clearInterval(this._scrollTimeObj);var fill=-this.scDiv[this._scroll]%this.pageWidth;this.move(fill)},move:function(num,quick){var thisTemp=this;var thisMove=num/5;var theEnd=false;if(!quick){if(thisMove>this.space){thisMove=this.space};if(thisMove<-this.space){thisMove=-this.space}};if(Math.abs(thisMove)<1&&thisMove!=0){thisMove=thisMove>=0?1:-1}else{thisMove=Math.round(thisMove)};var temp=this.scDiv[this._scroll]+thisMove;if(thisMove>0){if(this.circularly){if(this.scDiv[this._scroll]+thisMove>=this.lDiv01[this._sWidth]){this.scDiv[this._scroll]=this.scDiv[this._scroll]+thisMove-this.lDiv01[this._sWidth]}else{this.scDiv[this._scroll]+=thisMove}}else{if(this.scDiv[this._scroll]+thisMove>=this.lDiv01[this._sWidth]-this.frameWidth){this.scDiv[this._scroll]=this.lDiv01[this._sWidth]-this.frameWidth;this._state="ready";theEnd=true}else{this.scDiv[this._scroll]+=thisMove}}}else{if(this.circularly){if(this.scDiv[this._scroll]+thisMove<0){this.scDiv[this._scroll]=this.lDiv01[this._sWidth]+this.scDiv[this._scroll]+thisMove}else{this.scDiv[this._scroll]+=thisMove}}else{if(this.scDiv[this._scroll]+thisMove<=0){this.scDiv[this._scroll]=0;this._state="ready";theEnd=true}else{this.scDiv[this._scroll]+=thisMove}}};this.accountPageIndex();if(theEnd){this.accountPageIndex('end');return};num-=thisMove;if(Math.abs(num)==0){this._state="ready";if(this.autoPlay){this.play()};this.accountPageIndex();return}else{clearTimeout(this._scrollTimeObj);this._scrollTimeObj=setTimeout(function(){thisTemp.move(num,quick)},this.speed)}},pre:function(){if(this._state!="ready"){return};this._state="stoping";this.move(-this.pageWidth)},next:function(reStar){if(this._state!="ready"){return};this._state="stoping";if(this.circularly){this.move(this.pageWidth)}else{if(this.scDiv[this._scroll]>=this.lDiv01[this._sWidth]-this.frameWidth){this._state="ready";if(reStar){this.pageTo(0)}}else{this.move(this.pageWidth)}}},play:function(){var thisTemp=this;if(!this.autoPlay){return};clearInterval(this._autoTimeObj);this._autoTimeObj=setInterval(function(){thisTemp.next(true)},this.autoPlayTime*1000)},stop:function(){clearInterval(this._autoTimeObj)},pageTo:function(num){if(this.pageIndex==num){return};if(num<0){num=this.pageLength-1};clearTimeout(this._scrollTimeObj);clearInterval(this._scrollTimeObj);this._state="stoping";var fill=num*this.frameWidth-this.scDiv[this._scroll];this.move(fill,true)},accountPageIndex:function(type){var pageIndex=Math.round(this.scDiv[this._scroll]/this.frameWidth);if(pageIndex>=this.pageLength){pageIndex=0};this.scrollLeft=this.scDiv[this._scroll];var scrollMax=this.lDiv01[this._sWidth]-this.frameWidth;if(!this.circularly){this.eof=this.scrollLeft>=scrollMax;this.bof=this.scrollLeft<=0};if(type=='end'&&typeof(this.onmove)==='function'){this.onmove()};if(pageIndex==this.pageIndex){return};this.pageIndex=pageIndex;if(this.pageIndex>Math.floor(this.lDiv01[this.upright?'offsetHeight':'offsetWidth']/this.frameWidth)){this.pageIndex=0};var i;for(i=0;i<this.dotObjArr.length;i++){if(i==this.pageIndex){this.dotObjArr[i].className=this.dotOnClassName}else{this.dotObjArr[i].className=this.dotClassName}};if(typeof(this.onpagechange)==='function'){this.onpagechange()}},iPadX:0,iPadLastX:0,iPadStatus:'ok',iPad:function(){if(typeof(window.ontouchstart)==='undefined'){return};if(!this.touch){return};var tempThis=this;this.addEvent(this.scDiv,'touchstart',function(e){tempThis._touchstart(e)});this.addEvent(this.scDiv,'touchmove',function(e){tempThis._touchmove(e)});this.addEvent(this.scDiv,'touchend',function(e){tempThis._touchend(e)})},_touchstart:function(e){this.stop();this.iPadX=e.touches[0].pageX;this.iPadScrollX=window.pageXOffset;this.iPadScrollY=window.pageYOffset;this.scDivScrollLeft=this.scDiv[this._scroll]},_touchmove:function(e){if(e.touches.length>1){this._touchend()};this.iPadLastX=e.touches[0].pageX;var cX=this.iPadX-this.iPadLastX;if(this.iPadStatus=='ok'){if(this.iPadScrollY==window.pageYOffset&&this.iPadScrollX==window.pageXOffset&&Math.abs(cX)>20){this.iPadStatus='touch'}else{return}};this._state='touch';var scrollNum=this.scDivScrollLeft+cX;if(scrollNum>=this.lDiv01[this._sWidth]){if(this.circularly){scrollNum=scrollNum-this.lDiv01[this._sWidth]}else{return}};if(scrollNum<0){if(this.circularly){scrollNum=scrollNum+this.lDiv01[this._sWidth]}else{return}};this.scDiv[this._scroll]=scrollNum;e.preventDefault()},_touchend:function(e){if(this.iPadStatus!='touch'){return};this.iPadStatus='ok';var cX=this.iPadX-this.iPadLastX;if(cX<0){this.rightEnd()}else{this.leftEnd()};this.play()},_overTouch:function(){this.iPadStatus='ok'},$:function(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}},isIE:navigator.appVersion.indexOf("MSIE")!=-1?true:false,addEvent:function(obj,eventType,func){if(obj.attachEvent){obj.attachEvent("on"+eventType,func)}else{obj.addEventListener(eventType,func,false)}},delEvent:function(obj,eventType,func){if(obj.detachEvent){obj.detachEvent("on"+eventType,func)}else{obj.removeEventListener(eventType,func,false)}},preventDefault:function(e){if(e.preventDefault){e.preventDefault()}else{e.returnValue=false}}};


//焦点图构造函数 071221 mengjia
//FocusPic(BigPicID,SmallPicsID,TitleID,MemoID) 大图容器ID，小图列表容器ID，标题容器ID ,说明容器ID
//	add(BigPic,SmallPic,Url,Title) 大图地址，小图地址，链接地址，标题，说明文字
//	begin() 开始执行
//	TimeOut = 5000 默认切换时间
var FocusPic=function(BigPicID,SmallPicsID,TitleID,MemoID,width,height){this.Data=[];this.ImgLoad=[];this.TimeOut=5000;var isIE=navigator.appVersion.indexOf("MSIE")!=-1?true:false;this.width=width;this.height=height;this.adNum=0;var TimeOutObj;if(!FocusPic.childs){FocusPic.childs=[]};this.showTime=null;this.showSum=10;this.ID=FocusPic.childs.push(this)-1;this.Add=function(BigPic,SmallPic,Title,Url,Memo){var ls;this.Data.push([BigPic,SmallPic,Title,Url,Memo]);ls=this.ImgLoad.length;this.ImgLoad.push(new Image);this.ImgLoad[ls].src=BigPic};this.TimeOutBegin=function(){clearInterval(TimeOutObj);TimeOutObj=setInterval("FocusPic.childs["+this.ID+"].next()",this.TimeOut)};this.TimeOutEnd=function(){clearInterval(TimeOutObj)};this.select=function(num){if(num>this.Data.length-1){return};if(num==this.adNum){return};this.TimeOutBegin();if(BigPicID){if(this.$(BigPicID)){var aObj=this.$(BigPicID).getElementsByTagName("a")[0];aObj.href=this.Data[num][2];if(this.aImgY){this.aImgY.style.display='none';this.aImg.style.zIndex=0};this.aImgY=this.$('F'+this.ID+'BF'+this.adNum);this.aImg=this.$('F'+this.ID+'BF'+num);clearTimeout(this.showTime);this.showSum=10;this.showTime=setTimeout("FocusPic.childs["+this.ID+"].show()",50)}};if(TitleID){if(this.$(TitleID)){this.$(TitleID).innerHTML="<a href=\""+this.Data[num][2]+"\" target=\"_blank\">"+this.Data[num][3]+"</a>"}};if(MemoID){if(this.$(MemoID)){this.$(MemoID).innerHTML=this.Data[num][4]}};if(SmallPicsID){if(this.$(SmallPicsID)){var sImg=this.$(SmallPicsID).getElementsByTagName("span"),i;for(i=0;i<sImg.length;i++){if(i==num||num==(i-this.Data.length)){sImg[i].className="selected"}else{sImg[i].className=""}}}};if(this.onselect){this.onselect()};this.adNum=num};this.show=function(){this.showSum--;this.aImgY.style.display='block';this.aImg.style.display='block';if(isIE){this.aImg.style.filter="alpha(opacity=0)";this.aImg.style.filter="alpha(opacity="+(10-this.showSum)*10+")"}else{this.aImg.style.opacity=0;this.aImg.style.opacity=(10-this.showSum)*0.1};if(this.showSum<=0){this.aImgY.style.display='none';this.aImg.style.zIndex=0;this.aImgY=null}else{this.aImg.style.zIndex=2;this.showTime=setTimeout("FocusPic.childs["+this.ID+"].show()",50)}};this.next=function(){var temp=this.adNum;temp++;if(temp>=this.Data.length){temp=0};this.select(temp)};this.MInStopEvent=function(ObjID){if(ObjID){if(this.$(ObjID)){if(this.$(ObjID).attachEvent){this.$(ObjID).attachEvent("onmouseover",Function("FocusPic.childs["+this.ID+"].TimeOutEnd()"));this.$(ObjID).attachEvent("onmouseout",Function("FocusPic.childs["+this.ID+"].TimeOutBegin()"))}else{this.$(ObjID).addEventListener("mouseover",Function("FocusPic.childs["+this.ID+"].TimeOutEnd()"),false);this.$(ObjID).addEventListener("mouseout",Function("FocusPic.childs["+this.ID+"].TimeOutBegin()"),false)}}}};this.begin=function(){this.MInStopEvent(TitleID);this.MInStopEvent(SmallPicsID);this.MInStopEvent(BigPicID);this.adNum=0;var i,temp="";if(BigPicID){if(this.$(BigPicID)){var aObj=this.$(BigPicID).getElementsByTagName("a")[0];aObj.style.zoom=1;this.$(BigPicID).style.position="relative";this.$(BigPicID).style.zoom=1;this.$(BigPicID).style.overflow="hidden";for(i=0;i<this.Data.length;i++){temp+='<img src="'+this.Data[i][0]+'" id="F'+this.ID+'BF'+i+'" style="display:'+(i==this.adNum?'block':'none')+'" galleryimg="no"'+(this.width?' width="'+this.width+'"':'')+(this.height?' height="'+this.height+'"':'')+' alt="'+this.Data[i][3]+'" />'};aObj.innerHTML=temp;var imgObjs=aObj.getElementsByTagName("img");for(i=0;i<imgObjs.length;i++){imgObjs[i].style.position="relative";imgObjs[i].style.top=0;imgObjs[i].style.left=0;}}};if(SmallPicsID){if(this.$(SmallPicsID)){temp="";for(i=0;i<this.Data.length;i++){temp+="<span"+(this.adNum==i?' class="selected"':"")+"><a href=\""+this.Data[i][2]+"\" target=\"_blank\"><img src=\""+this.Data[i][1]+"\" onmouseover=\"FocusPic.childs["+this.ID+"].select("+i+")\" alt=\""+this.Data[i][3]+"\" /></a></span>"};this.$(SmallPicsID).innerHTML=temp}};if(TitleID){if(this.$(TitleID)){this.$(TitleID).innerHTML="<a href=\""+this.Data[this.adNum][2]+"\" target=\"_blank\">"+this.Data[this.adNum][3]+"</a>"}};if(MemoID){if(this.$(MemoID)){this.$(MemoID).innerHTML=this.Data[this.adNum][4]}};this.TimeOutBegin()};this.$=function(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}}};
//舌签构造函数
function SubShowClass(C,i,c,l,I){var V=this,v=V;V.parentObj=V.$(C);if(V.parentObj==null&&C!="none"){throw new Error("SubShowClass(ID)参数错误:ID 对像不存在!(value:"+C+")")};V.lock=false;V.label=[];V.defaultID=c==null?0:c;V.selectedIndex=V.defaultID;V.openClassName=l==null?"selected":l;V.closeClassName=I==null?"":I;V.mouseIn=false;var O=function(){v.mouseIn=true},o=function(){v.mouseIn=false};if(C!="none"&&C!=""){if(V.parentObj.attachEvent){V.parentObj.attachEvent("onmouseover",O)}else{V.parentObj.addEventListener("mouseover",O,false)}};if(C!="none"&&C!=""){if(V.parentObj.attachEvent){V.parentObj.attachEvent("onmouseout",o)}else{V.parentObj.addEventListener("mouseout",o,false)}};if(typeof(i)!="string"){i="onmousedown"};i=i.toLowerCase();switch(i){case "onmouseover":V.eventType="mouseover";break;case "onmouseout":V.eventType="mouseout";break;case "onclick":V.eventType="click";break;case "onmouseup":V.eventType="mouseup";break;default:V.eventType="mousedown"};V.autoPlay=false;V.autoPlayTimeObj=null;V.spaceTime=5000};SubShowClass.prototype={version:"1.31",author:"mengjia",_setClassName:function(l,I){var o=this,i;i=l.className;if(i){i=i.replace(o.openClassName,"");i=i.replace(o.closeClassName,"");i+=" "+(I=="open"?o.openClassName:o.closeClassName)}else{i=(I=="open"?o.openClassName:o.closeClassName)};l.className=i},addLabel:function(labelID,contID,parentBg,springEvent,blurEvent){var t=this,labelObj=this.$(labelID),contObj=this.$(contID);if(labelObj==null&&labelID!="none"){throw new Error("addLabel(labelID)参数错误:labelID 对像不存在!(value:"+labelID+")")};var TempID=this.label.length;if(parentBg==""){parentBg=null};this.label.push([labelID,contID,parentBg,springEvent,blurEvent]);var tempFunc=function(){t.select(TempID)};if(labelID!="none"){if(labelObj.attachEvent){labelObj.attachEvent("on"+this.eventType,tempFunc)}else{labelObj.addEventListener(this.eventType,tempFunc,false)}};if(TempID==this.defaultID){if(labelID!="none"){this._setClassName(labelObj,"open")};if(this.$(contID)){contObj.style.display=""};if(this.ID!="none"){if(parentBg!=null){this.parentObj.style.background=parentBg}};if(springEvent!=null){eval(springEvent)}}else{if(labelID!="none"){this._setClassName(labelObj,"close")};if(contObj){contObj.style.display="none"}};var mouseInFunc=function(){t.mouseIn=true},mouseOutFunc=function(){t.mouseIn=false};if(contObj){if(contObj.attachEvent){contObj.attachEvent("onmouseover",mouseInFunc)}else{contObj.addEventListener("mouseover",mouseInFunc,false)};if(contObj.attachEvent){contObj.attachEvent("onmouseout",mouseOutFunc)}else{contObj.addEventListener("mouseout",mouseOutFunc,false)}}},select:function(num,force){if(typeof(num)!="number"){throw new Error("select(num)参数错误:num 不是 number 类型!(value:"+num+")")};if(force!=true&&this.selectedIndex==num){return};var i;for(i=0;i<this.label.length;i++){if(i==num){if(this.label[i][0]!="none"){this._setClassName(this.$(this.label[i][0]),"open")};if(this.$(this.label[i][1])){this.$(this.label[i][1]).style.display=""};if(this.ID!="none"){if(this.label[i][2]!=null){this.parentObj.style.background=this.label[i][2]}};if(this.label[i][3]!=null){eval(this.label[i][3])}}else if(this.selectedIndex==i||force==true){if(this.label[i][0]!="none"){this._setClassName(this.$(this.label[i][0]),"close")};if(this.$(this.label[i][1])){this.$(this.label[i][1]).style.display="none"};if(this.label[i][4]!=null){eval(this.label[i][4])}}};this.selectedIndex=num},random:function(){var O=this;if(arguments.length!=O.label.length){throw new Error("random()参数错误:参数数量与标签数量不符!(length:"+arguments.length+")")};var l=0,o;for(o=0;o<arguments.length;o++){l+=arguments[o]};var I=Math.random(),i=0;for(o=0;o<arguments.length;o++){i+=arguments[o]/l;if(I<i){O.select(o);break}}},order:function(){var O=this;if(arguments.length!=O.label.length){throw new Error("order()参数错误:参数数量与标签数量不符!(length:"+arguments.length+")")};if(!(/^\d+$/).test(SubShowClass.sum)){return};var i=0,o;for(o=0;o<arguments.length;o++){i+=arguments[o]};var I=SubShowClass.sum%i;if(I==0){I=i};var l=0;for(o=0;o<arguments.length;o++){l+=arguments[o];if(l>=I){O.select(o);break}}},play:function(spTime){var t=this;if(typeof(spTime)=="number"){this.spaceTime=spTime};clearInterval(this.autoPlayTimeObj);this.autoPlayTimeObj=setInterval(function(){t.autoPlayFunc()},this.spaceTime);this.autoPlay=true},autoPlayFunc:function(){var i=this;if(i.autoPlay==false||i.mouseIn==true){return};i.nextLabel()},nextLabel:function(){var t=this,index=this.selectedIndex;index++;if(index>=this.label.length){index=0};this.select(index);if(this.autoPlay==true){clearInterval(this.autoPlayTimeObj);this.autoPlayTimeObj=setInterval(function(){t.autoPlayFunc()},this.spaceTime)}},previousLabel:function(){var t=this,index=this.selectedIndex;index--;if(index<0){index=this.label.length-1};this.select(index);if(this.autoPlay==true){clearInterval(this.autoPlayTimeObj);this.autoPlayTimeObj=setInterval(function(){t.autoPlayFunc()},this.spaceTime)}},stop:function(){var i=this;clearInterval(i.autoPlayTimeObj);i.autoPlay=false},$:function(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}}};SubShowClass.readCookie=function(O){var o="",l=O+"=";if(document.cookie.length>0){var i=document.cookie.indexOf(l);if(i!=-1){i+=l.length;var I=document.cookie.indexOf(";",i);if(I==-1)I=document.cookie.length;o=unescape(document.cookie.substring(i,I))}};return o};SubShowClass.writeCookie=function(i,l,o,c){var O="",I="";if(o!=null){O=new Date((new Date).getTime()+o*3600000);O="; expires="+O.toGMTString()};if(c!=null){I=";domain="+c};document.cookie=i+"="+escape(l)+O+I};SubShowClass.sum=SubShowClass.readCookie("SSCSum");if((/^\d+$/).test(SubShowClass.sum)){SubShowClass.sum++}else{SubShowClass.sum=1};SubShowClass.writeCookie("SSCSum",SubShowClass.sum,12);
