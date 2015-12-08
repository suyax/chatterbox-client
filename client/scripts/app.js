// YOUR CODE HERE:
var parseURL = "https://api.parse.com/1/classes/chatterbox";

var displayCount = 10;

var app = {};

user = window.location.search.slice(10);

app.init = function(){
  $(document).ready(function(){
    $input = $('<input type = "text" span = "chatTextForm" name = "postChat">');
    $submitButton = $('<input type ="submit" class ="submit" value = "submit">');
    $('#send').append($input);
    $('#send').append($submitButton);
    app.addRoom("Lobby");

    $(document).on('click','.username',function(){
      app.addFriend($(this).text());
    });

    $('.submit').on('click',function(){
      app.handleSubmit();
    });
  })


};

app.server = parseURL;

app.fetch = function(){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: parseURL,
    type: 'GET',
    // data: {format:'json'},
    contentType: 'application/json',
    success: function (data) {
      console.log('First Message' + data.results[0].username);
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
  var $user = $('<div class="username"></div>');
  $user.text(message.username);
  var $text = $('<div class="text"></div>');
  $text.text(message.text);
  var $room = $('<div class="room"></div>');
  $room.text(message.roomname);
  $message.append('Room: ');
  $message.append($room);
  $message.append(' Username: ');
  $message.append($user);
  $message.append(' Text: ');
  $message.append($text);
  $('#chats').prepend($message);

}

app.addRoom = function (room) {
  var $room = $('<option value="'+room+'"></option>');
  $room.text('Room: ' + room);
  $('#roomSelect').append($room);
}




app.addFriend = function(friend) {

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
  message.roomname = $("#roomSelect option:selected" ).text().slice(6)
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


