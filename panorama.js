/**
 * Draws the streetview from a given latitude and longitude if they are valid. Also modifies HTML to display the name of the bridge.
 *
 * @param latitude
 * @param longitude
 * @param bridgeName
 */
function drawStreetView(latitude, longitude, bridgeName) {
    if (isNaN(latitude) || isNaN(longitude) || !latitude || !longitude) {
        const location = document.getElementById('pano-title');
        location.innerHTML = 'The ' + bridgeName + '\'s coordinates have not been surveyed';
        location.style['background-color'] = 'transparent';

        document.getElementById('pano').innerHTML = "";
        document.getElementById('pano').style['background-color'] = 'transparent';
        return;
    }

    const location = document.getElementById('pano-title');
    location.innerHTML = bridgeName;
    location.style['background-color'] = 'transparent';

    let bridge = {lat: latitude, lng: longitude};

    let panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: bridge,
            pov: {
                heading: 34,
                pitch: 10
            }
        });
}
