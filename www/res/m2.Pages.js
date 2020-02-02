// JScript File

var maincontent;// = document.getElementById("maincontent");
var CurrentPage;
//var PreviousPage;
var CurrentTimeHTML = "";
var CurrentBrowsingHTML = "";
var CurrentTopLineHTML = "";
var CurrentLine1HTML = "";
var CurrentLine2HTML = "";
var CurrentLine3HTML = "";
var CurrentServersList;
var CurrentlySelectedServer;
var CurrentRenderersList;
var CurrentlySelectedRenderer;
var CurrentlyBrowsedFolder;
var CurrentlyBrowsedParentsFolderList;
var CurrentlyBrowsedFolderViewList;
var CurrentlySelectedItem;
var CurrentlySelectedItemIndex;
var CurrentlyBrowsedItemViewList;
var IsCurrentlyPlaying;
var CurrentVolume;

function Identifier()
{
    var ID;
    var Name;
}

function FolderIdentifier()
{
    var ID;
    var Name;
    var ParentID;
    var Index;
}

function ItemIdentifier()
{
    var ID;
    var Name;
    var ParentID;
    var Index;
    var MediaURL;
}

function IsServersListEquivalent(DestList)
{
    if(DestList.length != CurrentServersList.length)return false;
    for(var a = 0 ; a < DestList.length ; a++)
    {
        if(DestList[a].ID != CurrentServersList[a].ID || DestList[a].Name != CurrentServersList[a].Name)
        {
            return false;
        }
    }
    return true;
}

function IsRenderersListEquivalent(DestList)
{
    if(DestList.length != CurrentRenderersList.length)return false;
    for(var a = 0 ; a < DestList.length ; a++)
    {
        if(DestList[a].ID != CurrentRenderersList[a].ID || DestList[a].Name != CurrentRenderersList[a].Name)
        {
            return false;
        }
    }
    return true;
}

function IsFoldersListEquivalent(DestList)
{
    if(DestList.length != CurrentlyBrowsedFolderViewList.length)return false;
    for(var a = 0 ; a < DestList.length ; a++)
    {
        if(DestList[a].ID != CurrentlyBrowsedFolderViewList[a].ID 
            || DestList[a].Name != CurrentlyBrowsedFolderViewList[a].Name
            || DestList[a].ParentID != CurrentlyBrowsedFolderViewList[a].ParentID
            || DestList[a].Index != CurrentlyBrowsedFolderViewList[a].Index)
        {
            return false;
        }
    }
    return true;
}

function IsItemsListEquivalent(DestList)
{
    if(DestList.length != CurrentlyBrowsedItemViewList.length)return false;
    for(var a = 0 ; a < DestList.length ; a++)
    {
        if(DestList[a].ID != CurrentlyBrowsedItemViewList[a].ID 
            || DestList[a].Name != CurrentlyBrowsedItemViewList[a].Name
            || DestList[a].ParentID != CurrentlyBrowsedItemViewList[a].ParentID
            || DestList[a].MediaURL != CurrentlyBrowsedItemViewList[a].MediaURL
            || DestList[a].Index != CurrentlyBrowsedItemViewList[a].Index)
        {
            return false;
        }
    }
    return true;
}

function alertmsg(e){
//alert("You pressed the keyboard inside the document : !" + e)
}


function startPages()
{
    try
    {
        document.onkeypress=alertmsg
    }
    catch(e)
    {
    }
    
    CurrentPage = 1;
    CurrentlyBrowsedParentsFolderList = new Array();
    CurrentServersList = new Array();
    CurrentRenderersList = new Array();
    CurrentlyBrowsedFolderViewList = new Array();
    CurrentlyBrowsedItemViewList = new Array();
    maincontent = document.getElementById("maincontent");
    PreviouslyBrowsedFolder = "0";
    parent.historyframe.location="m2.page1.html";
}

function showPageError(text)
{
    maincontent.innerHTML = '<div id="BORDER"><input id="BUTTON" type="button" value="Retour" onclick="history.go(-1)"/></div>' +
                            '<div id="ERROR_TEXT" >' + text + '</div>';
    setTimeout("ReturnToPage(" + CurrentPage + ")", 2000) ;
}

