
  var map;
  var marqueurs = [];
  var marqueurs_nearMe = [];
  var marqueur_myPos;
  var parcours = [];
  // var lat = marqueur_myPos.getPosition().lat();
  // var lng = marqueur_myPos.getPosition().lng();

  var infowindow;
  var localise = false;

  function DistanceBetweenKM(lat1, lon1, lat2, lon2){
    var rlat1 = Math.PI * lat1/180;
    var rlat2 = Math.PI * lat2/180;
    var rlon1 = Math.PI * lon1/180;
    var rlon2 = Math.PI * lon2/180;

    var theta = lon1-lon2;
    var rtheta = Math.PI * theta/180;

    var dist = Math.sin(rlat1) * Math.sin(rlat2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.cos(rtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;

    dist = dist * 1.609344;
    return dist;
  }

  function addToPath(lat, lon){
    parcours.push(new google.maps.LatLng(lat, lon)); // alert(lat + ", " + lon);
  }

  function nearMe(dist_km){
    if(DistanceBetweenKM(marqueur_myPos.getPosition().lat(), marqueur_myPos.getPosition().lng(), 42.713537, 17.971721) < dist_km){
      var i0 = marqueurs_nearMe.length;
      marqueurs_nearMe.push(new google.maps.Marker({
                    position: new google.maps.LatLng(42.713537, 17.971721),
                    map: map,
                    title: 'All�e de l\'arboretum'
                  }));

      var cs0 = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Moi</h1>'+
            '<div id="bodyContent">'+
            '<p><b>All�e de l\'arboretum</b>. ' +
            'Coucou les amiiiiiiiis !!! '+
            'ceci est un test !'+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            '<a href="#" onClick="addToPath(42.713537, 17.971721)">Ajouter au parcours</a> '+
            '</div>'+
            '</div>';
      var iw0 = new google.maps.InfoWindow({
          content: cs0
      });

      google.maps.event.addListener(marqueurs_nearMe[i0], 'click', function() {
        iw0.open(map, marqueurs_nearMe[i0]);
      });
    }

    if(DistanceBetweenKM(marqueur_myPos.getPosition().lat(), marqueur_myPos.getPosition().lng(), 55.244390, -6.368876) < dist_km){
      var i1 = marqueurs_nearMe.length;
      marqueurs_nearMe.push(new google.maps.Marker({
                    position: new google.maps.LatLng(55.244390, -6.368876),
                    map: map,
                    title: 'Port Ballintoy'
                  }));

      var cs1 = '<div id="content1">'+
            '<div id="siteNotice1">'+
            '</div>'+
            '<h1 id="firstHeading1" class="firstHeading">Moi</h1>'+
            '<div id="bodyContent1">'+
            '<p><b>Moi</b>, also referred to as <b>Nheon</b>. ' +
            'Coucou les amiiiiiiiis !!! '+
            'ceci est un test !'+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            '<a href="#" onClick="addToPath(55.244390, -6.368876)">Ajouter au parcours</a> '+
            '</div>'+
            '</div>';
      var iw1 = new google.maps.InfoWindow({
          content: cs1
      });

      google.maps.event.addListener(marqueurs_nearMe[i1], 'click', function() {
        iw1.open(map, marqueurs_nearMe[i1]);
      });
    }

    if(DistanceBetweenKM(marqueur_myPos.getPosition().lat(), marqueur_myPos.getPosition().lng(), 55.210863, -6.579595) < dist_km){
      var i2 = marqueurs_nearMe.length;
      marqueurs_nearMe.push(new google.maps.Marker({
                    position: new google.maps.LatLng(55.210863, -6.579595),
                    map: map,
                    title: 'Ch�teau Greyjoy'
                  }));

      var cs2 = '<div id="content2">'+
            '<div id="siteNotice2">'+
            '</div>'+
            '<h1 id="firstHeading2" class="firstHeading">Moi</h1>'+
            '<div id="bodyContent2">'+
            '<p><b>Moi</b>, also referred to as <b>Nheon</b>. ' +
            'Coucou les amiiiiiiiis !!! '+
            'ceci est un test !'+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            '<a href="#" onClick="addToPath(55.210863, -6.579595)">Ajouter au parcours</a> '+
            '</div>'+
            '</div>';
      var iw2 = new google.maps.InfoWindow({
          content: cs2
      });

      google.maps.event.addListener(marqueurs_nearMe[i2], 'click', function() {
        iw2.open(map, marqueurs_nearMe[i2]);
      });
    }

    if(DistanceBetweenKM(marqueur_myPos.getPosition().lat(), marqueur_myPos.getPosition().lng(), 31.509912, -9.774515) < dist_km){
      var i3 = marqueurs_nearMe.length;
      marqueurs_nearMe.push(new google.maps.Marker({
                    position: new google.maps.LatLng(31.509912, -9.774515),
                    map: map,
                    title: 'Jet�e du port d\'Essaouira'
                  }));

      var cs3 = '<div id="content3">'+
            '<div id="siteNotice3">'+
            '</div>'+
            '<h1 id="firstHeading3" class="firstHeading">Moi</h1>'+
            '<div id="bodyContent3">'+
            '<p><b>Moi</b>, also referred to as <b>Nheon</b>. ' +
            'Coucou les amiiiiiiiis !!! '+
            'ceci est un test !'+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            '<a href="#" onClick="addToPath(31.509912, -9.774515)">Ajouter au parcours</a> '+
            '</div>'+
            '</div>';
      var iw3 = new google.maps.InfoWindow({
          content: cs3
      });

      google.maps.event.addListener(marqueurs_nearMe[i3], 'click', function() {
        iw3.open(map, marqueurs_nearMe[i3]);
      });
    }

    if(DistanceBetweenKM(marqueur_myPos.getPosition().lat(), marqueur_myPos.getPosition().lng(), 50.482566, 2.554207) < dist_km){
      var i4 = marqueurs_nearMe.length;
      marqueurs_nearMe.push(new google.maps.Marker({
                    position: new google.maps.LatLng(50.482566, 2.554207),
                    map: map,
                    title: 'Bruay la buissiere'
                  }));

      var cs4 = '<div id="content4">'+
            '<div id="siteNotice4">'+
            '</div>'+
            '<h1 id="firstHeading4" class="firstHeading">Moi</h1>'+
            '<div id="bodyContent4">'+
            '<p><b>Moi</b>, also referred to as <b>Nheon</b>. ' +
            'Coucou les amiiiiiiiis !!! '+
            'ceci est un test !'+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            '<a href="#" onClick="addToPath(50.482566, 2.554207)">Ajouter au parcours</a> '+
            '</div>'+
            '</div>';
      var iw4 = new google.maps.InfoWindow({
          content: cs4
      });

      google.maps.event.addListener(marqueurs_nearMe[i4], 'click', function() {
        iw4.open(map, marqueurs_nearMe[i4]);
      });
    }

    if(DistanceBetweenKM(marqueur_myPos.getPosition().lat(), marqueur_myPos.getPosition().lng(), 50.638125, 3.063989) < dist_km){
      var i5 = marqueurs_nearMe.length;
      marqueurs_nearMe.push(new google.maps.Marker({
                    position: new google.maps.LatLng(50.638125, 3.063989),
                    map: map,
                    title: 'Sc�ne du restaurant Bar Morel et Fils'
                  }));

      var cs5 = '<div id="content5">'+
            '<div id="siteNotice5">'+
            '</div>'+
            '<h1 id="firstHeading5" class="firstHeading">Moi</h1>'+
            '<div id="bodyContent5">'+
            '<p><b>Moi</b>, also referred to as <b>Nheon</b>. ' +
            'Coucou les amiiiiiiiis !!! '+
            'ceci est un test !'+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            '<a href="#" onClick="addToPath(50.638125, 3.063989)">Ajouter au parcours</a> '+
            '</div>'+
            '</div>';
      var iw5 = new google.maps.InfoWindow({
          content: cs5
      });

      google.maps.event.addListener(marqueurs_nearMe[i5], 'click', function() {
        iw5.open(map, marqueurs_nearMe[i5]);
      });
    }

    if(DistanceBetweenKM(marqueur_myPos.getPosition().lat(), marqueur_myPos.getPosition().lng(), 51.05, 2.36667) < dist_km){
      var i6 = marqueurs_nearMe.length;
      marqueurs_nearMe.push(new google.maps.Marker({
                    position: new google.maps.LatLng(51.05, 2.36667),
                    map: map,
                    title: 'Sc�ne du pipi'
                  }));


      var cs6 = '<div id="content6">'+
            '<div id="siteNotice6">'+
            '</div>'+
            '<h1 id="firstHeading6" class="firstHeading">Moi</h1>'+
            '<div id="bodyContent6">'+
            '<p><b>Moi</b>, also referred to as <b>Nheon</b>. ' +
            'Coucou les amiiiiiiiis !!! '+
            'ceci est un test !'+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            'bididoudidididaksdfiejvbidadidoubidididam '+
            '<a href="#" onClick="addToPath(51.05, 2.36667)">Ajouter au parcours</a> '+
            '</div>'+
            '</div>';
      var iw6 = new google.maps.InfoWindow({
          content: cs6
      });

      google.maps.event.addListener(marqueurs_nearMe[i6], 'click', function() {
        iw6.open(map, marqueurs_nearMe[i6]);
      });
    }
  }

  function initialize() {
    var mapOptions = {
      center: { lat: 50.701200, lng: 3.158245},
      zoom: 8
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    marqueur_myPos = new google.maps.Marker({
      position: new google.maps.LatLng(0, 0),
      map: null,
      title: 'C\'est moi !'
    });

    var contentString = '<div id="content7">'+
              '<div id="siteNotice7">'+
              '</div>'+
              '<h1 id="firstHeading7" class="firstHeading">Moi</h1>'+
              '<div id="bodyContent7">'+
              '<p><b>Moi</b>, also referred to as <b>Nheon</b>. ' +
              'Coucou les amiiiiiiiis !!! '+
              'ceci est un test !'+
              'bididoudidididaksdfiejvbidadidoubidididam '+
              'bididoudidididaksdfiejvbidadidoubidididam '+
              'bididoudidididaksdfiejvbidadidoubidididam '+
              '</div>'+
              '</div>';
    infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(marqueur_myPos, 'click', function() {
      infowindow.open(map, marqueur_myPos);
    });
    geolocaliseUser();
  }

  function drawParcours(){
    parcours.splice(0, 0, new google.maps.LatLng(marqueur_myPos.getPosition().lat(), marqueur_myPos.getPosition().lng()));
    addPath(parcours);
  }

  function addPath(tab){
    var traceParcoursBus = new google.maps.Polyline({
      path: tab,//chemin du trac�
      strokeColor: "#FF0000",//couleur du trac�
      strokeOpacity: 1.0,//opacit� du trac�
      strokeWeight: 2//grosseur du trac�
    });

    //lier le trac� � la carte
    //ceci permet au trac� d'�tre affich� sur la carte
    traceParcoursBus.setMap(map);

    /*for (var i=0; i<tab.length; i++) {
      var image = 'c2.jpg';
      marqueurs.push(new google.maps.Marker({
        position: tab[i],
        map: map,
        icon: image
      }));
    }*/

  }

  function testAddPath(){
    var parcoursBus = [
      new google.maps.LatLng(46.781367900048, 6.6401992834884),
      new google.maps.LatLng(46.780821285011, 6.6416348016222),
      new google.maps.LatLng(46.780496546047, 6.6421830461926),
      new google.maps.LatLng(46.779835306991, 6.6426765713417),
      new google.maps.LatLng(46.777748677169, 6.6518819126808),
      new google.maps.LatLng(46.778027878803, 6.6541349682533),
      new google.maps.LatLng(46.778484884759, 6.6557324922045),
      new google.maps.LatLng(46.778752327087, 6.6573654211838),
      new google.maps.LatLng(20.778605381016, 40.6588674582321)
    ];
    addPath(parcoursBus);
  }

  function move(){
    var longitude;
    var latitude;

    latitude = parseFloat(document.getElementById("txtlat").value);
    longitude = parseFloat(document.getElementById("txtlong").value);

    if(!isNaN(latitude) && !isNaN(longitude)){
      map.panTo(new google.maps.LatLng(latitude, longitude));
    }

    testAddPath();
  }

  function successCallback(position){
    map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    marqueur_myPos.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    marqueur_myPos.setMap(map);
    setTimeout("map.setZoom(12)", 1000);
    if(!localise){localise=true;
      nearMe(50);}
  }

  function geolocaliseUser(){
    if (navigator.geolocation)
      var watchId = navigator.geolocation.watchPosition(successCallback, null, {enableHighAccuracy:true});
    else
      alert("Votre navigateur ne prend pas en compte la g�olocalisation HTML5");
  }

  google.maps.event.addDomListener(window, 'load', initialize);