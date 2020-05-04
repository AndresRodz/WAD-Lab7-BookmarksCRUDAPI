const mongoose = require('mongoose');

const bookmarksSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        required: true
    }
});

const bookmarksCollection = mongoose.model('bookmarks', bookmarksSchema);

const Bookmarks = {
    getAllBookmarks: function() {
        return bookmarksCollection
            .find()
            .then(allBookmarks => {
                return allBookmarks;
            })
            .catch(err => {
                return err;
            });
    },
    getBookmarkByTitle: function(TITLE) {
        return bookmarksCollection
            .find({title: TITLE})
            .then(bookmark => {
                return bookmark;
            })
            .catch(err => {
                return err;
            });
    },
    createBookmark: function(newBookmark) {
        return bookmarksCollection
            .create(newBookmark)
            .then(createdBookmark => {
                return createdBookmark;
            })
            .catch(err => {
                return err;
            });
    },
    deleteBookmark: function(ID) {
        return bookmarksCollection
            .findOneAndDelete({_id: ID})
            .then(deletedBookmark => {
                return deletedBookmark;
            })
            .catch(err => {
                return err;
            });
    },
    updateBookmark: function(ID, update) {
        return bookmarksCollection
            .findOneAndUpdate({_id: ID}, {$set: update})
            .then(updatedBookmark => {
                return updatedBookmark;
            })
            .catch(err => {
                return err;
            });
    }
};

module.exports = {Bookmarks};