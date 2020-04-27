const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require("uuid");
const validateToken = require('./middleware/validateToken');

const app = express();
const jsonParser = bodyParser.json();

app.use(morgan('dev'));
app.use(validateToken);

let bookmarkList = [
    {
        id: 123,
        title: "YouTube",
        description: "Search for videos",
        url: "https://www.youtube.com/",
        rating: 10
    },
    {
        id: uuid.v4(),
        title: "Google",
        description: "Search for anything",
        url: "https://www.google.com/",
        rating: 10
    },
    {
        id: uuid.v4(),
        title: "YouTube",
        description: "Search for videos",
        url: "https://www.youtube.com/123",
        rating: 10
    }
];

app.get('/bookmarks', (req, res) => {
    console.log("Getting list of all bookmarks...");

    res.statusMessage = "The bookmarks were obtained successfully";
    return res.status(200).json(bookmarkList);
});

app.get('/bookmark', (req, res) => {
    console.log("Getting bookmarks by title...");

    let title = req.query.title;

    if(!title) {
        res.statusMessage = "The 'title' parameter is required!";
        return res.status(406).end();
    }

    let result = bookmarkList.filter((bookmark) => {
        if(bookmark.title == title) {
            return bookmark;
        }
    });

    if(!result || !result.length) {
        res.statusMessage = `The title '${title}' was not found in the bookmarks list`;
        return res.status(404).end();
    }

    res.statusMessage = "The bookmark was obtained successfully";
    return res.status(200).json(result);
});

app.post('/bookmarks', jsonParser, (req, res) => {
    console.log("Adding a new bookmark to the list...");

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!title || !description || !url || !rating) {
        res.statusMessage = "The parameters are incorrect, please verify them!";
        return res.status(406).end();
    }

    if(typeof(rating) != 'number') {
        res.statusMessage = "The 'rating' parameter MUST be a number";
        return res.status(409).end();
    }

    let result = bookmarkList.find((bookmark) => {
        if(bookmark.url == url) {
            return bookmark;
        }
    });

    if(!result) {
        let newBookmark = {
            id: uuid.v4(),
            title: title,
            description: description,
            url: url,
            rating: rating
        };
        
        bookmarkList.push(newBookmark);
        res.statusMessage = "The bookmark was added successfully";
        return res.status(201).json(newBookmark);
    }
    else {
        res.statusMessage = `The url '${url}' has already been added to the bookmarks list`;
        return res.status(409).end();
    }
});

app.delete('/bookmark/:id', (req, res) => {
    console.log("Deleting a bookmark...");

    let id = req.params.id;

    if(!id) {
        res.statusMessage = "The 'id' parameter is required!";
        return res.status(406).end();
    }

    let bookmarkToRemove = bookmarkList.findIndex((bookmark) => {
        if(bookmark.id == String(id)) {
            return true;
        }
    });

    if(bookmarkToRemove < 0) {
        res.statusMessage = "The 'id' was not found in the bookmark list";
        return res.status(404).end();
    }
    else {
        bookmarkList.splice(bookmarkToRemove, 1);
        res.statusMessage = "The bookmark was deleted successfully";
        return res.status(200).end();
    }
});

app.patch('/bookmark/:id', jsonParser, (req, res) => {
    console.log("Updating a bookmark...");

    let paramsID = req.params.id;
    let bodyID = req.body.id;

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!bodyID) {
        res.statusMessage = "The 'id' is missing in the body!";
        return res.status(406).end();
    }

    if(paramsID != bodyID) {
        res.statusMessage = "The 'id' parameter is different from the one in the body!";
        return res.status(409).end();
    }

    let result = bookmarkList.find((bookmark) => {
        if(bookmark.id == paramsID) {
            return bookmark;
        }
    });

    if(!result) {
        res.statusMessage = "The 'id' was not found in the bookmark list";
        return res.status(404).end();
    }
    else {
        if(title) {
            console.log("The 'title' was updated");
            result.title = title;
        }
        if(description) {
            console.log("The 'description' was updated");
            result.description = description;
        }
        if(url) {
            console.log("The 'url' was updated");
            result.url = url;
        }
        if(rating) {
            console.log("The 'rating' was updated");
            result.rating = rating;
        }
        
        res.statusMessage = "The bookmark was updated successfully";
        return res.status(202).json(result);
    }
});

app.listen(8000, () => {
    console.log("The server is running on port 8000");
});

/*
Base URL: http://localhost:8000/
GET endpoint: http://localhost:8000/bookmarks
GET by title: http://localhost:8000/bookmark?title=value
POST endpoint: http://localhost:8000/bookmarks
DELETE endpoint: http://localhost:8000/bookmark/:id
PATCH endpoint: http://localhost:8000/bookmark/:id
*/