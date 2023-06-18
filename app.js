const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Poster = require('./models/poster')
const dbURL = require('./data_base_key')

mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(5000))
    .catch((error) => console.log(error))

app.use(express.json());

app.get('/home', async (req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    let articles;

    let searchQuery = {};

    if(req.query.category && req.query.category !== "all categories") {
        searchQuery.category = req.query.category;
    }

    if(req.query.name) {
        searchQuery.name = { $regex: req.query.name, $options: 'i' };
    }

    const totalArticles = await Poster.countDocuments(searchQuery);
    const numberOfTotalPages = Math.ceil(totalArticles/10)

    const hasMore = totalArticles > 1 * pageSize;

    articles = await Poster.find(searchQuery)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

    res.json({articles, numberOfTotalPages, hasMore});
});

// app.get('/home', (req, res) => {
//     console.log(req.params)
// })

app.delete('/home/:id', (req, res) =>{
    const id = req.params.id
    Poster.findByIdAndDelete(id)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => console.log(error))
});

app.post('/add-article', (req, res) => {
    const poster = new Poster(req.body);

    poster.save()
    .then((result) => res.json({message: "Article créé avec succès", data: result}))
    .catch((error) => console.log(error))
});

app.get('/article/:id', (req, res) =>{
    const id = req.params.id
    Poster.findById(id)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => console.log(error))
});

app.put('/update/:id', (req, res) =>{
    Poster.findByIdAndUpdate(req.body.id, req.body, { new: true, runValidators: true })
        .then((result) => {
            if (!result) {
                res.status(404).json({ error: 'Article not found' });
            } else {
                res.status(200).json(result);
            }
        })
        .catch((error) => {
            res.status(400).json({ error: error.toString() });
        });
});
 
app.use((req, res) => {
    res.status(404).send("such file do not exist")
});