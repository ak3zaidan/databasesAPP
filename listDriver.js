window.onload = function() {
    var songTable = document.getElementById('songTable');
    getAllSongs();
}

function getAllSongs() {
    fetch('http://localhost:3000/songs')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then(data => {
        console.log('Songs:', data);
        populateSongTable(data); // Call the function to populate the table with songs
      })
      .catch(error => {
        console.log('Error:', error.message);
      });
}

function populateSongTable(songs) {
    var tbody = songTable.getElementsByTagName('tbody')[0];
    // Clear existing table rows
    tbody.innerHTML = '';
    var tbody = songTable.getElementsByTagName('tbody')[0];
    songs.forEach(song => {
        var row = document.createElement('tr');
        var idCell = document.createElement('td');
        idCell.textContent = song._id;
        row.appendChild(idCell);
        var titleCell = document.createElement('td');
        titleCell.textContent = song.title;
        row.appendChild(titleCell);
        var artistCell = document.createElement('td');
        artistCell.textContent = song.artist;
        row.appendChild(artistCell);
        var genreCell = document.createElement('td');
        genreCell.textContent = song.genre;
        row.appendChild(genreCell);
        var releasedCell = document.createElement('td');
        var releasedDate = new Date(song.date);
        var releasedDateString = releasedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        releasedCell.textContent = releasedDateString;
        row.appendChild(releasedCell);
        var popularityCell = document.createElement('td');
        popularityCell.textContent = song.popularity;
        row.appendChild(popularityCell);
        tbody.appendChild(row);
    });
}

window.addEventListener('load', getAllSongs);