let express = require("express");
let mongoose = require("mongoose");
let shortid = require("shortid");
let responseLib = require("../library/responseLib");
let schema = require("../models/signupmodel");
let signupmodel = mongoose.model("signupModel");
let config=require('../config/config');

let login = (req, res) => {
  signupmodel
    .findOne({ email: req.body.email })
    .select("-_id -__v")
    .exec((err, result) => {
      if (result == undefined || result == "" || result == null) {
        res.send(
          responseLib.generate(true, 404, "email id not regisered", "false")
        );
      } else if (err) {
        console.log("error occured while login");
        res.send(
          responseLib.generate(true, 500, "error occured while login", "false")
        );
      } else {
        if (result.password == req.body.password) {
          let o = result;
          o.password = "";
          res.send(responseLib.generate(false, 200, "user verified", o));
        } else {
          res.send(
            responseLib.generate(true, 500, "incorrect password", "false")
          );
        }
      }
    });
};
let signup = (req, res) => {
    let signupmodeldata = new signupmodel({
      uid: shortid.generate(),
      email: req.body.email,
      password: req.body.password
    });
    signupmodel
      .findOne({ email: req.body.email })
      .select("-_id -__v")
      .exec((err, result) => {
        if (result == undefined || result == "" || result == null) {
          signupmodeldata.save((err, result) => {
            if (err) {
              console.log("error occured while signup");
              res.send(
                responseLib.generate(
                  true,
                  500,
                  "error occured while signup",
                  "false"
                )
              );
            }
            res.send(responseLib.generate(false, 200, "signup success", result));
          });
        } else if (err) {
          console.log("error occured while login");
          res.send(
            responseLib.generate(true, 600, "error occured while login", "false")
          );
        } else {
          res.send(
            responseLib.generate(
              true,
              500,
              "user already registered with this email please login",
              "false"
            )
          );
        }
      });
};
module.exports = {
  login: login,
  signup: signup
};
