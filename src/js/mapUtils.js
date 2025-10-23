/**
 * Draws an image on the map within specified bounds.
 *
 * @param {google.maps.Map} map - The Google Map instance.
 * @param {string} imgPath - The path to the image to be drawn.
 * @param {google.maps.LatLngBoundsLiteral} bounds - The geographical bounds for the image.
 * @param {Object} [options] - Additional options for the GroundOverlay.
 *
 * @returns {Promise<google.maps.GroundOverlay>} A promise that resolves to the GroundOverlay instance.
 */
function drawImageOnMap(map, imgPath, bounds, options = {}) {
  const groundOverlay = new google.maps.GroundOverlay(imgPath, bounds, options);

  groundOverlay.setMap(map);

  return groundOverlay;
}

function removeImageFromMap(groundOverlay) {
  groundOverlay.setMap(null);
}

/**
 * Loads the homepage map.
 *
 * @returns {Promise<google.maps.Map>} A promise that resolves to the Google Map instance.
 */
async function loadHomepageMap() {
  const { ColorScheme, ControlPosition } =
    await google.maps.importLibrary("core");
  const { Map, MapTypeId } = await google.maps.importLibrary("maps");

  const centre = await fetch("../../datasets/aeroGIS/aeroGIS-centroid.json")
    .then((response) => response.json())
    .then((data) => {
      return { lat: data.lat, lng: data.lng };
    });

  const mapOptions = {
    mapId: "homepage-map",
    center: centre,
    zoom: 6,
    mapTypeId: MapTypeId.TERRAIN,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    fullscreenControl: true,
    keyboardShortcuts: false,
    minZoom: 4,
    colorScheme:
      getCurrentTheme() === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT,
  };

  const map = new Map(document.getElementById("map"), mapOptions);

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

  map.data.setControls(["Point", "LineString", "Polygon"]);
  map.data.setControlPosition(ControlPosition.BLOCK_END_INLINE_CENTER);

  logoBoundsData = await fetch(
    "../../datasets/aeroGIS/aeroGIS-logo-bounds.json",
  ).then((response) => response.json());

  const imageBounds = {
    north: logoBoundsData.ne.lat,
    south: logoBoundsData.sw.lat,
    east: logoBoundsData.ne.lng,
    west: logoBoundsData.sw.lng,
  };

  const logoGroundOverlay = drawImageOnMap(
    map,
    (imgPath = "../../assets/aerogis-logo-bare.png"),
    imageBounds,
  );

  // TODO: Make letters do something on interaction (click/hover/etc.)
  // See: https://developers.google.com/maps/documentation/javascript/datalayer#data_layer_events

  return map;
}
