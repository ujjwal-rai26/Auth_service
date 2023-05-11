
const dotenv =require('dotenv');

const bcrypt=require('bcrypt');

dotenv.config();

module.exports ={
    PORT:process.env.PORT,
    SALT:bcrypt.genSaltSync(10),  //this will generate the salt
    JWT_KEY:process.env.JWT_KEY
}