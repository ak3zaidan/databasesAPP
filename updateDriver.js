var mySongs = [];   //to store all the myStructs in

window.onload = function() {    //on load to allow the view to render
    var songTable = document.getElementById('songTable');
    var elementID = document.getElementById('id');
    elementID.disabled = true;
    var title = document.getElementById('title');
    var artist = document.getElementById('artist');
    var genre = document.getElementById('genre');         //get all the values of each field
    var rating = document.getElementById('rating');
    var released = document.getElementById('released');
    getAllSongs();

    songTable.addEventListener('click', function(event) {
        var clickedButton = event.target;           //find the clicked button
        var clickedRow = clickedButton.closest('tr');      //and the specific row
        var rowIndex = clickedRow.rowIndex;
        if (event.target.tagName === 'BUTTON') {        //make sure the button was the one pressed
            if (title.value === '' || artist.value === '' || genre.value === '' || rating.value === '' || released.value === '') {       //check if their filled out
                alert('Please fill out all the fields before adding the song to the playlist.');
            } else {
                mySongs[rowIndex - 1]._id = elementID.value      //update in the array
                mySongs[rowIndex - 1].title = title.value 
                mySongs[rowIndex - 1].artist = artist.value 
                mySongs[rowIndex - 1].genre = genre.value 
                mySongs[rowIndex - 1].popularity = rating.value 
                mySongs[rowIndex - 1].date = formatDate(released.value);

                var cells = clickedRow.querySelectorAll('td');      //update the actual row in the table
                cells[0].textContent = title.value;
                cells[1].textContent = artist.value;

                Update(mySongs[rowIndex - 1]._id, title.value, artist.value , genre.value, rating.value, released.value)        //call the update function
            }
        } else if (event.target.tagName === 'TD'){
            elementID.value = mySongs[rowIndex - 1]._id          //update the form
            title.value = mySongs[rowIndex - 1].title
            artist.value = mySongs[rowIndex - 1].artist
            genre.value = mySongs[rowIndex - 1].genre
            rating.value = mySongs[rowIndex - 1].popularity
            released.value = mySongs[rowIndex - 1].date
        }
    });
    //function to upload song to data base
    function Update(id, title, artist, genre, rating, released){
        const updatedSong = {       //put it in a struct
        id: id,
        title: title,
        artist: artist,
        genre: genre,
        popularity: rating,
        date: released
        };
    
        fetch('http://localhost:3000/update-song', {        //call the end point
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSong)               // use json strinfy func
            })
            .then(response => {
                if (response.ok) {
                console.log('Song updated successfully');
                } else {
                throw new Error('Failed to update song');
                }
            })
            .catch(error => {
                console.log('Error updating song:', error);
            });
    }

    //function to fetch songs from the data base and add them to the table
    function getAllSongs() {
        console.log("called")
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
            console.log(data)
            populateSongTable(data); // Call the function to populate the table with songs
        })
        .catch(error => {
            console.log('Error:', error.message);
        });
    }

    function populateSongTable(songs) {
        console.log("called2")
        mySongs = songs
        console.log(songs)
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

            var deleteCell = document.createElement('td');
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Update';
            deleteButton.type = 'button';
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            tbody.appendChild(row);
        });
    }
    function formatDate(dateString) {   //to avoid the warning
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    window.addEventListener('load', getAllSongs);
}

