const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function fetchBookmarks() {
    //let url = '/bookmarks';
    let url = 'http://localhost:8000/bookmarks';

    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    };

    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";

            for(let i = 0; i < responseJSON.length; i++) {
                results.innerHTML +=
                `<div id="${responseJSON[i].id}"> 
                    <ul>
                        <li>Id: ${responseJSON[i].id} </li>  
                        <li>Title: ${responseJSON[i].title} </li>
                        <li>Description: ${responseJSON[i].description} </li>
                        <li>Url: ${responseJSON[i].url} </li>
                        <li>Rating: ${responseJSON[i].rating} </li>
                    </ul>
                </div>`;
            }
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function postBookmark(title, description, bookmarkUrl, rating) {
    //let url = "/bookmarks";
    let url = 'http://localhost:8000/bookmarks';

    let bookmark = {
        title: title,
        description: description,
        url: bookmarkUrl,
        rating: Number(rating)
    };

    let settings = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookmark)
    };

    let results = document.querySelector(".results");

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            fetchBookmarks();
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchPostForm() {
    let postForm = document.querySelector('.postForm');

    postForm.addEventListener("submit", event => {
        event.preventDefault();

        let title = document.querySelector('#postTitle').value;
        let description = document.querySelector('#postDescription').value;
        let url = document.querySelector('#postUrl').value;
        let rating = document.querySelector('#postRating').value;
        
        postBookmark(title, description, url, rating);
  });
}

function deleteBookmark(id) {
    //let url = `/bookmark/${id}`;
    let url = `http://localhost:8000/bookmark/${id}`;

    let settings = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    };

    let results = document.querySelector(".results");

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            fetchBookmarks();
        })
        .catch(err => {
            //results.innerHTML = `<div> ${err.message} </div>`;
            fetchBookmarks();
        });
}

function watchDeleteForm() {
    let deleteForm = document.querySelector('.deleteForm');

    deleteForm.addEventListener("submit", event => {
        event.preventDefault();

        let id = document.querySelector('#deleteId').value;
        
        deleteBookmark(id);
  });
}

function patchBookmark(id, title, description, bookmarkUrl, rating) {
    //let url = "/bookmarks";
    let url = `http://localhost:8000/bookmark/${id}`;

    let bookmark = {
        id: id,
        title: title,
        description: description,
        url: bookmarkUrl,
        rating: Number(rating)
    };

    let settings = {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookmark)
    };

    let results = document.querySelector(".results");

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            fetchBookmarks();
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchPatchForm() {
    let patchForm = document.querySelector('.patchForm');

    patchForm.addEventListener("submit", event => {
        event.preventDefault();

        let id = document.querySelector('#patchId').value;
        let title = document.querySelector('#patchTitle').value;
        let description = document.querySelector('#patchDescription').value;
        let url = document.querySelector('#patchUrl').value;
        let rating = document.querySelector('#patchRating').value;
        
        patchBookmark(id, title, description, url, rating);
  });
}

function getBookmark(title) {
    //let url = '/bookmarks';
    let url = `http://localhost:8000/bookmark?title=${title}`;

    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    };

    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";

            for(let i = 0; i < responseJSON.length; i++) {
                results.innerHTML +=
                `<div id="${responseJSON[i].id}"> 
                    <ul>
                        <li>Id: ${responseJSON[i].id} </li>  
                        <li>Title: ${responseJSON[i].title} </li>
                        <li>Description: ${responseJSON[i].description} </li>
                        <li>Url: ${responseJSON[i].url} </li>
                        <li>Rating: ${responseJSON[i].rating} </li>
                    </ul>
                </div>`;
            }
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchGetForm() {
    let getForm = document.querySelector('.getForm');

    getForm.addEventListener("submit", event => {
        event.preventDefault();

        let title = document.querySelector('#getTitle').value;
        
        getBookmark(title);
  });
}

function init() {
    fetchBookmarks();
    watchPostForm();
    watchDeleteForm();
    watchPatchForm();
    watchGetForm()
}

init();