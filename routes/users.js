var express = require('express');
var router = express.Router();
let fs = require('fs');
const cors = require('cors');
let { randomUUID } = require('crypto');
let cryptoJS = require('crypto-js');


let multer = require('multer'); 



let storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null,"public/upload/userimage");
  },
    filename: function(req, file, cb){
      let fileName = file.originalname;
      file.filename = fileName.replace(/.*(?=\.)/, req.params.id)
      cb(null, file.filename);
  }
  })


const upload =  multer({storage}); 

// middleware
router.use(cors());
       
// Chech if user exist
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

// add image to user
router.post('/image/:id', upload.single("image"), (req,res) => {

  fs.readFile('usersInfo.json', (err,data) => {
    if (err) console.log(err);

    const userInfo = JSON.parse(data)
    
    user = userInfo.find(user => user.id == req.params.id);
    user.userImage = true
   
    
    fs.writeFile('userInfo.json', JSON.stringify(userInfo,null, 2), (err) => {
      if(err) console.log(err)
    })
    let sendUser = {
      id: user.id,
      userImage: user.userImage
    }
    res.json(sendUser)
    console.log('Logged in user:', user)
  })
 


})

// add new user
router.post('/add', (req, res) => {

    fs.readFile('usersInfo.json', function(err,data){
     if(err){
        console.log(err)

        if(err.code == 'ENOENT'){
          let userInfo = {
            id: randomUUID(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            userImage: false
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
     let cryptoPassWord = cryptoJS.HmacSHA256(userPassword, 'Salt nyckel').toString();


       let user= {
         id: randomUUID(),
         name: req.body.name,
         email: req.body.email,
         password: cryptoPassWord,
         userImage: false
     }

    userInfo.push(user);
    
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