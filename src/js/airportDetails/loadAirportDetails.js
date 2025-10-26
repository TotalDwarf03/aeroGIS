async function loadAirportDetails() {
  // Get airport id from session storage
  const airportId = Number(sessionStorage.getItem("selectedAirportId"));
  if (!airportId) {
    console.error("No airport ID found in session storage.");
    alert("Error: No airport selected. Returning to Airport Finder.");
    window.location.href = "./airportFinder.html";
    return null;
  }

  // Fetch airport data from the dataset
  const airportData = await fetch(
    "../datasets/ourAirports/ourAirports-airports.geojson",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  const airportJson = await airportData.json();

  const airportFeature = airportJson.features.find(
    (feature) => feature.properties.id === airportId,
  );
  if (!airportFeature) {
    console.error("Airport not found in dataset.");
    alert("Error: Airport not found. Returning to Airport Finder.");
    window.location.href = "./airportFinder.html";
    return null;
  }

  return airportFeature;
}

async function renderAirportDetails() {
  const airportFeature = await loadAirportDetails();

  if (!airportFeature) {
    return;
  }

  const airportName = airportFeature.properties.name;
  const airportType = airportFeature.properties.type.replace("_", " ");
  const airportLat = airportFeature.properties.latitude_deg;
  const airportLon = airportFeature.properties.longitude_deg;
  const airportElevation = airportFeature.properties.elevation_ft;
  const airportMunicipality = airportFeature.properties.municipality;
  const airportIcao = airportFeature.properties.icao_code;
  const airportIata = airportFeature.properties.iata_code;
  const airportWebsite = airportFeature.properties.home_link;

  const airportHeading = document.getElementById("airportHeading");
  airportHeading.innerHTML = airportHeading.innerHTML.replace(
    "(airport)",
    `${airportName}`,
  );

  // Populate airport information
  const airportInfoDiv = document.getElementById("airport-info");
  airportInfoDiv.innerHTML = `
        <h3>Details</h3>
        <p><strong>Type:</strong> ${airportType}</p>
        <p><strong>Location:</strong> ${airportMunicipality}</p>
        <p><strong>ICAO Code:</strong> ${airportIcao || "N/A"}</p>
        <p><strong>IATA Code:</strong> ${airportIata || "N/A"}</p>
        <p><strong>Coordinates:</strong> ${airportLat}, ${airportLon}</p>
        <p><strong>Elevation:</strong> ${airportElevation !== null ? airportElevation + " ft" : "N/A"}</p>
        <p>${airportWebsite ? `<a href="${airportWebsite}" target="_blank">${airportName} Website<span class="material-icons inline-icon">open_in_new</span></a>` : "No Website Available"}</p>
    `;

  // Fetch and display Wikipedia information
  const wikiDiv = document.getElementById("airport-wiki");
  const wikiUrl = airportFeature.properties.wikipedia_link;
  if (wikiUrl) {
    wikiDiv.innerHTML = `
            <h3>Wikipedia Information</h3>
            <iframe style="border: 1px solid;" src="${wikiUrl}" width="100%" height="400px"></iframe>
            <a style="display: block; margin-top: 0.5rem;" href="${wikiUrl}" target="_blank">
                Read more on Wikipedia<span class="material-icons inline-icon">open_in_new</span>
            </a>
        `;
  } else {
    wikiDiv.innerHTML =
      "<h3>Wikipedia Information</h3><p>No Wikipedia link available.</p>";
  }
}
