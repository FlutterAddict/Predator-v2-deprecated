function getJSON(path, callback) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        callback(JSON.parse(request.responseText));
      };
    };    
  }
  request.open('GET', path);
  request.send();  
}



export default getJSON;