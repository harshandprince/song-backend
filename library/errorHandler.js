let responseLib=require('./../library/responseLib');
let errorHandler=(err,req,res,next)=>{
console.log('application error handler called');
console.log(err);
console.log(err.message);
res.send(responseLib.generate(true,500,'global error',null));
}
let notFoundHandler=(req,res,next)=>{
console.log('global not found handler called');
res.status(404).send(responseLib.generate(true,404,"route not found",null));
}
module.exports={
    errorHandler:errorHandler,
    notFoundHandler:notFoundHandler
}