/************************************************************************************************
    @Copyright (c) IDS AIRNAV, all rights reserved.
*************************************************************************************************/

var HIDE_AMDTS_SS = "Hide Amendments Changes";
var SHOW_AMDTS_SS = "Show Amendments Changes";
var BROWSER_NAME = navigator.appName;

/** Show or hide AMDTs  */
function setAMDTsTasks() {
	//alert("setAMDTsTasks");
    if (showAMDTsRequested()) {
        showAMDTsTasks();
    } else {
        hideAMDTsTasks();
    }
}

/** Inverse the AMDTs visibility */
function toggleAMDTs() {
	//alert("toggleAMDTs");
    if (getActiveStyleSheet() == SHOW_AMDTS_SS) {
        hideAMDTs();
    } else {
        showAMDTs();
    }
}

/** show AMDTs, checkbox  */  
function showAMDTs() {
    // IE 6 bug: first hide then show...
    if (isIE()) {
        setActiveStyleSheet(HIDE_AMDTS_SS);
     }
    setActiveStyleSheet(SHOW_AMDTS_SS);
    showAMDTsTasks();
}

/** hide AMDTs, checkbox  */  
function hideAMDTs() {
	//alert("hideAMDTs");
    setActiveStyleSheet(HIDE_AMDTS_SS);
    hideAMDTsTasks()
}

function showAMDTsTasks() {
	//alert("hideAshowAMDTsTasksMDTs");
	try {
	    document.getElementById("checkBox").checked = true;
	    
	    // Get document's base, to compare with other hrefs
	    var base = getBase( location.href );
	    padHrefs(window, base);
  
        var navigationFrame = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
        if (navigationFrame) {
            padHrefs(navigationFrame, base);
        }
    } catch (e) {
       
    }
    //moveToAnchor(window.location.href);
}

function hideAMDTsTasks() {
	//alert("hideAMDTsTasks");
    document.getElementById("checkBox").checked = false;
    
    unpadHrefs(window); // Change in the current window
    try {
        var navigationFrame = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
        if (navigationFrame)
        	unpadHrefs(navigationFrame);
    } catch (e) {
        // Do nothing, we are not in a frameset
    }
    moveToAnchor(window.location.href);
}

function setRequestedStyleSheet() {
	//alert("setRequestedStyleSheet");
    if (showAMDTsRequested()) {
        setActiveStyleSheet(SHOW_AMDTS_SS);
    } else {
        setActiveStyleSheet(HIDE_AMDTS_SS);
    }
}

function setActiveStyleSheet(title) {
	//alert("setActiveStyleSheet");
   var i, links;
   links = document.getElementsByTagName("link");
   for(i=0; i < links.length; i++) {
      if (links[i].getAttribute("rel").indexOf("stylesheet") != -1 && links[i].getAttribute("title")) {
         if (links[i].getAttribute("title") == title) {
            links[i].disabled = false;
         } else {
            links[i].disabled = true;
         }
      }
   }
}

function getActiveStyleSheet() {
	//alert("getActiveStyleSheet");
   var i, links;
   links = document.getElementsByTagName("link");
   for(i=0; i < links.length; i++) {
      if (links[i].getAttribute("rel").indexOf("stylesheet") != -1 &&
          links[i].getAttribute("title") &&
          !links[i].disabled) {
         return links[i].getAttribute("title");
      }
   }
   return "";
}

function toggleStyleSheet() {
	//alert("toggleStyleSheet");
    toggleAMDTs();
}


SHOW_AMDT = "amdt=show";


function padHrefs(win, base) {
	//alert("padHrefs");
	var elems = win.document.getElementsByTagName("A");
	for ( i=0; i < elems.length; i++ ) {
		// See if they are relative = contain the base
		if ( elems[i].href.indexOf( base ) != -1 || elems[i].target == "_self") {
			if (elems[i].search.search(SHOW_AMDT) != -1) //Skip if it already exists
				continue;
			// Remember the hash, because we are redoing the url by hand
//			if (elems[i].search == "") { 
//				elems[i].search = "?" + SHOW_AMDT;
//			} else {
//				elems[i].search = elems[i].search +"&"+ SHOW_AMDT;
//			}
			remakeUrl(elems[i]); // Fix IE bug
		}
	}
}

