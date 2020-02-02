var is_IE_6 = document.all ;
var current_table="";
var KEY;
EFFECT_KEY="system/config/ffplayer/audio_effect"
var config_effect = false;

window.onload = function(event) {
	volume = new Slider(document.getElementById("VOLUME"), document.getElementById("volume_value"),"vertical") ;
	volume.setMaximum(20);
	volume.setValue(20);
	if (!is_IE_6) { // change img for handle if not IE6
		var handle = getElementsByClassName(document,"div","handle") ;
		if (handle[0]) {
			handle[0].style.backgroundImage = "url('res/volume.handle.png')" ;
		}
	}
	volume.onRelease = function() {
		if (getRenderer()) {
			req_setvolume.load(_url_command+"?cmd=setvolume&renderer="+getRenderer()+"&vol="+getVolumeValue(this.getValue())) ;
		}
	}
	req_setvolume.onfailed = function() {
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :</h1></div>" ;
		var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
		NOWPLAYING_LINE1.innerHTML = "<div id=\"UPNP_ERROR\">"+ _TEXT_ERROR_SETVOLUME+"</div>" ;
		var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
		NOWPLAYING_LINE2.innerHTML = "<div id=\"UPNP_ERROR\">"+this.req.responseText+"</div>" ;
		var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
		NOWPLAYING_LINE3.innerHTML = "" ;
	}
	req_setvolume.onsuccess = function() {
	}
	
	req_getvolume.onfailed = function() {
		updateDevices();
	}
	req_getvolume.onsuccess = function() {
		_re_getvolume.lastIndex = 0 ;
		var data = _re_getvolume.exec(this.req.responseText) ;
		if (data && data.length) {
			volume.setValue(getVolumePos(data[1])) ;
		}
	}
	req_browse.onfailed = function() {
		startUpdateBrowseTimer() ;
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
		var last_index=0;
		var menu = new Kaemu._popupMenu("PATH") ;
		menu.select(currentPath) ;
		var div = document.getElementById("BROWSER") ;
		div.innerHTML = "" ;
		var divhtml = "<div id=\"BROWSERTABLE\">" ;
		var rows = this.req.responseText.split(_row_separator) ;
		var parent_path="";
		current_table="";
		total_elements = 0 ;
		for(var i=0;i<rows.length;i++) {
			if (rows[i].length) {
				_re_browse_item.lastIndex = 0 ;
				_re_browse_container.lastIndex = 0 ;
				var data = _re_browse_item.exec(rows[i]) ;
				if (data && data.length) {  // case of an item
					last_index=data[7];
					current_table += '<div id="'+escape(data[2])+'" class="browserline parity'+(total_elements%2)+'" type="item" onclick="play(this)" itemURL="'+data[6]+'" parentpath="'+escape(data[3])+'" idlist='+data[7]+'><div id="Header_'+escape(data[2])+'" class="itemPlayHeader""></div><div class="item"">'+data[6]+'</div></div>' ;
					// parentpath won't be used
					parent_path=data[3];
					
					total_elements ++ ;
				} else { // case of a container
					var data = _re_browse_container.exec(rows[i]) ;
					if (data && data.length) {
						last_index=data[6];
						current_table += '<div id="'+escape(data[2])+'" class="browserline parity'+(total_elements%2)+'" type="container" folderName="'+escape(data[5])+'" idlist='+data[6]+'><div class="containerPlay" onclick="playfolder(this.parentNode)"></div><div class="containerIcon" onclick="browseFolder(this.parentNode)"></div><div class="container" onclick="browseFolder(this.parentNode)">'+data[5]+'</div></div>' ;
						parent_path=data[3];
						
						total_elements ++ ;
					}
				}
			}
		}
		divhtml +=current_table;
		if (divhtml == "<div id=\"BROWSERTABLE\">") {
			divhtml = "" ;
		} else {
			divhtml += "</div>" ;
		}
		div.innerHTML = divhtml ;

		
		if(total_elements>0)
		{
			need_more_browse=1;
			last_index++;
			req_more_browse.load(_url_command+"?cmd=browse&path="+encodeURIComponent('"'+parent_path+'"')+"&server="+getServer()+"&idx="+last_index+"&nb=50") ;
		}else
		{
			
		}
		info() ;
		if (playing == true) {
			locateInBrowser(playingId) ;
		}
	}
	req_more_browse.onfailed = function() {
			startUpdateBrowseTimer() ;
			var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
			NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured req_more_browse :</h1></div>" ;
			var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
			NOWPLAYING_LINE1.innerHTML = "<div id=\"UPNP_ERROR\">"+ _TEXT_ERROR_BROWSE+"</div>" ;
			var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
			NOWPLAYING_LINE2.innerHTML = "<div id=\"UPNP_ERROR\">"+this.req.responseText+"</div>" ;
			var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
			NOWPLAYING_LINE3.innerHTML = "" ;
	}
	req_more_browse.onsuccess = function() {
		if(need_more_browse==0)
			return;
		
		stopUpdateBrowseTimer();
		// switch img
		
		var menu = new Kaemu._popupMenu("PATH") ;
		menu.select(currentPath) ;
		var div = document.getElementById("BROWSER") ;
		var rows = this.req.responseText.split(_row_separator) ;
		var parent_path="";
		var resp_total_elements=0;
		var last_index=0;
		var divhtml = "<div id=\"BROWSERTABLE\">" ;
		
		for(var i=0;i<rows.length;i++) {
			if (rows[i].length) {
				_re_browse_item.lastIndex = 0 ;
				_re_browse_container.lastIndex = 0 ;
				var data = _re_browse_item.exec(rows[i]) ;
				
				if (data && data.length) {  // case of an item
					current_table += '<div id="'+escape(data[2])+'" class="browserline parity'+(total_elements%2)+'" type="item" onclick="play(this)" itemURL="'+data[6]+'" parentpath="'+escape(data[3])+'" idlist='+data[7]+'><div id="Header_'+escape(data[2])+'" class="itemPlayHeader""></div><div class="item"">'+data[6]+'</div></div>' ;
					// parentpath won't be used
					parent_path=data[3];
					last_index=data[7];
					resp_total_elements ++ ;
					total_elements++;
				} else { // case of a container
					var data = _re_browse_container.exec(rows[i]) ;
					if (data && data.length) {
						current_table += '<div id="'+escape(data[2])+'" class="browserline parity'+(total_elements%2)+'" type="container" folderName="'+escape(data[5])+'" idlist='+data[6]+'><div class="containerPlay" onclick="playfolder(this.parentNode)"></div><div class="containerIcon" onclick="browseFolder(this.parentNode)"></div><div class="container" onclick="browseFolder(this.parentNode)">'+data[5]+'</div></div>' ;
						resp_total_elements ++ ;
						last_index=data[6];
						parent_path=data[3];
						total_elements++;
					}
				}
			}
		}
		divhtml +=current_table;
		divhtml += "</div>" ;
		div.innerHTML = divhtml ;	
		if(resp_total_elements>0)
		{
			need_more_browse++;
			last_index++;
			req_more_browse.load(_url_command+"?cmd=browse&path="+encodeURIComponent('"'+parent_path+'"')+"&server="+getServer()+"&idx="+last_index+"&nb=50") ;
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
		timeStartDisplay = null ;
		timeTotalDisplay = null ;
		updateTimeDisplay() ;
		updateStatus() ;
	}
	req_prev.onfailed = function() {
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :</h1></div>" ;
		var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
		NOWPLAYING_LINE1.innerHTML = "<div id=\"UPNP_ERROR\">"+ _TEXT_ERROR_PREV+"</div>" ;
		var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
		NOWPLAYING_LINE2.innerHTML = "<div id=\"UPNP_ERROR\">"+this.req.responseText+"</div>" ;
		var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
		NOWPLAYING_LINE3.innerHTML = "" ;
	}
	req_next.onsuccess = function() {
		timeStartDisplay = null ;
		timeTotalDisplay = null ;
		updateTimeDisplay() ;
		updateStatus() ;
	}
	req_next.onfailed = function() {
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :</h1></div>" ;
		var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
		NOWPLAYING_LINE1.innerHTML = "<div id=\"UPNP_ERROR\">"+ _TEXT_ERROR_NEXT+"</div>" ;
		var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
		NOWPLAYING_LINE2.innerHTML = "<div id=\"UPNP_ERROR\"> "+this.req.responseText+"</div>" ;
		var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
		NOWPLAYING_LINE3.innerHTML = "" ;
	}
	req_play.onsuccess = function() {
		lock(false) ;
		setPlayingSong(selectedItem, !playing) ;
		pending = false ;
		timeStartDisplay = null ;
		timeTotalDisplay = null ;
		updateTimeDisplay() ;
		updateStatus() ;
	}
	req_play.onfailed = function() {
		lock(false) ;
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :</h1></div>" ;
		var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
		NOWPLAYING_LINE2.innerHTML = "<div id=\"UPNP_ERROR\">"+ _TEXT_ERROR_PLAY+"</div>" ;
		var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
		NOWPLAYING_LINE3.innerHTML = "<div id=\"UPNP_ERROR\"> error :"+this.req.responseText+"</div>" ;
		

	}
	
	req_clear_folder.onsuccess = function() {
		var menu = new Kaemu._popupMenu("PATH") ;
		req_set_context.load(_url_command+"?cmd=set_context&server="+getServer()+"&renderer="+getRenderer()+"&id=%22"+selectedItem.id+"%22");
	}
	req_clear_folder.onfailed = function() {
		
		lock(false) ;
	}
	req_clear.onsuccess = function() {
		var menu = new Kaemu._popupMenu("PATH") ;
		req_set_context.load(_url_command+"?cmd=set_context&server="+getServer()+"&renderer="+getRenderer()+"&id=%22"+encodeURIComponent(menu.get())+"%22"+"&index="+selectedItem.getAttribute("idList"));
	}
	req_clear.onfailed = function() {
		
		lock(false) ;
	}
	req_set_context.onsuccess = function() {
		req_play.load(_url_command+"?cmd=play&renderer="+getRenderer()) ;
	}
	req_set_context.onfailed = function() {
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :</h1></div>" ;
		var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
		NOWPLAYING_LINE1.innerHTML = "<div id=\"UPNP_ERROR\">"+ _TEXT_ERROR_SET_CONTEXT+"</div>" ;
		var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
		NOWPLAYING_LINE2.innerHTML = "<div id=\"UPNP_ERROR\"> error :"+this.req.responseText+"</div>" ;
		var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
		NOWPLAYING_LINE3.innerHTML = "" ;
		lock(false) 
	}
	
	req_enqueuedir.onsuccess = function() {
		lock(false);
		req_select.load(_url_command+"?cmd=select&server="+getServer()+"&renderer="+getRenderer()+"&id=%22"+encodeURIComponent(unescape(selectedItem.getAttribute("id")))+"%22") ;
	}
	req_enqueuedir.onfailed = function() {
		var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
		NOWPLAYING_TOPLINE.innerHTML = "<div id=\"UPNP_ERROR\"> <h1>An error occured :</h1></div>" ;
		var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
		NOWPLAYING_LINE1.innerHTML = "<div id=\"UPNP_ERROR\">"+ _TEXT_ERROR_BROWSE+"</div>" ;
		var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
		NOWPLAYING_LINE2.innerHTML = "<div id=\"UPNP_ERROR\"> error :"+this.req.responseText+"</div>" ;
		var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
		NOWPLAYING_LINE3.innerHTML = "" ;
	}
	req_enqueue.onsuccess = function() {
	}
	req_select.onsuccess = function() {
		req_play.load(_url_command+"?cmd=play&renderer="+getRenderer()) ;
	}
	req_status.onfailed = function()
	{
		updateDevices();
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
	}

	if(config_effect != false) {
		/* kdb effect request */
		req_effect.onsuccess = function() {
			var rows = this.req.responseText.split(_row_separator);
	
			KEY = new Object();
			var data;
			for(var i = 0; i < rows.length; i++) {
				if (rows[i].length) {
					_re_effect.lastIndex = 0 ;
					data = _re_effect.exec(rows[i]) ;
					if (data && data.length) {
						KEY[data[1]] = data[2];
					}
				}
			}
	
			var effect = KEY[EFFECT_KEY];
			if(effect == '4') {
				karaoking =true;
				setButtonKaraoke("pause") ;
			}
			else {
				karaoking =false;
				setButtonKaraoke("active") ;
			}
			pending = false;
		}
		req_effect.onfailed = function() {
			pending = false;
		}
		update_effect();
	}


	updateDevices() ;
	updateTimeDisplay() ;
	startTimers() ;
}

function updateTimeDisplay() {
	var TIME = document.getElementById("TIME") ;
	var TIMEREMAIN = document.getElementById("TIMEREMAIN") ;
	var TIMETOTAL = document.getElementById("TIMETOTAL") ;
	if (!playing || timeStartDisplay == null || timeTotalDisplay == null) {
		TIME.innerHTML = "" ;
		TIMEREMAIN.innerHTML = "" ;
		TIMETOTAL.innerHTML = "" ;
	} else {
		var now = new Date() ;
		var timeElapsed = Math.round(now.getTime()/1000) - timeStartDisplay;
		var timeRemain = timeTotalDisplay - timeElapsed;
		if (timeRemain > 0)
		{
		    TIME.innerHTML = smartTime(timeElapsed) ;
		    TIMEREMAIN.innerHTML = smartTime(timeRemain) ;
		    TIMETOTAL.innerHTML = smartTime(timeTotalDisplay) ;
		}
		else if (timeTotalDisplay > 0  &&  timeElapsed > timeTotalDisplay)
		{
		    TIME.innerHTML = smartTime(timeTotalDisplay) ;
		    TIMEREMAIN.innerHTML = smartTime(0) ;
		    TIMETOTAL.innerHTML = smartTime(timeTotalDisplay) ;
		}
		else
		{
		    TIME.innerHTML = smartTime(timeElapsed) ;
		    TIMEREMAIN.innerHTML = smartTime(0) ;
		    TIMETOTAL.innerHTML = smartTime(timeTotalDisplay) ;
		}
	}
}
function setButtonPlay(c) {
  if (document.getElementById("PLAY").className != c) {
	document.getElementById("PLAY").className = c ;
  }
}

function setButtonKaraoke(c) {
  if (document.getElementById("KARAOKE").className != c) {
	document.getElementById("KARAOKE").className = c ;
  }
}