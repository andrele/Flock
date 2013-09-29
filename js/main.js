var app = app || {
	View : {},
	Logic : {}, 
	Session : {}
};

	app.Session.filter = "default";

function locationClicked(element) {
	console.log("Name: " + element.innerHTML);
	console.log("Id: " + element.getAttribute("data-id"));
	var place = {
		name : element.innerHTML,
		id :  element.getAttribute("data-id")
	};
	var time = "";
	app.Logic.addUserToEvent(place, time);
	app.View.renderChatPage('default');
	// add user to this event 
}


$(function(){

app.Logic.addUserToPeople = function ( name, meta ){
    var peopleRef = new Firebase("https://hackny.firebaseio.com/people/");
    var ref = peopleRef.push({name:name, meta:meta});
    app.Session.name = name;
    app.Session.meta = meta;
};

app.View.initialize = function(){

	$(document).ready(function(){
		$('.chzn').chosen();
	});

	template = _.template( $('#loginPage').html() );
	$('#main_container').html(template( {name: 'fasdfa', day:'fsdfsd'} ));

	$('#enterLoginInfo').on('click', function(){
			var name = $('#name').val();
			var email = $('#email').val();
			var phone = $('#phone').val();
			var meta = {
				email : email, 
				phone : phone, 
				interests : ['tech', 'art', 'food']
			};
			app.Logic.addUserToPeople(name, meta);
			app.View.renderLocationPage();
		} );
	
	app.Session.filter = "default";
};

// opens default chat session
app.Logic.addUserToEvent = function (event, time){

	app.Session.event = event;
    var eventRef = new Firebase("https://hackny.firebaseio.com/events/" + event.id + "/");

    for (var i=0;i<app.Session.meta.interests.length;i++){
       var attendeesRef = new Firebase("https://hackny.firebaseio.com/events/" + event.id + "/" + app.Session.meta.interests[i] + "/" + "people" + "/");
       attendeesRef.push({
        name: app.Session.name,
        time : time, 
        meta : app.Session.meta
       });
    }
     var attendeesRef = new Firebase("https://hackny.firebaseio.com/events/" + event.id + "/" + "default" + "/" + "people" + "/");
       attendeesRef.push({
        name: app.Session.name,
        time : time, 
        meta : app.Session.meta
    });
}


// gets all meta data of users of certain filter
// filter == none returs all attendees
app.Logic.getAttendees = function ( event, filter, callback ){

    // get refs to all attendees
    var attendeesRef = new Firebase("https://hackny.firebaseio.com/events/" + event + "/" + filter + "/" + "people" + "/");
    attendeesRef.on('child_added', function(snapshot) {
    	var attendee = snapshot.val();
    	console.log(attendee);
    	callback( attendee );
    });
}

app.Logic.setFilter = function(filter) {
	app.Session.filter = filter;
}

app.Logic.addChat = function(text){
	// console.log("Add CHAT!");
	// app.Session.filter = "default"; // change depending on what chatroom you are in
	time = new Date();
    var chatRef = new Firebase("https://hackny.firebaseio.com/events/" + app.Session.event.id + "/" + app.Session.filter + "/" + "chat" + "/");
	chatRef.push({
        name: app.Session.name,
        time : time, 
        text : text
       });
}

app.Logic.getChat = function( callback ){

    // get refs to all attendees
    // change session.filter depending on what chatroom you are in
    var chatRef = new Firebase("https://hackny.firebaseio.com/events/" + app.Session.event.id + "/" + app.Session.filter + "/" + "chat" + "/");
    var chatRefLimited = chatRef.limit(5);

    chatRefLimited.on('child_added', function(snapshot) {
    	var chat = snapshot.val();

    	callback( chat );
    });
}

app.View.renderMessage = function(text) {
	template = _.template($('#chatroom-message').html());
	$('#msg-list').append(template({message : text.text, username : text.name, timestamp : "2:00"}));
}


app.View.renderLocationPage = function(){
	

			app.View.drawLocation();
			app.View.getLocation();
	  // var map = L.mapbox.map('map', 'mayakreidieh.map-kb1dxm8i')
   //    .setView([37.9, -77], 5);
};

app.View.renderChatPage = function( filter ){

	template = _.template($('#chatroom').html());
	$('#main_container').html(template({location : app.Session.event.name}));
	
	$('#chatbox-submit').on("click", function() {app.View.sendChat()});
	app.Session.filter = filter;
	
	app.Logic.getChat(app.View.renderMessage);
	console.log('rendering chat page');
}

app.View.sendChat = function() {
	//console.log("SEND CHAT!");
	app.Logic.addChat($('#chatbox-input').val());
	
	$('#chatbox-input').val("");
	
}

app.View.renderAttendeesPage = function( filter ){

	var template = _.template($('#attendeesListTemplate').html());
	$('#main_container').html('');
	$('#main_container').html( template() );
	app.Logic.getAttendees(app.Session.event.id, filter, function( attendee ){

		console.log(attendee);
		var t = _.template($('#attendeeTemplate').html());

		$('#attendeeList').append( t(attendee) );

	});

}

app.View.drawLocation = function() {
	template = _.template($('#locationPage').html());
	$('#main_container').html(template());

	console.log('HERE ');
	console.log( $('#main_container') );
	
}

app.View.getLocation = function() {
	//var x=document.getElementById("demo");
	console.log("in get loc");
	var foursquareData;

	function getLocation()
	{
	if (navigator.geolocation)
		{
		navigator.geolocation.getCurrentPosition(showPosition);
		}
	//else{ x.innerHTML="Geolocation is not supported by this browser."; }
	}
	function showPosition(position)
	{
		  var map = L.mapbox.map('map', 'mayakreidieh.map-kb1dxm8i')
      .setView([position.coords.latitude, position.coords.longitude], 15);
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://api.foursquare.com/v2/venues/search?ll=" + position.coords.latitude + "," + position.coords.longitude + "&oauth_token=2ZBTC4SWH5UO1UTOPCXOARGZ5RXLFM3NFRVE1UNFDMNGLGPN&v=20130928", false);
		xhr.send();
		foursquareData = JSON.parse(xhr.responseText);

	//x.innerHTML= "Status: " + xhr.status + "<br/>" + "StatusText: " + xhr.responseText;
	
		var ul = document.getElementById("locations");
		console.log("Locations");
		console.log(ul);
		for (var i = 0;i<foursquareData.response.venues.length;i++) {
			var listItem = document.createElement("li");
			listItem.setAttribute("data-id", foursquareData.response.venues[i].id );
			listItem.setAttribute("onclick", "locationClicked(this)");
			listItem.appendChild(document.createTextNode(foursquareData.response.venues[i].name));
			ul.appendChild(listItem); 
		}
		//x.appendChild(ul);
	}	
	getLocation();

}



window.onload = app.View.initialize();

});

/*
insert following to init:
$('.chzn').chosen()

*/
