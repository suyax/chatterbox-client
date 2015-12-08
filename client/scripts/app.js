// YOUR CODE HERE:
var parseURL = "https://api.parse.com/1/classes/chatterbox";

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};


var displayCount = 30;

var app = {};
app.friends = {};
var rooms = {Lobby:false};
var initialInterval;
var lobbyIds = {}
var roomIds = {}

user = window.location.search.slice(10);

app.init = function(){
  $(document).ready(function(){
    $input = $('<label>chat   </label><span class = "textBoxSpan"><input type = "text" class = "chatTextForm" name = "postChat"></span>');
    $submitButton = $('<span class = "submitButtonSpan"><input type ="submit" class ="submit" value = "Chat"></span>');
    $('#send').append($input);
    $inputRoom = $('<br><label>room   </label><span class = "roomBoxSpan"><input type = "text" class="roomBox" name = "roomBox"></span>');
    $('#send').append($input);
    $('#send').append($inputRoom);
    $('#send').append($submitButton);
    app.fetch();
    initialInterval = setInterval(app.fetch,1000);

    $(document).on('click','.username',function(){
      app.addFriend($(this).text());
    });

    $(document).on('click','.submit',function(e){
      app.handleSubmit();
      e.preventDefault();
    });
    // $('#roomSelect').on(change(function(){
    //   var roomname = $('#roomSelect option:selected').text().slice(6)
    //   if($(roomname === "Lobby")){
    //     console.log("wroks");
    //   } else {
    //     console.log('other');
    //     // app.fetchRoom(roomname);
    //   }
    // });
    $('#roomSelect').change(function(){
      var roomname = $('#roomSelect option:selected').text().slice(6)
      if(roomname === "Lobby"){
        clearInterval(initialInterval)
        app.clearMessages();
        lobbyIds = {}
        initialInterval = setInterval(app.fetch,1000)
      } else {

        clearInterval(initialInterval)
        roomIds = {};
        app.fetchRoom(roomname)
        // app.fetchRoom(roomname);
      }
    });
    // $("#roomSelect option:selected").change(function(){
    //   var roomname = $("#roomSelect option:selected").text().slice(6)
    //   if($(roomname === "Lobby")){
    //     setInterval(app.fetch,1000);
    //   } else {
    //     setInterval(app.fetchRoom(roomname),1000)
    //   }
    // })
  })


};

app.fetchRoom = function(roomname){
  app.clearMessages()

  var fetching = function(){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: parseURL,
      type: 'GET',
      // data: {format:'json'},
      contentType: 'application/json',
      success: function (data) {
        var messageCount = 0
        var index = 0
        while(messageCount < displayCount && index < data.results.length){
          if(roomIds[data.results[index].objectId] === true){
            break;
          }
          if(data.results[index].roomname === roomname){
            roomIds[data.results[index].objectId] = true;
            app.addMessage(data.results[index])
            messageCount++;
            index++;
          } else {
            index++
          }
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to load');
      }
    })
  }

  setInterval(fetching,1000)

}

app.server = parseURL;

app.fetch = function(){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: parseURL,
    type: 'GET',
    // data: {format:'json'},
    contentType: 'application/json',
    success: function (data) {
      for(var i = 0; i <displayCount; i++){
        if(lobbyIds[data.results[i].objectId] == true){
          break;
        } else {
          app.addMessage(data.results[i]);
          rooms[escapeHtml(data.results[i].roomname)] = rooms[escapeHtml(data.results[i].roomname)] || false;
          lobbyIds[data.results[i].objectId] = true;
        }

      }
      for(var key in rooms){
        if(rooms[key] === false){
          app.addRoom(key);
          rooms[key] = true;
        }
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to load');
    }
  });
}

app.clearMessages = function(){
  $('#chats').html(" ");
}

// var message = {};
//   message.username = "Mel Brooks";
//   message.text = "some text";
//   message.roomname = "Flo 8";


app.addMessage = function (message) {
  var $message = $('<div class="message"></div>');
  var $user = $('<span class="username"></div>');
  $user.text(escapeHtml(message.username));
  var $text = $('<span class="text"></div>');
  $text.text(escapeHtml(message.text));
  var $room = $('<span class="room"></div>');
  $room.text(escapeHtml(message.roomname));
  $message.append('Room: ');
  $message.append($room);
  $message.append(' Username: ');
  $message.append($user);
  $message.append(' Text: ');
  $message.append($text);
  $('#chats').append($message);
  if(app.friends[message.username] === true){
    $message.addClass('friend');
  }
}

app.addRoom = function (room) {
  
  var $room = $('<option value="'+room+'"></option>');
  $room.text('Room: ' + room);
  $('#roomSelect').append($room);
}

app.addFriend = function(friend) {
app.friends[friend] = true;
}

app.send = function(message){  
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: parseURL,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}


app.handleSubmit = function(){
  var newChat = $('input[name = postChat]').val();
  var message = {};
  var newRoom = $('input[name = roomBox]').val();
  if(newRoom === ""){
    newRoom = $("#roomSelect option:selected").text().slice(6)
  }
  message.roomname = newRoom;
  message.username = user;
  message.text = newChat;
  app.send(message);
}

// app.handleSubmit.restore = function(){
//   // $('input[name = postChat]').val("");

// }

app.init();



// $.get(parseURL,function(data,status){
//   console.log(status);
//   if(status === "success"){
//     chatsData = data.results.slice(0,displayCount);
//     chatsData.concat(_.map(chatsData,function(element){
//       var obj = {}
//       obj.username = element.username;
//       obj.time = element.createdAt;
//       obj.text = element.text;
//       obj.roomname = element.roomname;
//       return obj
//     }))
//   }
// });

// $(document).ready(function(){
//   console.log(chatsData[0][username]);
// })


