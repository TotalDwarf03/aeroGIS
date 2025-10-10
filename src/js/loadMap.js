function initMap() {

    const mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
