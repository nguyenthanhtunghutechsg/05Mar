/*
C-POST-domain:port/api/v1/products ( +data) create/login
R-GET - All: domain:port/api/v1/products
      - byID: domain:port/api/v1/products/id
U-PUT - domain:port/api/v1/products/id (+data)
D-DELETE - domain:port/api/v1/products/id 
*/
var url = "http://localhost:3000/posts"
var listGlobal;

function Load() {
    fetch(url).then(//get all
        function (response) {
            return response.json();
        }
    ).then(
        function (posts) {
            listGlobal = posts;
            posts.sort(compare);
            var tbody = document.getElementById('tbody');
            tbody.innerHTML = "";
            for (const post of posts) {
                tbody.innerHTML += (ConvertFormPostToRow(post));
            }
        }
    )
}

function compare(a, b) {
    if (parseInt(a.id) > parseInt(b.id)) {
        return 1;
    }
    return -1;
}

function getMaxID() {
    var ids = listGlobal.map(element => {
        return element.id
    });
    return Math.max(...ids);
}

function Delete(id) {
    fetch(url + "/" + id, {
        method: 'DELETE'
    }).then(
        Load
    )
}
function Edit(id, data) {
    fetch(url + "/" + id, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(
        Load
    )
}


function Save() {
    var id = parseInt(document.getElementById('id').value);
    if (isNaN(id)) {
        let newItem = {
            id: (getMaxID() + 1) + "",
            userId: document.getElementById('userId').value,
            title: document.getElementById('title').value,
            body: document.getElementById('body').value,
        }
        Create(newItem);
    } else {// id la so
        let ids = listGlobal.map(element => {
            return element.id
        });
        let checkexist = ids.includes(id + "");
        if (checkexist) {
            let editItem = {
                userId: document.getElementById('userId').value,
                title: document.getElementById('title').value,
                body: document.getElementById('body').value,
            }
            Edit(id, editItem);
        } else {
            //them moi 
            let newItem = {
                id: id + "",
                userId: document.getElementById('userId').value,
                title: document.getElementById('title').value,
                body: document.getElementById('body').value,
            }
            Create(newItem);
        }
    }
}

function Create(data) {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(
        Load
    )
}

function ConvertFormPostToRow(post) {
    let string = '<tr>'
    string += '<td>' + post.id + '</td>'
    string += '<td>' + post.userId + '</td>'
    string += '<td>' + post.title + '</td>'
    string += '<td>' + post.body + '</td>'
    string += '<td><button onclick="Delete(' + post.id + ')">Delete</button></td>'
    string += '</tr>'
    return string;
}