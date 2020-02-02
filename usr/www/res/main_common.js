var _url_command = "/upnpcp/index.html";
var _re_list = new RegExp("^SUCCESS: (uuid:.*) (SERVER|RENDERER) \"(.*)\"$","g") ;
var _re_status = new RegExp("^SUCCESS: (PLAYING|PAUSED|PAUSED_PLAYBACK|STOPPED) ([0-9]+) ([0-9]+) \"(.*)\" \"(.*)\" \"(.*)\" \"(.*)\" (.*)","g") ;
var _re_play = new RegExp("^SUCCESS$","g") ;
var _re_enqueue = new RegExp("^SUCCESS$","g") ;
var _re_enqueuedir = new RegExp("^SUCCESS$","g") ;
var _re_stop = new RegExp("^SUCCESS$","g") ;
var _re_next = new RegExp("^SUCCESS$","g") ;
var _re_prev = new RegExp("^SUCCESS$","g") ;
var _re_setvolume = new RegExp("^SUCCESS$","g") ;
var _re_getvolume = new RegExp("^SUCCESS: ([0-9]+)","g") ;
var _re_select = new RegExp("^SUCCESS ([0-9]+)$","g") ;
var _re_browse_item = new RegExp("^SUCCESS: (ITEM) \"(.*)\" \"(.*)\" (.+) (.+) \"(.*)\" \"(.*)\"$","g") ;
var _re_browse_container = new RegExp("^SUCCESS: (CONTAINER) \"(.*)\" \"(.*)\" (.+) \"(.*)\" \"(.*)\"$","g") ;
var _re_set_context = new RegExp("^SUCCESS$","g") ;
var _re_unspecified_error = new RegExp("^ERROR(.*)","g") ;
var _re_error = new RegExp("^ERROR: ([0-9]+)(.*)","g") ;
var _row_separator = "\n" ;
var req_list = new Kaemu._httpRequest() ;
var req_status = new Kaemu._httpRequest() ;
var req_play = new Kaemu._httpRequest() ;
var req_prev = new Kaemu._httpRequest() ;
var req_next = new Kaemu._httpRequest() ;
var req_browse = new Kaemu._httpRequest() ;
var req_more_browse = new Kaemu._httpRequest() ;
var req_setvolume = new Kaemu._httpRequest() ;
var req_getvolume = new Kaemu._httpRequest() ;
var req_enqueue = new Kaemu._httpRequest() ;
var req_enqueuedir = new Kaemu._httpRequest() ;
var req_set_context =  new Kaemu._httpRequest() ;
var req_clear = new Kaemu._httpRequest() ;
var req_clear_folder = new Kaemu._httpRequest();
var req_select = new Kaemu._httpRequest() ;
var volume ;
var volume_pos = 2;
var playing = false ;
var karaoking = false;
var pending = false ;
var browse_pending = false ;
var next_pending =false;
var selectedItem = null ;
var sendingQueue = new Array() ;
var playingId = null ;
var paths = new Array() ;
var updateBrowseListTimer ;
var nextTimer ;
var prevTimer ;
var moreBrowseListTimer;
var updateStatusTimer ;
var updateDevicesTimer ;
var currentPath = "";
var updateTimeDisplayTimer ;
var timeStartDisplay = null ;
var timeTotalDisplay = null ;
var max_waiting_time = 100 ; // in ms ; the maximum time findBrowserSong() can use to locateBrowserSong ;
var next_count =0;
var need_more_browse=0;

var nbMaxToEnqueue = 100 ;
var total_elements =0;



function next() {
	startNextTimer(1);
}
function prev() {
	startNextTimer(-1);
}

function nextBrowseRequest() {
	clearInterval(nextTimer);
	if (getRenderer()&&(next_count!=0)) {
		if(next_count>0)
		{
			req_next.load(_url_command+"?cmd=next&renderer="+getRenderer()+"&jump="+next_count) ;
		}
		else
		{
			var prev_count=-next_count;
			req_prev.load(_url_command+"?cmd=prev&renderer="+getRenderer()+"&jump="+prev_count) ;
		}
	}
	next_pending=false;
	next_count=0;
}

function startNextTimer(inc) {
	
	clearInterval(nextTimer);
	var index_play=0;
	if (selectedItem != null)  {
		index_play=selectedItem.getAttribute("idList");
	}
	
	if(next_count>=total_elements||-next_count>=total_elements)
	{
		nextBrowseRequest();
	}else
	{
		next_count+=inc;
		nextTimer= setInterval("nextBrowseRequest()", 500) ;
	}
	
}

function stopUpdateBrowseTimer() {
	browse_pending = false;
	clearInterval(updateBrowseListTimer);
}

function startUpdateBrowseTimer() {
	if (browse_pending == true)
	return;

	browse_pending = true;
	updateBrowseListTimer = setInterval("updateBrowseList()", 15000) ;
}
function stopUpdateBrowseTimer() {
	browse_pending = false;
	clearInterval(updateBrowseListTimer);
}

function in_array(v,a) {
	for(i in a) {
		if (a[i] == v) {
			return true ;
		}
	}
	return false ;
}
function removeClass(o,c) {
	if (o.className.indexOf(c,0)>=0) {
		o.className = o.className.substring(0,o.className.indexOf(c,0)-1)+o.className.substring(o.className.indexOf(c,0)+c.length,o.className.length) ;
	}
}
function addClass(o,c) {
	var e = new RegExp("\b"+c+"\b") ;
	if (!e.exec(o.className)) {
		o.className += (o.className?" "+c:c) ;
	}
}



function decodehtmlentities(s) {
	return s.replace("&","&amp;")
}
function stripquotes(s) { // s is an escaped string
	while(s.indexOf("%22") !=-1){
		s=s.replace("%22", "\'");
	}
	while(s.indexOf("%27") !=-1){
		s=s.replace("%27", "&quot;");
	}
	return unescape(s) ;
}
function sreplace()
{
	if (!arguments || arguments.length < 1 || !RegExp)
	{
		return;
	}
	var str = arguments[0];
	var re = /([^\$]*)\$([0-9])(.*)/;
	var a = b = [], numSubstitutions = 0, numMatches = 0;
	while (a = re.exec(str)) {
		var leftpart = a[1] ;
		var nsub = a[2] ;
		var rightPart = a[3];
		var param = arguments[nsub];
		str = leftpart + param + rightPart;
	}
	return str;
}

function smartTime(seconds) {
	var time = new Date(seconds*1000) ;
	var hours = time.getUTCHours() ;
	if (hours>0) {
		var minutes = time.getUTCMinutes()>9?time.getUTCMinutes()+"":"0"+time.getUTCMinutes() ;
	} else {
		var minutes = time.getUTCMinutes()+"" ;
	}
	var seconds = time.getUTCSeconds()>9?time.getUTCSeconds():"0"+time.getUTCSeconds()+"" ;
	return (hours>0) ? hours+":"+minutes : ""+minutes+":"+seconds ;
}

function getElementsByClassName(oElm, strTagName, strClassName){
    var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
    var arrReturnElements = new Array();
    strClassName = strClassName.replace(/\-/g, "\\-");
    var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
    var oElement;
    for(var i=0; i<arrElements.length; i++){
        oElement = arrElements[i];      
        if(oRegExp.test(oElement.className)){
            arrReturnElements.push(oElement);
        }   
    }
    return (arrReturnElements)
}
