let generate=(error,status,message,data)=>{
let o={
    "error":error,
    "status":status,
    "message":message,
    "data":data
}
return o;
}
module.exports={
    generate:generate
}