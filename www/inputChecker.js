// JavaScript Document
function checkFields(f, num){ 
	var fieldURL = "ch" + num + "url";
	var RSSurl = document.getElementById(fieldURL);
	var rowToBeColored = document.getElementById("row" + num);
	
	var regex = new RegExp("(http|https)", "i");
	regex.compile("(http|https)", "i"); 
	//alert(regex.test(RSSurl.value));
	
	if(RSSurl.value != "" && regex.test(RSSurl.value.toString())){
		markConfirm(rowToBeColored, RSSurl, num);	
	} else {
		markError(rowToBeColored);
		alert("This is not a Valid URL");
	}
}

function markConfirm(row, url, num){
	alert("Feed has been added");
	row.setAttribute(window.ActiveXObject ? "className" : "class", "green");
	var td = document.getElementById("name" + num);
		if(!td.hasChildNodes()){	
			var input = document.createElement("input");
			input.setAttribute("type", "text");
			input.setAttribute("id", "ch" + num + "name");
			input.setAttribute("name", "ch" + num + "name");
			input.setAttribute("size", "10");
			input.setAttribute("value", url.value);
			td.appendChild(input);
		}
}

function markError(row){
	row.setAttribute(window.ActiveXObject ? "className" : "class", "red");
}

function isValidIpAddress(address) {
  var i = 0;

  if ( address == '0.0.0.0' || address == '255.255.255.255' )
     return false;

  if ( address == 'any' || address == 'ANY')
     return true;

  addrParts = address.split('.');
  if ( addrParts.length != 4 ) 
     return false;

  for (i = 0; i < 4; i++) {
     if(addrParts[i].length == 0)
         return false;
     for ( j = 0; j < addrParts[i].length; j++ ) {
         c = addrParts[i].charAt(j);
         if (c >= '0' && c <= '9')
             continue;
         else
             return false;
     }
     num = parseInt(addrParts[i]);
     if ( num < 0 || num > 255 )
         return false;
  }

  return true;
}