function ReturnToPage(ID)
{
    eval("showPage" + ID + "()");
}

function showPage1()
{
    if(!maincontent)return;
    CurrentVolume = 5;
    CurrentPage = 1;
//    PreviousPage = 1;
    maincontent.innerHTML = '<div id="servers">' +
                                '<div id="SERVER">' +
                                '</div>' +
                            '</div>';
   PageRefreshServersRenderers();
}

function showPage2()
{
    CurrentPage = 2;
//    PreviousPage = 2;
    maincontent.innerHTML = '<div id="BORDER"><input id="BUTTON" type="button" value="Retour" onclick="history.go(-1)"/></div>' +
                            '<div id="BROWSER">' +
                            '<div id="IMGSEARCH"></div>' +
                            '</div>';
    var Button = document.getElementById("BUTTON");
    Button.focus();
    //PageRefreshBrowsedFolderItemView();
}

/*function backToPreviousFolder()
{
    if(CurrentlyBrowsedParentsFolderList.length > 0)
    {
        PageBrowseToFolder(CurrentlyBrowsedParentsFolderList.pop());
    }
    else
    {
        parent.historyframe.location="javascript:parent.mainframe.showPage1();";
    }
}*/

function showPage3()
{
    // if comming from the player page, go back again
    if(CurrentPage == 4)
    {
        history.go(-1);
        return;
    }
    CurrentPage = 3;
    maincontent.innerHTML = '<div id="BORDER"><input id="BUTTON" type="button" value="Retour" onclick="history.go(-1)"/></div>' +
                            '<div id="RENDERER">' +
                            '</div>';
    PageRefreshBrowsedRendererView();
}

function showPage4()
{
    CurrentPage = 4;
    updateStatus();
    
    maincontent.innerHTML = '<div id="BORDER">' +
                            '<input id="BUTTON" type="button" value="Retour" onclick="history.go(-1)"/>' +
                            '</div>' +
                            '<div id="LOGO"></div>' +
                            '<div id="NOWPLAYING_TOPLINE">' +
                            '</div>' +
                            '<div id="NOWPLAYING_LINE1">' +
                            '</div>' +
                            '<div id="NOWPLAYING_LINE2">' +
                            '</div>' +
                            '<div id="NOWPLAYING_LINE3">' +
                            '</div>' +
                            '<div id="TIME">' +
                            '</div>' +
                            '<div id="BUTTONSBLOCK">' + 
                                '<a id="LINKPREV" href="javascript:prev()" onfocus="ButtonFocused(\'PREV\')" onblur="ButtonUnFocused(\'PREV\')"><div id="PREV"></div></a>' +
                                '<a id="LINKPLAY_PAUSE" href="javascript:ClickOnPlayPause()" onfocus="ButtonFocused(\'PLAY_PAUSE\')" onblur="ButtonUnFocused(\'PLAY_PAUSE\')"><div id="PLAY_PAUSE"></div></a>' +
                                '<div id="BLOCKNEXT">' +
                                    '<div id="UPPERBLOCKNEXT"></div>' +
                                    '<a id="LINKNEXT" href="javascript:next()" onfocus="ButtonFocused(\'NEXT\')" onblur="ButtonUnFocused(\'NEXT\')"><div id="NEXT"></div></a>' +
                                '</div>' +
                                '<div id="VOLUMEBLOCK">' +
                                    '<div id="IMGVOL"></div>' +
                                    '<div id="VOLUMEBUTTONS">' +
                                        '<a id="LINKPLUS" href="javascript:vol_plus()" onfocus="ButtonFocused(\'VOL_PLUS\')" onblur="ButtonUnFocused(\'VOL_PLUS\')"><div id="VOL_PLUS"></div></a>' +
                                        '<a id="LINKMINUS" href="javascript:vol_minus()" onfocus="ButtonFocused(\'VOL_MINUS\')" onblur="ButtonUnFocused(\'VOL_MINUS\')"><div id="VOL_MINUS"></div></a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';

    var Button = document.getElementById("LINKPLAY_PAUSE");
    Button.focus();
    
    PageRefreshTime();
    PageRefreshPlay();
    PageRefreshNowPlaying();
    return;
}

