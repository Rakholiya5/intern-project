const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://Rakholiya55:Asdf1234@cluster0.gvqu7.mongodb.net/projects?retryWrites=true&w=majority", {

}).then(()=>{
    console.log(`connection Successful`);
}).catch((e)=>{
    console.log(`No Connection`);
});