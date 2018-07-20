const express = require('express');
const app = express();
const path = require('path');
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
//const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const expressHandlebars = require('express-handlebars');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/user.js');
const Admin = require('./models/admin');


app.engine('handlebars', expressHandlebars({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

const port = 8888;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

//express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Connect Flash
app. use(flash());
// app.use(function (req, res, next) {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg  =req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// });

app.use(express.static(__dirname)); // For Loading all the files present in Directory
//app.use(ensureAuthenticated);

mongoose.Promise = global.Promise;
const url = 'mongodb://localhost:27017/userDB';
mongoose.connect(url);


//************************* A D M I N ***********************************

//========================== SIGN-UP ====================================

app.get("/signup", function (req, res) {
    const signUpPath = path.join(__dirname, '/sign-up.html');
    res.sendFile(signUpPath);
});
function SignUpCallback(req, res){
    // if (req.body.adminUsername && req.body.adminEmail && req.body.password && req.body.passwordconf) {
    //     const adminData = new Admin(req.body);
    //     console.log(adminData);
    //     adminData.save()
    //         .then(admin => {
    //         res.send("Admin registered!").redirect('/login');
    //         })
    // }
    // else
    //     res.status(400).send('Unable to register, Try Again!');
    const adminUsername = req.body.adminUsername;
    const adminEmail = req.body.adminEmail;
    const password = req.body.password;
    const passwordconf = req.body.passwordconf;

    req.checkBody('adminUsername', 'adminUsername is required').notEmpty();
    req.checkBody('adminEmail', 'adminEmail is required').notEmpty();
    req.checkBody('adminEmail', 'adminEmail is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('passwordconf', 'Passwords do not match').equals(req.body.password);

    var error = req.validationErrors();

    if (error) {
        res.send(error);
        res.redirect('/signup');
    } else {
        const newAdmin = new Admin({
            adminUsername: adminUsername,
            adminEmail: adminEmail,
            password: password
        });
        console.log(newAdmin);

        Admin.createAdmin(newAdmin);
        //res.json('You are registered and can now login!')
        res.redirect('/login');
    }
}
app.post('/signup', SignUpCallback);

//========================== LOGIN =================================
app.get("/login", function (req, res) {
    const loginPath = path.join(__dirname, '/login.html');
    res.sendFile(loginPath);
    console.log(req.url);
});

passport.use(new localStrategy({
        usernameField: 'adminUsername',
        passwordField: 'password',
        session: false
    },
    function (adminUsername, password, done) {
        Admin.getAdminByAdminUsername(adminUsername, function (err, admin) {
            if (err) throw err;
            console.log('getAdmin called');
            if (!admin) {
                console.log('Admin Not Found');
                return done(null, false);
            }

            Admin.comparePassword(password, admin.password, function (err, isMatch) {
                console.log('comparePassword called');
                if (err) throw err;
                if (isMatch) {
                    return done(null, admin);
                } else {
                    console.log('Wrong Password!');
                    return done(null, false);
                }
            });
        });
    }));

passport.serializeUser(function (admin, done) {
    done(null, admin.id);
});
passport.deserializeUser(function (id, done) {
    Admin.getAdminById(id, function (err, admin) {
        done(err, admin);
        console.log('findById called');
    });
});

app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login'}), function(req, res){
        console.log('login called');
        res.redirect('/');
    });

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/login');
});

function ensureAuthenticated(req, res, next){
    console.log(req.isAuthenticated);
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

app.use(ensureAuthenticated);


//************************** C. R. U. D. ********************************

//===============================POST====================================
app.get("/adduser", function (req, res) {
    const addPath = path.join(__dirname, '/adduser.html');
    res.sendFile(addPath);
});
function PostCallback(req, res) {
    const userData = new User(req.body);
    //console.log(userData);

    userData.save()
        .then(item => {
            res.send("Item saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save data to DB");
        });
}
app.post("/adduser", PostCallback);

//===============================GET=====================================
app.get("/users", function(req, res) {
    const result = [];
    mongo.connect(url, function(err, db){
        assert.equal(null, err);
        const dbo = db.db('userDB');
        const allData = dbo.collection('users').find({});
        allData.forEach(function(doc, err) {
            assert.equal(null, err);
            result.push(doc);
        }, function () {
            db.close();

            res.json(result);
        });
    });
});

//=============================DELETE====================================
app.get("/delete", function (req, res) {
    const deletePath = path.join(__dirname, '/delete.html');
    res.sendFile(deletePath);
});
function deleteCallback(req, res) {
    mongo.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("userDB");
        const myQuery = req.body;
        console.log(myQuery);
        dbo.collection("users").deleteOne({user_name: myQuery.user_name}, function (err) {
            if (err) throw err;
            else
                res.send("item deleted from database!");
        });
    });
}
app.post('/delete', deleteCallback);

//=============================UPDATE====================================
app.get("/update", function (req, res) {
    const updatePath = path.join(__dirname, '/update.html');
    res.sendFile(updatePath);
});
function updateCallback(req, res) {
    const item = {
        user_name : req.body.user_name,
        user_mail : req.body.user_mail,
        user_phone : req.body.user_phone
    };
    const ID = req.body._id;
    console.log(item);

    const id = objectId(ID);
    //console.log(id);

    mongo.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("userDB");
        dbo.collection('users').updateOne({_id: objectId(ID)}, {$set: item}, function (err) {
            if (err) throw err;
            else
                res.send("Item updated in database!");
        });
    });
}
app.post('/update', updateCallback);

//=======================================================================
app.listen(8888);
console.log("Running at port 8888...");