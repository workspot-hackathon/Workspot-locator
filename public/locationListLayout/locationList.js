let listSpots = {};
let markers = {};
let detailsCallBack;
let listSpotsMap;
let LocationList = function () {
  let $cards = $('.workspot-list');

  function renderCards(spots) {
    $cards.empty();
    var source = $('#card-template').html();
    var template = Handlebars.compile(source);
    for (let i = 0; i < spots.length; i++) {
      let obj = {
        name: spots[i].name,
        address: spots[i].address.text,
        photo: spots[i].photo[0],
        id: spots[i]._id
      }
      if (workspot.isItemInMapBounds(spots[i].address)) {

        var newHTML = template(obj);
        $cards.append(newHTML);
      }
    }
  }

  //ugly code
  var filterSpots = function (text) {
    text = text.toLowerCase();
    let tempSpots = listSpots.filter(function (spot) {
      return spot.name.toLowerCase().startsWith(text) || spot.address.text.toLowerCase().includes(text);
    });

    let toHide = listSpots.filter(function (spot) {
      return !(spot.name.toLowerCase().startsWith(text) || spot.address.text.toLowerCase().includes(text));
    });

    for(let i=0; i < toHide.length; i++) {
      markers[toHide[i]._id].setVisible(false);
    }

    for(let i=0; i < tempSpots.length; i++) {
      markers[tempSpots[i]._id].setVisible(true);
    }

    renderCards(tempSpots);
  }
  var setDetailsCallBack = function (callback) {
    detailsCallBack = callback;
  }
  return {
    renderCards: renderCards,
    filterSpots: filterSpots,
    setDetailsCallBack: setDetailsCallBack,
    detailsCallBack: detailsCallBack
  }

}

let list = LocationList();
const arrayToObject = (array) =>
   array.reduce((obj, item) => {
     obj[item._id] = item
     return obj
   }, {});

// call back for all the spots
workspot.getSpots(function (spots, markersArr) {
  listSpots = spots;
  markers = markersArr;
  listSpotsMap = arrayToObject(spots)
  list.renderCards(spots);
});

var old = iFrameDetails.onload;
iFrameDetails.onload = function () {
  console.log("iFrameDetails loaded");
  if(old) { old(); }
  list.setDetailsCallBack(iFrameDetails.contentWindow.workWindow.openDetails);
}
// search the spots when the input-search is changed
$('#search-list').on('input', function () {
  var input = $('#search-list').val().trim();
  if (input != '') {
    list.filterSpots(input);
  } else {
    list.filterSpots('');
  }
});

$('.workspot-list').on('mouseenter', '.list-item', function(){
  var defaultIcon = 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless_hdpi.png'
  markers[$(this).data().id].setIcon(defaultIcon);
});

$('.workspot-list').on('mouseleave', '.list-item', function(){
  var defaultIcon = 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless_hdpi.png'
  markers[$(this).data().id].setIcon('https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png');
})

$('.workspot-list').on('click', '.list-item', function(){
  if (detailsCallBack) {
    detailsCallBack(listSpotsMap[$(this).data().id]);
    $('#spot-details-container').fadeIn(250);
  }
})

$('#filter-options').change(function() {
console.log($(this).find(":selected").val());
});

$('.selectpicker').selectpicker({
  // style: 'btn-info',
  
});





