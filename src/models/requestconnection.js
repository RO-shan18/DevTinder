const mongoose = require("mongoose");

const RequestConnectionSchema = new mongoose.Schema({
    FromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    ToUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    Status : {
        type : String,
        required : true,
        enum : {
            values : ["interested", "ignored", "accepted", "rejected"],
            message : `{VALUE} is incorrect status type`
        },
       
    },
}, {
    timestamps : true,
});

RequestConnectionSchema.index({FromUserId : 1, ToUserId : 1});

RequestConnectionSchema.pre("save", function(next){
    const user = this;

    if(user.FromUserId.equals(user.ToUserId)){
        throw new Error("You can't send request to yourself!!!!");
    }

    next();
})

const RequestConnection =  mongoose.model("Connections", RequestConnectionSchema);
module.exports = RequestConnection;
