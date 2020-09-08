const express = require('express');
const Posts = require('../posts/postDb.js')

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
  .then(posts => {
    res.status(200).json({posts})
  })
  .catch(error => {
    res.status(500).json({message: 'server error, try again'})
  })
});

router.get('/:id', (req, res) => {
  Posts.getById(req.params.id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(error => {
    res.status(404).json({message: 'ID not found'})
    res.status(500).json({message: 'server error, try again'})
  })
});

router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
  .then(post => {
    res.status(200).json({"Post Deleted": post})
  })
  .catch(error => {
    res.status(500).json({})
  })
});

router.put('/:id', validatePostId, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Posts.update(id, body)
  .then(post => {
    res.status(200).json({id,body})
  })
  .catch(error => {
    res.status(500).json({message: "server error, try again"})
  })
});

// custom middleware

function validatePostId(req, res, next) {
  const {id} = req.params;

  Posts.getById(id)
  .then(post => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({message: 'Post Id is invalid'})
    }
  })
  .catch(error => {
    error.code = 500;
    error.message = 'database error';
    next(error);
  })
}

module.exports = router;
