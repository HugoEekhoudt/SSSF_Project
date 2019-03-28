const http = new XMLHttpRequest();
const url ='http://localhost:3000/patch?' + window.location.search.substr(1);
http.open("Get", url);
http.send();
http.onreadystatechange = (error)=> {
    if (http.readyState === 4) {
            JSON.parse(http.response).forEach(element => {
        document.querySelector('.page-content').innerHTML += `
        <form method="PATCH" action="/rest/PatchService/patches">
        patch name:<br>
        <input type="text" value="${element.name}" name="name">
        <br>
        patch description:<br>
        <input type="text" value="${element.description}" name="description">
        <br>
        <br>
        change image:<input type="checkbox" name="checkIfUpdateImage">
        <br>
        image:<br>
        <input type="file" name="image">
        <br><br>
        <input type="button" onclick="updatePatch()" value="save changes">
      </form>`
    });
    }
}

function updatePatch() {
    
}