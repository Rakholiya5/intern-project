const mongoose=require("mongoose");
const validator=require("validator");

const waitSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:30
    },
    member:{
        type:Number,
        required:true,
        validate(value){
            if(value < 0){
                throw new Error("Members should be positive integers.");
            }else if(value>10){
                throw new Error("Members should be less than or equal to 10.");
            }
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is Invalid.")
            }
        }
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
        validate(value){
            if(value<1000000000 || value>9999999999){
                throw new Error("Please Enter valid Mobile Number");
            }
        }
    }
})

const Waiter=new mongoose.model("Waiter", waitSchema);

module.exports=Waiter;