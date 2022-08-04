const express= require("express");
const app= express();
const bodyParser=require("body-parser");

app.use(bodyParser.json());

app.post('/',function(req,res){
   var email=req.body.email;
   var amount=req.body.amount;

  res.send({"amount":amount,"email":email });
});




app.listen(3000,function(){
   console.log('server is running on port 3000');

});
