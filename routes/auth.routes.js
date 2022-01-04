const Router = require("express")
const express = require("express")
const app = express()

const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const  multer   =  require ( 'multer' ) 

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
            console.log(user._id)
            const fileEndDir = `${user._id}`
            const upload = multer({ dest: `./files/${fileEndDir}`})
            // app.use(multer({dest : 'files/'+ `${fileEndDir}`}).single("filedata"))
            // const  upload  =  multer ( {  dest : 'files/'+ `${fileEndDir}`  } )
            router.post('/upload', upload.single('filedata'),
                
                function (req, res, next) {
                    

   

                    try {
                        console.log(req.file)
                        console.log(req.body)
                        
                        // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any 
   console.log(req.file, req.body)
                            // req.file is the `avatar` file
                            // req.body will hold the text fields, if there were any
                            return res.render('index.hbs')
                    } catch (e) {
                        console.log(e)
                    }
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
