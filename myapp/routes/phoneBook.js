var express = require('express');
var router = express.Router();
var mongodb = require('../config/lib/mongodb');

/* create phone record  */
router.post('/create', function(req, res, next) {
    mongodb.getOne(mongodb.getDBConnection(), "record", { name: req.body.name }, function (err, doc) {
        if (err) {
            res.send("request failed.");
           // callback(true, response.get("error", "e-response-0001", ));
        } else if (doc != null && doc.name == req.body.name) {
            res.send("phone number already exists");
            // callback(true, response.get("error", "e-response-0002", "A package already exist with that name"));
        } else {
            var saveObject = {};
            saveObject.name = req.body.name;
            saveObject.phoneNumber = req.body.phoneNumber;
            saveObject.address = req.body.address;
            mongodb.createOne(mongodb.getDBConnection(), "record", saveObject, function (err, data) {
                if (err) {
                    res.send("request failed.");
                } else {
                    res.send("phone number added successfully");
                }
            });

        }
    });
});

router.get('/', function(req, res, next) {
    mongodb.getAll(mongodb.getDBConnection(), "record", {}, function (err, doc) {
        if (err) {
            res.send("request failed.");
           // callback(true, response.get("error", "e-response-0001", "request failed."));
        } else {
            res.send(doc);
          //  callback(false, response.get("success", "s-response-0002", "Fetched All Packages Successfully", doc));
        }
    });
});

router.put('/modify',  function (req, res, next) {
    var setCol = {};
    setCol.phoneNumber = req.body.phoneNumber;
    setCol.address = req.body.address;
    mongodb.updateOne(mongodb.getDBConnection(), "record", { name: req.body.name }, setCol, function (err, doc) {
        if (err) {
            res.send("request failed.");
        } else {
            res.send("phonenumber modified successfully.");
        }
    });
});


router.delete('/', function (req, res, next) {
    mongodb.deleteOne(mongodb.getDBConnection(), "record", { name: req.query.name }, function (err, doc) {
        if (err) {
            res.send("request failed.");
        } else {
            res.send("profile deleted successfully");
        }
    });
});

module.exports = router;
