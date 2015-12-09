// YOUR CODE HERE:

var Chat = Backbone.Model.extend ({

  // initialize: function(username, text, roomname) {
  //   this.set('username',username);
  //   this.set('text', text);
  //   this.set('roomname', roomname);
  // },
  // addMessage: function(username, text, roomname) {

  // },

});

var Chats = Backbone.Collection.extend({
  model: Chat,
  url: "https://api.parse.com/1/classes/chatterbox",
  parse: function(response,options){
    return response.results
  }
});


var ChatView = Backbone.View.extend({
  initialize: function() {

  },
  render: function() {
    var html = [
      '<div class="message">',
        '<span class="username">',
          this.model.get(username),
        '</span>',
        '<span class="text">',
          this.model.get(text),
        '</span>',
        '<span class="roomname">',
          this.model.get(roomname),
        '</span>',
      '</div>'
    ].join('');

    return this.$el.html(html);
  },
})


var ChatsView = Backbone.View.extend({
  initialize: function(roomname){

  }
})