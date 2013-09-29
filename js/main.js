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
	app.View.renderChatMenu(place);

	//app.View.renderChatPage('default');
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
		} )
	
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

	//app.Session.filter = "default";
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
    var chatRef = new Firebase("https://hackny.firebaseio.com/events/" + app.Session.event.id + "/" + app.Session.filter + "/" + "chat" + "/");
    chatRef.on('child_added', function(snapshot) {
    	var chat = snapshot.val();

    	callback( chat );
    });
}


app.View.renderChat = function(location) {
	template = _.template($('#chatroom').html());
	$('#main_container').html(template({location : location.name}));
}


app.View.renderMessage = function(message) {
	template = _.template($('#chatroom-message').html());
	$('#msg-list').append(template({message : "hello", username : "abc", timestamp : "02:11:00"}));
}


app.View.renderLocationPage = function(){
			//console.log(meta);
			app.View.drawLocation();
			app.View.getLocation();
};

app.View.renderChatPage = function( filter ){

	$('#main_container').html('');
	console.log('rendering chat page');
}

app.View.renderChatMenu = function( filter ){

	var numArtAttendees = 123;
	var numSportsAttendees = 5;
	var numMusicAttendees = 0;
	var numTechAttendees = 0;
	var numFoodAttendees = 10;

	var template = _.template($('#chatMenuTemplate').html());
	$('#main_container').html( template({
		numberOfArtAttendees : numArtAttendees,
		numberOfSportsAttendees : numSportsAttendees,
		numberOfMusicAttendees : numMusicAttendees,
		numberOfTechnologyAttendees : numTechAttendees,
		numberOfFoodAttendees : numFoodAttendees
	}) );
	// TODO - ADD logic to fetch the number of attendees for each interests.

	if (numArtAttendees <= 0) {
		$('#artAttendees').attr("disabled", "disabled");
		$('#artAttendees').addClass("btn-disabled");
	}
	
	if (numSportsAttendees <= 0) {
		$('#sportsAttendees').attr("disabled", "disabled");
		$('#sportsAttendees').addClass("btn-disabled");
	}

	if (numMusicAttendees <= 0) {
		$('#musicAttendees').attr("disabled", "disabled");
		$('#musicAttendees').addClass("btn-disabled");
	}

	if (numTechAttendees <= 0) {
		$('#technologyAttendees').attr("disabled", "disabled");
		$('#technologyAttendees').addClass("btn-disabled");
	}

	if (numFoodAttendees <= 0) {
		$('#foodAttendees').attr("disabled", "disabled");
		$('#foodAttendees').addClass("btn-disabled");
	}	
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
	
}

app.View.getLocation = function() {
	//var x=document.getElementById("demo");
	console.log("in get loc");
	var foursquareData;

	function getLocation()
	{
		console.log('test');
	if (navigator.geolocation)
		{
		navigator.geolocation.getCurrentPosition(showPosition);
		}
	//else{ x.innerHTML="Geolocation is not supported by this browser."; }
	}
	function showPosition(position)
	{
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
