/**
 * Draws an image on the map within specified bounds.
 *
 * @param {google.maps.Map} map The Google Map instance.
 * @param {string} imgPath The path to the image to be drawn.
 * @param {google.maps.LatLngBoundsLiteral} bounds - The geographical bounds for the image.
 * @param {Object} [options] Additional options for the GroundOverlay.
 *
 * @returns {Promise<google.maps.GroundOverlay>} A promise that resolves to the GroundOverlay instance.
 */
function drawImageOnMap(map, imgPath, bounds, options = {}) {
  const groundOverlay = new google.maps.GroundOverlay(imgPath, bounds, options);

  groundOverlay.setMap(map);

  return groundOverlay;
}

/**
 * Removes an image from the map.
 *
 * @param {google.maps.GroundOverlay} groundOverlay The GroundOverlay instance to remove.
 */
function removeImageFromMap(groundOverlay) {
  groundOverlay.setMap(null);
}

/**
 * Initializes the Google Map (Homepage).
 *
 * @returns {Promise<google.maps.Map>} A promise that resolves to the initialized Google Map instance.
 */
async function initMap() {
  const { ColorScheme, ControlPosition } =
    await google.maps.importLibrary("core");
  const { Map, MapTypeId } = await google.maps.importLibrary("maps");

  const { default: EasterEggChecklist } = await import("./checklist.js");

  // Initialize Easter Egg Checklist
  var checklist = new EasterEggChecklist();

  const centre = await fetch("../datasets/aeroGIS/aeroGIS-centroid.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
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
    colorScheme: ColorScheme.LIGHT,
    // Keep the map in light mode only for now.
    // I don't have the time to fully implement the theme switching right now.
    // colorScheme: getCurrentTheme() === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT,
  };

  const map = new Map(document.getElementById("map"), mapOptions);

  // Add AeroGIS logo as a clickable overlay
  // This is used to initiate an Easter Egg tracker

  logoBoundsData = await fetch("../datasets/aeroGIS/aeroGIS-logo-bounds.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((response) => response.json());

  const imageBounds = {
    north: logoBoundsData.ne.lat,
    south: logoBoundsData.sw.lat,
    east: logoBoundsData.ne.lng,
    west: logoBoundsData.sw.lng,
  };

  const logoGroundOverlay = drawImageOnMap(
    map,
    (imgPath = "../assets/aerogis-logo-bare.png"),
    imageBounds,
  );

  logoGroundOverlay.addListener("click", async () => {
    checklist.createUIChecklist();

    // Remove the logo from the map after clicking
    removeImageFromMap(logoGroundOverlay);
  });

  // Load AeroGIS GeoJSON data and style it

  map.data.loadGeoJson("../datasets/aeroGIS/aeroGIS.geojson");

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

  // Add interaction to features

  // Import letter functions
  const letterFunctions = await import("./letterFunctions.js");

  // Add session variable to keep track of a clicks
  // This is used to toggle the colour inversion on and off
  sessionStorage.setItem("a_clicked", "false");

  // Add a hover listener to change the element if hovered
  // This will change strokeWeight to emphasise the feature being hovered over
  map.data.addListener("mouseover", (event) => {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, { strokeWeight: 8 });
  });

  map.data.addListener("mouseout", (event) => {
    map.data.revertStyle();
  });

  map.data.addListener("click", (event) => {
    const feature = event.feature;
    const letter = feature.getProperty("letter");

    if (checklist.initialised) {
      switch (letter) {
        case "a":
          letterFunctions.handleAClick(event, map);
          checklist.markEggAsCompleted("invertColours");
          break;
        case "e":
          map.data.setControls(["Point", "LineString", "Polygon"]);
          map.data.setControlPosition(ControlPosition.BLOCK_END_INLINE_CENTER);
          checklist.markEggAsCompleted("enableEditing");
          break;
        default:
          console.log(`No click handler defined for letter: ${letter}`);
      }
    } else {
      Toastify({
        text: "Try clicking the AeroGIS logo first ;)",
        duration: 3000,
      }).showToast();
    }
  });

  map.data.addListener("dblclick", (event) => {
    const feature = event.feature;
    const letter = feature.getProperty("letter");

    if (checklist.initialised) {
      switch (letter) {
        case "r":
          letterFunctions.handleRDoubleClick(event, map);
          checklist.markEggAsCompleted("rIsForRed");
          break;
        case "s":
          map.data.remove(feature);
          checklist.markEggAsCompleted("snapCracklePop");
          break;
        default:
          console.log(`No right-click handler defined for letter: ${letter}`);
      }
    }
  });

  map.data.addListener("");

  map.data.addListener("setgeometry", (event) => {
    checklist.markEggAsCompleted("putMeDown");
  });

  map.data.addListener("addfeature", (event) => {
    if (checklist.initialised) {
      checklist.markEggAsCompleted("itsAlive");
    }
  });

  return map;
}
