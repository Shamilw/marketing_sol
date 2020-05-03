const express   = require('express');
const router    = express.Router();

const database    = require('./database')
const User  = database.model('User');
const {phoneRegexp,emailRegexp}= require('./helpers/regexp')



router.get('/allusers' ,async ( req, res ) => {
  try {
    const data = await User.find({})
    res.send({ status: 'success',data})
  } catch (e) {
    console.log(e)
  }
})





router.post('/create', async ( req, res ) => {
  
  try {
    const notValid=[]// массив с названиями невалидных полей

    const user={
        fio:req.body.fio.trim()           ||null,
        email:req.body.email.trim()       ||null,
        phone:parseInt(req.body.phone)    ||null,
        password:req.body.password.trim() ||null,
    }

    if (!user.fio||user.fio.length>255||user.fio.length<10)                                          notValid.push('fio') 
    if (!user.email||user.email.length>255||user.email.length<10||!emailRegexp.test(user.email))     notValid.push('email')  
    if (!user.phone|| Number.isNaN(user.phone)||!phoneRegexp.test(user.phone))                       notValid.push('phone')
    if (!user.password||user.password.length>36||user.password.length<6)                             notValid.push('password')
   
    if (notValid.length) {
        res.send({ status: 'error', notValid})
    }else{

        const  newUser = await User.create({
            fio:user.fio,
            email:user.email,
            phone:user.phone,
            password:user.password,
        })
        res.send({ status: 'success', data:newUser})
        
    }
    
  } catch (e) {
    console.log(e)
  }
})




module.exports = router

