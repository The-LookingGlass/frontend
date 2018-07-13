var key = "AIzaSyAGiNsd-zPf5pwe6_JN32W5fth_yhLtTt0";
/*var location = [[], // Antrim
[], // Armagh
[], // Carlow
[], // Cavan
[], // Clare
[], // Cork
[], // Derry
[], // Donegal
[], // Down
[53.350140, -6.266155], // Dublin
[], // Fermanagh
[], // Galway
[], // Kerry
[], // Kildare
[], // Kilkenny
[], // Laois
[], // Leitrim
[], // Limerick
[], // Longford
[], // Louth
[], // Mayo
[], // Meath
[], //Monaghan
[], //Offaly
[], //Roscommon
[], //Sligo
[], //Tipperary
[], //Tyrone
[], //Waterford
[], // Westmeath
[], //Wexford
[] //Wicklow
] ; */
var long_county = ["Carlow", 
"Cavan", 
"Clare", 
"Cork", 
"Donegal", 
"Dublin", 
"Galway", 
"Kerry", 
"Kildare", 
"Kilkenny", 
"Laois", 
"Leitrim", 
"Limerick", 
"Longford", 
"Louth", 
"Mayo", 
"Meath", 
"Monaghan", 
"Offaly", 
"Roscommon", 
"Sligo", 
"Tipperary", 
"Waterford", 
"Westmeath", 
"Wexford", 
"Wicklow"
];
function myMap() {

var mapProp= {
    center:new google.maps.LatLng(52.9808,-6.0446),
    zoom:11.9,
};

var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}