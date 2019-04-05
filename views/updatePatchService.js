const http = new XMLHttpRequest();
const url ='/patch?' + window.location.search.substr(1);
http.open("Get", url);
http.send();
http.onreadystatechange = (error)=> {
    if (http.readyState === 4) {
            JSON.parse(http.response).forEach(element => {
        document.querySelector('.page-content').innerHTML += `
        <form method="POST" action="/rest/PatchService/patches">
        patch name:<br>
        <input type="text" value="${element.name}" id="newName" name="name">
        <br>
        patch description:<br>
        <input type="text" value="${element.description}" id="newDescription" name="description">
        <br>
        image:<br>
        <input type="file" id="newImage" value="${element.image}" name="image">
        <br><br>
        <input type="submit" value="save changes">
        <input type="hidden" value="${element._id}" id="idToUpdate" name="idOfPatchToUpdate">
      </form>`
    });
    }
}