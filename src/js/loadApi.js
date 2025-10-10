/**
 * Loads the Google Maps API script.
 * Once loaded, it initializes the map.
 * @param {string} apiKey 
 * @returns {void}
 */
function loadMapsAPI(apiKey) {

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;

    script.onerror = function () {
        console.error("Failed to load Google Maps API script.");
    };

    document.head.appendChild(script);
}