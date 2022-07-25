/************************************************************************************************
    @Copyright (c) IDS AIRNAV, all rights reserved.
*************************************************************************************************/

 var DEBUG = false;

 var PDF_EXTENSION="pdf";
 
 var HTML_EXTENSION="html";
 

 function readFileAsPdf(href) {
	
	var value = new String(href);
	var ret = "";
	var preret = "";
	try{
		var splitNamePdf = href.split("."); 
		if (splitNamePdf[splitNamePdf.length-1].toLowerCase() == PDF_EXTENSION
				||  href.indexOf("noContent")!=-1
				||  href.indexOf("help")!=-1) { 
	  	   return href;
	    }
	 	 
		
		var d1 = value.lastIndexOf("/"); //d vale -1, 'z' n
		var path = value.substring(0,d1);
		var namePdf = value.substring(d1);
		
		if (namePdf.indexOf("Cover") != -1) {
	 	    return path+PDF_FOLDER+coverPagePDFFile;//COVER_PAGE_PDF;
	 	}
		
		if (DEBUG) alert("namePdf :" + namePdf);
	
		if(typeof lang1!== 'undefined'  && lang1 != null){
			namePdf=namePdf.replace("-"+lang1,"");
		}	
		if(typeof lang2!== 'undefined'  && lang2 != null
			&& lang2!= ''){
			namePdf=namePdf.replace("-"+lang2,"");
		}	
		
		if ((typeof SUP_FOLDER !== 'undefined' && SUP_FOLDER != null) && 
			path.indexOf(SUP_FOLDER)!=-1){
			path = path + PDF_FOLDER;
		}else if ((typeof AIC_FOLDER !== 'undefined' && AIC_FOLDER != null) && 
			path.indexOf(AIC_FOLDER)!=-1){
			path = path + PDF_FOLDER;
		}else{	
			path = path.replace(HTML_FOLDER, PDF_FOLDER);
		}	
			
		ret = path + namePdf.replace(HTML_EXTENSION,PDF_EXTENSION);
		
	}catch(err) {
		 if (DEBUG) alert("readFileAsPdf error:" + err.message);
		 return href;
	}
	return  ret;
	
	// Bug in IE 6 on NT4 and 2000: anchors on PDF links lead to non-existant pages. 
	// Bugfix: strip the anchor for all IE (for PDF)
 	//if (navigator.appName == "Microsoft Internet Explorer") {
	//	search = /\.html#.*/;
	//}
	//else {
	//	search = ".html";
	//}
 }
 

 function getFilePdf() {
	try{ 
	 	var frame = window.top.frames["eAISContent"];
	 	var location = frame.location.href;
	 	return readFileAsPdf(location);
	}catch (e) {
		// TODO: handle exception
	}
 }
 
 async function LinkCheck(url){
	    let http = await fetch(url);

	    return http.status;
}
 
 function loadHrefForPdf(obj) {
	try{ 
	var link=  getFilePdf();
	var fileExist = LinkCheck(link);	
	if(typeof link !== 'undefined' && link != null && link != 'undefined'){
			obj.href = link;
		}
		if(fileExist === 404){
			var t = obj.href.split(".pdf");
			obj.href = t[0] + ".html";
		}
	}catch (e) {
		// TODO: handle exception
	}
 }
 

