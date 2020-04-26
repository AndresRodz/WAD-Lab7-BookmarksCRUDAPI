const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const jsonParser = bodyParser.json();

app.use(morgan('dev'));

let bookmarkList = [
    {
        //id: uuid.v4(),
        title: "YouTube",
        description: "Search for videos",
        url: "https://www.youtube.com/",
        rating: 10
    },
    {
        //id: uuid.v4(),
        title: "Google",
        description: "Search for anything",
        url: "https://www.google.com/",
        rating: 10
    }
];

app.get('/bookmarks', (req, res) => {
    console.log("Getting list of all bookmarks...");

    return res.status(200).json(bookmarkList);
});

app.get('/bookmark', (req, res) => {
    console.log("Getting bookmarks by title...");

    console.log(req.query);
    let title = req.query.title;
    console.log('title', title);

    if(!title) {
        res.statusMessage = "The 'title' parameter is required!";
        return res.status(406).end();
    }

    let result = bookmarkList.filter((bookmark) => {
        if(bookmark.title == title) {
            return bookmark;
        }
    });

    if(!result) {
        res.statusMessage = `The title '${title}' was not found in the bookmarks list`;
        return res.status(404).end();
    }

    return res.status(200).json(result);
});

app.post('/bookmarks', jsonParser, (req, res) => {
    console.log("Adding a new bookmark to the list...");

    console.log("body", req.body);

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!title || !description || !url || !rating) {
        res.statusMessage = "The parameters are incorrect, please verify them!";
        res.status(406).end();
    }

    if(typeof(rating) != 'number') {
        res.statusMessage = "The 'rating' parameter MUST be a number";
        return res(409).end();
    }

    let result = bookmarkList.find((bookmark) => {
        if(bookmark.url == url) {
            return bookmark;
        }
    });

    if(!result) {
        let newBookmark = {
            //id: ,
            title: title,
            description: description,
            url: url,
            rating: rating
        };

        bookmarkList.push(newBookmark);
        return res.status(201).json(newBookmark);
    }
    else {
        res.statusMessage = `The url '${url}' has already been added to the bookmarks list`;
        return res.status(409).end();
    }
});

app.delete('/bookmark', (req, res) => {
    console.log("Deleting a bookmark...");

    let id = req.query.id;

    if(!id) {
        res.statusMessage = "The 'id' parameter is required!";
        return res.status(406).end();
    }

    let bookmarkToRemove = bookmarkList.findIndex((bookmark) => {
        if(bookmark.id == id) {
            return true;
        }
    });

    if(bookmarkToRemove < 0) {
        res.statusMessage = "The 'id' was not found in the bookmark list";
        return res.status(404).end();
    }
    else {
        bookmarkList.splice(bookmarkToRemove, 1);
        return res.status(200);
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