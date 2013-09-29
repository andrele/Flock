var app = app || {
	View : {},
	Logic : {}, 
	Session : {}
};


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
		} );
	};
});

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


