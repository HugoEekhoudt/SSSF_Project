const http = new XMLHttpRequest();
const url ='http://localhost:3000/patches/all';
http.open("Get", url);
http.send();
http.onreadystatechange = (error)=> {
    if (http.readyState === 4) {
            JSON.parse(http.response).forEach(element => {
        document.querySelector('.tab-content').innerHTML += 
        `<div class='card' style='width: 15rem;'> <img class='card-img-top' src='/images/${element.image}' 
        alt='Card image cap'> <div class='card-body'> <h5 class='card-title'>${element.name}
        </h5> <p class='card-text'>${element.description}</p>
        <a href='/updatePatch?idToUpdate=${element._id}' class='btn btn-primary'>Edit</a>
        <form>
        <input type="button" onclick="deletePatch('${element._id}')" value="delete">
        </form>
        </div>`
    });
    }
}

function searchPatches() {
    document.querySelector('.tab-content').innerHTML = ""
    const http = new XMLHttpRequest();
const url ='http://localhost:3000/search/patch?searchField=' + document.getElementById("sField").value;
http.open("Get", url);
http.send();
http.onreadystatechange = (error)=> {
    if (http.readyState === 4) {
            JSON.parse(http.response).forEach(element => {
        document.querySelector('.tab-content').innerHTML += 
        `<div class='card' style='width: 15rem;'> <img class='card-img-top' src='/images/${element.image}' 
        alt='Card image cap'> <div class='card-body'> <h5 class='card-title'>${element.name}
        </h5> <p class='card-text'>${element.description}</p>
        <a href='/updatePatch?idToUpdate=${element._id}' class='btn btn-primary'>Edit</a>
        <form>
        <input type="button" onclick="deletePatch('${element._id}')" value="delete">
        </form>
        </div>`
    });
    }
}
}

function deletePatch() {
    document.querySelector('.tab-content').innerHTML = ""
        const http = new XMLHttpRequest();
        const url ='/rest/PatchService/patches?idToDelete=' + arguments[0];
        http.open("Delete", url);
        http.send();
        http.onreadystatechange = (error)=> {
            if (http.readyState === 4) {
                    JSON.parse(http.response).forEach(element => {
                document.querySelector('.tab-content').innerHTML += 
                `<div class='card' style='width: 15rem;'> <img class='card-img-top' src='/images/${element.image}' 
                alt='Card image cap'> <div class='card-body'> <h5 class='card-title'>${element.name}
                </h5> <p class='card-text'>${element.description}</p>
                <a href='#' class='btn btn-primary'>More Info</a>
                <form>
                <input type="button" onclick="deletePatch('${element._id}')" value="delete">
                </form>
                </div>`
            });
            }
        }
}