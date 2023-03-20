let express=require('express');
let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let songmodelschema=new Schema(
    {
       sid:{type:String},
       uid:{type:String},
       name:{type:String},
       desc:{type:String},
       imageName:{type:String},
       songName:{type:String},
       date:{type:Date}
    }
);
mongoose.model('songModel',songmodelschema);