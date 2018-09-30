var config = {
  apiKey: "AIzaSyCr89_-1vUFRhO6DCUyJnCAjUyWAY5SYRg",
  authDomain: "aditama-1997.firebaseapp.com",
  databaseURL: "https://aditama-1997.firebaseio.com",
  projectId: "aditama-1997",
  storageBucket: "aditama-1997.appspot.com",
  messagingSenderId: "220738787131"
};

firebase.initializeApp(config);
var db = firebase.database();

// CREATE
var preview = document.getElementById('preview');
var nim = document.getElementById('nim');
var nama = document.getElementById('nama');
var pesan = document.getElementById('pesan');

preview.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!nim.value || !nama.value || !pesan.value) return null

  db.ref('mahasiswa/' + nim.value).set({
    nama: nama.value,
    pesan: pesan.value
  });

  nama.value = '';
  pesan.value = '';
  nim.value = '';
});

// READ
var list = document.getElementById('list-mahasiswa');
var listRef = db.ref('/mahasiswa');

listRef.on('child_added', (data) => {
  var nim = data.key
  var nama = data.val().nama
  var pesan = data.val().pesan

  var div = document.createElement('div')
  div.id = nim;
  div.setAttribute("class", "column is-one-third")
  div.innerHTML = card(nim, nama, pesan)
  list.appendChild(div);
});

list.addEventListener('click', (e) => {
  var listNode = e.target.parentNode.parentNode

  // UPDATE
  if (e.target.id == 'edit') {
    nim.value = listNode.querySelector('#data-nim').innerText;
    nama.value = listNode.querySelector('#data-nama').innerText;
    pesan.value = listNode.querySelector('#data-pesan').innerText;
  }

  // DELETE
  if (e.target.id == 'delete') {
    var id = listNode.querySelector('#data-nim').innerText;
    db.ref('mahasiswa/' + id).remove();
  }
});

listRef.on('child_changed', (data) => {
  var nim = data.key
  var nama = data.val().nama
  var pesan = data.val().pesan

  var listNode = document.getElementById(nim);
  listNode.innerHTML = card(nim, nama, pesan);
});

listRef.on('child_removed', (data) => {
  var listNode = document.getElementById(data.key);
  listNode.parentNode.removeChild(listNode);
});


function card(nim, nama, pesan) {
  return `
  <div class="card">
    <header class="card-header">
      <p class="card-header-title" id="data-nama">
        ${nama}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
          <span id="data-pesan">${pesan}</span>
          <span></br>- </span>
          <span id="data-nim">${nim}</span>
      </div>
    </div>
    <footer class="card-footer">
      <a class="card-footer-item" id="edit">Edit</a>
      <a class="card-footer-item" id="delete">Delete</a>
    </footer>
  </div>
  `
};
