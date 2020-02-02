
window.onload = function(event) {
	req_setvolume.onsuccess = function() {
	}
	req_getvolume.onsuccess = function() {
		_re_getvolume.lastIndex = 0 ;
		var data = _re_getvolume.exec(this.req.responseText) ;
		if (data && data.length) {
			volume_pos = getVolumePos(data[1]) ;
		}
	}
	req_browse.onfailed = function() {
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :</h1></div>" ;
		var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
		NOWPLAYING_LINE1.innerHTML = "<div id=\"UPNP_ERROR\">"+ _TEXT_ERROR_BROWSE+"</div>" ;
		var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
		NOWPLAYING_LINE2.innerHTML = "<div id=\"UPNP_ERROR\">"+this.req.responseText+"</div>" ;
		var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
		NOWPLAYING_LINE3.innerHTML = "" ;
	}
	req_browse.onsuccess = function() {
	
		
		stopUpdateBrowseTimer();
	  
		// switch img
		var menu = new Kaemu._popupMenu("PATH") ;
		menu.select(currentPath) ;
		var div = document.getElementById("BROWSER") ;
		div.innerHTML = "" ;
		var divhtml = "<table id=\"BROWSERTABLE\"><tbody>" ;
		var rows = this.req.responseText.split(_row_separator) ;
		var parent_path="";
		total_elements = 0 ;
		for(var i=0;i<rows.length;i++) {
			if (rows[i].length) {
				_re_browse_item.lastIndex = 0 ;
				_re_browse_container.lastIndex = 0 ;
				var data = _re_browse_item.exec(rows[i]) ;
				if (data && data.length) {  // case of an item
					divhtml += '<tr><td id="'+escape(data[2])+'" parentpath="'+escape(data[3])+'" type="item" class="parity'+(total_elements%2)+'" onclick="play(this)" idlist='+data[7]+'>'+data[6]+'</td></tr>' ;
					// parentpath won't be used
					parent_path=data[3];
					total_elements ++ ;
				} else { // case of a container
					var data = _re_browse_container.exec(rows[i]) ;
					if (data && data.length) {
						
						divhtml += '<tr><td id="'+escape(data[2])+'" type="container" class="container parity'+(total_elements%2)+'" onclick="addtopath(\''+escape(data[2])+'\',\''+escape(data[5])+'\')" idlist='+data[7]+'>'+data[5]+'</td></tr>' ;
						parent_path=data[3];
						total_elements ++ ;
					}
				}
			}
		}
		if (divhtml == "<table id=\"BROWSERTABLE\"><tbody>") {
			divhtml = "" ;
		} else {
			divhtml += "</tbody></table>" ;
		}
		div.innerHTML = divhtml ;

		
		if(total_elements>49)
		{
			need_more_browse=1;
			req_more_browse.load(_url_command+"?cmd=browse&path="+encodeURIComponent('"'+parent_path+'"')+"&server="+getServer()+"&idx="+total_elements+"&nb=25") ;
		}else
		{
			
		}
		info() ;
		if (playing == true) {
			locateInBrowser(playingId) ;
		}
	}
	req_more_browse.onfailed = function() {
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :</h1></div>" ;
		var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
		NOWPLAYING_LINE1.innerHTML = "<div id=\"UPNP_ERROR\">"+ _TEXT_ERROR_BROWSE+"</div>" ;
		var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
		NOWPLAYING_LINE2.innerHTML = "<div id=\"UPNP_ERROR\">"+this.req.responseText+"</div>" ;
		var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
		NOWPLAYING_LINE3.innerHTML = "" ;
	}
	req_more_browse.onsuccess = function() {
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :111</h1></div>" ;
		if(need_more_browse==0)
		return;
		
		
		stopUpdateBrowseTimer();
		// switch img
		var menu = new Kaemu._popupMenu("PATH") ;
		menu.select(currentPath) ;
		var div = document.getElementById("BROWSERTABLE") ;
		var rows = this.req.responseText.split(_row_separator) ;
		var parent_path="";
		var resp_total_elements=0;
	
		var divhtml = "" ;

		for(var i=0;i<rows.length;i++) {
			if (rows[i].length) {
				_re_browse_item.lastIndex = 0 ;
				_re_browse_container.lastIndex = 0 ;
				var data = _re_browse_item.exec(rows[i]) ;
				if (data && data.length) {  // case of an item
					divhtml += '<tr><td id="'+escape(data[2])+'" parentpath="'+escape(data[3])+'" type="item" class="parity'+(total_elements%2)+'" onclick="play(this)" idlist='+data[7]+'>'+data[6]+'</td></tr>' ;
					// parentpath won't be used
					parent_path=data[3];
					resp_total_elements ++ ;
					total_elements++;
				} else { // case of a container
					var data = _re_browse_container.exec(rows[i]) ;
					if (data && data.length) {
						divhtml += '<tr><td id="'+escape(data[2])+'" type="container" class="container parity'+(total_elements%2)+'" onclick="addtopath(\''+escape(data[2])+'\',\''+escape(data[5])+'\')" idlist='+data[7]+'>'+data[5]+'</td></tr>' ;
						parent_path=data[3];
						resp_total_elements ++ ;
						total_elements++;
					}
				}
			}
		}
		
		
		div.firstChild.innerHTML+= divhtml ;

		if(resp_total_elements>24)
		{
			need_more_browse++;
			req_more_browse.load(_url_command+"?cmd=browse&path="+encodeURIComponent('"'+parent_path+'"')+"&server="+getServer()+"&idx="+total_elements+"&nb=25") ;
		}else
		{
			need_more_browse=0;
		}
		info();
		if (playing == true) {
			locateInBrowser(playingId) ;
		}
		
	}

	req_prev.onsuccess = function() {
	}
	req_next.onsuccess = function() {
	}
	req_play.onsuccess = function() {
		setPlayingSong(selectedItem, !playing) ;
		pending = false ;
		timeStartDisplay = null ;
		timeTotalDisplay = null ;
		updateTimeDisplay() ;
		updateStatus() ;
	}
	req_clear.onsuccess = function() {
		var menu = new Kaemu._popupMenu("PATH") ;
		req_enqueuedir.load(_url_command+"?cmd=enqueuedir&server="+getServer()+"&renderer="+getRenderer()+"&id=%22"+encodeURIComponent(menu.get())+"%22"+"&index="+selectedItem.getAttribute("idList")+"&count="+nbMaxToEnqueue);
	}
	req_enqueuedir.onsuccess = function() {
		lock(false) ;
		req_select.load(_url_command+"?cmd=select&server="+getServer()+"&renderer="+getRenderer()+"&id=%22"+encodeURIComponent(unescape(selectedItem.getAttribute("id")))+"%22") ;
	}
	req_enqueue.onsuccess = function() {
	}
	req_select.onsuccess = function() {
		req_play.load(_url_command+"?cmd=play&renderer="+getRenderer()) ;
	}

	req_status.onsuccess = function() {
		_re_status.lastIndex = 0 ;
		var data = _re_status.exec(this.req.responseText) ;
		if (data && data.length) {
			if (!pending) {
				switch(data[1]) {
					case "PLAYING" :
						setButtonPlay("pause") ;
						setPlayingSong(selectedItem, true);
						playingId = data[4] ;
						var now = new Date() ;
						timeStartDisplay = Math.round(now.getTime()/1000) - data[2] ;
						timeTotalDisplay = data[3] ;
						break ;
					case "STOPPED" :
					case "PAUSED_PLAYBACK" :
					case "PAUSED" :
						setButtonPlay("") ;
						setPlayingSong(selectedItem, false);
						break ;
				}
				updateTimeDisplay() ;
				locateInBrowser(playingId) ;
				if (data[7] != "") {
				    RefreshPlayingText(decodehtmlentities(data[4]), 
				                        decodehtmlentities(data[5]), 
				                        decodehtmlentities(data[6]), 
				                        decodehtmlentities(data[7]), 
				                        data[7]);
				} else {
				    RefreshPlayingText(decodehtmlentities(data[4]), 
                                        decodehtmlentities(data[5]), 
                                        decodehtmlentities(data[6]), 
                                        decodehtmlentities(data[7]), 
                                        data[4]);
				}
			}
		} else {
		}
	}

	req_list.onsuccess = function() {
		var menu = new Kaemu._popupMenu("SERVER") ;
		var currentServer = menu.get() ;

		var rows = this.req.responseText.split(_row_separator) ;

		var SERVER = new Array() ;
		var RENDERER = new Array() ;
		
		var menu = new Kaemu._popupMenu("SERVER") ;
		var SERVER_n = menu.numbofitems() ;
		
		for(var i=0;i<rows.length;i++) {
			if (rows[i].length) {
				_re_list.lastIndex = 0 ;
				var data = _re_list.exec(rows[i]) ;
				if (data && data.length) {
					eval(data[2]).push(data[1]) ; // push in SERVER or RENDERER arrays
					var menu = new Kaemu._popupMenu(data[2]) ;
					if (!menu.find(data[1])) {
						menu.append(data[3],data[1]) ;
					}
				}
			}
		}
		var old_server = getServer() ;
		var menu = new Kaemu._popupMenu("SERVER") ;
		for(var i=0;i<menu.numbofitems();i++) {
			if (!in_array(menu.getvalue(i), SERVER)) {
				menu.removeOption(menu.getvalue(i)) ;
			}
		}
		if (old_server=="" || (SERVER_n==0 && menu.numbofitems()>0) || !in_array(old_server, SERVER)) {
			changeserver() ;
		}

		var old_renderer = getRenderer() ;
		var menu = new Kaemu._popupMenu("RENDERER") ;
		for(var i=0;i<menu.numbofitems();i++) {
			if (!in_array(menu.getvalue(i), RENDERER)) {
				menu.removeOption(menu.getvalue(i)) ;
			}
		}
		updateStatus();
/*		if (old_renderer!="" && !in_array(old_renderer, RENDERER)) {
			if (confirm(sreplace(_TEXT_RENN,old_renderer,menu.get()))) {
			} else {
			}
		}*/
	}
	updateDevices() ;
	updateTimeDisplay() ;
	startTimers() ;
}
function updateTimeDisplay() {
	var TIME = document.getElementById("TIME") ;
	if (!playing || timeStartDisplay == null || timeTotalDisplay == null) {
		TIME.innerHTML = "" ;
	} else {
		var now = new Date() ;
		var timeElapsed = Math.round(now.getTime()/1000) - timeStartDisplay;
		var timeRemain = timeTotalDisplay - timeElapsed;
		if(timeRemain > 0)
		{
		    TIME.innerHTML = smartTime(timeElapsed) + " / " + smartTime(timeTotalDisplay);
		}
		else if (timeTotalDisplay > 0  &&  timeElapsed > timeTotalDisplay)
		{
		    TIME.innerHTML = smartTime(timeTotalDisplay);
		}
		else
		{
		    TIME.innerHTML = smartTime(timeElapsed) ;
		}
	}
}
function vol_plus()
{
        volume_pos = volume_pos + 2;
	if (volume_pos > 20)
	  volume_pos = 20;

	if (getRenderer()) {
		req_setvolume.load(_url_command+"?cmd=setvolume&renderer="+getRenderer()+"&vol="+getVolumeValue(volume_pos)) ;
	}
}
function vol_minus()
{
        volume_pos = volume_pos - 2;
	if (volume_pos < 2)
	  volume_pos = 2;
	if (getRenderer()) {
		req_setvolume.load(_url_command+"?cmd=setvolume&renderer="+getRenderer()+"&vol="+getVolumeValue(volume_pos)) ;
	}
}

function setButtonPlay(c) {
  if (document.getElementById("PLAY").className != c) {
	document.getElementById("PLAY").className = c ;
	if (c == "pause")
	{
	  document.getElementById("PLAY_PAUSE").src = "res/remotectrl.pause_m.png" ;
	}
	else
	{
	  document.getElementById("PLAY_PAUSE").src = "res/remotectrl.play_m.png" ;
	}
  }
}
