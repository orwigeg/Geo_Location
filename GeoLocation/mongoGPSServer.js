/**
 * Elizabeth Orwig
 */
class mongoGPSServer {
    // Note:
    // The constructor is called when the 'new' statement
    // (at bottom of file) is executed.
    constructor() {
        // do nothing in this case (never runs since this class is not instantiated)
    }

    static start() {
        var express = require('express'); // express web server framework from NPM
        var favicon = require('express-favicon');
        var mongoose = require('mongoose');
        /*
        Note: To be able to serve a page that can activate GPS on a remote device,
        you must serve it using https.
         */
        var app = express(); // init the framework

        var server = app.listen(3003);

        var connection = mongoose.connect('mongodb://localhost/gpstracker');
        var gpsSchema = new mongoose.Schema(
            {
                'route': String,
                'time': String,
                'lat': String,
                'lon': String
            }
        );
        var GPSModel = mongoose.model('GPS', gpsSchema );

// This is the route that index.html uses to save gps data to mongo
        app.get('/gpsData', function( request, response ) {
            "use strict";
            var url = require('url');  // used for parsing request urls (in order to get params)
            var urlObject = url.parse(request.url,true); // see https://nodejs.org/api/url.html

            var gpsdata = new GPSModel( // create a new GPSModel object
                {
                    'route': urlObject.query["route"],
                    'time': urlObject.query["time"],
                    'lat': urlObject.query["lat"],
                    'lon': urlObject.query["lon"]
                });

            gpsdata.save(function (err) { // save the GPSModel object to Mongo
                //To retrieve entries, use (for example) db.gps.find()
                if (err !== null) {
                    console.log(err); //
                    response.sendStatus(500); // client gets an error if we can't save
                } else {
                    response.sendStatus(200); // ...otherwise client gets "OK"
                }
            });
        });


//This route serves html (and other) files from the /webcontent folder
        app.use(express.static('webcontent') );
    } // end start()
} // end class mongoGPSServer

mongoGPSServer.start();
