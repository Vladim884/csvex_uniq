const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
// const multer  = require("multer");

const hbs = require("hbs")
const expressHbs = require("express-handlebars")
// const { engine } = require('express-handlebars')
const config = require("config")
// const fileUpload = require("express-fileupload")
const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/file.routes")
const app = express()
// app.use(express.static(__dirname))
const PORT = config.get('serverPort')
const corsMiddleware = require('./middleware/cors.middleware')
// app.use(multer({dest : 'files/'+ `${fileEndDir}`}).single("filedata"))
app.engine("hbs", expressHbs.engine(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))
// app.engine('handlebars', engine(
//     { 
//         layoutsDir: "views/layouts", 
//         extname: '.hbs', 
//         defaultLayout: "layout"
//     }
// ));
// app.set('view engine', 'handlebars');
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json())

app.use(express.static(__dirname + '/public'))
app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)

app.use("/contacts", function(_, res){
    res.render("contacts", {
        title: "Мои контакты",
        email: "gavgav@mycorp.com",
        phone: "+1234567890"
    });
});
app.use("/login", function(req, res){
    res.render('login.hbs')
})
app.use("/", function(req, res){
    // return res.sendFile(__dirname + "/index.html");
    res.render('index.hbs')
})

const start = async () => {
    // console.log(__dirname)
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
