function drawStreetView(latitude, longitude) {
    var bridge = {lat: latitude, lng: longitude};

    // var map = new google.maps.Map(document.getElementById('map'), {
    //     center: bridge,
    //     zoom: 14
    // });

    var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: bridge,
            pov: {
                heading: 34,
                pitch: 10
            }
        });

    // map.setStreetView(panorama);
}
