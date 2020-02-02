var _url_podcast = "/cgi-bin/get_podcast_kdb";
var _url_podcast_status = "/cgi-bin/podcast_status";
var _url_myradio_status = "/cgi-bin/myradio_status";
var _separator_status = ";";
var hr = null;
var podcast_type = "name";
var podcast_timer = null;
var myradio_timer = null;
var podcast_modify_timer = null;
var podcast_loading = ".";

NewHttpRequest();

function getWidth()
{
  var winW = 0;
  var bodyW = 0;

  /* IE */
  if( document.documentElement && document.documentElement.clientWidth ) {
  winW = document.documentElement.clientWidth;
  }
  else if( document.body && document.body.clientWidth ) {
  winW = document.body.clientWidth;
  }

  /* FF */
  else if( window.innerWidth ) {
  winW = window.innerWidth;
  }

  bodyW = document.getElementById("text");
  bodyW.style.width = winW-9;
};


function NewHttpRequest()
{
  if (window.XMLHttpRequest) 
  { //Firefox ou IE >= 7.0
    hr = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) 
  {
    try 
    { // IE6
      hr = new ActiveXObject("Msxml2.XMLHTTP");
    } 
    catch (e) 
    {
       try 
       { // other IE
          hr = new ActiveXObject("Microsoft.XMLHTTP");
       } 
       catch (e) 
       { //no HttpRequest support
          StopPodcastHttpRequest();
          return;
       }
    } 
  }
}

function PodcastHttpRequest()
{
  hr.open("GET", _url_podcast_status, true);
  hr.onreadystatechange = function() {
    if(hr.readyState == 4) {
      var http_response = hr.responseText;
      var rexp = new RegExp(_separator_status,"g");
      var parse_response = http_response.split(rexp);

      if(parse_response[10]) {
        var _downloading_podcast = new RegExp("downloading podcast","i");
        var div_podcast_download_status = document.getElementById("podcastdownloadstatus");

        if(div_podcast_download_status) {
          if(_downloading_podcast.test(parse_response[10]))
            div_podcast_download_status.innerHTML = parse_response[10];
          else if(parse_response[10].length < 2)
            div_podcast_download_status.innerHTML = "";
          else {
            loading();
            div_podcast_download_status.innerHTML = podcast_loading + " downloading: " + parse_response[10] + " " + podcast_loading;
          }
        }
      }

      for (i = 0; i < 10; i++) {
        divid = "podcaststatus" + i;
        var div_podcast_status = document.getElementById(divid)

        if(div_podcast_status) {
          if(parse_response[i]) {
            if(parse_response[i].length > 1)
              div_podcast_status.innerHTML = parse_response[i];
            else
              div_podcast_status.innerHTML = "";
          }
        }
      }
    }
  } 
  hr.send(null);
}


function PodcastModifyHttpRequest(nb_podcast)
{
  var kdb_value;

  url_get_podcast_kdb = _url_podcast + "?" + podcast_type + nb_podcast;
  hr.open("GET", url_get_podcast_kdb, true);
  hr.onreadystatechange = function() {
    if(hr.readyState == 4) {
      if(hr.responseText) {
        divid = "podcast" + podcast_type;
        var div_podcast_id = document.getElementById(divid);
        var div_podcast_download_check = document.getElementById("podcast_download_check");
        var div_podcast_modify = document.getElementById("podcastmodify");

        if(div_podcast_id && div_podcast_download_check && div_podcast_modify) {
          if(podcast_type == "name") {
            div_podcast_id.innerHTML = '<input value="' + hr.responseText + '" class="musicbox" type="text" id="podcast_name" name="podcast_name" size="60" xlength="255">';
            podcast_type = "url";
          }
          else if(podcast_type == "url") {
            div_podcast_id.innerHTML = '<input value="' + hr.responseText + '" class="musicbox" type="text" id="podcast_url" name="podcast_url" size="60" xlength="255">';
            podcast_type = "download";
          }
          else {
            var _download_podcast_null = new RegExp("^null","i");
            podcast_download_null = _download_podcast_null.test(hr.responseText);

            if(podcast_download_null) {
              div_podcast_download_check.innerHTML = '<input class="musicbox" type="checkbox" id="podcast_download" name="podcast_download" onClick="disable_download_repertory_text()">';

              div_podcast_id.innerHTML = '<input value="/podcast" class="disabled" type="text" id="podcast_repertory" name="podcast_repertory" size="60" xlength="255" disabled>';
            }
            else {
              div_podcast_download_check.innerHTML = '<input class="musicbox" type="checkbox" id="podcast_download" name="podcast_download" onClick="disable_download_repertory_text()" checked>';

              div_podcast_id.innerHTML = '<input value="' + hr.responseText + '" class="disabled" type="text" id="podcast_repertory" name="podcast_repertory" size="60" xlength="255">';
            }

            div_podcast_modify.innerHTML = '<input value="' + nb_podcast + '" class="musicbox" type="hidden" id="podcast_modify" name="podcast_modify" >';

            StopPodcastModifyHttpRequest();
          }
        }
      }
    }
  }
  hr.send(null);
}


