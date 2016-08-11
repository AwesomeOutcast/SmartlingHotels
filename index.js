var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var url = require('url');

// Set port for the app to run on
app.set('port', (process.env.PORT || 5000));

//Serve files in the 'public' directory
app.use(express.static('public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/* Fields */
var nav = JSON.parse(require('fs').readFileSync('./data/strings/en/nav.json', 'utf8'));
var data = JSON.parse(require('fs').readFileSync('./data/strings/en/data.json', 'utf8'));
var hotels = JSON.parse(require('fs').readFileSync('./data/strings/en/hotels.json', 'utf8'));
var locations = JSON.parse(require('fs').readFileSync('./data/strings/en/locations.json', 'utf8'));
var descriptions = JSON.parse(require('fs').readFileSync('./data/strings/en/meta.json', 'utf8'));
/* Fields */

app.get('/browse/:city', function (request, response) {
    var city = request.params.city;
    var results = [];
    var description = "";
    for (var i = 0; i < hotels.length; i++) {
        var hotel = hotels[i];
        if (hotel.prevLink.toLowerCase() === city.toLowerCase()) {
            results.push(hotel);
        }
    }
    if (results.length > 0) {
        description = descriptions.browse.results + results[0].address.city + ", " + results[0].address.state;
        response.render('pages/hotel_results', {
            nav: nav,
            hotels: results,
            locations: locations,
            city: city,
            description: description
        });
    }
    else {
        results = 0;
        description = descriptions.results404;
        response.render('pages/results404', {
            nav: nav,
            locations: locations,
            city: city,
            results: results,
            description: description
        });
    }
});

app.get('/about_us', function (request, response) {
    var titleTxt = nav.about_us.text;
    var data2 = data.about_us;
    var description = descriptions.about_us;
    response.render('pages/page', {nav: nav, data: data2, titleTxt: titleTxt, description: description});
});

app.get('/browse', function (request, response) {
    var description = descriptions.browse.default;
    response.render('pages/browse', {nav: nav, locations: locations, description: description});
});

app.get('/site_map', function (request, response) {
    var titleTxt = nav.site_map.text;
    var data2 = data.site_map;
    var description = descriptions.site_map;
    response.render('pages/page', {nav: nav, data: data2, titleTxt: titleTxt, description: description});
});

app.get('/support', function (request, response) {
    var titleTxt = nav.support.text;
    var data2 = data.support;
    var description = descriptions.support;
    response.render('pages/page', {nav: nav, data: data2, titleTxt: titleTxt, description: description});
});

app.get('/:hotelPath', function (request, response) {
    var hotelPath = request.params.hotelPath;
    var currentHotel = {};
    var description = "";
    for (var i = 0; i < hotels.length; i++) {
        var hotel = hotels[i];
        if (hotel.link.toLowerCase() === hotelPath.toLowerCase()) {
            currentHotel = hotel;
            description = hotel.description1;
        }
    }
    if (Object.keys(currentHotel).length > 0) {
        response.render('pages/hotel_page', {
            nav: nav,
            hotel: currentHotel,
            locations: locations,
            description: description
        });
    } else {
        description = descriptions.page404;
        response.render('pages/page404', {nav: nav, locations: locations, description: description});
    }
});

/*
 app.get('/:language/', function(request, response) {
 var language = request.params.language;
 var data = JSON.parse(require('fs').readFileSync('./data/strings/en/data.json', 'utf8'));
 response.render('pages/index', {nav: nav, data: data});
 });
 */


app.get('/', function (request, response) {
    var description = descriptions.index;
    response.render('pages/index', {nav: nav, data: data, description: description});
});


// This is for parsing query strings, might want it later
//var urlData = url.parse(request.url,true).query;


// Set the server listening for requests
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});








