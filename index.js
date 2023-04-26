const express = require('express')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const URI = process.env.URI

mongoose.connect(URI)
.then(()=> {
    console.log('Mongoose neural handshake complete');
})
.catch((err)=> {
    console.log('Mongoose failed to connect');
    console.log(err);
})

let todoSchema = {
    title: {type: String, required: true},
    category: {type: String, required: true},
    description: {type: String, required: true},
    time: {type: String, required: true},
    date: {type: Date, required: true, default:Date.now},
}

let userModel = mongoose.model('todo_collections', todoSchema)

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', (req,res)=> {
    userModel.find()
    .then((response)=> {
        console.log(response);
        res.render('todo', {response})
    })
    .catch((err)=> {
        console.log(err);
    })
})

app.post('/', (req,res)=> {
    console.log(req.body);
    let form = new userModel(req.body)
    form.save()
    .then(()=> {
        console.log('Successfully saved to database');
        res.redirect('/')
    })
    .catch((err)=> {
        console.log('Failed to save to database');
        console.log(err);
    })
})

app.post('/edit', (req,res)=> {
    userModel.findOne({email:req.body.userEmail})
    .then((response)=> {
        console.log(response);
        res.render('editUser', {response})
    })
})

app.post('/update', (req,res)=> {
    let id = req.body.id
    userModel.findByIdAndUpdate(id, req.body)
    .then((response)=> {
        console.log(response);
        res.redirect('/')
    })
    .catch((err)=> {
        console.log(err);
    })
})

app.post('/delete', (req,res)=> {
    userModel.findOneAndDelete({_id: req.body.userId})
    .then(()=> {
        console.log('Deleted Successfully');
        res.redirect('/')
    })
    .catch((err)=> {
        console.log(err, 'Failed to delete');
    })
})

app.listen(4300, ()=> {
    console.log('Server started on port 4300');
})