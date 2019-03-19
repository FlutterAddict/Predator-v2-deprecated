const get = (key, target, placeholderHTML='', callback) => {
  target.innerHTML = placeholderHTML;
  let request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        target.innerHTML = request.responseText;
        if (callback) {
          callback();
        };
      };
    };
  };
  request.open('GET', key);
  request.send();
};