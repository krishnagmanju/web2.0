const express= require("express");
const app= express();
const bodyParser=require("body-parser");
const {save_user_information} = require('./models/server_db');
const path=require('path');
const publicPath = path.join(__dirname,'./public');
const paypal=require('paypal-rest-sdk');


app.use(bodyParser.json());
app.use(express.static(publicPath));

/*paypal configuration*/
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Afs5p5MEQGIpH1gycXP3AtVfTj5q0lsbp3X8Ckb9lCiWN3c_5xnIVrB8-WiA4rmWm5QyciUmQqwLFkxd',
  'client_secret': 'EM6dzbIl-5LO5kb6B_Mqg2LgnmyOb6czzboZALNrowT8LVo_1cuuIHZRebiKpTDwcMywypzgwaDe2MCk'
});

app.post('/post_info', async (req,res)=>{
   var email=req.body.email;
   var amount=req.body.amount;

   if (amount<=1){
     return_info={};
     return_info.error=true;
     return_info.message="The amount should be greater than 1";
     return res.send(return_info);
   }
  var result = await save_user_information({"amount":amount,"email":email});

  var create_payment_json = {
   "intent": "sale",
   "payer": {
       "payment_method": "paypal"
   },
   "redirect_urls": {
       "return_url": "http://localhost:3000/success",
       "cancel_url": "http://localhost:3000/cancel"
   },
   "transactions": [{
       "item_list": {
           "items": [{
               "name": "Lottery",
               "sku": "Funding",
               "price": amount,
               "currency": "USD",
               "quantity": 1
           }]
       },
       "amount": {
           "currency": "USD",
           "total": amount
       },
       "payee":{
         'email':'lottery.manager1@lotteryapp.com'
       },
       "description": "Lottery purchase."
   }]
};


paypal.payment.create(create_payment_json, function (error, payment) {
   if (error) {
       throw error;
   } else {
       console.log("Create Payment Response");
       console.log(payment);
       for (var i=0; i< payment.links.length;i++){
         if(payment.links[i].rel == 'approval_url'){
           return res.send(payment.links[i].href);
         }
       }
   }
});



});

app.get("/get_total_amount", async (req,res)=>{
   var result = await get_total_amount();
  res.send(result);
});





app.listen(3000,()=>{
   console.log('server is running on port 3000');

});
