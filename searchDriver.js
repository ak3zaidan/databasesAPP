window.onload = function() {    //on load to allow the view to render
    var songTable = document.getElementById('table');
    var title = document.getElementById('mainTitle');
    var menu = document.getElementById('menu');
    var search = document.getElementById('search');
    songTable.style.display = "none";

    search.addEventListener('click', function() {//add event listner to exec function when this button is pressed
        fetchData()
    });

    //function to fetch songs from the data base and add them to the table
    function fetchData() {
        songTable.style.display = "table";
      
        var placeHolder = menu.value + "--Music";
        title.innerHTML = "<h2>" + placeHolder + "</h2>";
      
        let genre = menu.value.toLowerCase();
        console.log(genre)
        fetch('http://localhost:3000/search?genre=' + genre) // Use query parameter instead of request body
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
}

