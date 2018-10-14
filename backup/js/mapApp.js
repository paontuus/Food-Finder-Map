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
        //console.log(formData)
        
        console.log(capitalizeLetter(inputData.value))
        
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
    function inputValidate(){
        console.log("hajsan");
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
        'area["boundary"~"administrative"]["name"~"'+ capitalizeLetter(inputData.value) + '"];' + 
        'node(area)["amenity"~"restaurant"];' + 
        'out;', true);
        console.log(capitalizeLetter(inputData.value))
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var json = JSON.parse(xhr.responseText);
                jsonData = json;
                console.log(json);
                //setPolygon();
                if (json.elements.length == 0){
                    alert("Inga resultat hittade, kolla din stavning!")
                }else{
                    var x = document.getElementById("inputfield");
                    x.parentNode.removeChild(x);
                    console.log(x);
                    //inputData.parentNode.removeChild(inputData);
                    createMap();
                }
                
            }
        };
        
    }
    function setFoodMarkers(fromLocation){
        console.log(jsonData.elements)
        
            var markers = []
            for (var i = 0; i < jsonData.elements.length; i++) {
                markers[i] = L.marker([jsonData.elements[i].lat, jsonData.elements[i].lon]).addTo(theMap);
                if( jsonData.elements[i].tags.cuisine != undefined ){
                    markers[i].bindPopup("<h3>" + jsonData.elements[i].tags.name +"</h3><p> Matsort: " + capitalizeLetter(jsonData.elements[i].tags.cuisine) +"<br><br>Avstånd från din användarposition: "+fromLocation.distanceTo(markers[i].getLatLng()).toFixed(0)/1000+ " km.</p>");
                }else{
                    markers[i].bindPopup("<h3>" + jsonData.elements[i].tags.name +"</h3><p> Matsort: Okänd<br><br>Avstånd från din användarposition: "+fromLocation.distanceTo(markers[i].getLatLng()).toFixed(0)/1000+ " km.</p>");
                }
                
            }
        
        /*
        var bearsBbqMarker = L.marker([56.878451, 14.808853]).addTo(theMap);
            bearsBbqMarker.bindPopup("<h3>Bears BBQ & Craft Beer</h3><p>Mustig, mysig mat med med följande mikrobrygger.<br><img src='logotypes/bears.png' height='100' width='310'><br>Avstånd från din användarposition: "+fromLocation.distanceTo(bearsBbqMarker.getLatLng()).toFixed(0)/1000+ " km.</p>");
        var muxiSushiMarker = L.marker([56.878423, 14.809337]).addTo(theMap);
            muxiSushiMarker.bindPopup("<h3>Muxi Sushi</h3><p>Ditt livs bästa sushi, sashimi och misosoppa.<br><img src='logotypes/muxi-sushi.png' height='350' width='250'><br>Avstånd från din användarposition: "+fromLocation.distanceTo(muxiSushiMarker.getLatLng()).toFixed(0)/1000+ " km.</p>");
        var cafeIncMarker = L.marker([56.878395, 14.809787]).addTo(theMap);
            cafeIncMarker.bindPopup("<h3>Café Inc</h3><p>Kaffevagn med koll på allt i kaffeväg.<br><img src='logotypes/cafeinc.png' height='350' width='250'><br>Avstånd från din användarposition: "+fromLocation.distanceTo(cafeIncMarker.getLatLng()).toFixed(0)/1000+ " km.</p>");
        var surstrommingenMarker = L.marker([56.878681, 14.809857]).addTo(theMap);
            surstrommingenMarker.bindPopup("<h3>Surströmmingen</h3><p>Traditionell norrländsk cuisine med aromatisk twist.<br><img src='logotypes/surstrommingen.png' height='250' width='300'><br>Avstånd från din användarposition: "+fromLocation.distanceTo(surstrommingenMarker.getLatLng()).toFixed(0)/1000+ " km.</p>");
        var elCerdoMarker = L.marker([56.878714, 14.809438]).addTo(theMap);
            elCerdoMarker.bindPopup("<h3>El Cerdo – Taqueria & Tocineta</h3><p>Smakexplosioner i fantastiska kombinationer med knorr.<br><img src='logotypes/el-cerdo.png' height='100' width='310'><br>Avstånd från din användarposition: "+fromLocation.distanceTo(elCerdoMarker.getLatLng()).toFixed(0)/1000+ " km.</p>");
        var veghanaMarker = L.marker([56.878754, 14.808946]).addTo(theMap);
            veghanaMarker.bindPopup("<h3>Veghana</h3><p>Kryddigt veganskt krubb utan krusiduller.<br><img src='logotypes/veghana.png' height='200' width='260'><br>Avstånd från din användarposition: "+fromLocation.distanceTo(veghanaMarker.getLatLng()).toFixed(0)/1000+ " km.</p>");*/
    }

    function capitalizeLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /*function setPolygon(){
        var foodMarketPolygon = L.polygon([
            [56.878860, 14.808800],
            [56.878343, 14.808697],
            [56.878253, 14.809946],
            [56.878767, 14.810045]
        ]).addTo(theMap);
            foodMarketPolygon.bindPopup("<h3>Matmarknad Växjö</h3><p>Olika matstånd från världen över.<p>");
    }*/

    return {
        init : init
    };
  
} )();

MapApp.init(); // Run application