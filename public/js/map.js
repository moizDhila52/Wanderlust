    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10 // starting zoom
    });
const marker = new mapboxgl.Marker({color: "black",draggable: true})
.setLngLat(coordinates)
.setPopup(new mapboxgl.Popup({ closeOnClick: true })
    .setHTML('<p>Exact location will be given on booking.</p>'))
    .addTo(map);