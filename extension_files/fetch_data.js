function getProfData(univ, prof) {

    const http = new XMLHttpRequest();
    const url = 'http://54.87.246.226/';

    http.open("GET", url);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify({University:univ, Professor:prof}));

    http.onreadystatechange=(e) => {
        console.log(http.responseText);
        return http.responseText;
    }
}