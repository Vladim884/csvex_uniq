const Router = require("express")
const express = require("express")
const app = express()

const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const  multer   =  require ( 'multer' ) 
const fse = require('fs-extra')
const fs = require('fs')
const uuidv1 = require('uuidv1');
const path = require('path');
const shell = require('shelljs');


console.log(uuidv1())



const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')

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
        await fileService.createDir(new File({user:user.id, name: ''}))
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
            let storage = multer.diskStorage({
                //https://stackoverflow.com/questions/53916462/generate-destination-path-before-file-upload-multer
                // pass function that will generate destination path
                destination: (req, file, cb) => {
                  // initial upload path
                  let dirPath = '../files/' + `%{user._id}`
                  let destination = path.join(__dirname, '../files/') // ./uploads/
                //   console.log(destination)
                  let id = uuidv1();
                  shell.mkdir('-p', './files/' + id)
            
                  destination = path.join(destination, '', id) // ./uploads/files/generated-uuid-here/
                //   console.log('dest', destination)
              
                  cb(
                    null,
                    destination
                  );
                },
              
                // pass function that may generate unique filename if needed
                filename: (req, file, cb) => {
                  cb(
                    null,
                    Date.now() + '.' + path.extname(file.originalname)
                  );
                }
            
              });
              
              let upload = multer({storage: storage})
              router.post('/upload', upload.any(),  (req, res) => {
                res.json('test')
              })

             } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })
    
    

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
