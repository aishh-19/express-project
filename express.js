const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const dbPath = './db.json';

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// API to get all todos
app.get('/api/todos', (req, res) => {
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const todos = JSON.parse(data).todos;
    res.json(todos);
  });
});

// API to add a new todo
app.post('/api/todos', (req, res) => {
  const newTodo = req.body;
  
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const db = JSON.parse(data);
    newTodo.id = db.todos.length + 1;
    db.todos.push(newTodo);

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      res.json(newTodo);
    });
  });
});

// API to update status of even ID todos from false to true
app.put('/api/todos/update', (req, res) => {
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let db = JSON.parse(data);
    db.todos.forEach(todo => {
      if (todo.id % 2 === 0 && todo.status === false) {
        todo.status = true;
      }
    });

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      res.json({ message: 'Status updated for even ID todos where status was false' });
    });
  });
});

// API to delete todos whose status is true
app.delete('/api/todos', (req, res) => {
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let db = JSON.parse(data);
    db.todos = db.todos.filter(todo => todo.status === false);

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      res.json({ message: 'Deleted todos with status true' });
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
