/************************************************************************************************
	@Copyright (c) IDS AIRNAV, all rights reserved.
*************************************************************************************************/
var getYOffset, floatingMenu;

function moveMenu() {
	floatingMenu.style.top = eval(getYOffset);
	setTimeout("moveMenu()", 10);
}

function init() {
	floatingMenu = document.getElementById("floatingMenu");
	//initFloatingMenu();

	if (isIE()) {
		// init for moveMenu
		getYOffset = window.pageYOffset ? "window.pageYOffset" : "document.body.scrollTop";
		moveMenu(); //other browsers implement CSS property display: fixed
	}
	setAMDTsTasks();
	sizeFrame() ;
}

var FLOATING_LABEL_ID = "floatingLabel";

/** Initialise the floating menu mouse events handling. */
function initFloatingMenu() {
	checkBox = document.getElementById("checkBox");
	if (checkBox.addEventListener) { //if W3C event registration is supported
		checkBox.addEventListener("mouseover", showMenu, false);
		checkBox.addEventListener("mouseout", hideMenu, false);
	} else if (checkBox.attachEvent) { //if IE event registration is supported
		checkBox.attachEvent("onmouseover", showMenu);
		checkBox.attachEvent("onmouseout", hideMenu);
	}
}

function showMenu(event) {
	if (isValidEvent(event)) show(FLOATING_LABEL_ID);
}

function hideMenu(event) {
	if (isValidEvent(event)) hide(FLOATING_LABEL_ID);
}

/** Workaround for Firefox 1.0.7 mouseover/mouseout bug.
 * Reference: http://www.garretwilson.com/notes/computers/internet/browsers/mozilla/mousebug.html
 */
function isValidEvent(event) {
	if (isIE()) return true;

	var trace = "* " + event.type + " target: " + event.target + " currentTarget: " + event.currentTarget + " relatedTarget: " + event.relatedTarget;
	try
	{
		trace += " (relatedTarget.nodeName: " + event.relatedTarget.nodeName + ")";
	}
	catch(e)
	{
		trace += " (error: " + e + ")";
	}
	trace += "\n";
	document.getElementById("textarea").value += trace;

	if (event.relatedTarget == null) return false;
	if (event.relatedTarget == event.target) return false; // check for FF 1.0.7 bug
	dump(event.relatedTarget + "target: " + event.target);

	try {
		var dummy = event.relatedTarget.nodeName;
	} catch (e) {
		return false; // check for FF 1.0.7 bug
	}

	return true;
}

function show_hide(elemid) {
	var el = document.getElementById(elemid);

	if (el.style.display != "none") {
		el.style.display = "none";
	} else {
		el.style.display = "";
	}
}

function show(elemid) {
	var el = document.getElementById(elemid);
	el.style.display = "";
}

function hide(elemid) {
	var el = document.getElementById(elemid);
	el.style.display = "none";
}

function show_hide2(elemid) {
	var el = document.getElementById(elemid);

	if (el.style.visibility != "hidden") {
		el.style.visibility = "hidden";
	} else {
		el.style.visibility = "visible";
	}
}

var toc;


// -------------------- IE Bug Fixes ---------------------------
/** Function to move the visible area to the anchor,
 *  with workaround for bug in IE about ordering of Search and Hash:
 *  IE does not go to an anchor if there is also a search in the URL
 */
function moveToAnchor(url) {
	var browserName = navigator.appName;
	if (browserName != "Microsoft Internet Explorer") {
		// non-IE browsers
		//location = url;
		return;
	}

	// Only for IE
	anchor = url.split('#')[1]; //Find stuff after #
	if (anchor == null) return; // There is no anchor

	anchor = anchor.split('?')[0]; //Get rid of search stuff
	//alert(url + '\n' + anchor + '\n' + location.hash);
	if (anchor == "") return; // Empty anchor

	if (location.hash != '#' + anchor) { // Avoid reloading loop
		//alert(location.hash);
		location.hash = anchor;
	}

}

function sizeFrame() 
{
	var FTop = document.getElementById("IncludeFileTop");
	var FBottom = document.getElementById("IncludeFileBottom");
	var pix = 10;

	//alert("start ...");

	FTop.height = FTop.contentWindow.document.body.scrollHeight + pix;

	if(FTop.height == 0) 
	{
		FTop.height = FTop.contentDocument.documentElement.scrollHeight + pix; //FF 3.0.11, Opera 9.63, and Chrome
	}

	FBottom.height = FBottom.contentWindow.document.body.scrollHeight + pix;
	if(FBottom.height == 0) 
	{
		FBottom.height = FBottom.contentDocument.documentElement.scrollHeight + pix; //FF 3.0.11, Opera 9.63, and Chrome
	}

	//alert(FTop.height);
	//alert(FBottom.height);

}