/**
 * Same as above but without the base checking
 * Warning: this will pad links that point externally. Make
 * sure there are no such links in the window from which you
 * call this function
 */
function padHrefsNoBase(win) {
	//alert("padHrefsNoBase");
	var elems = win.document.getElementsByTagName("A");
	for ( i=0; i < elems.length; i++ ) {
		if (elems[i].search.search(SHOW_AMDT) != -1) //Skip if it already exists
					continue;
		if (elems[i].search == "") { 
			elems[i].search = "?" + SHOW_AMDT;
		} else {
			elems[i].search = elems[i].search +"&"+ SHOW_AMDT;
		}
		remakeUrl(elems[i]); // Fix IE bug
	}
}

/** 
 * Remove at the end of all internal links SHOW_AMDT, if it exists 
 * @param win Window in which to do the unpadding
 */
function unpadHrefs(win) {
	//alert("unpadHrefs");
	// go through all hrefs and see if they are padded.
	//alert("unpadHrefs:"+ win.document.getElementsByTagName("A"));
	var elems = win.document.getElementsByTagName("A");
	for ( i=0; i < elems.length; i++ ) {
		if ( elems[i] == null ) return;
			
		var attr = getAttributes( elems[i].search );
		var result = "";	
		for ( j=0; j<attr.length; j++) {
			//alert("unpadHrefs:"+ attr[j]);
			//if (attr[j] != SHOW_AMDT) 
				result = addAttribute( result, attr[j] );
		}
		
		// IE Bug. IE sometimes forgets the hash when we update the search
		var temp = elems[i].hash.split('#')[1];
		elems[i].search = result;
		if (temp != null)
			elems[i].hash = temp;
			
		remakeUrl(elems[i]); // Fix IE bug
	}
	
}

function showAMDTsRequested() {
	//alert("showAMDTsRequested");
	attr = getAttributes( location.search );
	for ( i=0; i<attr.length; i++) {
		if (attr[i] == SHOW_AMDT){
			return true;
		}
	}
	return false;
}

function toggleAmendment() {
	//alert("toggleAmendment");
	if (showAMDTsRequested()) {
		// Base is the the URL of the content window
		//var base = getBase(window.top.frames["eAISContent"].document.location.href);
		//padHrefs(window, base);
		padHrefsNoBase(window);
	}
}


function getAttributes( fromHere ) {
	//alert("getAttributes");
	attributes = fromHere.split("?")[1]; //Get the string after the ?
	if ( attributes == null ) {
		return "";
	} else return attributes.split("&"); //If there are several attributes, split them
}

function addAttribute( list, attribute ) {
	separator = "&";
	if (list=="") {
		separator = "";
	}
	return list + separator + attribute;
}

function getBase( href ) {
	//alert("getBase:"+href);
	
	attr = getAttributes( href);
	var targetWindowCommand = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
	if(typeof targetWindowCommand.document.getElementById('currentTabSelected') !== 'undefined' 
		 && targetWindowCommand.document.getElementById('currentTabSelected') != null){
		var currentTab = targetWindowCommand.document.getElementById('currentTabSelected').value;
		if (currentTab=='tab2'){
			for ( i=0; i<attr.length; i++) {
				var app = attr[i].split("#");
				if (app.length>=2){
					lastAddClass=app[1];
					showSectionChanged( app[1]);
				}
			}
		}
	}
	
	
	// find position of last /
	last = href.lastIndexOf("/");
	// Basename is from 0 to that
	if (last == -1) return "";
	return href.substring(0,last);
}


function remakeUrl(loc) {
	//alert("remakeUrl:"+loc);
	//alert("remakeUrl loc:"+loc);
	var browserName = navigator.appName;
	if (browserName == "Microsoft Internet Explorer") {
	
		// Strip search part
		var temp = loc.href.split('?')[0];
		// Strip Anchor part
		temp = temp.split('#')[0];
		// Append search
		temp = temp + loc.search;
		// Append anchor
		temp = temp + loc.hash;
		//alert("remakeUrl:"+temp);
		loc.href = temp;
	}
}


