/**
 * Converts OSGB36 coordinates to WGS84.
 *
 * This makes a request to an external API to perform the conversion.
 * See: https://www.getthedata.com/bng2latlong
 *
 * @param {number} easting The easting coordinate in OSGB36.
 * @param {number} northing The northing coordinate in OSGB36.
 * @returns {Promise<Object>} A promise that resolves to the WGS84 coordinates.
 */
async function osgb36ToWgs84(easting, northing) {
  const url = `https://api.getthedata.com/bng2latlong/${easting}/${northing}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to convert coordinates.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error converting coordinates:", error);
    throw error;
  }
}

/**
 * Searches for a postcode and retrieves its coordinates.
 * Once the coordinates are found, they are stored in sessionStorage
 * and the user is redirected to the airport finder page where they are handled.
 * @returns {void}
 */
async function searchByPostcode() {
  const postcodeInput = document.querySelector('input[name="search"]');
  const postcode = postcodeInput.value.trim();

  if (!postcode) {
    alert("Please enter a valid postcode.");
    return;
  }

  // Get the first 2 characters of the postcode for area lookup
  const postcodeArea = postcode.slice(0, 2).toLowerCase();

  const postcodeData = await fetch(
    `../../datasets/codePointOpen/CSV/${postcodeArea}.csv`,
  );

  if (!postcodeData.ok) {
    alert("Failed to retrieve postcode data.");
    return;
  }

  const postcodeText = await postcodeData.text();
  const postcodeLines = postcodeText.split("\n");

  let found = false;
  let easting, northing;

  for (const line of postcodeLines) {
    const columns = line.split(",");
    const datasetPostcode = columns[0].toLowerCase().replaceAll('"', "");

    if (datasetPostcode === postcode.toLowerCase()) {
      easting = parseFloat(columns[2]);
      northing = parseFloat(columns[3]);

      found = true;
      break;
    }
  }

  if (!found) {
    alert("Postcode not found.");
    return;
  }

  // Convert OSGB36 to WGS84
  // This is done using https://www.getthedata.com/bng2latlong
  const data = await osgb36ToWgs84(easting, northing);

  sessionStorage.setItem("searchLatitude", data.latitude);
  sessionStorage.setItem("searchLongitude", data.longitude);
  sessionStorage.setItem("searchPostcode", postcode);

  // Redirect to airport finder page
  window.location.href = "airportFinder.html";
}
