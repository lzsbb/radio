
function play(item) {
	if (!pending && getRenderer()!="" && getServer()!="") {
		pending = true ;
		if (item != null) {
			lock(true) ;
			setPlayingSong(item, false) ;
			req_clear.load(_url_command+"?cmd=clear&renderer="+getRenderer()) ;
			setButtonPlay("pause") ;
		} else {
			if (playing == false) {
				req_play.load(_url_command+"?cmd=play&renderer="+getRenderer()) ;
				setButtonPlay("pause") ;
			} else {
				req_play.load(_url_command+"?cmd=pause&renderer="+getRenderer()) ;
				setButtonPlay("") ;
			}
		}
	}
}

function playfolder(item) {
	if (!pending && getRenderer()!="" && getServer()!="") {
		pending = true ;
		if (item != null) {
			lock(true) ;
			setPlayingSong(item, false) ;
			req_clear_folder.load(_url_command+"?cmd=clear&renderer="+getRenderer()) ;
			setButtonPlay("pause") ;
		} else {
			if (playing == false) {
				req_play.load(_url_command+"?cmd=play&renderer="+getRenderer()) ;
				setButtonPlay("pause") ;
			} else {
				req_play.load(_url_command+"?cmd=pause&renderer="+getRenderer()) ;
				setButtonPlay("") ;
			}
		}
	}
}

function karaoke() {
	if (!pending && getRenderer()!="" && getServer()!="") {
		pending = true ;
		if (karaoking == false) {
			set_effect_karaoke();
			//setButtonKaraoke("pause") ;
			//karaoking = true;
		} else {
			//setButtonKaraoke("active") ;
			set_effect_none();
			//karaoking = false;
		}
	}
}




function browseFolder(item)
{
    addtopath(item.id,item.getAttribute("folderName"));
}

function getRenderer() {
	var menu = new Kaemu._popupMenu("RENDERER") ;
	return menu.get() ;
}
function getServer() {
	var menu = new Kaemu._popupMenu("SERVER") ;
	return menu.get() ;
}
function changeserver() {
	if (!pending) {
		var menu = new Kaemu._popupMenu("PATH") ;
		menu.clear() ;
		addtopath("0",_TEXT_ROOT) ;
	}
}
function updateBrowseList() {
    open(escape(currentPath),escape(""), true);
}

function browse() {
	if (!pending) {
		var menu = new Kaemu._popupMenu("PATH") ;
		if (menu.numbofitems()>0) {
			menu.removeOptionsAfter(menu.get()) ;
			open(escape(menu.get()),escape(menu.getname()), false) ;
		}
	}
}
function goparent() {
	var menu = new Kaemu._popupMenu("PATH") ;
	if (menu.numbofitems()>1) {
		open(escape(menu.getvalue(menu.numbofitems()-2)), escape(menu.getname(menu.numbofitems()-2)), false) ;
		menu.removeOptionsAfter(menu.getvalue(menu.numbofitems()-2)) ; // remove after open
	} else {
		open(escape(menu.getvalue(menu.numbofitems()-1)), escape(menu.getname(menu.numbofitems()-1)), false) ;
	}
}
function goconfig() {
  parent.location="config.html";
}
function gomyradio() {
  parent.location="myradio.html";
}
function gopodcast() {
  parent.location="podcast.html";
}
function gohome() {
  parent.location="home.html";
}
function info() {
	if(need_more_browse>0)
	{
		var point=need_more_browse%4;
		var text="";
		var space=4-point;
		document.getElementById("INFO").innerHTML ="Browsing";
		
		while(point>0)
		{
			text+=".";
			point--;
		}
		while(space>0)
		{
			text+="&nbsp";
			space--;
		}
		document.getElementById("INFO").innerHTML +=text;
	}
	else if (total_elements>1) {
		document.getElementById("INFO").innerHTML = total_elements+_TEXT_ELES ;
	} else {
		document.getElementById("INFO").innerHTML = total_elements+_TEXT_ELEM ;
	}
}
function addtopath(path,name) {
	path = unescape(path) ;
	name = unescape(name) ;
	var menu = new Kaemu._popupMenu("PATH") ;
	menu.append(name,path) ;
	open(escape(path),escape(name), false) ;
}
function open(path,name,refreshMode) {
	path = unescape(path) ;
	name = unescape(name) ;
	var menu = new Kaemu._popupMenu("PATH") ;
	menu.select(path) ;
	currentPath = path ;
	var div = document.getElementById("BROWSER") ;
	if(refreshMode == false) {
	    div.innerHTML = "" ;
	}
	total_elements = 0 ;
	if (getServer() != "") {
		need_more_browse=0;
		req_browse.load(_url_command+"?cmd=browse&path="+encodeURIComponent('"'+path+'"')+"&server="+getServer()+"&idx=0&nb=50") ;
	} else {
		info() ;
	}
}
function lock(b) {
	if (b) {
		var menu = new Kaemu._popupMenu("SERVER") ;
		menu.disable() ;
		var menu = new Kaemu._popupMenu("PATH") ;
		menu.disable() ;
		var menu = new Kaemu._popupMenu("RENDERER") ;
		menu.disable() ;
	} else {
		var menu = new Kaemu._popupMenu("SERVER") ;
		menu.enable() ;
		var menu = new Kaemu._popupMenu("PATH") ;
		menu.enable() ;
		var menu = new Kaemu._popupMenu("RENDERER") ;
		menu.enable() ;
	}
}
function setPlayingSong(o, StartPlaying) {
    if(selectedItem != o || StartPlaying != playing) {
        if (selectedItem != null) {
            var elem = document.getElementById("Header_" + selectedItem.id);
            if(elem != null)
            {
	            removeClass(elem,"play") ;
	        }
        }
        if (StartPlaying == true && o != null) {
            var elem = document.getElementById("Header_" + o.id);
            if(elem != null)
            {
               addClass(elem,"play") ;
            }
        }
        selectedItem = o ;
        playing = StartPlaying ;
    }
}

