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
			app.View.getLocation();
	} );

};

app.View.drawLocation = function() {
	template = _.template( $('#enumerateLocations').html());
	$('#main_container').html(template());
}

app.View.getLocation = function() {
	//var x=document.getElementById("demo");
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
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://api.foursquare.com/v2/venues/search?ll=" + position.coords.latitude + "," + position.coords.longitude + "&oauth_token=2ZBTC4SWH5UO1UTOPCXOARGZ5RXLFM3NFRVE1UNFDMNGLGPN&v=20130928", false);
			xhr.send();

			foursquareData = JSON.parse(xhr.responseText);

		//x.innerHTML= "Status: " + xhr.status + "<br/>" + "StatusText: " + xhr.responseText;

			var ul = $('ul#locations');

			for (var i = 0;i<foursquareData.response.venues.length;i++) {
				var listItem = document.createElement("li");
				listItem.setAttribute("data-id", foursquareData.response.venues[i].id );
				listItem.setAttribute("onclick", "locationClicked(this)");
				listItem.appendChild(document.createTextNode(foursquareData.response.venues[i].name));
				ul.appendChild(listItem); 
			}

			//x.appendChild(ul);

		}

		function locationClicked(element) {
			console.log("Name: " + element.innerHTML);
			console.log("Id: " + element.getAttribute("data-id"));
		}
}


});
