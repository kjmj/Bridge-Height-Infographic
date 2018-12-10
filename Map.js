function drawStreetView(latitude, longitude) {
    if (isNaN(latitude) || isNaN(longitude) || !latitude || !longitude) {
        const location = document.getElementById('pano');
        location.innerHTML = '<p> Bridge coordinates have not been surveyed';
        location.style['background-color'] = null;

        return;
    }

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