function reloadMenu(){
	var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
	if(typeof targetWindow.document.getElementById('currentLanguage') !== 'undefined' 
			 && targetWindow.document.getElementById('currentLanguage') != null){
		var lang = targetWindow.document.getElementById('currentLanguage').value;
		
		changeLang (lang);
	}
}

 
 function changeLang (lang){
	 currentLang = lang;
	 try {
		 var targetWindowCommand = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
		 // set campo hidden "currentLanguage" usato come riferimento
		 // quando faccio switch sulle varie voci del menu a tabs
		 targetWindowCommand.document.getElementById('currentLanguage').value = currentLang;
		 
		 if(typeof lang2 !== 'undefined' && lang2 != null && lang2 != ''){
			 
			 var currentTab = targetWindowCommand.document.getElementById('currentTabSelected').value;
			
			 if (currentLang == lang1){
				 
				 removeClassToObj(document.getElementById("p_history1"), "invisibile");
				 removeClassToObj(document.getElementById("p_pdf1"), "invisibile");
				 removeClassToObj(document.getElementById("p_help1"), "invisibile");
								
				 removeClassToObj(document.getElementById("p_flag_lang1"), "invisibile");
				 removeClassToObj(document.getElementById("coverlang1"), "invisibile");
				 addClassToObj(document.getElementById("p_flag_link_lang1"), "invisibile");	
				 
				
				 addClassToObj(document.getElementById("p_history2"), "invisibile");
				 addClassToObj(document.getElementById("p_pdf2"), "invisibile");
				 addClassToObj(document.getElementById("p_help2"), "invisibile");
				 addClassToObj(document.getElementById("coverlang2"), "invisibile");
				 
				 removeClassToObj(document.getElementById("p_flag_link_lang2"), "invisibile");
				 addClassToObj(document.getElementById("p_flag_lang2"), "invisibile");	
				
				 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
				 
				 if (currentTab=='tab1'){
					 //MENU TAB1 /////////////////////////////////////////////////////////////////
					 setCurrentLang1eAip();
					 /////////////////////////////////////////////////////////////////////////////
				 }else if (currentTab=='tab2'){ 
					 ///AMDT /////////////////////////////////////////////////////////////////////
					 setCurrentLang1Amdt();
					 /////////////////////////////////////////////////////////////////////////////
				 }else if (currentTab=='tab3'){ 
					 ///SUP //////////////////////////////////////////////////////////////////////
					 setCurrentLang1Sup();
					 /////////////////////////////////////////////////////////////////////////////
				 }else if (currentTab=='tab4'){ 
					 ///AIC //////////////////////////////////////////////////////////////////////
					 setCurrentLang1Aic();
					 /////////////////////////////////////////////////////////////////////////////
				 }
				
				 var linkframeeAISContent = window.top.frames["eAISContent"].location.href;
					
				 if (linkframeeAISContent.toLowerCase().indexOf(".htm")!=-1 
						 || linkframeeAISContent.toLowerCase().indexOf(".html")!=-1){
					 
					 if (linkframeeAISContent.toLowerCase().indexOf(folderHelpInterNational)!=-1){
						 window.top.frames["eAISContent"].location.href = linkframeeAISContent.replace(folderHelpInterNational, folderHelpNational);
					 }else if (linkframeeAISContent.toLowerCase().indexOf(folderHelpNational)!=-1){
						 window.top.frames["eAISContent"].location.href = linkframeeAISContent.replace(folderHelpNational, folderHelpInterNational);
					 }else{
						 window.top.frames["eAISContent"].location.href = linkframeeAISContent.replace(lang2, lang1);
					 }
				 }
			 }else{
				
				 removeClassToObj(document.getElementById("p_history2"), "invisibile");
				 removeClassToObj(document.getElementById("p_pdf2"), "invisibile");
				 removeClassToObj(document.getElementById("p_help2"), "invisibile");
				 removeClassToObj(document.getElementById("coverlang2"), "invisibile");
				 
				 removeClassToObj(document.getElementById("p_flag_link_lang1"), "invisibile");
				 addClassToObj(document.getElementById("p_flag_lang1"), "invisibile");		
				
				 
				 addClassToObj(document.getElementById("p_history1"), "invisibile");
				 addClassToObj(document.getElementById("p_pdf1"), "invisibile");
				 addClassToObj(document.getElementById("p_help1"), "invisibile");	
				 addClassToObj(document.getElementById("coverlang1"), "invisibile");
		
				 removeClassToObj(document.getElementById("p_flag_lang2"), "invisibile");		
				 addClassToObj(document.getElementById("p_flag_link_lang2"), "invisibile");	
				
				 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
				
				 if (currentTab=='tab1'){
					 //MENU TAB1 /////////////////////////////////////////////////////////////////
					 setCurrentLang2eAip();
					 /////////////////////////////////////////////////////////////////////////////
				 }else if (currentTab=='tab2'){ 
					 ///AMDT /////////////////////////////////////////////////////////////////////
					 setCurrentLang2Amdt();
					 /////////////////////////////////////////////////////////////////////////////
				 }else if (currentTab=='tab3'){ 
				 	 ///SUP //////////////////////////////////////////////////////////////////////
					 setCurrentLang2Sup();
					 /////////////////////////////////////////////////////////////////////////////
				 }else if (currentTab=='tab4'){ 
				 	 ///AIC //////////////////////////////////////////////////////////////////////
					 setCurrentLang2Aic();
					 /////////////////////////////////////////////////////////////////////////////
				 }
				
				 
				 var linkframeeAISContent = window.top.frames["eAISContent"].location.href;
				 if (linkframeeAISContent.toLowerCase().indexOf(".htm")!=-1 
						 || linkframeeAISContent.toLowerCase().indexOf(".html")!=-1){
					 if (linkframeeAISContent.toLowerCase().indexOf(folderHelpInterNational)!=-1){
						 window.top.frames["eAISContent"].location.href = linkframeeAISContent.replace(folderHelpInterNational, folderHelpNational);
					 }else if (linkframeeAISContent.toLowerCase().indexOf(folderHelpNational)!=-1){
						 window.top.frames["eAISContent"].location.href = linkframeeAISContent.replace(folderHelpNational, folderHelpInterNational);
					 }else{
						 window.top.frames["eAISContent"].location.href = linkframeeAISContent.replace(lang1, lang2);
					 }
				 }	 
			 }
			 ////////////////////////////////////////////////////////////
			 // Se sto sulla search azzero il vecchio risultato nel caso cambio lingua /////
			 var targetWindowNavigation = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
			 if(typeof targetWindowNavigation.document.getElementById('formSearch') !== 'undefined' 
				 && targetWindowNavigation.document.getElementById('formSearch')  != null){
					 targetWindowNavigation.document.getElementById('containerSearchResult').style="visibility=hidden; display:none;";
				 targetWindowNavigation.document.getElementById('formSearch').srchval.value=''; 
				 //removeAllElementIntoContainer(targetWindowNavigation.document.getElementById('containerSearchResult'));
			 }
			 ///////////////////////////////////////////////////////////////////////////////
		 }	 
	 }
	 catch(err) {
		 if (DEBUG) alert("changeLang error:" + err.message);
	   
	 }
 }
 
 function setCurrentLang1eAip(){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
	 addClassToObj(targetWindow.document.getElementById("dateLang2"),"invisibile"); 
	 removeClassToObj(targetWindow.document.getElementById("dateLang1"),"invisibile"); 
	 addClassToArrayObj (targetWindow, lang2RootHeader, "invisibile");
	 removeClassToArrayObj (targetWindow, lang1RootHeader, "invisibile");
	 removeClassToArrayObj (targetWindow, menuItemSectionLang1, "invisibile");
	 addClassToArrayObj (targetWindow, menuItemSectionLang2, "invisibile");
 }
 
 function setCurrentLang2eAip(){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
	 addClassToObj(targetWindow.document.getElementById("dateLang1"),"invisibile"); 
	 removeClassToObj(targetWindow.document.getElementById("dateLang2"),"invisibile"); 
	 addClassToArrayObj (targetWindow, lang1RootHeader, "invisibile");
	 removeClassToArrayObj (targetWindow, lang2RootHeader, "invisibile");	 
	 addClassToArrayObj (targetWindow, menuItemSectionLang1, "invisibile");
	 removeClassToArrayObj (targetWindow, menuItemSectionLang2, "invisibile");
 }
 
 
 function setCurrentLang1Amdt(){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
	 addClassToObj(targetWindow.document.getElementById("dateLang2"),"invisibile"); 
	 removeClassToObj(targetWindow.document.getElementById("dateLang1"),"invisibile"); 	 
	 addClassToObj(targetWindow.document.getElementById("amdtIntroLang2"),"invisibile"); 
	 removeClassToObj(targetWindow.document.getElementById("amdtIntroLang1"),"invisibile"); 
	 addClassToArrayObj (targetWindow, lang2RootHeaderAMDT, "invisibile");
	 removeClassToArrayObj (targetWindow, lang1RootHeaderAMDT, "invisibile");
	 removeClassToArrayObj (targetWindow, menuItemSectionAMDTLang1, "invisibile");
	 addClassToArrayObj (targetWindow, menuItemSectionAMDTLang2, "invisibile");
 }
 
 function setCurrentLang2Amdt(){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
	 addClassToObj(targetWindow.document.getElementById("dateLang1"),"invisibile"); 
	 removeClassToObj(targetWindow.document.getElementById("dateLang2"),"invisibile"); 
	 addClassToObj(targetWindow.document.getElementById("amdtIntroLang1"),"invisibile"); 
	 removeClassToObj(targetWindow.document.getElementById("amdtIntroLang2"),"invisibile"); 
	 addClassToArrayObj (targetWindow, lang1RootHeaderAMDT, "invisibile");
	 removeClassToArrayObj (targetWindow, lang2RootHeaderAMDT, "invisibile");	 
	 addClassToArrayObj (targetWindow, menuItemSectionAMDTLang1, "invisibile");
	 removeClassToArrayObj (targetWindow, menuItemSectionAMDTLang2, "invisibile");
 }
 function setCurrentLang1Sup(){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
	 addClassToArrayObj (targetWindow, lang2RootHeaderSup, "invisibile");
	 removeClassToArrayObj (targetWindow, lang1RootHeaderSup, "invisibile");
	 removeClassToArrayObj (targetWindow, menuItemSectionSupLang1, "invisibile");
	 addClassToArrayObj (targetWindow, menuItemSectionSupLang2, "invisibile");	
 }
 
 function setCurrentLang2Sup(){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
	 addClassToArrayObj (targetWindow, lang1RootHeaderSup, "invisibile");
	 removeClassToArrayObj (targetWindow, lang2RootHeaderSup, "invisibile");	 
	 addClassToArrayObj (targetWindow, menuItemSectionSupLang1, "invisibile");
	 removeClassToArrayObj (targetWindow, menuItemSectionSupLang2, "invisibile");	
 }
 
 function setCurrentLang1Aic(){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
	 addClassToArrayObj (targetWindow, lang2RootHeaderAic, "invisibile");
	 removeClassToArrayObj (targetWindow, lang1RootHeaderAic, "invisibile");
	 removeClassToArrayObj (targetWindow, menuItemSectionAicLang1, "invisibile");
	 addClassToArrayObj (targetWindow, menuItemSectionAicLang2, "invisibile");	
 }
 
 function setCurrentLang2Aic(){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISNavigation"];
	 addClassToArrayObj (targetWindow, lang1RootHeaderAic, "invisibile");
	 removeClassToArrayObj (targetWindow, lang2RootHeaderAic, "invisibile");	 
	 addClassToArrayObj (targetWindow, menuItemSectionAicLang1, "invisibile");
	 removeClassToArrayObj (targetWindow, menuItemSectionAicLang2, "invisibile");	
 }
 
 function addClassToObj (obj, cls){
	 if(typeof obj !== 'undefined' && obj != null){
		 if(obj.classList) 
			 obj.classList.add(cls);
		 else
			 obj.className += cls;
	 }
 }
 
 function addClassToArrayObj (targetWindow, arrObj, cls){
	 if(typeof arrObj !== 'undefined' && arrObj != null){ 
		 for (var i = 0; i < arrObj.length; i++) {
			addClassToObj(targetWindow.document.getElementById(arrObj[i]), cls);	
		 }
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

 function removeClassToArrayObj (targetWindow, arrObj, cls){
	 if(typeof arrObj !== 'undefined' && arrObj != null){ 
		 for (var i = 0; i < arrObj.length; i++) {
			 removeClassToObj(targetWindow.document.getElementById(arrObj[i]), cls);	
		 }
	 }
 }
 

 function setNoContentLabel(val){
 	var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
 	if(typeof targetWindow.document.getElementById('menuSectionTitle') !== 'undefined' 
 			 && targetWindow.document.getElementById('menuSectionTitle') != null){
 		return targetWindow.document.getElementById('menuSectionTitle').value= val;
 	}else{	
 		return '';
 	}
 }
 function selectTab(tab){
	 try{
		 var targetWindowCommand = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
		 targetWindowCommand.document.getElementById('currentTabSelected').value = tab;
	 }catch(err) {
		 if (DEBUG) alert("selectTab error:" + err.message);
	 }		
 }
 
 function startupBilanguage(){
	 
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
	 try{
		 if(typeof targetWindow.document.getElementById('currentLanguage') !== 'undefined' 
				 && targetWindow.document.getElementById('currentLanguage') != null){
			var currentLang = targetWindow.document.getElementById('currentLanguage').value;
			if(typeof lang2 !== 'undefined' && lang2 != null && lang2 != ''){
				if (currentLang == lang1){
					setCurrentLang1eAip();
				}else{
					setCurrentLang2eAip();
				}
			 }	 
		 }else{
			 currentLang = lang1;
			 setCurrentLang1eAip();
		 }
	 }catch(err) {
		 if (DEBUG) alert("startupBilanguage error:" + err.message);
	   
	 }		
 }

 function startupAMDTBilanguage(){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
	 try{
		 if(typeof targetWindow.document.getElementById('currentLanguage') !== 'undefined' 
				 && targetWindow.document.getElementById('currentLanguage') != null){
			var currentLang = targetWindow.document.getElementById('currentLanguage').value;
			if(typeof lang2 !== 'undefined' && lang2 != null && lang2 != ''){
				if (currentLang == lang1){
					setCurrentLang1Amdt();
				}else{
					setCurrentLang2Amdt();
				}
			 }	 
		 }else{
			 currentLang = lang1;
			 setCurrentLang1Amdt();
		 }
	 }catch(err) {
		 if (DEBUG) alert("startupAMDTBilanguage error:" + err.message);
	   
	 }
 }
 
function startupSupBilanguage (){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
	 try{
		 if(typeof targetWindow.document.getElementById('currentLanguage') !== 'undefined' 
				 && targetWindow.document.getElementById('currentLanguage') != null){
			var currentLang = targetWindow.document.getElementById('currentLanguage').value;
			if(typeof lang2 !== 'undefined' && lang2 != null && lang2 != ''){
				if (currentLang == lang1){
					setCurrentLang1Sup();
				}else{
					setCurrentLang2Sup();
				}
			 }	 
		 }else{
			 currentLang = lang1;
			 setCurrentLang1Sup();
		 }
	 }catch(err) {
		 if (DEBUG) alert("startupSupBilanguage error:" + err.message);
	   
	 }
 }
 
function startupAicBilanguage (){
	 var targetWindow = window.top.frames["eAISNavigationBase"].frames["eAISCommands"];
	 try{
		 if(typeof targetWindow.document.getElementById('currentLanguage') !== 'undefined' 
				 && targetWindow.document.getElementById('currentLanguage') != null){
			var currentLang = targetWindow.document.getElementById('currentLanguage').value;
			if(typeof lang2 !== 'undefined' && lang2 != null && lang2 != ''){
				if (currentLang == lang1){
					setCurrentLang1Aic();
				}else{
					setCurrentLang2Aic();
				}
			 }	 
		 }else{
			 currentLang = lang1;
			 setCurrentLang1Aic();
		 }
	 }catch(err) {
		 if (DEBUG) alert("startupAicBilanguage error:" + err.message);
	   
	 }
}