const Router = require("express")
const express = require("express")
const app = express()
const formidable = require('formidable')
// const rimraf = require('rimraf')
const csv = require('csv-parser')

const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
// const  multer = require ( 'multer' ) 
// const fse = require('fs-extra')
const fs = require('fs')
// const uuidv1 = require('uuidv1')
const path = require('path');
// const shell = require('shelljs');
var mv = require('mv');


// console.log(uuidv1())



const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
// const fileService = require('../services/fileService')
// const File = require('../models/File')
let thisId
// let newpath

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
            thisId = user._id
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
        let results = []
        let ind = 0
        resfind = []
        resname = []
        resgroup = []
        if (req.url == '/upload') {
            console.log(req.url)
            const form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                console.log(files)
                console.log(files.filedata.originalFilename)
                let fullFileName = files.filedata.originalFilename
                let fileExt = path.extname(fullFileName)
                if(fileExt !== '.csv') return res.send('Wrong file extension! Select file with ".csv" extension')
                if(!thisId) return res.send('Login to your account')
                let oldpath = `${files.filedata.filepath}`;
                console.log(`oldpath: ${oldpath}`)
                
                let dirpath = `${config.get("filePath")}\\${thisId}`
                let newpath = `${config.get("filePath")}\\${thisId}\\` + files.filedata.originalFilename
                console.log(`newpath: ${newpath}`)
                
                if(fs.existsSync(dirpath)){
                    deleteFolder(dirpath)
                    console.log(dirpath)
                    console.log('dir was delete')
                } else {
                    console.log('userId-directory does not contain temporary files');
                }

                fs.mkdirSync(`${dirpath}`, err => {
                    if(err) throw err; // не удалось создать папку
                    console.log('Папка успешно создана');
                    });
                mv(oldpath, newpath, function (err) {
                    if (err) throw err;
                    console.log('File uploaded and moved!')
                    console.log(`mv-newpath: ${newpath}`)
                    fs.createReadStream(newpath)
                        .pipe(csv())
                        .on('data', (data) => {
                            results.push(data)
                            // console.log(results[ind])
                        })
                        .on('end', () => {
                
                            for (let i = 0; i < results.length; i++) {
                                let data_f = results[i]['Поисковые_запросы'];
                                let data_n = results[i]['Название_позиции'];
                                let data_g = results[i]['Название_группы'];
            
                                resfind.push(data_f)
                                resname.push(data_n)
                                resgroup.push(data_g)
                            }
                            let req_name = resname;
                            let req_group = resgroup;
                            let req_find = resfind;
                            res.render("upload1.hbs", {
                                req_name: req_name,
                                req_group: req_group,
                                req_find: req_find,
                                resfind: resfind,
                                resname: resname,
                                resgroup: resgroup
                            });
                        });
                    
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
