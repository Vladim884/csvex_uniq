const Router = require("express")
const express = require("express")
const app = express()
const formidable = require('formidable');
const rimraf = require('rimraf')

const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const  multer = require ( 'multer' ) 
const fse = require('fs-extra')
const fs = require('fs')
const uuidv1 = require('uuidv1')
const path = require('path');
const shell = require('shelljs');
var mv = require('mv');


// console.log(uuidv1())



const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')
let thisId;

function deleteFolder(p) {
    let files = [];
    if( fs.existsSync(p) ) {
        files = fs.readdirSync(p);
        files.forEach(function(file,index){
            let curPath = p + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(p);
    }
}

router.post('/registration',
    [
        check('email', "Uncorrect email").isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({min:3, max:12})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Uncorrect request", errors})
        }
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if(candidate) {
            return res.status(400).json({message: `User with email ${email} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({email, password: hashPassword})
        await user.save()
        // await fileService.createDir(new File({user:user.id, name: ''}))
        res.json({message: "User was created"})
    } catch (e) {
        console.log(e)
        res.send({message: "Server error"})
    }
})


router.post('/login',
    async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(404).json({message: "User not found"})
            }
            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({message: "Invalid password"})
            }
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            thisId = user._id;
            // return res.json({
            //     token,
            //     user: {
            //         id: user.id,
            //         email: user.email,
            //         diskSpace: user.diskSpace,
            //         usedSpace: user.usedSpace,
            //         avatar: user.avatar
            //     }
            // })
            res.render('./start.hbs')
        } catch {

        }
    })

        router.post('/upload', (req, res) => {
            if (req.url == '/upload') {
                console.log(req.url)
                var form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {
                    
                    const oldpath = `${files.filedata.filepath}`;
                    console.log(`oldpath: ${oldpath}`)
                    
                    const dirpath = `${config.get("filePath")}\\${thisId}`
                    const newpath = `${config.get("filePath")}\\${thisId}\\` + files.filedata.originalFilename
                    
                    
                    if(fs.existsSync(dirpath)){
                        deleteFolder(dirpath)
                        console.log(dirpath)
                        console.log('dir was create') 
                    } else {
                        console.log('userId-directory does not contain temporary files');
                    }
   
                    fs.mkdirSync(`${dirpath}`, err => {
                        if(err) throw err; // не удалось создать папку
                        console.log('Папка успешно создана');
                     });
                    mv(oldpath, newpath, function (err) {
                      if (err) throw err;
                      res.write('File uploaded and moved!');
                      res.end();
                })})
        }})


router.get('/auth', authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.id})
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })


module.exports = router
