var express = require('express');
var router = express.Router();
let fs = require('fs');
const cors = require('cors');


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
     }

     const userInfo = JSON.parse(data);

     // Create new user and add to userInfo
     let user = {
        id: userInfo.length +1,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    userInfo.push(user)
    
    fs.writeFile('usersInfo.json', JSON.stringify(userInfo,null, 2), function(err){
        if (err){
          console.log(err)
        }
      });
      res.json(userInfo);
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
        
         // forEach id after deleted id , -1 
       fs.writeFile('usersInfo.json', JSON.stringify(userInfo,null, 2), function(err){
           if (err){
             console.log(err)
           }
         });
         res.json(userInfo);
       }) 
})

module.exports = router;