function ButtonFocused(buttonName)
{
   var Button = document.getElementById(buttonName);
   Button.style.border = '1px groove Black';
}

function ButtonUnFocused(buttonName)
{
    var PrevButton = document.getElementById(buttonName);
    PrevButton.style.border = '0px solid Black';
}

/*function backFromPage4()
{
    if(PreviousPage == 2)
    {
        PageBrowseToFolder(CurrentlyBrowsedFolder);
    }
    else
    {
        parent.historyframe.location="javascript:parent.mainframe.showPage1();";
    }
}*/

function PageSetTime(timeHTML)
{
    CurrentTimeHTML = timeHTML;
    if(CurrentPage == 4)
    {
        PageRefreshTime();
    }
}

function PageRefreshTime()
{
	var TIME = document.getElementById("TIME") ;
	TIME.innerText = CurrentTimeHTML;
}

function ClickOnPlayPause() {
	if (!pending && CurrentlySelectedRenderer != "" && CurrentlySelectedServer != "")
	{
		pending = true ;
		if (IsCurrentlyPlaying == true)
		{
			req_play.load(_url_command+"?cmd=pause&renderer="+CurrentlySelectedRenderer) ;
		}
		else
		{
			req_play.load(_url_command+"?cmd=play&renderer="+getRenderer()) ;
		}
		// reset update timer
		clearTimeout(updateStatusTimer) ;
		PageSetPlay(!IsCurrentlyPlaying) ;
	}
}

function PageSetVolume(Volume)
{
    if(Volume < 1) Volume = 1;
    if(Volume > 10) Volume = 10;
    CurrentVolume = Volume;
    if(CurrentPage == 4)
    {
        PageRefreshVolume();
    }
}

function PageRefreshVolume()
{
	var Volume = document.getElementById("IMGVOL") ;
	switch(CurrentVolume)
	{
	    case 1:
	        Volume.style.backgroundPosition = "0px 0px";
            break;
	    case 2:
	        Volume.style.backgroundPosition = "-27px 0px";
            break;
	    case 3:
	        Volume.style.backgroundPosition = "-54px 0px";
            break;
	    case 4:
	        Volume.style.backgroundPosition = "-81px 0px";
            break;
	    case 5:
	        Volume.style.backgroundPosition = "-108px 0px";
            break;
	    case 6:
	        Volume.style.backgroundPosition = "0px -54px";
            break;
	    case 7:
	        Volume.style.backgroundPosition = "-27px -54px";
            break;
	    case 8:
	        Volume.style.backgroundPosition = "-54px -54px";
            break;
	    case 9:
	        Volume.style.backgroundPosition = "-81px -54px";
            break;
	    case 10:
	        Volume.style.backgroundPosition = "-108px -54px";
            break;
	}
}

function PageSetPlay(IsPlaying)
{
    if(IsCurrentlyPlaying != IsPlaying)
    {
        IsCurrentlyPlaying = IsPlaying;
        if(CurrentPage == 4)
        {
            PageRefreshPlay();
        }
    }
}

function updateTimeDisplay() {
	if (!IsCurrentlyPlaying || timeStartDisplay == null || timeTotalDisplay == null) {
		PageSetTime("") ;
	} else {
		var now = new Date() ;
		var timeElapsed = Math.round(now.getTime()/1000) - timeStartDisplay;
		var timeRemain = timeTotalDisplay - timeElapsed;
		if(timeRemain > 0)
		{
		    PageSetTime(smartTime(timeElapsed) + " / " + smartTime(timeTotalDisplay));
		}
		else if (timeTotalDisplay > 0  &&  timeElapsed > timeTotalDisplay)
		{
		    PageSetTime(smartTime(timeTotalDisplay));
		}
		else
		{
		    PageSetTime(smartTime(timeElapsed));
		}
	}
}

