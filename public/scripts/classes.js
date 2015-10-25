function Playlist(){
  this._id = null;
  this.title = "";
  this.videos = [];  
};

function VimeoVideo(url, callback){
  var id = null;
  if(!!~url.indexOf('vimeo')){
    id = helper.Url.getID(url);
  }
  console.log('vimeo id',url,id);
  this.id = id;
  this.media = {
    small: '',
    big: ''
  };
  this.iframeSrc = 'https://player.vimeo.com/video/'+id+'?api=1&player_id=player1&autoplay=1';
  this.title = {};
  this.instance = {};
  $.ajax({
      type:'GET',
      url: 'http://vimeo.com/api/v2/video/'+id+'.json',
      jsonp: 'callback',
      // comentado em 25-10-15
      //dataType: 'jsonp',
      success: callback
  });
};

function YoutubeVideo(url, callback){
  var id = null;
  if(!!~url.indexOf('youtube')){
    id = helper.Url.getParameterByName(url, 'v');
  }else if(!!~url.indexOf('youtu.be')){
    id = helper.Url.getID(url);
  }
  this.id = id;
  this.media = {
    small: 'http://img.youtube.com/vi/'+id+'/default.jpg',
    big: 'http://img.youtube.com/vi/'+id+'/maxresdefault.jpg'
  };
  this.iframeSrc = 'http://www.youtube.com/embed/'+id+'?enablejsapi=1&autoplay=1&version=3&controls=2&rel=0&modestbranding=1&disablekb=1&fs=1&iv_load_policy=3';
  // var instance = new YT.Player('player1', {
  //   videoId: id,
  //   events: {
  //     'onStateChange': Player.Youtube.OnPlayerStateChange
  //   }
  // });
  this.title = "";
  // $.get('https://www.googleapis.com/youtube/v3/videos?id='+id+'&key=AIzaSyDdNn7Fj9e0_gIURLfIDm9Cg8ubNzhmmQU%20&part=snippet&fiel=title', function(r){
  //   console.log(r);
  //   callback(r);
  // });
 $.get('https://www.googleapis.com/youtube/v3/videos?id='+id+'&key='+KEYS['youtube']+'&part=snippet,contentDetails&fiel=title', 
    callback
    );

  // nova instancia de youtube
  var instance = Player.Youtube.newInstance(id);
  this.instance = instance;
  //console.log('asasd', instance.B);

};
// TODO estudar passar para o angular factory
function Video(url, callback){
  callback = (typeof callback == 'function') ?
              callback : function(){};
  var self = this;
  this.originalUrl = url;
  var origin = helper.Url.getOrigin(url);
  //var id = helper.Url.getID(url) || null;
  var isValid = false;
  var originModel = {};
  
  if(origin == 'vimeo'){
    isValid = true;
    var cb = function(data){ 
      console.log(data);
      if(data && data.length){
        var v = data[0];
        self.title = v.title;
        self.media = {
          small: v.thumbnail_medium,
          big: v.thumbnail_large
        };
        self.duration = new VideoDuration(v.duration);
      }else{
        self.isValid = false;
      }
      callback(data);
    };
    originModel = new VimeoVideo(url, cb);
  }else if(origin == 'youtube'){
    isValid = true;
    var cb = function(r){ 
      console.log('cb',r);
      //self.title = r.items[0].snippet.title;
      if (r && r.items && r.items.length) {
        self.title = r.items[0].snippet.title;
        var duration = r.items[0].contentDetails.duration,
            seconds = helper.Date.convertISO8601ToSeconds(duration);
        //console.log('tyoutube video title', self.title);
        //console.log('tyoutube video duration', seconds, duration);
        helper.Date.secondsToStringFormatted(seconds);

        self.duration = new VideoDuration(duration);

      }else{
        self.isValid = isValid = false;
      }

      callback(r);
      
    };
    originModel = new YoutubeVideo(url, cb);
  }
  
  this.isValid = isValid;
  this.title = originModel.title;
  this.id = originModel.id;
  this.origin = origin; // Youtube/Vimeo
  this.iframeSrc = originModel.iframeSrc;
  this.instance = originModel.instance;
  this.media = {
    small: originModel.media ? originModel.media.small : null,
    big: originModel.media ? originModel.media.big : null
  };
}; 

function VideoDuration(duration){
  this.originalValue = duration;
  var seconds = 0
  if(typeof duration == 'string'){
    seconds = this.seconds = helper.Date.convertISO8601ToSeconds(duration);
  }else if(typeof duration == 'number'){
    seconds = this.seconds = duration;
  }
  
  this.formatted = helper.Date.secondsToStringFormatted(seconds);
};

function SearchResultItem(id, origin, title, image, url, duration){
  this.id = id;
  this.title = title;
  this.image = image;
  this.origin = origin;
  this.url = url;
  // api youtube não tem suporte, teria q fazer 2 ajax
  //this.duration = helper.Date.secondsToStringFormatted(duration);
};

function BroadcastMessage(type, data){
	this.type = type;
	this.data = data;
};