const express = require('express');
const Post = require('./postDb');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.query)
    Post.get(req.query)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(500).json({
                err: 'Error retrieving the posts'
            })
        })
})

router.get('/:id', validatePostById, (req, res) => {
    Post.getById(req.params.id)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(mes => {
            res.status(500).json({
                mes: 'Error grabbing the posts'
            })
        })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params

    Post.remove(id)
        .then(id => {
            if (id === 0) {
                res.status(400).json({ err: "That post doesn't exist"})
            } else {
                res.status(200).json({
                    mes: 'Post destroyed'
                })
            }
        })
        .catch(err => {
            res.status(404).json({
                err: "Post not found"
            })
        })
})

router.put('/:id', validatePostById, (req, res) => {
    Post.update(req.params.id, req.body)
        .then(post =>{
            if (post) {
                res.status(200).json({ mes: 'The post has been updated.' })
            } else {
                res.status(404).json({ err: 'The post could not be found.'})
            }
        })

})

// custom middleware

function validatePostById(req, res, next) {
    const {id} = req.params;
    Post.getById(id)
        .then(post =>{
            req.post = post;
            post ? next() : res.status(404).json({message:'no user with that ID'})
        })
        .catch(error=>{
            console.log(error);
            res.status(500).json({message: 'could not validate post id'})
        })
}

module.exports = router;
