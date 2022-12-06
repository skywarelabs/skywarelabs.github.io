/************************************************************************************************
	@Copyright (c) IDS AIRNAV, all rights reserved.
*************************************************************************************************/
// global constants
var HIDE = 0;
var SHOW = 1;
var TOGGLE = 3;

function showHide(id, operation) {
	var op, plus, details;
	//alert(id + " - " + operation);

	if (id == "") {
		return 2; //<!-- this stills returns true. we need this trick for the internal links to work even towards nodes above the section level, such as #PART-1 -->
	}
	plus = document.getElementById(id + "plus");
	details = document.getElementById(id + "details");

  if (details) {
		if (operation == TOGGLE) {
			if (details.style.display == "none") {
				op = SHOW;
			} else {
				op = HIDE;
			}
		} else {
			op = operation;
		}

		if (op == SHOW) {
			plus.innerHTML = "-";
			details.style.display = "";
		} else {
			plus.innerHTML = "+";
			details.style.display = "none";
		}
	}
	return 1;
}

function showHideDetails(id, operation) {
	var op, details;
	//alert(id + " - " + operation);

	if (id == "") {
		return 2; //<!-- this stills returns true. we need this trick for the internal links to work even towards nodes above the section level, such as #PART-1 -->
	}

	details = document.getElementById(id + "details");

	if (details) {
		if (operation == TOGGLE) {
			if (details.style.display == "none") {
				op = SHOW;
			} else {
				op = HIDE;
			}
		} else {
			op = operation;
		}

		if (op == SHOW) {

			details.style.display = "";
		} else {

			details.style.display = "none";
		}
	}
	return 1;
}


/** Initial load of content URL */
function loadContent() {
	var current = location.href;
	var attr = getAttributes(current);

	result = "";
	for (j = 0; j < attr.length; j++) {
		if (attr[j].substr(0, 3) != "show")
			result = attr[j];
	}
	if (result != "") {
		var target = result.split("=")[1];
		if (target != "") {
			var frame = frames[1];
			frame.document.location.href = target;
		}
	}
}

/** Function to fix bug in IE.
 *  IE does not move to the anchor if there is a
 *  search. Something to do about ordering of Search and Hash... 
 */
function moveMainWindowToAnchor(dest) {
	var targetWindow = window.top.frames["eAISContent"];
	var browserName = navigator.appName;
	if (browserName == "Microsoft Internet Explorer") {
		anchor = dest.split('#')[1]; //Find stuff after #
		if (anchor != null) {
			anchor = anchor.split('?')[0]; //Get rid of search stuff
			if (anchor != "") {
				targetWindow.location.hash = '#' + anchor;
			}
		}
	}
}


//** incapsulo lo scroll per poterlo richiamare tramite timeout. 
// necessario, altrimenti la function non funziona **//
function showContent(id, idOtherLang) {
	window.top.frames.idToScroll = idOtherLang; //id per cambio lingua
	window.top.frames.idToScrollBack = id;	//id per ritorno lingua
	try {
		setTimeout(function () {
			var targetWindow = window.top.frames["eAISContent"];
			targetWindow.document.getElementById(id).scrollIntoView();
		}, 300)
	} catch (e) {

	}
}