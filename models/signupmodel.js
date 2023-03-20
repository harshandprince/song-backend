let express=require('express');
let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let signupmodelschema=new Schema(
    {
       uid:{type:String},
       email:{type:String,unique:true},
       password:{type:String},
    }
);
mongoose.model('signupModel',signupmodelschema);