function initTargetEmulation() {
	//alert("initTargetEmulation");
    // Simple normalization function to clean extra white-space.
    String.prototype.normalize = function(){
	return this.replace(/\s+/g, " ");
    };
    window.attachEvent("onload", emulateCSSPseudoClassTarget);
}


function emulateCSSPseudoClassTarget(){
	//alert("emulateCSSPseudoClassTarget");
	var sCurrentTargetID = getFragmentID();
	
	function setClass(sID){
		//alert("setClass:"+sID);
		var node = document.getElementById(sID);
		if(node == null){
			return;
		};
		var sClassName = node.className;
		if(sClassName == null){
			sClassName = "target";
		} else {
			sClassName = sClassName.normalize() + (sClassName == "" ? "" : " ") + "target";
		};
		node.className = sClassName;
	};
	
	function removeClass(sID){
		var node = document.getElementById(sID);
		if(node == null){
			return;
		};
		node.className = node.className.replace(/\btarget\b/, "");
	};
	
	function getFragmentID(){
		return document.location.hash.replace(/^#(.*)$/, "$1");
	};
	
	function monitor(){
		
		var sNewTargetID = getFragmentID();
		if(sNewTargetID != sCurrentTargetID){
			removeClass(sCurrentTargetID);
			setClass(sNewTargetID);
			sCurrentTargetID = sNewTargetID;
		};
	};
	
	setClass(sCurrentTargetID);
	
	setInterval(monitor, 150);
};

var lastAddClass="default";

function showSectionChanged(anchor){
	try{
		var targetWindow = window.top.frames["eAISContent"];
			
		if(typeof targetWindow.document.getElementById(lastAddClass) !== 'undefined' 
			&& targetWindow.document.getElementById(lastAddClass) != null){
			removeClassToObj(targetWindow.document.getElementById(lastAddClass), "selectedSection");
		}
			
		lastAddClass = anchor;
				
		if(typeof targetWindow.document.getElementById(anchor)!== 'undefined' 
			&& targetWindow.document.getElementById(anchor) != null){
			addClassToObj(targetWindow.document.getElementById(anchor), "selectedSection");
		}
	} catch (e) {
	       
    }
}	

function addClassToObj (obj, cls){
	 if(typeof obj !== 'undefined' && obj != null){
		 if(obj.classList) 
			 obj.classList.add(cls);
		 else
			 obj.className += cls;
	 }
}

function removeClassToObj (obj, cls){
	 if(typeof obj !== 'undefined' && obj != null){
		 if(obj.classList) 
				obj.classList.remove(cls);
			else
				obj.className = obj.className.replace(new RegExp('(?:^|s)'+cls+'(?!S)'), '');
	 }
}

function isChrome() { 
	var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS");

  if(isIOSChrome){
    return true;
  } else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
    return true;
  } else { 
    return false;
  }
}
function detectIE() {
	  var ua = window.navigator.userAgent;

	  // Test values; Uncomment to check result …

	  // IE 10
	  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
	  
	  // IE 11
	  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
	  
	  // Edge 12 (Spartan)
	  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
	  
	  // Edge 13
	  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
	  if (isSafari())
		  return true;
	  var msie = ua.indexOf('MSIE ');
	  if (msie > 0) {
	    // IE 10 or older => return version number
	    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	  }

	  var trident = ua.indexOf('Trident/');
	  if (trident > 0) {
	    // IE 11 => return version number
	    var rv = ua.indexOf('rv:');
	    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	  }

	  var edge = ua.indexOf('Edge/');
	  if (edge > 0) {
	    // Edge (IE 12+) => return version number
	    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	  }

	  // other browser
	  return false;
}


function isSafari() {
	  var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
	  return is_safari;
}

function isIE() {
	
//	return ((navigator.appName == 'Microsoft Internet Explorer') || 
//			((navigator.appName == 'Netscape') && 
//			 (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
//
	return 	detectIE();
}
