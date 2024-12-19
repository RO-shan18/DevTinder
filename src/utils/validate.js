const validator = require("validator");

const Validate = (req) => {

    const {FirstName, LastName, Email, Password} = req.body;

    if(validator.isEmpty(FirstName) || validator.isEmpty(LastName)){
        throw new Error("Name is not Valid");
    }
    else if(!validator.isEmail(Email)){
        throw new Error("Email is not Valid")
    }
    else if(!validator.isStrongPassword(Password)){
        throw new Error("Password should contain capital letter, specail characters, small letters & numbers ")
    }
}

const ValidateEditProfileData = (req) =>{

    const AllowedEditData = ["FirstName", "LastName", "Age", "Gender"];

    const isvalid = Object.keys(req.body).every(key => AllowedEditData.includes(key));

    return isvalid;
}

module.exports = {
    Validate,
    ValidateEditProfileData,
};