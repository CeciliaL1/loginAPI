let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
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



             
let app = express();

let userRouter = require('./routes/users');
let loginRouter = require('./routes/login');
let imageRouter


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', userRouter);
app.use('/login', loginRouter)



module.exports = app;
