var app = app || {
	View : {},
	Logic : {}
};




$(function(){



app.Logic.addUserToPeople = function ( name, meta ){
    var peopleRef = new Firebase("https://hackny.firebaseio.com/people/");
    peopleRef.push({name:name, meta:meta});
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
				phone : phone
			};
			app.addUserToPeople(name, meta);
			console.log(meta);
	} );
};





});