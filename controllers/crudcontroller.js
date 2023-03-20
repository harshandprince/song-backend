let express = require("express");
let mongoose = require("mongoose");
let shortid = require("shortid");
let responseLib = require("../library/responseLib");
let schema = require("../models/signupmodel");
let schema2 = require("../models/songModel");
let signupmodel = mongoose.model("signupModel");
let songmodel = mongoose.model("songModel");
const formidable = require('formidable');
var path = require("path");

const fs = require("fs");

let getSongStream = (req, res) => {
  let fpath = path.join(__dirname,"songs/"+req.body.songName);
  console.log(fpath);
  fs.stat(fpath, (err, stats) => {
    // Handle Error when trying to get file stats
    // Respond with 500 Internal Server Error
    if (err) {
      console.log(err)
      return res.sendStatus(500);
    }
    let { size } = stats
    res.status(200)
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', size)
    fs.createReadStream(fpath).pipe(res);
  })
}

let editSongListing = (req, res) => {
  songmodel.findOne({ sid: req.body.sid }).exec((err, song) => {
    if (song == undefined || song == null || song == "") {
      res.send(
        responseLib.generate(
          true,
          500,
          "not found to update, some error while editing listing",
          null
        )
      );
    } else if (err) {
      res.send(
        responseLib.generate(
          true,
          500,
          "some error while editing listing",
          null
        )
      );
    }
    else {
      song.name = req.body.name;
      song.desc = req.body.desc;
      if (req.body.ifiImage == true) {
        //update image*******************
      }
      if (req.body.ifSong) {
        //update song*****************
      }
      song.save((err, song) => {
        if (err) {
          res.send(
            responseLib.generate(
              true,
              500,
              "some error editing listing",
              null
            )
          );
        }
        res.send(
          responseLib.generate(false, 200, "success editing certificate", song)
        );
      });
    }
  });
};

let listSong = (req, res) => {

  var form = new formidable.IncomingForm();
  let fn;
  let name;
  let desc;
  form.parse(req);
  form.on('fileBegin', function (name, file) {
    file.path = __dirname + "/images/" + file.name;
    fn = file.name;
  });
  form.on('field', function (field, value) {
    if(field=='name'){
      name=value;
    }
    if(field=='desc'){
      desc=value;
    }
  });

  form.parse(req, (err, fields, files) => {
    console.log(fields);
    let songmodeldata = new songmodel({
      sid: shortid.generate(),
      name: fields.name,
      desc: fields.desc,
      imageName: fn,
      date: Date.now()
    });
    songmodeldata.save((err, result) => {
      if (err) {
        res.send(
          responseLib.generate(
            true,
            500,
            "some error while listing",
            null
          )
        );
      }
      res.send(
        responseLib.generate(false, 200, "success listing Song", result)
      );
    });

  });

};
let uploadSong = (req, res) => {

  var form = new formidable.IncomingForm();
  let fn;
  let sid;
  form.parse(req);
  form.on('fileBegin', function (name, file) {
    file.path = __dirname + "/songs/" + file.name;
    fn = file.name;
  });

  form.on('field', function (field, value) {
    if(field=='sid'){
      sid=value;
    }
  });

  form.parse(req, (err, fields, files) => {
    songmodel.findOne({ sid: fields.sid }).exec((err, results) =>{
      if (err) {
        res.send(
          responseLib.generate(
            true,
            500,
            "some error while uploading",
            null
          )
        );
      }
      let name=fields.name;
      results.songName=name;
      results.save((err, result) => {
        if (err) {
          
          res.send(
            responseLib.generate(
              true,
              500,
              "some error while listing",
              null
            )
          );
        }
        res.send(
          responseLib.generate(false, 200, "success adding Song", result)
        );
      });
      
    });
  });
};

let getSongDetails = (req, res) => {
  songmodel.findOne({ sid: req.body.sid }).exec((err, result) => {
    if (result == undefined || result == null || result == "") {
      res.send(
        responseLib.generate(
          true,
          500,
          "not found to view, some error while getting song data",
          null
        )
      );
    }
    if (err) {
      res.send(
        responseLib.generate(
          true,
          500,
          "some error while retrieving certificate",
          null
        )
      );
    }
    res.send(
      responseLib.generate(false, 200, "success retrieving song", result)
    );
  });
};

let deleteSong = (req, res) => {
  songmodel.findOneAndDelete({ sid: req.body.sid }).exec((err, result) => {
    if (result == undefined || result == null || result == "") {
      res.send(
        responseLib.generate(
          true,
          500,
          "not found to delete, some error while deleting song listing",
          null
        )
      );
    } else if (err) {
      res.send(
        responseLib.generate(
          true,
          500,
          "some error while deleting song listing",
          null
        )
      );
    }
    else {
      //delete files also like url of image and song**********************
      res.send(responseLib.generate(false, 200, "success deleting song listing", result));
    }
  });
};



let getAllListings = (req, res) => {
  let pageNumber = req.body.pageNumber;
  let size = req.body.size;
  let skip=(pageNumber - 1) * size;
  songmodel.find().skip(skip).limit(size).sort({ date: -1 }).exec((err, listings) => {
    if (err) {
      res.send(
        responseLib.generate(
          true,
          500,
          "some error while retrieving songs",
          null
        )
      );
    }
    songmodel.find().exec((err, all) => {
      if (err) {
        res.send(
          responseLib.generate(
            true,
            500,
            "some error while retrieving songs",
            null
          )
        );
      }
      let o = {
        TotalSongs: all.length,
        listings: listings
      }
      res.send(
        responseLib.generate(
          false,
          200,
          "success retrieving songs",
          o
        )
      );
    });

  });

}



module.exports = {
  editSongListing: editSongListing,
  listSong: listSong,
  uploadSong:uploadSong,
  getSongDetails: getSongDetails,
  deleteSong: deleteSong,
  getAllListings: getAllListings,
  getSongStream: getSongStream
};
