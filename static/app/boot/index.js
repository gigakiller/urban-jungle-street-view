'use strict';

var Pano = require('map');

function init() {
  var self = this;
  var _panoLoader = new GSVPANO.PanoLoader({zoom: 1});
  var _depthLoader = new GSVPANO.PanoDepthLoader();

  var pano = new Pano();

  _depthLoader.onDepthLoad = function() {
    var x, y, canvas, context, image, w, h, c,pointer;

    canvas = document.createElement("canvas");
    context = canvas.getContext('2d');

    w = this.depthMap.width;
    h = this.depthMap.height;

    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);

    image = context.getImageData(0, 0, w, h);

    for(y=0; y<h; ++y) {
      for(x=0; x<w; ++x) {
        c = this.depthMap.depthMap[y*w + x] / 50 * 255;
        image.data[4*(y*w + x)    ] = c;
        image.data[4*(y*w + x) + 1] = c;
        image.data[4*(y*w + x) + 2] = c;
        image.data[4*(y*w + x) + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);

    //document.body.appendChild(canvas);

    pano.mesh.material.map.image = canvas;
    pano.mesh.material.map.needsUpdate = true;

    canvas = document.createElement("canvas");
    context = canvas.getContext('2d');

    w = this.depthMap.width;
    h = this.depthMap.height;

    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);

    image = context.getImageData(0, 0, w, h);
    pointer = 0;

    var pixelIndex;

    for(y=0; y<h; ++y) {
      for(x=0; x<w; ++x) {
        pointer += 3;
        pixelIndex = (y*w + (w-x))*4;
        image.data[ pixelIndex ] = (this.normalMap.normalMap[pointer]+1)/2 * 255;
        image.data[pixelIndex + 1] = (this.normalMap.normalMap[pointer+1]+1)/2 * 255;
        image.data[pixelIndex + 2] = (this.normalMap.normalMap[pointer+2]+1)/2 * 255;
        image.data[pixelIndex + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);

    //document.body.appendChild(canvas);

    pano.mesh.material.normalMap.image = canvas;
    pano.mesh.material.normalMap.needsUpdate = true;

    pano.render();
  }

  _panoLoader.onPanoramaLoad = function() {
    //document.body.appendChild(this.canvas);
    _depthLoader.load(this.panoId);
  };



/*
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  }
  else {
    _panoLoader.load(new google.maps.LatLng(42.345601, -71.098348));
  }

  function successFunction(position)
  {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      _panoLoader.load(new google.maps.LatLng(lat,lon));
  }

  function errorFunction(position)
  {

    _panoLoader.load(new google.maps.LatLng(40.759101,-73.984406));
  }*/
   _panoLoader.load(new google.maps.LatLng(40.759101,-73.984406));


}

init();
