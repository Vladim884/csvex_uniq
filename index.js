const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const multer  = require("multer");

const hbs = require("hbs");
const { engine } = require('express-handlebars');
const config = require("config")
const fileUpload = require("express-fileupload")
const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/file.routes")
const app = express()
app.use(express.static(__dirname))
const PORT = config.get('serverPort')
const corsMiddleware = require('./middleware/cors.middleware')
// const fileEndDir = `${user._id}`
// app.use(multer({dest : 'files/'+ `${fileEndDir}`}).single("filedata"))
app.engine('handlebars', engine({ layoutsDir: "views/layouts", extname: '.hbs', defaultLayout: "layout"}));
app.set('view engine', 'handlebars');
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json())

// app.use(express.static(__dirname + '/'));
app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)

app.use("/contact", function(request, response){
     
    res.render("contact.hbs")
})
app.use("/login", function(req, res){
    res.render('login.hbs')
})
app.use("/", function(req, res){
    // return res.sendFile(__dirname + "/index.html");
    res.render('index.hbs')
})

const start = async () => {
    console.log(__dirname)
    try {
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex: true
        })

        app.listen(PORT, () => {
            console.log('Server started on port ', PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
