const express=require("express");
const mongoose=require("mongoose");
const app=express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/medilabDB");

const patientSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    pid: Number,
    age: Number,
    email: String,
    phno: String,
    address: String,
});

const Patient = mongoose.model("Patient",patientSchema);

const staffSchema = new mongoose.Schema({
        fname: String,
        lname: String,
        empid: Number,
        age: Number,
        email: String,
        phno: String,
        address: String,
        designation: String,
        jdate: String
});

const Staff = mongoose.model("Staff",staffSchema);

const userSchema = new mongoose.Schema({
    uname: String,
    pass: String
});

const User = mongoose.model("User",userSchema);

const defaultpatient = new Patient({
    fname: "Arijeet",
    lname: "Nayak",
    pid: 11500119028,
    age: 20,
    email: "akn@gmai.com",
    phno: 8888888888,
    address: "Street 07",
});

const defaultstaff = new Staff({
    fname: "Arijeet",
    lname: "Nayak",
    empid: 11500119028,
    age: 20,
    email: "akn@gmai.com",
    phno: 8888888888,
    address: "Street 07",
    designation: "Registration Desk",
    jdate: "2021-12-29"
});

const defaultpatients=[defaultpatient];
const defaultstaffs=[defaultstaff];

app.get("/", function(req, res){
    res.render("login");
});

app.post("/", function(req, res){

    const uname = req.body.username;
    const pass = req.body.password;
    
    User.findOne({uname: uname}, function(err, foundUser){
        if(foundUser.pass===pass){
            res.redirect("/home");
        }
    });
 
});

app.get("/signup", function(req, res){
    res.render("signup");
});

app.post("/signup", function(req,res){

    const uname = req.body.username;
    const pass = req.body.password;

    const user = new User({
        uname: uname,
        pass: pass
    });

    user.save().then(function(){
        res.redirect("/");
    });

    
});

app.get("/home", function(req, res){
    res.render("home");
});

app.get("/home/patientreg", function(req, res){
    res.render("patientreg");
});

app.post("/home/patientreg", function(req, res){
    
    const fname = req.body.fname;
    const lname = req.body.lname;
    const pid = req.body.pid;
    const age = req.body.age;
    const email = req.body.email;
    const phno = req.body.phno;
    const address = req.body.address;

    const patient = new Patient({
        fname: fname,
        lname: lname,
        pid: pid,
        age: age,
        email: email,
        phno: phno,
        address: address,
    });

    patient.save().then(function(){
        res.redirect("/home/patientview");
    });   
});

app.get("/home/patientview", function(req, res){


    Patient.find(function(err, foundPatients){
        if(foundPatients.length===0){
            defaultpatient.save().then(function(){
                res.render("patientview", {newPatients: defaultpatients});
            });   
        }
        else
        res.render("patientview", {newPatients: foundPatients});
        
    });

});


app.get("/home/staffreg", function(req, res){
    res.render("staffreg");
});

app.post("/home/staffreg", function(req, res){

    const fname = req.body.fname;
    const lname = req.body.lname;
    const empid = req.body.empid;
    const age = req.body.age;
    const email = req.body.email;
    const phno = req.body.phno;
    const address = req.body.address;
    const designation = req.body.desig;
    const jdate = req.body.jdate;

    const staff = new Staff({
        fname: fname,
        lname: lname,
        empid: empid,
        age: age,
        email: email,
        phno: phno,
        address: address,
        designation: designation,
        jdate: jdate
    });

    staff.save().then(function(){
        res.redirect("/home/staffview");
    });   
});

app.get("/home/staffview", function(req, res){
    
    Staff.find(function(err, foundStaffs){
        if(foundStaffs.length===0){
            defaultstaff.save().then(function(){
                res.render("staffview", {newStaffs: defaultstaffs});
            });  
        }
        else
        res.render("staffview", {newStaffs: foundStaffs});
        
    });

});

app.listen(3000, function(){
    console.log("Server Started at 3000");
});