function PageRefreshPlay()
{
    if (IsCurrentlyPlaying == true)
    {
        document.getElementById("PLAY_PAUSE").style.backgroundPosition = "-54px -54px";
    }
    else
    {
        document.getElementById("PLAY_PAUSE").style.backgroundPosition = "-54px 0px";
    }
}

function PageSetNowPlaying(topLine, line1, line2, line3)
{
    CurrentTopLineHTML = topLine;
    CurrentLine1HTML = line1;
    CurrentLine2HTML = line2;
    CurrentLine3HTML = line3;
    if(CurrentPage == 4)
    {
        PageRefreshNowPlaying();
    }
}

function PageRefreshNowPlaying()
{
	var NOWPLAYING_TOPLINE = document.getElementById("NOWPLAYING_TOPLINE") ;
	NOWPLAYING_TOPLINE.innerHTML = CurrentTopLineHTML ;
	var NOWPLAYING_LINE1 = document.getElementById("NOWPLAYING_LINE1") ;
	NOWPLAYING_LINE1.innerHTML = CurrentLine1HTML ;
	var NOWPLAYING_LINE2 = document.getElementById("NOWPLAYING_LINE2") ;
	NOWPLAYING_LINE2.innerHTML = CurrentLine2HTML ;
	var NOWPLAYING_LINE3 = document.getElementById("NOWPLAYING_LINE3") ;
	NOWPLAYING_LINE3.innerHTML = CurrentLine3HTML ;
}

function PageSetServers(ServersList)
{
    if(CurrentlySelectedServer)
    {
        var found = false;
        for(var a = 0; a < ServersList.length ; a++)
        {
	    if(ServersList[a].ID == CurrentlySelectedServer)
	    {
	      found = true;
            }
        }
        if(!found)
	{
	    CurrentlySelectedServer = null;
            if(CurrentPage == 2)
	    {
                parent.historyframe.location="m2.page1.html";
            }
        }
    }
    if(!IsServersListEquivalent(ServersList) || ServersList.length == 0)
    {
        CurrentServersList = ServersList;
        if(CurrentPage == 1)
        {
            PageRefreshServersRenderers();
        }
    }
}

function PageSetRenderers(RenderersList)
{
    if(CurrentlySelectedRenderer)
    {
        var found = false;
        for(var a = 0; a < RenderersList.length ; a++)
        {
	    if(RenderersList[a].ID == CurrentlySelectedRenderer)
	    {
	      found = true;
            }
        }
        if(!found)
	{
	    CurrentlySelectedRenderer = null;
            if(CurrentPage == 4)
	    {
                parent.historyframe.location="m2.page1.html";
            }
        }
    }
    if(!IsRenderersListEquivalent(RenderersList) || RenderersList.length == 0)
    {
        CurrentRenderersList = RenderersList;
        if(CurrentPage == 1)
        {
            PageRefreshServersRenderers();
        }
        if(CurrentPage == 3)
        {
            PageRefreshBrowsedRendererView();
        }
    }
}

function PageRefreshServersRenderers()
{
    var CentralPage = document.getElementById("SERVER") ;
    var ServersRenderersInnerHTML = "";
    var parity = false;
    if(CurrentServersList.length == 0 && CurrentRenderersList.length == 0)
    {
        ServersRenderersInnerHTML += '(vide)';
    }
    
    for(var i=0;i<CurrentServersList.length;i++)
    {
        if(parity)
        {
            ServersRenderersInnerHTML += '<a href="javascript:PageClickedOnServer(\'' + CurrentServersList[i].ID + '\')" class="SERVERENTRY0" id="SERVER'+ i +'"><img id="FOLDERIMG" src="res/folder.gif" alt=""/> ' + CurrentServersList[i].Name + '</a>';
        }
        else
        {
            ServersRenderersInnerHTML += '<a href="javascript:PageClickedOnServer(\'' + CurrentServersList[i].ID + '\')" class="SERVERENTRY1" id="SERVER'+ i +'"><img id="FOLDERIMG" src="res/folder.gif" alt=""/> ' + CurrentServersList[i].Name + '</a>';
        }
        parity = !parity;
    }
    
    for(var j=0;j<CurrentRenderersList.length;j++)
    {
        if(parity)
        {
            ServersRenderersInnerHTML += '<a href="javascript:PageClickedOnRenderer(\'' + CurrentRenderersList[j].ID + '\')" class="SERVERENTRY0">' + CurrentRenderersList[j].Name + '</a>';
        }
        else
        {
            ServersRenderersInnerHTML += '<a href="javascript:PageClickedOnRenderer(\'' + CurrentRenderersList[j].ID + '\')" class="SERVERENTRY1">' + CurrentRenderersList[j].Name + '</a>';
        }
        parity = !parity;
    }
    
    CentralPage.innerHTML = ServersRenderersInnerHTML;
    
    var FirstEntry = document.getElementById("SERVER0");
    if(FirstEntry)
    {
        FirstEntry.focus();
    }

}

