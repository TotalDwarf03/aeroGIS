countryColourMap = {
  England: "#FFFFFF",
  Scotland: "#0000FF",
  Wales: "#FF0000",
  "Northern Ireland": "#00FF00",
};

airportTypeIconMap = {
  large_airport: "./mapIcons/large_airport.png",
  medium_airport: "./mapIcons/medium_airport.png",
  small_airport: "./mapIcons/small_airport.png",
  heliport: "./mapIcons/heliport.png",
  closed: "./mapIcons/closed_airport.png",
};

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
 * Removes all data from the map.
 * @param {google.maps.Map} map The Google Map instance to remove data from.
 */
function removeAllMapData(map) {
  map.data.forEach((feature) => {
    map.data.remove(feature);
  });
}

/**
 * Shows the country polygons on the map.
 * @param {google.maps.Map} map The Google Map instance to show the country polygons on.
 */
async function showCountryPolygons(map) {
  map.data.loadGeoJson(
    "../../datasets/ukBoundaries/ukBoundaries-countries.geojson",
    null,
    () => {
      map.data.setStyle((feature) => {
        colour =
          countryColourMap[feature.getProperty("CTRY21NM")] || "lightgray";

        return {
          fillColor: colour,
          strokeColor: "black",
          strokeWeight: 1,
        };
      });
    },
  );

  map.set("styles", [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ]);

  // Reuse logo bounds to show country flag on hover
  logoBoundsData = await fetch(
    "../../datasets/aeroGIS/aeroGIS-logo-bounds.json",
  ).then((response) => response.json());

  const imageBounds = {
    north: logoBoundsData.ne.lat,
    south: logoBoundsData.sw.lat,
    east: logoBoundsData.ne.lng,
    west: logoBoundsData.sw.lng,
  };

  let imageGroundOverlay = null;

  map.data.addListener("mouseover", (event) => {
    map.data.overrideStyle(event.feature, {
      strokeWeight: 3,
    });

    var countryName = event.feature.getProperty("CTRY21NM");
    countryName = countryName.replace(" ", "_").toLowerCase();

    imageGroundOverlay = drawImageOnMap(
      map,
      `./mapIcons/${countryName}.png`,
      imageBounds,
    );

    map.data.addListener("mouseout", () => {
      removeImageFromMap(imageGroundOverlay);
      map.data.revertStyle();
    });
  });

  map.data.addListener("click", (event) => {
    const countryName = event.feature.getProperty("CTRY21NM");
    const lat = event.feature.getProperty("LAT");
    const lng = event.feature.getProperty("LONG");

    // Remove existing mouseover listeners to prevent multiple triggers
    google.maps.event.clearListeners(map.data, "mouseover");
    google.maps.event.clearListeners(map.data, "mouseout");
    google.maps.event.clearListeners(map.data, "click");

    removeImageFromMap(imageGroundOverlay);
    removeAllMapData(map);
    showAirportMarkers(map, countryName);

    // Pan and zoom to the country
    map.setCenter({ lat: lat, lng: lng });
    map.setZoom(8);
    map.scrollwheel = true;
    map.maxZoom = 8;
  });
}

/**
 * Shows the airport markers on the map.
 * @param {google.maps.Map} map The Google Map instance to show the airport markers on.
 * @param {string} countryName The name of the country to show airport markers for.
 */
function showAirportMarkers(map, countryName) {
  countryName = countryName.replace(" ", "_").toLowerCase();

  map.data.loadGeoJson(
    `../../datasets/ukBoundaries/ukBoundaries-borders-${countryName}.geojson`,
    null,
    () => {
      map.data.setStyle({
        strokeColor: "lightgray",
      });
    },
  );

  map.data.loadGeoJson(
    `../../datasets/ourAirports/${countryName}/ourAirports-airports.geojson`,
    null,
    () => {
      map.data.setStyle((feature) => {
        const name = feature.getProperty("name");
        const type = feature.getProperty("type");
        let iconUrl = "";

        iconUrl = airportTypeIconMap[type] || "./mapIcons/default_airport.png";

        return {
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(25, 25),
          },
          title: name,
        };
      });

      // TODO: Add a click listener to show info window with airport details
    },
  );
}

