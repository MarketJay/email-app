const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

const port = process.env.port || 3000;

const details = require("./details.json");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`The server started on port ${port} !!!!!!`);
});

app.get("/", (req, res) => {
  res.send(
    "<h1 style='text-align: center'>Wellcome to FunOfHeuristic <br><br>😃👻😃👻😃👻😃👻😃</h1>"
  );
});

app.post("/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
    res.send(info);
  });
});

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   secure: true, // true for 465, false for other ports
  //   auth: {
  //     user: details.email,
  //     pass: details.password
  //   }
  // });

  let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: details.email,
      pass: details.password
    }
  }));


  var table = '';
  table= table.concat('<h4><table> <tr style="background-color: antiquewhite;"> <td width=20px align ="center"># </td><td width=200px>Product Name </td><td width=50px align ="center">Qty</td><td width=80px align ="right">Price </td> </tr>');
  for(var index=0; user.products.length>index; index++){
    table= table.concat(`<tr style="background-color: beige;"> <td width=20px align ="center">${index+1}</td><td width=200px>${user.products[index].name}</td><td width=50px align ="center">${user.products[index].count} </td><td width=80px align ="right">${user.products[index].price}</td> </tr>`);
  }
  table= table.concat('<tr><td  colspan="4" style="border-top:dashed 2px #179dd8;"></td></tr>');
  table= table.concat('<tr style="background-color: palegreen;"><td colspan="3" align ="right">Delivery Fee</td><td>Rs 200.00</td></tr>');
  table= table.concat(`<tr style="background-color: palegreen;"><td colspan="3" align ="right">Total Price</td><td>Rs ${user.totalPrice}</td></tr>`);
  table= table.concat('</table> </h4>');

  let mailOptions = {
    from: '"MARKET-JAY"<jayodafruits@gmail.com>', // sender address
    to: user.email, // list of receivers,
    cc:'janithag@gmail.com',
    subject: `MARKET-JAY E-Bill | ${user.orderNo}`, // Subject line
    html: `<h2>Hi ${user.name}</h2><br>
    <h3>Thanks for purchesing from MARKET-JAY App..!!</h3><br>
    <h3>Order Reference: ${user.orderNo}</h3><br>
    <h3>Order Date & Time: ${user.date}</h3><br>
    <h3>Your total price: Rs ${user.totalPrice}</h3><br>`+table

    
  };
  console.log(table);
  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}

// main().catch(console.error);
