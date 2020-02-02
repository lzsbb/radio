/*
Copyright (c) 2006 Ben VIE kaemu@kaemu.com

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/


Kaemu._popupMenu = function(id) {
	this.menu = document.getElementById(id);
	this.__i = 0 ;
	
	this.clear = function() {
		while (this.menu.length > 0) {
			this.menu.remove(0);
		}
	} ;
	
	this.append = function(name, value) {
		var _name = document.createTextNode(name);
		var opt = document.createElement("option");
		opt.value = value;
		opt.appendChild(_name);
		this.menu.appendChild(opt);
	} ;
	this.removeOption = function(value) {
		for(var i=0;i<this.menu.options.length;i++) {
			if (this.menu.options[i].value == value) {
				this.menu.removeChild(this.menu.options[i]) ;
				break ;
			}
		}
	} ;
	this.removeOptionsAfter = function(value) {
		var l = this.menu.options.length ;
		for(var i=0;i<l;i++) {
			if (this.menu.options[i].value == value) {
				break ;
			}
		}
		for(var j=i+1;j<l;j++) {
			this.menu.removeChild(this.menu.options[this.menu.options.length-1]) ; // do not confuse l and this.menu.options.length
		}
	}
	this.find = function(value) {
		for(var i=0;i<this.menu.options.length;i++) {
			if (this.menu.options[i].value == value) {
				return true ;
			}
		}
		return false ;
	} ;
	this.numbofitems = function() {
		return this.menu.options.length ;
	} ;
	this.getvalue = function(i) {
		if (i==null) {
			return this.get() ;
		} else {
			return this.menu.options[i].value ;
		}
	} ;
	this.getname = function(i) {
		if (i==null) {
			i = this.menu.selectedIndex;
		}
		if (i>=0 && this.menu.options[i]) {
			return this.menu.options[i].firstChild.nodeValue ;
		}
	} ;
	
	this.get = function() {
		if (this.menu.selectedIndex>=0 && this.menu.options[this.menu.selectedIndex]) {
			return this.menu.options[this.menu.selectedIndex].value ;
		}
		return "" ;
	} ;

	this.select = function(value) {
		for(var i=0;i<this.menu.options.length;i++) {
			if (this.menu.options[i].value == value) {
				this.menu.selectedIndex = i ;
				break ;
			}
		}
	} ;
	
	this.disable = function() {
		this.menu.disabled = true ; 
	} ;
	this.enable = function() {
		this.menu.disabled = false ; 
	} ;
/*	this.disableoption = function(name,value) {
		option.disabled = value ;
		if (value == true) {
			option.style.color = "#888";
			alert(option.name+" "+option.style.color) 
		} else {
			option.style.color = "#000";
		}
	} ;*/
}