/**
 * Creates a custom control to reset the map to its initial state.
 * @param {google.maps.Map} map The Google Map instance to create the control for.
 * @returns {HTMLElement} The custom control element.
 */
function createResetMapControl(map) {
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset Map";
  resetButton.classList.add("reset-map-control");

  resetButton.addEventListener("click", () => {
    removeAllMapData(map);
    showCountryPolygons(map);

    // Reset map view
    fetch("../../datasets/aeroGIS/aeroGIS-centroid.json")
      .then((response) => response.json())
      .then((data) => {
        map.setCenter({ lat: data.lat, lng: data.lng });
        map.setZoom(5);
        map.scrollwheel = false;
        map.maxZoom = null;
      });
  });

  return resetButton;
}

/**
 * Initializes the Google Map (Homepage).
 *
 * @returns {Promise<google.maps.Map>} A promise that resolves to the initialized Google Map instance.
 */
async function initMap() {
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { Map, MapTypeId } = await google.maps.importLibrary("maps");

  const centre = await fetch("../../datasets/aeroGIS/aeroGIS-centroid.json")
    .then((response) => response.json())
    .then((data) => {
      return { lat: data.lat, lng: data.lng };
    });

  const mapOptions = {
    center: centre,
    zoom: 5,
    mapTypeId: MapTypeId.ROADMAP,
    mapTypeControl: true,
    disableDoubleClickZoom: true,
    zoomControl: false,
    scrollwheel: false,
    disableDefaultUI: true,
    colorScheme: ColorScheme.LIGHT,
    // Keep the map in light mode only for now.
    // I don't have the time to fully implement the theme switching right now.
    // colorScheme: getCurrentTheme() === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT,
  };

  const map = new Map(document.getElementById("map"), mapOptions);

  // See if the search results are set in session storage
  const searchLongitude = sessionStorage.getItem("searchLongitude");
  const searchLatitude = sessionStorage.getItem("searchLatitude");
  const searchPostcode = sessionStorage.getItem("searchPostcode");

  if (searchLongitude && searchLatitude && searchPostcode) {
    const lat = parseFloat(searchLatitude);
    const lng = parseFloat(searchLongitude);

    const infoPanel = document.getElementById("info-panel");
    infoPanel.innerHTML = `
      <h2>Search Results</h2>
      <p>Showing airports near <b style="color: #f29828;">${searchPostcode}</b> (${lat.toFixed(4)}, ${lng.toFixed(4)})</p>
      <small>(You can refresh the page to clear the results)</small>`;

    // Clear the search results from session storage
    sessionStorage.removeItem("searchLongitude");
    sessionStorage.removeItem("searchLatitude");
    sessionStorage.removeItem("searchPostcode");

    // Pan and zoom to the searched location
    map.setCenter({ lat: lat, lng: lng });
    map.setZoom(10);
    map.scrollwheel = true;
    map.maxZoom = 15;

    const postcodeMarker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map,
      title: `Search Location: ${searchPostcode}`,
    });

    const postcodeInfo = await fetch(
      `http://api.getthedata.com/postcode/${searchPostcode.replace(" ", "+")}`,
    );
    const postcodeInfoData = await postcodeInfo.json();
    const country = postcodeInfoData.data.country
      .toLowerCase()
      .replace(" ", "_");

    showAirportMarkers(map, country);
  } else {
    // Load polygons initially
    showCountryPolygons(map);
  }

  const resetMapControlDiv = document.createElement("div");
  const resetMapControl = createResetMapControl(map);

  resetMapControlDiv.appendChild(resetMapControl);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(resetMapControlDiv);

  return map;
}
