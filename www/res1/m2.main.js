var ListFailedCount;

window.onload = function(event) {
    ListFailedCount = 0;
    startPages();
    req_setvolume.onsuccess = function() {
        PageSetVolume(parseInt(volume_pos/2));
	}
	req_getvolume.onsuccess = function() {
		_re_getvolume.lastIndex = 0 ;
		var data = _re_getvolume.exec(this.req.responseText) ;
		if (data && data.length) {
			volume_pos = getVolumePos(data[1]) ;
			PageSetVolume(parseInt(volume_pos/2));
		}
	}
	
	req_browse.onfailed = function() {
	    showPageError("Error");
	}

	req_browse.onsuccess = function() {
	    var ITEM = new Array() ;
	    var CONTAINER = new Array() ;
		try
		{
		    var rows = this.req.responseText.split(_row_separator) ;
    		
		    total_elements = 0;
    		
		    for(var i=0;i<rows.length;i++) {
			    if (rows[i].length) {
				    _re_browse_item.lastIndex = 0 ;
				    _re_browse_container.lastIndex = 0 ;
				    var data = _re_browse_item.exec(rows[i]) ;

				    if (data && data.length) {  // case of an item
				        var Id = new ItemIdentifier();
				        Id.ID = escape(data[2]);
				        Id.ParentID = escape(data[3]);
				        Id.MediaURL = escape(data[5]);
				        Id.Name = data[6];
				        Id.Index = escape(data[7]);
					    ITEM.push(Id) ; // push in ITEM array
					    total_elements ++ ;
				    } else { // case of a container
					    var data = _re_browse_container.exec(rows[i]) ;
					    if (data && data.length) {
				            var Id = new FolderIdentifier();
				            Id.ID = escape(data[2]);
				            Id.ParentID = escape(data[3]);
				            Id.Name = data[5];
				            Id.Index = escape(data[6]);
					        CONTAINER.push(Id) ; // push in CONTAINER array
					        total_elements ++ ;
					    }
				    }
			    }
		    }
		    

		}
		catch(e)
		{
		}

		PageSetBrowsedFolderItemView(CONTAINER, ITEM);
	}

	req_prev.onsuccess = function() {
	}
	req_next.onsuccess = function() {
	}
	req_play.onsuccess = function() {
		pending = false ;
		timeStartDisplay = null ;
		timeTotalDisplay = null ;
		updateTimeDisplay() ;
	    updateStatusTimer = setTimeout("onUpdateStatus()", 4000) ;
	}
	req_clear.onsuccess = function() {
	    req_enqueuedir.load(_url_command+"?cmd=enqueuedir&server="+getServer()+"&renderer="+getRenderer()+"&id=%22"+encodeURIComponent(getCurrentBrowsedDirectory())+"%22"+"&index="+getCurrentSelectedItemIndex()+"&count="+nbMaxToEnqueue);
	}
	req_enqueuedir.onsuccess = function() {
        req_select.load(_url_command+"?cmd=select&server="+getServer()+"&renderer="+getRenderer()+"&id=%22"+encodeURIComponent(unescape(getCurrentSelectedItem()))+"%22") ;
	}
	req_enqueue.onsuccess = function() {
	}
	req_select.onsuccess = function() {
	    req_play.load(_url_command+"?cmd=play&renderer="+getRenderer()) ;
	}

	req_status.onsuccess = function() {
        _re_status.lastIndex = 0 ;
        var data = _re_status.exec(this.req.responseText) ;
        if (data && data.length > 4) {
            //
	        if (!pending) {
		        switch(data[1]) {
			        case "PLAYING" :
				        PageSetPlay(true) ;
				        var now = new Date() ;
				        timeStartDisplay = Math.round(now.getTime()/1000) - data[2] ;
				        timeTotalDisplay = data[3] ;
				        break ;
			        case "STOPPED" :
			        case "PAUSED_PLAYBACK" :
			        case "PAUSED" :
				        PageSetPlay(false) ;
				        break ;
		        }
		        updateTimeDisplay() ;
                if(data && data.length >= 8 && data[7])
                {
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
	        }
        } else {
        }
	}

	req_list.onsuccess = function() {
		var rows = this.req.responseText.split(_row_separator) ;

		var SERVER = new Array() ;
		var RENDERER = new Array() ;
	        ListFailedCount = 0;
		
		for(var i=0;i<rows.length;i++) {
			if (rows[i].length) {
				_re_list.lastIndex = 0 ;
				var data = _re_list.exec(rows[i]) ;
				if (data && data.length) {
				    var Id = new Identifier();
				    Id.ID = data[1];
				    Id.Name = data[3];
					eval(data[2]).push(Id) ; // push in SERVER or RENDERER arrays
				}
			}
		}
		
		PageSetServers(SERVER);
		PageSetRenderers(RENDERER);
	}

        req_list.onfailed = function() {
	     ListFailedCount += 1;
             if(ListFailedCount > 3)
	     {
                  parent.historyframe.location="m1.page1.html";
                  ListFailedCount = 0;
	     }
	}
	updateDevices() ;
	updateTimeDisplay() ;
	startTimers() ;
}

function onUpdateTimeDisplay()
{
	updateTimeDisplayTimer = setTimeout("onUpdateTimeDisplay()", 1000) ;
    updateTimeDisplay();
}


function RequestPlayThis(item, renderer)
{
	req_clear.load(_url_command+"?cmd=clear&renderer="+renderer) ;
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

function vol_plus()
{
    volume_pos = volume_pos + 2;
	if (volume_pos > 20)
	  volume_pos = 20;
	if (volume_pos < 2)
	  volume_pos = 2;
	  
	if (getRenderer()) {
		req_setvolume.load(_url_command+"?cmd=setvolume&renderer="+getRenderer()+"&vol="+getVolumeValue(volume_pos)) ;
	}
}
function vol_minus()
{
    volume_pos = volume_pos - 2;
	if (volume_pos < 2)
	  volume_pos = 2;
	if (volume_pos > 20)
	  volume_pos = 20;

	if (getRenderer()) {
		req_setvolume.load(_url_command+"?cmd=setvolume&renderer="+getRenderer()+"&vol="+getVolumeValue(volume_pos)) ;
	}
}

function BrowseTo(path,server) {
	if (server && server != "") {
		req_browse.load(_url_command+'?cmd=browse&path=\"' + path + '\"&server='+server) ;
	}
}

function RefreshPlayingText(topLine, line1, line2, line3, title) {
    PageSetNowPlaying(topLine, line1, line2, line3);
    try
    {
	document.title = title;
	}
	catch(e)
	{
	}
}

function onUpdateStatus()
{
	updateStatusTimer = setTimeout("onUpdateStatus()", 4000) ;
	updateStatus();
}

function updateStatus() {
	if (getRenderer()!=null && getRenderer()!="" && CurrentPage == 4) {
		req_status.load(_url_command+"?cmd=status&renderer="+getRenderer()) ;
		req_getvolume.load(_url_command+"?cmd=getvolume&renderer="+getRenderer()) ;
	}
	else
	{
		PageSetPlay(false) ;
		RefreshPlayingText("", "", "", "", _DEFAULT_TITLE);
	}
}

function onUpdateDevices()
{
	updateDevicesTimer = setTimeout("onUpdateDevices()", 8000) ;
    updateDevices();
}

function updateDevices() {
	req_list.load(_url_command+"?cmd=list") ;
}

function startTimers() {
	updateStatusTimer = setTimeout("onUpdateStatus()", 4000) ;
	updateTimeDisplayTimer = setTimeout("onUpdateTimeDisplay()", 1000) ;
	updateDevicesTimer = setTimeout("onUpdateDevices()", 8000) ;
}
function stopTimers() {
	clearTimeout(updateStatusTimer) ;
	clearTimeout(updateTimeDisplayTimer) ;
	clearTimeout(updateDevicesTimer) ;
}

