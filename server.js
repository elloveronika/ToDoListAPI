const express = require('express')//this is created for express, its a dependency, makes connections cleaner, its unopinionated
const app = express() // instead of putting the method we use variable app
const MongoClient = require('mongodb').MongoClient //this is what will connect us to mongo db
const PORT = 2020 // this is the port connection 

let db, //this is a variable created to access the database and so it can be accessed multiple times 
    dbConnectionStr = 'mongodb+srv://elloveronika:blueblue@cluster0.yys3a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
     //this is where the db string link will go
    dbName ='todo'//this is getting the name of the db

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})//this is to connect, using the connect mthod, it takes in the connection string and another object, the objectis a special thing that we have to include so we dont get any errors
    .then( client => {// this is a promise that triggers when we get response back
        console.log(`Hey, connected to ${dbName} database`)// this will notify us when it is connected thru the console
        db = client.db(dbName) //whenever i see the db name i know that is the connection to my database
    })
    .catch(err => {//this will catch our err
        console.log(err)// this willl dispolay our error
    })

app.set('view engine' , 'ejs')// this is set up to use the ejs files , these are all forms?
app.use(express.static('public'))//server can serve up any static folder , this is all the things that we are going to use
app.use(express.urlencoded({ extended: true}))
app.use(express.json()) // this will allow us to the form the file we need both allow us access to pull the info out of the form




app.get('/', (req,res) => {//this is the main route of / , it will trigger the callback
    db.collection('todos').find().toArray() //gonna find all the documents in the collection
    .then( data => {
        res.render('index.ejs',{zebra: data}) // we are gonna pass in theobject into the ejs file, data is the array of objects we are passing it into an array
    })
    //res.render('index.ejs')//we are going to respond with the ejs file
}) 
app.post('/createTodo',(req,res) => { // whatever theaxtion is, is what we put in the post in ejs, send push t mongo db
    db.collection('todos').insertOne({ todo: req.body.todoItem , completed: false})//grabbing the input from  ejs this method enables us to insert a document into the collectiopns , user is gonna make apost and this wiolll listen to that post
    .then(result => {
        console.log('Todo has been added')
        res.redirect('/')//this will be the response
    })
})//whenevr you make a request to a server , you are sending all this information 
app.delete('/deleteTodo', (req ,res) => {
    console.log(req.body)
    db.collection('todos').deleteOne({ todo:req.body.rainbowUnicorn})
    .then(result => {
        console.log('Deleted Todo')
        res.json('deleted it')
    })
})
app.listen(PORT, () => {// this is the port connection and method that will connect us
    console.log('Sever is running') // to  see if were connected
})