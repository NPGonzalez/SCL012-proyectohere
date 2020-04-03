let platform = new H.service.Platform({
    apikey: 'vuOaY6JKA9wK1Ag-7FzRfLq-z3mAccDC7xTRw9Gukd0'
});

let targetElement = document.getElementById('mapContainer');
let defaultLayers = platform.createDefaultLayers();

// Instantiate the map in Chile
let map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map, {
        zoom: 5,
        center: {
            lat: -35.6751,
            lng: -71.543
        }
    });

let routingParameters = {
    'mode': 'fastest;car',
    'waypoint0': 'geo!-33.4691,-70.642',
    'waypoint1': 'geo!-33.441625100,-70.623969400',
    'representation': 'display'
};

let onResult = function(result) {
    let route,
        routeShape,
        startPoint,
        endPoint,
        linestring;
    if (result.response.route) {
        route = result.response.route[0];
        routeShape = route.shape;
        linestring = new H.geo.LineString();
        routeShape.forEach(function(point) {
            let parts = point.split(',');
            linestring.pushLatLngAlt(parts[0], parts[1]);
        });
        startPoint = route.waypoint[0].mappedPosition;
        endPoint = route.waypoint[1].mappedPosition;
        let routeLine = new H.map.Polyline(linestring, {
            style: {
                strokeColor: 'cyan',
                lineWidth: 3
            }
        });
        let startMarker = new H.map.Marker({
            lat: startPoint.latitude,
            lng: startPoint.longitude
        });
        let endMarker = new H.map.Marker({
            lat: endPoint.latitude,
            lng: endPoint.longitude
        });
        map.addObjects([routeLine, startMarker, endMarker]);
        map.getViewModel().setLookAtData({
            bounds: routeLine.getBoundingBox()
        });
    }
};
let router = platform.getRoutingService();
map.addEventListener('tap', function(evt) {
    var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    startPosition = coord.lat + ',' + coord.lng;
    startIsolineRouting();
});
window.addEventListener('resize', () => map.getViewPort().resize());
let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
let ui = H.ui.UI.createDefault(map, defaultLayers);
router.calculateRoute(routingParameters, onResult,
    function(error) {
        alert(error.message);
    });