function RefreshPlayingText(topLine, line1, line2, line3, title) {
	
	var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
	NOWPLAYING_TOPLINE.innerHTML = topLine ;
	var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
	NOWPLAYING_LINE1.innerHTML = line1 ;
	var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
	NOWPLAYING_LINE2.innerHTML = line2 ;
	var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
	NOWPLAYING_LINE3.innerHTML = line3 ;
	document.title = title;
}

function locateInBrowser(t) {
	var tr = findBrowserSong(t) ;
	if (tr) {
		setPlayingSong(tr, playing) ;
	}
}

function findBrowserSong(t) {
	var tr = getBrowserFirstSong() ;
	var start = new Date() ;
	if (tr) {
		do {
			if (tr.getAttribute("itemURL") == t) {
				return tr;
			}
			var now = new Date() ;
			if (now.getTime() - start.getTime() > max_waiting_time) {
				break ;
			}
		} while (tr = tr.nextSibling) ;
	}
	return null ;
}

function findBrowserSongById(id) {
	var tr = getBrowserFirstSong() ;
	var start = new Date() ;
	if (tr) {
		do {
			if (tr.getAttribute("type")=="item" && tr.firstChild.getAttribute("id") == id) {
				return tr ;
			}
			var now = new Date() ;
			if (now.getTime() - start.getTime() > max_waiting_time) {
				break ;
			}
		} while (tr = tr.nextSibling) ;
	}
	return null ;
}
function getSiblingSong(tr) {
	while (tr = tr.nextSibling) {
	    if (tr != null) {
		    if (tr.getAttribute("type") == "item") {
			    
			    return tr ;
		    }
		}
	}
	return null ;
}
function getBrowserFirstSong() {
	var div_browser = document.getElementById("BROWSER") ;
	try
	{
	    if (	div_browser 
		    && div_browser.firstChild 
		    && div_browser.firstChild.firstChild ) {
		    tr = div_browser.firstChild.firstChild;
		    if (tr.getAttribute("type")=="item") {
			    return tr ;
		    } else {
			    return getSiblingSong(tr) ;
		    }
	    } else {
		    return null ;
	    }
	}
	catch(e)
	{
	    return null;
	}
}

function updateStatus() {
	if (getRenderer()!="") {
 		req_getvolume.load(_url_command+"?cmd=getvolume&renderer="+getRenderer()) ;
 		req_status.load(_url_command+"?cmd=status&renderer="+getRenderer()) ;
	}
	else
	{
		setButtonPlay("") ;
		setPlayingSong(selectedItem, false);
		RefreshPlayingText("", "", "", "", _DEFAULT_TITLE);
	}
}
function updateDevices() {
	req_list.load(_url_command+"?cmd=list") ;
}


function startTimers() {
	updateStatusTimer = setInterval("updateStatus()", 4000);
	updateTimeDisplayTimer = setInterval("updateTimeDisplay()", 1000) ;
	updateDevicesTimer = setInterval("updateDevices()", 8000) ;
}
function stopTimers() {
	clearInterval(updateStatusTimer) ;
	clearInterval(updateTimeDisplayTimer) ;
	clearInterval(updateDevicesTimer) ;
}
function getVolumePos(v) {
	var p = Math.round(20 - 4*((Math.log(100/v)*Math.LOG10E)/(Math.log(2)*Math.LOG10E))) ;
	if (p==0 && v>0) {
		return 1 ;
	}
	return p ;
}
function getVolumeValue(pos) {
	if (pos>0) {
		return Math.round(100/(Math.pow(2,(20-pos)/4))) ;
	} else {
		return 0 ;
	}
}

function DisplayError(text,type) {
	if(type==0)
	{
		startUpdateBrowseTimer();
		var div = document.getElementById("BROWSER") ;
		div.innerHTML = "<table id=\"ERROR_TABLE\" ><tr><td><h1>" + text + "</h1></td></tr></table>" ;
		
				
	}else
	{
		clearInterval(updateStatusTimer) ;
		updateStatusTimer = setInterval("updateStatus()", 4000) ;
		
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :</h1></div>" ;
		var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
		NOWPLAYING_LINE1.innerHTML = text ;

	
	}
	pending = false;
}
