var express = require('express');
var router = express.Router();
let fs = require('fs');
const cors = require('cors');
let { randomUUID } = require('crypto');
let cryptoJS = require('crypto-js');


let multer = require('multer'); // enctype="multipert/form-data"

let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,"public/upload");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
    
})

const upload =  multer({storage}); // upload.single=""   / src="/upload/${req.file.filename}"


router.use(cors());
       

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

router.post('/image', upload.single("image"), (req,res) => {
  const userImage = req.file.filename;
  console.log(req.body)

  fs.readFile('usersInfo.json', (err, data) => {
    if(err){
      console.log(err)
    }

    const userInfo = JSON.parse(data);

    const addImage = {
      "imageSrc": userImage
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
     let cryptoPassWord = cryptoJS.HmacSHA256(userPassword, 'Salt nyckel').toString();


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