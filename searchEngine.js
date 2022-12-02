/************************************************************************************************
	@Copyright (c) IDS AIRNAV, all rights reserved.
*************************************************************************************************/
function Comparator(a, b) {
	if (parseInt(a[5], 10) < parseInt(b[4], 10)) return -1;
	if (parseInt(a[5], 10) > parseInt(b[4], 10)) return 1;
	return 0;
}

function search(srchval) 
{
	var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
	var lang = targetWindow.document.getElementById('currentLanguage').value;

	var container = document.getElementById('containerSearchResult');
	removeAllElementIntoContainer(container);
	txt = srchval.split(" ");

	var containerRiga = document.createElement("p");
	var containerlabel = document.createElement("Label");
	containerlabel.setAttribute('id', "totalItemResult");
	containerRiga.appendChild(containerlabel);
	container.appendChild(containerRiga);

	fnd = new Array();
	total = 0;

	if (typeof item !== 'undefined' && item != null) {  /** ATTENZIONE questo controllo 
								ha senso poiche'nel caso della generazione di un sup  
								senza eaip array non viene creato file "searchIndex.js" **/

		for (i = 0; i < item.length; i++) 
		{
			if (item[i][3].indexOf(lang) != -1) {
				fnd[i] = 0; order = new Array(2, 4);
				for (j = 0; j < order.length; j++)
					for (k = 0; k < txt.length; k++)
						if (item[i][order[j]].toLowerCase().indexOf(txt[k].toLowerCase()) > -1 && txt[k] != "")
							fnd[i] += (j + 1);

			}
		}

		//fnd = fnd.sort(Comparator);
	}

	for (i = 0; i < fnd.length; i++) 
	{
		n = 0; w = -1;
		for (j = 0; j < fnd.length; j++)
			if (fnd[j] > n) { n = fnd[j]; w = j; };
		if (w > -1) total += show(w, n, container);
		fnd[w] = 0;
	}


	var containerNewLine = document.createElement("br");
	container.appendChild(containerNewLine);
	document.getElementById('totalItemResult').innerHTML = "Total Item: " + total;
	container.setAttribute("style", "display:inline;");
	document.getElementById('bodysearch').appendChild(container);
}


function checkIfRemoteFileExists(fileToCheck)
{
	var myObject;
	var ret = true;

	return ret;
	/*
  myObject = new ActiveXObject("Scripting.FileSystemObject");
  alert("Check file2");
  if(myObject.FileExists(fileToCheck))
  {
	 alert("File Exists");
	 ret = true;
  } 
  else 
  {
	 alert("File doesn't exist");
	 alert(fileToCheck+" is not available");
  }
	
  oHttp = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();    
	
  try
  {
	  oHttp.open("HEAD", fileToCheck, false);
	  oHttp.send();
  }
   catch (e) 
   {
	  alert(e);
	  xmlhttp=false;
	  ret = false;
  }
	
	  	
  if( oHttp.responseText.indexOf("404 - File not found") > 0)
  {
	  ret = false;
  }


  return  ret;//oHttp.responseText.indexOf("404 - File not found") > 0 ? false : true;
  */
}


function show(which, num,container) 
{
	/* TMT verificare se online ...*/
	var sepa = "";
	var link = "";
	var i = 0;

	sepa = "/";
	link += item[which][0];

	// check Duplicati
	for (i = 0; i < which; i++) 
	{
		if(  item[which][0] == item[i][0] )
		{
			// duplicated
			if (DEBUG)
				alert("duplicato : " + item[which][2]);
			return 0;
		}

	}

	var containerdiv = document.createElement("div");
	containerdiv.setAttribute("class", "Hx");

	var conteinera = document.createElement('a');
	var functionOnClickOpenLink = "javascript:loadIdent('" + link + "')";
	conteinera.setAttribute('onclick', functionOnClickOpenLink);
	conteinera.setAttribute('href', link);
	conteinera.setAttribute('target', "eAISContent");
	var styleAnchor = "cursor: pointer; cursor: hand;";
	conteinera.setAttribute('style', styleAnchor);
	var containerlabel = document.createElement("Label");
	containerlabel.setAttribute('style', styleAnchor);
	containerlabel.innerHTML = item[which][2];
	conteinera.appendChild(containerlabel);
	containerdiv.appendChild(conteinera);
	container.appendChild(containerdiv);

	return 1;
}

function loadIdent(link) {
	var targetWindow = window.top.frames["eAISContent"];
	if (typeof targetWindow !== 'undefined' && targetWindow != null) {
		targetWindow.location.href = link;
	}
}

function removeAllElementIntoContainer(node) {
	if (typeof node !== 'undefined' && node != null) {
		while (node.hasChildNodes()) {
			node.removeChild(node.firstChild);
		}
	}
}
// End -->
