const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const router = express.Router();
const Todo = require('./todo.model');
require('dotenv').config({ path: 'ATLAS_CONNECTION' });
mongoose.connect('process.env.ATLAS_CONNECTION', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log('Connected Successfully'))
.catch(err => {console.log(err)})

app.use(cors());
app.use(bodyParser.json());
app.use('/todos', router);

router.get('/Todolist', function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

router.get('/todo/:id', function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

router.put('/todo/:id', function(req, res) {
    Todo.findByIdAndUpdate(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

router.post('/todo', function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});



app.listen(process.env.PORT, function() {
    console.log("Server is running on Port: " + process.env.PORT);
});