var express = require('express');
var router = express.Router();
let fs = require('fs');
const cors = require('cors');

router.use(cors());

router.post("/", (req,res) => {
    let checkEmail = req.body.email;
    let checkPassword = req.body.password;

    fs.readFile('usersInfo.json', function(err,data){
        if(err){
           console.log(err)
        }
   
       let userInfo = JSON.parse(data);
   
       userInfo = userInfo.find(user => user.email == checkEmail && user.password == checkPassword);
       
       if(userInfo){
            res.json({"user": userInfo.name, "id": userInfo.id})
        } else {
            res.status(401).json({message: "fel inlogg"});
        }
   
       }) 
})

module.exports = router;