function ElemFocused(ID)
{
   var Elem = document.getElementById(ID);
   Elem.style.backgroundColor = 'Orange';
}

function ElemUnFocused(ID)
{
   var Elem = document.getElementById(ID);
   Elem.style.backgroundColor = 'White';
}

function PageClickedOnServer(ID)
{
    CurrentlySelectedServer = ID;
    CurrentlyBrowsedFolder = "0";
    CurrentlyBrowsedParentsFolderList = new Array();
    CurrentlyBrowsedFolderViewList = new Array();
    CurrentlyBrowsedItemViewList = new Array();
	parent.historyframe.location="m2.page2.html?ID=0";
}

function PageClickedOnRenderer(ID)
{
    CurrentlySelectedRenderer = ID;
    parent.historyframe.location="m2.page4.html";
}

function PageSetBrowsedFolderItemView(BrowsedFolderViewList, BrowsedItemViewList)
{
    if(!IsFoldersListEquivalent(BrowsedFolderViewList) || !IsItemsListEquivalent(BrowsedItemViewList) || (BrowsedFolderViewList.length == 0 && BrowsedItemViewList.length == 0))
    {
        CurrentlyBrowsedItemViewList = BrowsedItemViewList;
        CurrentlyBrowsedFolderViewList = BrowsedFolderViewList;
        clearTimeout(updateBrowseListTimer);
        if(CurrentPage == 2)
        {
            PageRefreshBrowsedFolderItemView();
	        updateBrowseListTimer = setTimeout("updateBrowseList()", 10000) ;
        }
    }
}

function updateBrowseList()
{
    if(CurrentPage == 2)
    {
	    updateBrowseListTimer = setTimeout("updateBrowseList()", 10000) ;
    	if (CurrentlySelectedServer != "" && CurrentlyBrowsedFolder != "")
        {
	        BrowseTo(CurrentlyBrowsedFolder, CurrentlySelectedServer) ;
        }
    }
}

