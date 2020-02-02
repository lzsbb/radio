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

Kaemu._httpRequest = function() {
	if (!(window.ActiveXObject || window.XMLHttpRequest)) {
        stopTimers() ;
        DisplayError(_TEXT_HTTPREQUEST_ERROR,0);
        if (this.onfailed) {
            this.onfailed() ;
        }
		return false ;
	}
	this.req = null ;
	this.load = function(url,post) {
		var factory = this ;
		if (post != null) {
			var method = "POST" ;
		} else {
			var method = "GET" ;
		}
		var processReqChange = function() {
		    try {
		        if (factory.req.readyState == 4) {
				    if (factory.req.status == 200) {
					    factory.onload() ;
				     } else {
					    if (factory.req.status != undefined) {
						    var error_txt=_TEXT_CONNECTION_ERROR + " (" + factory.req.status + ")";
						    DisplayError(error_txt,0);
					    }
					    else
					    {
				            var txt=_TEXT_CONNECTION_ERROR +" 1";
				            DisplayError(txt,0);
					    }
                        if (this.onfailed) {
                            this.onfailed() ;
                        }
				     }
			    }
			}
			catch(e) {
				var txt=_TEXT_ERROR_UNSPEC+" 1";
				DisplayError(txt,0);
	            if (this.onfailed) {
                    this.onfailed() ;
	            }
			}
		}
		if (window.XMLHttpRequest) {
		    try {
			    this.req = new XMLHttpRequest();
			    this.req.onreadystatechange = processReqChange;
			    try {
			        // we set timeouts values so that when connection is not available anymore
			        // it will not wait more than a few seconds
			        // resolveTimeout : 3s (should not be greater)
			        // connectTimeout : 5s
			        // sendTimeout : 3s
			        // receiveTimeout : 30s
			        this.req.setTimeouts(3000,5000,3000,30000);
			    }
				catch(e) {} // if not supported do not use
			    this.req.open(method, url, true);
			    this.req.setRequestHeader('Content-Type','application/xml') ;
			    this.req.send(post);
			}
			catch(e) {
				var txt=_TEXT_ERROR_BROWSER+" 2";
				DisplayError(txt,0);
	            if (this.onfailed) {
                    this.onfailed() ;
	            }
			}
		} else if (window.ActiveXObject) {
            try {
               this.req = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    this.req = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    stopTimers() ;
		            DisplayError(_TEXT_ERROR_BROWSER,0);
	                if (this.onfailed) {
                        this.onfailed() ;
	                }
               }
            }
            
            try {   
			    if (this.req) {
				    this.req.onreadystatechange = processReqChange;
				    try {
				        // we set timeouts values so that when connection is not available anymore
				        // it will not wait more than a few seconds
				        // resolveTimeout : 3s (should not be greater)
				        // connectTimeout : 5s
				        // sendTimeout : 3s
				        // receiveTimeout : 30s
				        this.req.setTimeouts(3000,5000,3000,30000);
				    }
				    catch(e) {} // if not supported do not use
				    this.req.open(method, url, true);
				    this.req.setRequestHeader('Content-Type','application/xml') ;
				    this.req.send(post);
			    }
			    else
			    {
	                if (this.onfailed) {
                        this.onfailed() ;
	                }
			    }
			}
			catch(e) {
				var txt=_TEXT_ERROR_BROWSER+" 3";
				DisplayError(txt,0);
	            if (this.onfailed) {
                    this.onfailed() ;
	            }
			}
		} 
	} ;
	this.onload = function() {
	    var _re_unspecified_error = new RegExp("^ERROR(.*)","g") ;
	    var _re_error = new RegExp("^ERROR: ([0-9]+)(.*)","g") ;
	    var ResponseText = this.req.responseText.replace(/\n/, "");
		var error = _re_error.exec(ResponseText) ;
		if (error) {
		    var text = _TEXT_ERROR_UNSPEC;
		    var type=0;
		    switch(error[1])
		    {
			    case "1":
				test=_TEXT_ERROR_UPNP_IE;
				type=1;
		        case "2":
				test=_TEXT_ERROR_UPNP_INVALI;
				type=1;
			break;
		        case "3":
				text = _TEXT_ERROR_UPNP_NOANSWER  + " (" + error[1] + ")";
				type=1;
		        break;
			case "5":
				text = _TEXT_ERROR_UPNP_NOANSWER + " (" + error[1] + ")";
				type=1;
			break;
			
		        case "7":
		            text = _TEXT_ERROR_UPNP_OVERSIZED;
		            type=1;
		        break;
		        case "12":
		            text = _TEXT_ERROR_UPNP_CANCEL;
		            type=1;
		        break;
		        case "13":
		            text = _TEXT_ERROR_UNAUTHORIZED;
		        break;
		        case "19":
			    text = _TEXT_ERROR_UPNP_NOANSWER + " (" + error[1] + ")";
		            type=1;
		        break;
		        case "22":
		            text = _TEXT_ERROR_UPNP_UNAUTHORIZED;
		            type=1;
		        break;
		        case "38":
		            text = _TEXT_ERROR_UPNP_IE + " (" + error[1] + ")";
		            type=1;
		        break;
		        case "52":
		            text = _TEXT_ERROR_UPNP_IE + " (" + error[1] + ")";
		            type=1;
		        break;
		        case "106":
		            text = _TEXT_ERROR_UPNP_IE + " (" + error[1] + ")";
		            
		            type=1;
		        break;
		        case "104":
		            text = _TEXT_ERROR_UPNP_CONNECTION + " (" + error[1] + ")";
		            type=1;
		        break;
		        case "110":
		            text = _TEXT_ERROR_BUZY;
		            type=1;
		        break;
		        case "114":
		            text = _TEXT_ERROR_145;
		        break;
		        case "131":
		        case "149":
		        case "5":
		        case "22":
		        case "50":
		        case "89":
		            text = _TEXT_ERROR_131_149_5_22_50_89;
		        break;
		        default:
		            text = _TEXT_ERROR_UNSPEC + " (" + error[1] + ")";
				type=1;
		            break;
		        
		    }
		    DisplayError(text,type);
	        if (this.onfailed) {
                this.onfailed() ;
	        }
		} else {
		    error = _re_unspecified_error.exec(ResponseText) ;
		    if(error) {
		        DisplayError(_TEXT_ERROR_UNSPEC,0);
		        if (this.onfailed) {
	                this.onfailed() ;
		        }
		    } else {
		        if (this.onsuccess) {
	                this.onsuccess() ;
		        }
		    }
		}
	} ;
}


