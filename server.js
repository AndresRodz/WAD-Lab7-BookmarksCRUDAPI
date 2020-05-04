const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require("uuid");
const mongoose = require('mongoose');
const validateToken = require('./middleware/validateToken');
const {Bookmarks} = require('./models/bookmarkModel');

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

    //Local implementation
    /*res.statusMessage = "The bookmarks were obtained successfully";
    return res.status(200).json(bookmarkList);*/

    //Database implementation
    Bookmarks
        .getAllBookmarks()
        .then(result => {
            res.statusMessage = "The bookmarks were obtained successfully";
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the database, try again later";
            return res.status(500).end();
        });
});

app.get('/bookmark', (req, res) => {
    console.log("Getting bookmarks by title...");

    let title = req.query.title;

    if(!title) {
        res.statusMessage = "The 'title' parameter is required!";
        return res.status(406).end();
    }

    //Local implementation
    /*let result = bookmarkList.filter((bookmark) => {
        if(bookmark.title == title) {
            return bookmark;
        }
    });

    if(!result || !result.length) {
        res.statusMessage = `The title '${title}' was not found in the bookmarks list`;
        return res.status(404).end();
    }

    res.statusMessage = "The bookmark was obtained successfully";
    return res.status(200).json(result);*/

    //Database implementation
    Bookmarks
        .getBookmarkByTitle(title)
        .then(result => {
            if(result.errmsg) {
                res.statusMessage = `The title '${title}' was not found in the bookmarks list. ` + result.errmsg;
                return res.status(409).end();
            }
            res.statusMessage = "The bookmark was obtained successfully";
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the database, try again later";
            return res.status(500).end();
        });
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

    //Local implementation
    /*let result = bookmarkList.find((bookmark) => {
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
    }*/

    //Database implementation
    let id = uuid.v4();
    let newBookmark = {id, title, description, url, rating};

    Bookmarks
        .createBookmark(newBookmark)
        .then(result => {
            if(result.errmsg) {
                res.statusMessage = `The url '${url}' has already been added to the bookmarks list. ` + result.errmsg;
                return res.status(409).end();
            }
            res.statusMessage = "The bookmark was added successfully";
            return res.status(201).json(newBookmark);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the database, try again later";
            return res.status(500).end();
        });
});

app.delete('/bookmark/:id', (req, res) => {
    console.log("Deleting a bookmark...");

    let id = req.params.id;
    console.log(id);

    if(!id) {
        res.statusMessage = "The 'id' parameter is required!";
        return res.status(406).end();
    }

    //Local implementation
    /*let bookmarkToRemove = bookmarkList.findIndex((bookmark) => {
        if(bookmark.id == String(id)) {
            return true;
        }
    });

    if(bookmarkToRemove < 0) {
        res.statusMessage = "The 'id' was not found in the bookmarks list";
        return res.status(404).end();
    }

    bookmarkList.splice(bookmarkToRemove, 1);
    res.statusMessage = "The bookmark was deleted successfully";
    return res.status(200).end();
    */

    //Database implementation
    Bookmarks
        .deleteBookmark(id)
        .then(result => {
            if(result.errmsg) {
                res.statusMessage = `The id '${id}' was not found in the bookmarks list. ` + result.errmsg;
                return res.status(409).end();
            }
            res.statusMessage = "The bookmark was deleted successfully";
            return res.status(200).end();
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the database, try again later";
            return res.status(500).end();
        });
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

    //Local implementation
    /*let result = bookmarkList.find((bookmark) => {
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
    }*/

    //Database implementation
    let updatedBookmark = {};

    if(title) {
        updatedBookmark.title = title;
    }
    if(description) {
        updatedBookmark.description = description;
    }
    if(url) {
        updatedBookmark.url = url;
    }
    if(rating) {
        updatedBookmark.rating = rating;
    }

    Bookmarks
        .updateBookmark(paramsID, updatedBookmark)
        .then(result => {
            if(result.errmsg) {
                res.statusMessage = "The 'id' was not found in the bookmark list";
                return res.status(409).end();
            }
            res.statusMessage = "The bookmark was updated successfully";
            return res.status(202).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the database, try again later";
            return res.status(500).end();
        });
});

app.listen(8000, () => {
    console.log("The server is running on port 8000");

    new Promise((resolve, reject) => {
        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        };
        mongoose.connect('mongodb+srv://A01193126:A01193126!@cluster0-uula5.mongodb.net/bookmarksDB?retryWrites=true&w=majority', settings, (err) => {
            if(err) {
                return reject(err);
            }
            return resolve();
        })
    })
    .catch(err => {
        console.log(err);
    });
});

/*
Base URL: http://localhost:8000/
GET endpoint: http://localhost:8000/bookmarks
GET by title: http://localhost:8000/bookmark?title=value
POST endpoint: http://localhost:8000/bookmarks
DELETE endpoint: http://localhost:8000/bookmark/:id
PATCH endpoint: http://localhost:8000/bookmark/:id
*/