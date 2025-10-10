function initMap() {
  const mapOptions = {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);

  return map;
}
