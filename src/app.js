const express=require("express");
const app=express();
const nodemailer=require('nodemailer');
const path=require("path");
const hbs=require("hbs");
require("./db/conn.js");
const Register=require("./models/registers");  
const Waiter=require("./models/availability");
const bodyParser=require('body-parser'); 
const { Console } = require("console");
const port=process.env.PORT || 3000;

const static_path=path.join(__dirname, "../public");

app.use(express.static(static_path));
app.set("view engine", "ejs");

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.urlencoded({extended:false}));
app.use(express.json());

        let c=0;
        Register.find({}, function(error, tables) {
            const ta=tables;
            v=ta.length-1;
            for(var i=0;i<ta.length;i++){
                c++;
            }  
          if(c<12){
            Waiter.find({},function(error,data){
                const datas=data;
                for(var j=0;j<datas.length;j++){
                    const email=datas[j].email;
                    var transporter=nodemailer.createTransport({
                      host:'smtp.gmail.com',
                      port:587,
                      secure:false,
                      requireTLS:true,
                      auth:{
                          user:'smithlorez164@gmail.com',
                          pass:'Asdf@1234'
                      }
                });
                  
                let mailOptions = {
                      from:'smithlorez164@gmail.com',
                      to:email,
                      subject:'Available',
                      text:'Seats are now available you can reserve it now'
                }
                  
                transporter.sendMail(mailOptions, function(err, data){
                      if(err){
                          console.log('Error Occurs', err);
                      }else{
                          console.log('Email sent...');
                      }
                  });
                }
            })
          }
        });

app.get("/", jsonParser, async(req,res)=>{
    try{
        Register.find({}, function(error, tables) {
            res.render("index", {
                 tableList:tables
                })
            }).sort({"table":1})    
    }
    catch(e){
        res.status(400).send(e);
    }
});

app.get('/seats', jsonParser, async(req,res) => {
    try{
        Register.find({}, function(error, tables) {
            res.render("seats", {
                tableList:tables
            })
        }).sort({"table":1})
    }
    catch(e){
        res.status(400).send(e);
    }
})

app.get('/waitingList', jsonParser, async(req,res) => {
    try{
        Waiter.find({}, function(error, tables) {
            res.render("waitingList", {
                tableList:tables
            })
        });
    }
    catch(e){
        res.status(400).send(e);
    }
})

app.post("/booked",jsonParser, async (req,res)=>{
    try{
      const name=req.body.name;
      const table=req.body.table;
      const member=req.body.member;
      const email=req.body.email;
      const registerCustomer=new Register({
          table:req.body.table,
          name:req.body.name,
          member:req.body.member,
          email:req.body.email,
          mobile:req.body.mobile,
          suggestion:req.body.suggestion
      })

      var transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:'smithlorez164@gmail.com',
            pass:'Asdf@1234'
        }
    });
    
    let mailOptions = {
        from:'smithlorez164@gmail.com',
        to:email,
        subject:'Table booked',
        text: `${name} your table number ${table} booked successfully for ${member} members`
    }
    
    transporter.sendMail(mailOptions, function(err, data){
        if(err){
            console.log('Error Occurs', err);
        }else{
            console.log('Email sent...');
        }
    });

      const registered=await registerCustomer.save();
      res.status(201).render("booked",{
          name, table, member
      });
    }
    catch(error){
       res.status(400).render("error");
    }
});

app.post("/notified", async (req,res)=>{
    try{
      const name=req.body.name;
      const email=req.body.email;
      const member=req.body.member;
      const waitCustomer=new Waiter({
          name:req.body.name,
          member:req.body.member,
          email:req.body.email,
          mobile:req.body.mobile
      })    

      const waited=await waitCustomer.save();
      res.status(201).render("notified",{
          name, email, member
      });
    }
    catch(error){
       res.status(400).render("error");
    }
});

app.get('*', async(req, res) => {
    res.render('404');
})

app.listen(port, () => {
    console.log(`server running at port ${port}`);
})
