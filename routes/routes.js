let express = require("express");
let controllerLogin = require("./../controllers/controllerLogin");
let controllercrudManagement = require("./../controllers/crudcontroller");
let setRouter = (app) => {
  app.post("/login", controllerLogin.login);
  app.post("/signup", controllerLogin.signup);
  app.post("/listSong", controllercrudManagement.listSong);
  app.post("/uploadSong", controllercrudManagement.uploadSong);
  app.post(
    "/getSong",
    controllercrudManagement.getSongStream
  );
  app.post("/editSongListing", controllercrudManagement.editSongListing);
  app.post("/deleteSong", controllercrudManagement.deleteSong);
  app.post("/getAllListings",controllercrudManagement.getAllListings);
};

module.exports = {
  setRouter: setRouter,
};
