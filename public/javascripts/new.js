$(document).ready(function() {

	var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: 40, lng: -3}
  });

  var geocoder = new google.maps.Geocoder();
	var marker = new google.maps.Marker({
		map: map,
		position: {lat: 40, lng: -3}
	});
  $("#address").on('keydown', (ev) => {
		geocodeAddress($(ev.currentTarget).val())
		.then( coord =>{
			marker.setPosition(coord);
			map.setCenter(coord);
			$("#latitude").val(coord.lat);
			$("#longitude").val(coord.lng);
		})
		.catch(e => console.error(e));
	});

  function geocodeAddress(address) {
		console.log("Geocoding adress: " + address);
		return new Promise((resolve, reject) => {
			geocoder.geocode({'address': address}, function(results, status) {
				if (status === 'OK') {
					try{
						const location = {
							lat: results[0].geometry.location.lat(),
							lng: results[0].geometry.location.lng()
						};
						resolve(location);
					}catch(e){
						reject("No results for this string");
					}
				} else {
					reject('Geocode was not successful for the following reason: ' + status);
				}
			});
		});
	}
});
