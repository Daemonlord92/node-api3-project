const express = require('express');
const User = require('./userDb');
const Posts = require('../posts/postDb')
const router = express.Router();

router.post('/', validateUser, (req, res) => {
    User.insert(req.body)
        .then(user => {
            res
                .status(201)
                .json({mes: 'User made', user})
        })
        .catch(err => {
            res.status(500).json({mes: 'Problem with server', err})
        })

});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {

    const newPost = req.body;
    newPost.user_id = req.params.id;
    console.log('new post', newPost)
    Posts.insert(newPost)
        .then(post => {res.status(201).json(post)})
        .catch(err=>{
            console.log('error', err)
            res.status(500).json({message:'server error'})
        })

});

router.get('/', (req, res) => {
    User.get()
        .then(users => res.status(200).json(users))
        .catch(err=>res.status(500).json({message: "error"}));
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const {id} = req.params;
    User.getUserPosts(id)
        .then(posts => res.status(200).json(posts))
        .catch(err=>res.status(500).json({message:'server error'}))
});

router.delete('/:id', validateUserId, (req, res) => {
    const {id} = req.params;
    User.remove(id)
        .then(rem => res.status(200).json({rem}))
        .catch(err=>res.status(500).json({message:'server error'}))
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const {id} = req.params;
    const newUser = req.body;

    User.update(id, newUser)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({message: 'server error'}))
});

//custom middleware

function validateUserId(req, res, next) {
    const {id} = req.params;
    User.getById(id)
        .then(user => {
            req.user = user;
            console.log(req.user);
            user ? next() : res.status(404).json({message: 'no user with that id'})
        })
        .catch(err => res.status(500).json({message: 'validation error'}))
}

function validateUser(req, res, next) {
    const body = req.body;

    Object.keys(body).length === null
    ? res.status(400).json({mes: 'no data'})
    : !body
    ? res.status(400).json({mes: 'Missing name'})
    : next()
}

function validatePost(req, res, next) {
  const body = req.body;
  console.log(body)
  if (req.body && Object.keys(req.body).length > 0){
      next()
  } else {
      res.status(400).json({ message: 'no body'})
  }
}

module.exports = router;
