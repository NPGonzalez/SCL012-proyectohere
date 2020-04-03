// Start communication with the plattform
let platform = new H.service.Platform({
    apikey: 'vuOaY6JKA9wK1Ag-7FzRfLq-z3mAccDC7xTRw9Gukd0'
});
// Instantiate a map and platform object:

// Retrieve the target element for the map:
let targetElement = document.getElementById('mapContainer');

// Get the default map types from the platform object:
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
// Create the parameters for the routing request:
let routingParameters = {
    // The routing mode:
    'mode': 'fastest;car',
    // The start point of the route:
    'waypoint0': 'geo!-33.4691,-70.642',
    // The end point of the route:
    'waypoint1': 'geo!-33.441625100,-70.623969400',
    // // To retrieve the shape of the route we choose the route
    // representation mode 'display'
    'representation': 'display'
};

// Define a callback function to process the routing response:
let onResult = function(result) {
    let route,
        routeShape,
        startPoint,
        endPoint,
        linestring;
    if (result.response.route) {
        // Pick the first route from the response:
        route = result.response.route[0];
        // Pick the route's shape:
        routeShape = route.shape;

        // Create a linestring to use as a point source for the route line
        linestring = new H.geo.LineString();

        // Push all the points in the shape into the linestring:
        routeShape.forEach(function(point) {
            let parts = point.split(',');
            linestring.pushLatLngAlt(parts[0], parts[1]);
        });

        // Retrieve the mapped positions of the requested waypoints:
        startPoint = route.waypoint[0].mappedPosition;
        endPoint = route.waypoint[1].mappedPosition;

        // Create a polyline to display the route:
        let routeLine = new H.map.Polyline(linestring, {
            style: {
                strokeColor: 'cyan',
                lineWidth: 3
            }
        });

        // Create a marker for the start point:
        let startMarker = new H.map.Marker({
            lat: startPoint.latitude,
            lng: startPoint.longitude
        });

        // Create a marker for the end point:
        let endMarker = new H.map.Marker({
            lat: endPoint.latitude,
            lng: endPoint.longitude
        });

        // Add the route polyline and the two markers to the map:
        map.addObjects([routeLine, startMarker, endMarker]);

        // Set the map's viewport to make the whole route visible:
        map.getViewModel().setLookAtData({
            bounds: routeLine.getBoundingBox()
        });
    }
};

// Get an instance of the routing service:
let router = platform.getRoutingService();

map.addEventListener('tap', function(evt) {
    var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    startPosition = coord.lat + ',' + coord.lng;
    startIsolineRouting();
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
let ui = H.ui.UI.createDefault(map, defaultLayers);
// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):
router.calculateRoute(routingParameters, onResult,
    function(error) {
        alert(error.message);
    });