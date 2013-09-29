var app = app || {
	View : {},
	Logic : {}, 
	Session : {}
};


		function locationClicked(element) {
			console.log("Name: " + element.innerHTML);
			console.log("Id: " + element.getAttribute("data-id"));
			
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

	template = _.template( $('#loginPage').html() );
	$('#main_container').html(template( {name: 'fasdfa', day:'fsdfsd'} ));

	$('#enterLoginInfo').on('click', function(){
			var name = $('textarea#name').val();
			var email = $('textarea#email').val();
			var phone = $('textarea#phone').val();
			var meta = {
				email : email, 
				phone : phone, 
				interests : ['tech', 'art', 'food']
			};
			app.Logic.addUserToPeople(name, meta);
			console.log(meta);
			app.View.renderLocationPage();
		} );
};

// opens default chat session
app.Logic.addUserToEvent = function (event, time){

	app.Session.event = event;
    var eventRef = new Firebase("https://hackny.firebaseio.com/events/" + event + "/");

    for (var i=0;i<meta.interests.length;i++){
       var attendeesRef = new Firebase("https://hackny.firebaseio.com/events/" + event + "/" + meta.interests[i] + "/" + "people" + "/");
       attendeesRef.push({
        name: app.Session.name,
        time : time, 
        meta : app.Session.meta
       });
    }
}


// gets all meta data of users of certain filter
// filter == none returs all attendees
app.Logic.getAttendees = function ( event, filter, callback ){

    // get refs to all attendees
    var attendeesRef = new Firebase("https://hackny.firebaseio.com/events/" + event + "/" + filter + "/" + "people" + "/");
    attendeesRef.on('child_added', function(snapshot) {
    	var attendee = snapshot.val();
    	callback( attendee );
    });
}

app.Logic.addChat = function(event, filter, time, text){

    var chatRef = new Firebase("https://hackny.firebaseio.com/events/" + event + "/" + filter + "/" + "chat" + "/");
   chatRef.push({
        name: app.Session.name,
        time : time, 
        text : text
       });
}

app.Logic.getChat = function(){

}

app.View.renderChat = function(location) {
	template = _.template($('#chatroom').html());
	$('#main_container').html(template({location : location.name}));
}

app.View.renderMessage = function(message) {
	template = _.template($('#chatroom-message').html());
	template({message : "hello", username : "abc", timestamp : "02:11:00"}).appendTo($('#msg-list'));
}


app.View.renderLocationPage = function(){
			//console.log(meta);
			app.View.drawLocation();
			app.View.getLocation();


};

app.View.drawLocation = function() {
	template = _.template($('#enumerateLocations').html());
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
