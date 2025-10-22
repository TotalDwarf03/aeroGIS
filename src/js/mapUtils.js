async function loadHomepageMap() {
  const centre = await fetch("../../datasets/aeroGIS/aeroGIS-centroid.json")
    .then((response) => response.json())
    .then((data) => {
      return { lat: data.lat, lng: data.lng };
    });

  const mapOptions = {
    center: centre,
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    fullscreenControl: true,
    keyboardShortcuts: false,
    maxZoom: 6,
    minZoom: 4,
    colorScheme:
      getCurrentTheme() === "dark"
        ? google.maps.ColorScheme.DARK
        : google.maps.ColorScheme.LIGHT,
  };

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);

  map.data.loadGeoJson("../../datasets/aeroGIS/aeroGIS.geojson");

  map.data.setStyle(function (feature) {
    var id = feature.getProperty("id");
    var colour = id > 3 ? "#81bc37" : "#205d95";
    return {
      fillColor: colour,
      fillOpacity: 0.8,
      strokeColor: colour,
      strokeWeight: 3,
      strokeOpacity: 1,
      draggable: true,
    };
  });

  // TODO: Make letters do something on interaction (click/hover/etc.)
  // See: https://developers.google.com/maps/documentation/javascript/datalayer#data_layer_events

  map.data.setControls(["Point", "LineString", "Polygon"]);
  map.data.setControlPosition(
    google.maps.ControlPosition.BLOCK_END_INLINE_CENTER,
  );

  return map;
}
