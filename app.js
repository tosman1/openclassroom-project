// mongoose password: password1234
// mongo cluster: mongodb+srv://Priest:password1234@cluster0-iuer3.mongodb.net/test?retryWrites=true&w=majority

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe_shema');

const app = express();

mongoose.connect('mongodb+srv://Priest:password1234@cluster0-iuer3.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');        
    })
    .catch(
        (error) => {
            console.log('Unable to connect to MongoDB Atlass');
            console.error(error);        
});

// cross origin request
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

// post request api: /api/recipes
app.post('/api/recipes', (req, res, next) => {
    const newRecipe = new Recipe ({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });
    newRecipe.save().then(
        () => {
            res.status(201).json({
                message: 'new recipe created successfully'
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            })
        }
    )
});

//  getOne request api: /api/recipes/:id
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({
        _id: req.params.id
    }).then(
            (recipe) => {
                res.status(200).json(recipe)
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                })
            }
        )
});

// put/update request api: /api/recipes/:id 
app.put('/api/recipes/:id', (req, res, next) => {
    const newRecipe = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });
    Recipe.updateOne(
        {_id: req.body.id}, newRecipe)
            .then(
                () => {
                    res.status(201).json({
                        message: `${newRecipe.title} updated successfully`
                    })
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    })
                }
            )
});

// delete request api: /api/recipes/:id
app.delete('/api/recipes/:id', (req, res, next) => {
    const newRecipe = new Recipe()
    Recipe.deleteOne(
        {_id: req.body.id}
    ).then(
        () => {
            res.status(200).json({
                message: `${newRecipe.title} deleted successfully`
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            })
        }
    )
});

//  getAll request  api: /api/recipes
app.use('/api/recipes', (req, res, next) => {
    Recipe.find().then(
        (recipes) => {
            res.status(200).json(recipes)
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            })
        }
    )
});



module.exports = app;