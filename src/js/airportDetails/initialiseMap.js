const surfaceTypeMap = {
  ASP: "Asphalt",
  TURF: "Turf",
  CON: "Concrete",
  GRS: "Grass",
  GRE: "Gravel",
  WATER: "Water",
  UNK: "Unknown",
};

/**
 * Initializes the Google Map (Homepage).
 *
 * @returns {Promise<google.maps.Map>} A promise that resolves to the initialized Google Map instance.
 */
async function initMap() {
  const { ColorScheme } = await google.maps.importLibrary("core");
  const { Map, MapTypeId } = await google.maps.importLibrary("maps");

  const airportFeature = await loadAirportDetails();

  const centre = {
    lat: airportFeature.properties.latitude_deg,
    lng: airportFeature.properties.longitude_deg,
  };

  const mapOptions = {
    center: centre,
    zoom: 13,
    mapTypeId: MapTypeId.SATELLITE,
    disableDoubleClickZoom: true,
    minZoom: 13,
    maxZoom: 17,
    disableDefaultUI: true,
    restriction: {
      latLngBounds: {
        north: centre.lat + 0.04,
        south: centre.lat - 0.04,
        east: centre.lng + 0.05,
        west: centre.lng - 0.05,
      },
      strictBounds: false,
    },
    colorScheme: ColorScheme.LIGHT,
    // Keep the map in light mode only for now.
    // I don't have the time to fully implement the theme switching right now.
    // colorScheme: getCurrentTheme() === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT,
  };

  const map = new Map(document.getElementById("map"), mapOptions);

  // Load runway polygons

  var totalRunways = [];

  map.data.loadGeoJson(
    "../../datasets/ourAirports/ourAirports-runway-polys.geojson",
    null,
    function (features) {
      // Style the runway polygons
      map.data.setStyle({
        fillColor: "#FF0000",
        fillOpacity: 0.6,
        strokeColor: "#FFFFFF",
        strokeWeight: 1,
      });
    },
  );

  const infoWindow = new google.maps.InfoWindow();

  // Add a click listener on data click to show runway info
  map.data.addListener("click", (event) => {
    const runwayLength = event.feature.getProperty("length_ft");
    const runwayWidth = event.feature.getProperty("width_ft");
    const runwaySurface = event.feature.getProperty("surface");
    const isRunwayLit = event.feature.getProperty("lighted");
    const isActive = event.feature.getProperty("closed");

    const contentString = `
      <div class="centred-content" style="padding: 10px;">
        <h3>Runway Details</h3>
        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <td><strong>Length:</strong></td>
            <td>${runwayLength} ft</td>
          </tr>
          <tr>
            <td><strong>Width:</strong></td>
            <td>${runwayWidth} ft</td>
          </tr>
          <tr>
            <td><strong>Surface Type:</strong></td>
            <td>${surfaceTypeMap[runwaySurface] || "Unknown"}</td>
          </tr>
          <tr>
            <td><strong>Is Runway Lit?</strong></td>
            <td>${isRunwayLit ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Is Runway Active?</strong></td>
            <td>${isActive ? "No" : "Yes"}</td>
          </tr>
        </table>
      </div>
    `;

    infoWindow.close();

    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);

    infoWindow.open(map);

    infoWindow.addListener("closeclick", () => {
      // Recentre the map on the airport when the info window is closed
      map.panTo(centre);
    });
  });

  return map;
}
