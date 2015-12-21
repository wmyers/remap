//The following example reduces the saturation on all features and disables labels on roads.
module.exports = [
  {
    stylers: [
      { hue: "#313649" },
      { saturation: -80 },
      { lightness: -20 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 70 },
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];
