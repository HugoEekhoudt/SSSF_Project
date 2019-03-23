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
        <a href='#' class='btn btn-primary'>More Info</a>
        </div>`
    });
    }

}