var context = ["all"];
chrome.runtime.onInstalled.addListener(function() {
  //var context = "page";
  var title = "Google for Selected Text";
  var id = chrome.contextMenus.create({"title": title, "contexts":context,
                                         "id": "context"});  
});

chrome.runtime.onInstalled.addListener(function() {
  //var context = ["page", "selection", "image", "link"];
  var title = "Google for Sub";
  var id = chrome.contextMenus.create({"title": title, "contexts":context,
                                         "id": "context"+"2"});  
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
  var sText = info.selectionText;
  var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);  
  window.open(url, '_blank');
};
//==================================


// chrome.runtime.onInstalled.addListener(function() {
// 	chrome.contextMenus.create({
// 		"title": "Buzz This",
// 		"contexts": ["page", "selection", "image", "link"],
// 		"onclick": clickHandler
// 	});
// });
// var clickHandler = function(e) {
//     var url = e.pageUrl;
//     var buzzPostUrl = "http://www.google.com/buzz/post?";

//     if (e.selectionText) {
//         // The user selected some text, put this in the message.
//         buzzPostUrl += "message=" + encodeURI(e.selectionText) + "&";
//     }

//     if (e.mediaType === "image") {
//         buzzPostUrl += "imageurl=" + encodeURI(e.srcUrl) + "&";
//     }

//     if (e.linkUrl) {
//         // The user wants to buzz a link.
//         url = e.linkUrl;
//     }

//     buzzPostUrl += "url=" + encodeURI(url);

//     // Open the page up.
//     chrome.tabs.create(
//           {"url" : buzzPostUrl });
// };