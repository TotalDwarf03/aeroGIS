// This file contains functions related each letter of AeroGIS on the homepage map

/**
 * Handle click events on the 'A' letter feature
 *
 * This function will invert the colours of the AeroGIS regions when the 'A' feature is clicked.
 * @param {MouseEvent} event The click event
 * @param {Promise<google.maps.Map>} map The Google Map instance
 */
function handleAClick(event, map) {
  var aClicked = sessionStorage.getItem("a_clicked");
  aClicked = aClicked === "true"; // Convert string to boolean

  map.data.setStyle(function (feature) {
    var id = feature.getProperty("id");
    let colour;

    if (aClicked) {
      colour = id > 3 ? "#81bc37" : "#205d95";
    } else {
      colour = id <= 3 ? "#81bc37" : "#205d95";
    }

    return {
      fillColor: colour,
      fillOpacity: 0.8,
      strokeColor: colour,
      strokeWeight: 3,
      strokeOpacity: 1,
      draggable: true,
    };
  });

  // Toggle the state of 'a_clicked'
  sessionStorage.setItem("a_clicked", !aClicked);
}

function handleRDoubleClick(event, map) {
  const feature = event.feature;
  map.data.setStyle(function (feature) {
    let colour;

    if (feature.getProperty("letter") === "r") {
      colour = "#ff0000";
    } else {
      var id = feature.getProperty("id");
      colour = id > 3 ? "#81bc37" : "#205d95";
    }

    return {
      fillColor: colour,
      fillOpacity: 0.8,
      strokeColor: colour,
      strokeWeight: 3,
      strokeOpacity: 1,
      draggable: true,
    };
  });
}

export { handleAClick, handleRDoubleClick };
