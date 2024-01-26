var express = require('express');
var router = express.Router();
let fs = require('fs');
const cors = require('cors');
let cryptoJS = require('crypto-js')


router.use(cors());

router.post("/", (req,res) => {
    let checkEmail = req.body.email;
    let checkPassword = req.body.password;

    fs.readFile('usersInfo.json', function(err,data){
        if(err){
           console.log(err)
        }
   
       let userInfo = JSON.parse(data);
   
       let cryptoPassWord = cryptoJS.HmacSHA256(checkPassword, 'Salt nyckel').toString();


       userInfo = userInfo.find(user => user.email == checkEmail && user.password == cryptoPassWord);


       
       if(userInfo){
            res.json({"user": userInfo.name, "id": userInfo.id, "email": userInfo.email, userImage: userInfo.userImage })
        } else {
            res.status(401).json({message: "fel inlogg"});
        }
   
       }) 
})

module.exports = router;