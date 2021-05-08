const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    const data = JSON.parse(this.responseText);
    console.log(data);

    const ul = document.createElement("ul");
    ul.setAttribute("class", "notes");

    data.forEach((note) => {
      const li = document.createElement("li");
      ul.appendChild(li);
      li.appendChild(document.createTextNode(note.content));
    });

    document.querySelector("#notes").appendChild(ul);
  }
};

xhr.open("GET", "/data.json", true);
xhr.send();