function MyradioHttpRequest()
{
  hr.open("GET", _url_myradio_status, true);
  hr.onreadystatechange = function() {
    if(hr.readyState == 4) {
      var http_response = hr.responseText;
      var rexp = new RegExp(_separator_status,"g");
      var parse_response = http_response.split(rexp);

      for (i = 0; i < 10; i++) {
        divid = "myradiostatus" + i;
        var div_myradio_status = document.getElementById(divid);

        if(parse_response[i]) {
          if(parse_response[i].length > 1) {
            var myradio_status;
            var myradio_response = parse_response[i];

            if (myradio_response == 0)
              myradio_status = "(parse)";
            else if (myradio_response == 2)
	            myradio_status = "(URL error)";
            else if (myradio_response == 3)
	            myradio_status = "(Format error)";
            else
	            myradio_status = "";

            if(div_myradio_status)
              div_myradio_status.innerHTML = myradio_status;
          }
          else {
            if(div_myradio_status)
              div_myradio_status.innerHTML = "";
          }
        }
      }
    }
  } 
  hr.send(null);
}


function StartPodcastModifyHttpRequest(nb_podcast)
{
  podcast_modify_timer = setInterval("PodcastModifyHttpRequest(" + nb_podcast + ")", 300);
}

function StopPodcastModifyHttpRequest()
{
  clearInterval(podcast_modify_timer);
}

function StartPodcastHttpRequest()
{
  podcast_timer = setInterval("PodcastHttpRequest()", 500);
}

function StopPodcastHttpRequest()
{
  clearInterval(podcast_timer);
}

function StartMyradioHttpRequest()
{
  myradio_timer = setInterval("MyradioHttpRequest()", 500);
}

function StopMyradioHttpRequest()
{
  clearInterval(myradio_timer);
}


function getURL_param(url)
{
  var param_exp = new RegExp("[?]","i");

  param_exp.test(url);
  param=RegExp.rightContext;

  return param;
} 


function disable_text()
{
  var div_download_repertory = document.getElementById('downloadrepertory');
  if(document.podcastConfig.podcastDownload.checked)
  {
    if(div_download_repertory)
      div_download_repertory.disabled = false;
  }
  else
  {
    if(div_download_repertory)
      div_download_repertory.disabled = true;
  }
}

function disable_download_repertory_text()
{
  var div_podcast_download = document.getElementById('podcastdownload');
  if(document.podcastConfig.podcast_download.checked)
  {
    if(div_podcast_download)
      div_podcast_download.innerHTML = '<input value="' + document.podcastConfig.podcast_repertory.value + '" class="disabled" type="text" id="podcast_repertory" name="podcast_repertory" size="60" xlength="255">';
  }
  else
  {
    if(div_podcast_download)
      div_podcast_download.innerHTML = '<input value="' + document.podcastConfig.podcast_repertory.value + '" class="disabled" type="text" id="podcast_repertory" name="podcast_repertory" size="60" xlength="255" disabled>';
  }
}

function loading()
{
  if(podcast_loading.length < 10)
    podcast_loading = podcast_loading + ".";
  else
    podcast_loading = ".";
}

