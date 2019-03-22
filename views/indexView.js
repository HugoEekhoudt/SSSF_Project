const http = new XMLHttpRequest();
const url ='http://localhost:3000/patches/all';
http.open("Get", url);
http.send();
http.onreadystatechange = (error)=> {
    JSON.parse(http.response).forEach(element => {
        document.querySelector('.tab-content').innerHTML += "<h1>"+element.name+ " </h1>     "
    });
   
}