function PageRefreshBrowsedFolderItemView()
{
    var CentralPage = document.getElementById("BROWSER") ;
    var BrowsedFolderItemViewInnerHTML = "";
    var parity = false;
    if(CurrentlyBrowsedFolderViewList.length == 0 && CurrentlyBrowsedItemViewList.length == 0)
    {
        BrowsedFolderItemViewInnerHTML += '(vide)';
    }
    
    for(var i=0;i<CurrentlyBrowsedFolderViewList.length;i++)
    {
        if(parity)
        {
            BrowsedFolderItemViewInnerHTML += '<a href="javascript:PageClickedOnFolder(\'' + CurrentlyBrowsedFolderViewList[i].ID + '\',\'' + CurrentlyBrowsedFolderViewList[i].ParentID + '\')" id="BROWSERENTRY0"><img id="FOLDERIMG" src="res/folder.gif" alt=""/> ' + CurrentlyBrowsedFolderViewList[i].Name + '</a>';
        }
        else
        {
            BrowsedFolderItemViewInnerHTML += '<a href="javascript:PageClickedOnFolder(\'' + CurrentlyBrowsedFolderViewList[i].ID + '\',\'' + CurrentlyBrowsedFolderViewList[i].ParentID + '\')" id="BROWSERENTRY1"><img id="FOLDERIMG" src="res/folder.gif" alt=""/> ' + CurrentlyBrowsedFolderViewList[i].Name + '</a>';
        }
        parity = !parity;
    }
    
    for(var j=0;j<CurrentlyBrowsedItemViewList.length;j++)
    {
        if(parity)
        {
            BrowsedFolderItemViewInnerHTML += '<a href="javascript:PageClickedOnItem(\'' + CurrentlyBrowsedItemViewList[j].ID + '\',' + CurrentlyBrowsedItemViewList[j].Index + ')" id="BROWSERENTRY0">' + CurrentlyBrowsedItemViewList[j].Name + '</a>';
        }
        else
        {
            BrowsedFolderItemViewInnerHTML += '<a href="javascript:PageClickedOnItem(\'' + CurrentlyBrowsedItemViewList[j].ID + '\',' + CurrentlyBrowsedItemViewList[j].Index + ')" id="BROWSERENTRY1">' + CurrentlyBrowsedItemViewList[j].Name + '</a>';
        }
        parity = !parity;
    }
    
    CentralPage.innerHTML = BrowsedFolderItemViewInnerHTML;
    
    var Button = document.getElementById("BUTTON");
    Button.focus();
}

function PageClickedOnFolder(ID, ParentID)
{
    CurrentlyBrowsedParentsFolderList.push(ParentID);
    PageBrowseToFolder(ID);
}

function PageBrowseToFolder(ID)
{
    parent.historyframe.location="m2.page2.html?ID="+ID;
}

function SetCurrentlyBrowsedFolder(ID)
{
    CurrentlyBrowsedFolder = ID;
    CurrentlyBrowsedFolderViewList = new Array();
    CurrentlyBrowsedItemViewList = new Array();
	if (CurrentlySelectedServer != "")
	{
		BrowseTo(CurrentlyBrowsedFolder, CurrentlySelectedServer) ;
	}
}

function PageClickedOnItem(ID, index)
{
    CurrentlySelectedItem = ID;
    CurrentlySelectedItemIndex = index;
    if(CurrentRenderersList.length == 1)
    {
        PageClickedOnBrowsedRenderer(CurrentRenderersList[0].ID);
    }
    else
    {
	    parent.historyframe.location="m2.page3.html";
	}
}

function PageRefreshBrowsedRendererView()
{
    var CentralPage = document.getElementById("RENDERER") ;
    var RenderersInnerHTML = "";
    var parity = false;
    for(var j=0;j<CurrentRenderersList.length;j++)
    {
        if(parity)
        {
            RenderersInnerHTML += '<a href="javascript:PageClickedOnBrowsedRenderer(\'' + CurrentRenderersList[j].ID + '\')" class="SERVERENTRY0">' + CurrentRenderersList[j].Name + '</a>';
        }
        else
        {
            RenderersInnerHTML += '<a href="javascript:PageClickedOnBrowsedRenderer(\'' + CurrentRenderersList[j].ID + '\')" class="SERVERENTRY1">' + CurrentRenderersList[j].Name + '</a>';
        }
        parity = !parity;
    }
    
    CentralPage.innerHTML = RenderersInnerHTML;
}

function PageClickedOnBrowsedRenderer(ID)
{
    CurrentlySelectedRenderer = ID;
    RequestPlayThis(CurrentlySelectedItem, CurrentlySelectedRenderer);
    parent.historyframe.location="m2.page4.html";
}

function getRenderer() {
	return CurrentlySelectedRenderer;
}
function getServer() {
	return CurrentlySelectedServer;
}
function getCurrentBrowsedDirectory()
{
    return CurrentlyBrowsedFolder;
}
function getCurrentSelectedItem()
{
    return CurrentlySelectedItem;
}
function getCurrentSelectedItemIndex()
{
    return CurrentlySelectedItemIndex;
}

function DisplayError(text,type) {
    showPageError(text);
    pending = false;
}
