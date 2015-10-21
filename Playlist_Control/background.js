var context = ["all"];
chrome.runtime.onInstalled.addListener(function() {
  //var context = "page";
  var title = "Adicionar à Playlist";
  var id = chrome.contextMenus.create({"title": title, "contexts":context,
                                         "id": "context"});  
});

// chrome.runtime.onInstalled.addListener(function() {
//   //var context = ["page", "selection", "image", "link"];
//   var title = "Google for Sub";
//   var id = chrome.contextMenus.create({"title": title, "contexts":context,
//                                          "id": "context"+"2"});  
// });

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(e, tab) {
  console.log('onClickHandler', e, tab);
  // var sText = info.selectionText;
  // var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);  
 // window.open(url, '_blank');
  var url = e.pageUrl;
  var buzzPostUrl = "http://www.google.com/buzz/post?";

  if (e.selectionText) {
      // The user selected some text, put this in the message.
      buzzPostUrl += "message=" + encodeURI(e.selectionText) + "&";
  }

  if (e.mediaType === "image") {
      buzzPostUrl += "imageurl=" + encodeURI(e.srcUrl) + "&";
  }

  if (e.linkUrl) {
      // The user wants to buzz a link.
      url = e.linkUrl;
  }

  //buzzPostUrl += "url=" + encodeURI(url);

  // Open the page up.
  // chrome.tabs.create(
  //       {"url" : buzzPostUrl });

  // chrome.extension.sendMessage({ action: url});
  // chrome.runtime.sendMessage({ action: url}, function(response) {
  //   console.log('background.js sendMessage response', response);
  // });


  chrome.tabs.query({url:["*://*.playlist.ws/*","http://localhost:9000/"]}, function(tabs){
     // TODO implementar busca por tab e fallback
     tabs.forEach(function(t){
        chrome.tabs.sendMessage(t.id, {action:'set.video',data:url}, function(response) {
        });
      });
  });
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


// ========================================

function startExtension() {
    console.log('Starting Extension');
    $body.trigger('Api.Set',{er:'teste'});
  }

  function stopExtension() {
    console.log('Stopping Extension');
  }

  function onRequest(request, sender, sendResponse) {
    console.log('background.js', request, sender, sendResponse);
    if (request.action == 'start')
      startExtension()
    else if (request.action == 'stop')
      stopExtension()
    sendResponse({});
  }

  chrome.extension.onMessage.addListener(onRequest);



  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });