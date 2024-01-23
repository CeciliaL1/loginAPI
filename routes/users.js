var express = require('express');
var router = express.Router();
let fs = require('fs');
const cors = require('cors');
let { randomUUID } = require('crypto');

let cryptoJS = require('crypto-js')
router.use(cors());


router.get("/", (req, res) =>{
    res.json(users);
});          

router.post('/check', (req, res) => {
  fs.readFile('usersInfo.json', function(err, data){
    if(err){
      console.log(err)
      
    }

    let userInfo = JSON.parse(data);
 
  userInfo = userInfo.find(user => req.body.email === user.email);
    if(userInfo){
      res.json(true)
    } else {
      res.json(false)
    }
  })
})



router.post('/add', (req, res) => {

    fs.readFile('usersInfo.json', function(err,data){
     if(err){
        console.log(err)

        if(err.code == 'ENOENT'){
          let userInfo = {
            id: randomUUID(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        fs.writeFile('usersInfo.json', JSON.stringify(userInfo,null, 2), function(err){
          if (err){
            console.log(err)
          }
        });

        res.status('404 - filen hittades inte, ny fil skapad och använadren lades till')
        }
     }

     const userInfo = JSON.parse(data);

     // Create new user and add to userInfo
   
     let userPassword = req.body.password;
     let cryptoPassWord = cryptoJS.AES.encrypt(userPassword, 'Salt nyckel').toString();


/* Decrypt password
     let originalPassword = cryptoJS.AES.decrypt(userPassword, 'Salt nyckel').toString(cryptoJS.enc.Utf8);
*/
       let user= {
         id: randomUUID(),
         name: req.body.name,
         email: req.body.email,
         password: cryptoPassWord
     }

    userInfo.push(user)
    
    fs.writeFile('usersInfo.json', JSON.stringify(userInfo,null, 2), function(err){
        if (err){
          console.log(err)
        }
      });
      res.json({"user": req.body.name, "email": req.body.email});
    })  
 
})

// delete user 
router.delete("/:id", (req,res) =>{
    let id = req.params.id;
    fs.readFile('usersInfo.json', function(err,data){
        if(err){
           console.log(err)
        }
   
       let userInfo = JSON.parse(data);
   
         userInfo = userInfo.filter(user => user.id != id)

          
        
       fs.writeFile('usersInfo.json', JSON.stringify(userInfo,null, 2), function(err){
           if (err){
             console.log(err)
           }
         });
         res.json(userInfo);
       }) 
})

module.exports = router;