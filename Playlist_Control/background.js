var debug = false;
var context = ["all"];
chrome.runtime.onInstalled.addListener(function() {
  //var context = "page";
  var title = "Adicionar à Playlist";
  var id = chrome.contextMenus.create({"title": title, "contexts":context,
                                         "id": "context"});  
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

var setVideo = function(t, url){
  if(debug) console.log('setVideo',t, url);
  chrome.tabs.sendMessage(
    t.id, 
    {action:'set.video',data:url}, 
    function(response) {
    }
  );
};

// The onClicked callback function.
function onClickHandler(e, tab) {
  if(debug) console.log('onClickHandler', e, tab);
  var url = e.pageUrl;

  if (e.selectionText) {
      // The user selected some text, put this in the message.
      url = e.selectionText;
  }

  if (e.linkUrl) {
      // The user wants to buzz a link.
      url = e.linkUrl;
  }

  chrome.tabs.query({url:["*://*.playlist.ws/*","http://localhost:9000/"]}, function(tabs){
     if(debug) console.log('background.js tabs',tabs);
     if(tabs.length){
        tabs.forEach(function(t){
          setVideo(t, url);
        });
     }else{
        chrome.tabs.create(
          {url: 'http://playlist.ws', active: true}, 
          //{url: 'http://localhost:9000', active: true}, 
          function(tab){
            if(debug)
              console.log('tab created',tab);
            setTimeout((function(){setVideo(tab, url);}), 5000);
            //setVideo(tab, url);
          }
        );
     };
  });
};