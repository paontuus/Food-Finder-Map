/**
 * App for navigating a food market
 * Author: Pontus Öhling Hansson
 */
var MapApp = ( function() {
    // Properties
    var i = 0;
    var theMap;
    var xhr;
    var inputData = document.getElementById("inputText");
    var jsonData;
    // Methods
    function init() {
        // Application init code
        var addButton = document.getElementById("addWord");
            addButton.addEventListener("click", ajaxCalls);
    }
    function createMap(){
       
        theMap = L.map("map");
        theMap.locate({setView: true, maxZoom: 14});

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicGFvbnR1dXMiLCJhIjoiY2pjZGVnOHlpMTBpMDMzcGVyNnBveWtlYiJ9.oBaIkVeqUQ1Ec0J1W6MN8Q', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(theMap);

        theMap.on('locationerror', ifPositionNotFound);
        theMap.on('locationfound', ifPositionFound);
    }

    function ifPositionNotFound(e){
        alert(e.message);
    }

    function ifPositionFound(e){
        var myPositionIcon = L.icon({
            iconUrl: 'img/userPosition.png', iconSize: [32,32]
        });
        var myPosition = L.marker(e.latlng, {icon: myPositionIcon}).addTo(theMap);
            myPosition.bindPopup("<h3>Din position</h3>");

        fromLocation = myPosition.getLatLng();
        
        setFoodMarkers(fromLocation);
    }

    function ajaxCalls(){

        if (XMLHttpRequest)
        	xhr = new XMLHttpRequest();
        else if (ActiveXObject)
        	xhr = new ActiveXObject("Microsoft.XMLHTTP");
        else {
        	alert("Ajax not supported");
        	return false;
        }
        
        xhr.open("GET", 'https://lz4.overpass-api.de/api/interpreter?data=' + '[out:json]' + '[timeout:60];' + 
        'area["boundary"~"administrative"]["name"~"Växjö"];' + 
        'node(area)["amenity"~"restaurant"];' + 
        'out;', true);
        console.log(capitalizeLetter(inputData.value))
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var json = JSON.parse(xhr.responseText);
                jsonData = json;
                if (json.elements.length == 0){
                    alert("Inga resultat hittade, kolla din stavning!")
                }else{
                    var x = document.getElementById("inputfield");
                    x.parentNode.removeChild(x);
                    createMap();
                }
                
            }
        };
        
    }
    function setFoodMarkers(fromLocation){
            var markers = []
            for (var i = 0; i < jsonData.elements.length; i++) {
                markers[i] = L.marker([jsonData.elements[i].lat, jsonData.elements[i].lon]).addTo(theMap);
                if( jsonData.elements[i].tags.cuisine != undefined ){
                    markers[i].bindPopup("<h3>" + jsonData.elements[i].tags.name +"</h3><p> Matsort: " + capitalizeLetter(jsonData.elements[i].tags.cuisine) +"<br><br>Avstånd från din användarposition: "+fromLocation.distanceTo(markers[i].getLatLng()).toFixed(0)/1000+ " km.</p>");
                }else{
                    markers[i].bindPopup("<h3>" + jsonData.elements[i].tags.name +"</h3><p> Matsort: Okänd<br><br>Avstånd från din användarposition: "+fromLocation.distanceTo(markers[i].getLatLng()).toFixed(0)/1000+ " km.</p>");
                }
                
            }
    }

    function capitalizeLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
        init : init
    };
  
} )();

MapApp.init(); // Run application