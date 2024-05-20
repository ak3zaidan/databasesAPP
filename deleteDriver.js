var mySongs = [];   //to store all the myStructs in

window.onload = function() {    //on load to allow the view to render
    var songTable = document.getElementById('songTable');
    getAllSongs();

    songTable.addEventListener('click', function(event) {
        var clickedButton = event.target;           //find the clicked button
        var clickedRow = clickedButton.closest('tr');      //and the specific row
        var rowIndex = clickedRow.rowIndex;
        if (event.target.tagName === 'BUTTON') {        //make sure the button was the one pressed
            console.log(mySongs[rowIndex - 1]._id)
            deleteSong(mySongs[rowIndex - 1]._id)        //call the delete function
            mySongs.splice(rowIndex - 1, 1);      //delete the actual row from the array
            var tableBody = document.getElementById('body');
            tableBody.deleteRow(rowIndex - 1); //delete the row from the table
        } 
    });
}

function deleteSong(id) {
    fetch('http://localhost:3000/delete-song', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }), // Send the ID as an object
    })
      .then(response => {
        // Handle the response
        if (response.ok) {
          console.log('Song deleted successfully');
        } else {
          throw new Error(response.statusText);
        }
      })
      .catch(error => {
        console.log('Error deleting song:', error.message);
      });
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
    mySongs = songs
    var tbody = songTable.getElementsByTagName('tbody')[0];
    // Clear existing table rows
    tbody.innerHTML = '';
  
    songs.forEach(song => {
      var row = document.createElement('tr');
  
      var titleCell = document.createElement('td');
      titleCell.textContent = song.title;
      row.appendChild(titleCell);
  
      var artistCell = document.createElement('td');
      artistCell.textContent = song.artist;
      row.appendChild(artistCell);
  
      var deleteCell = document.createElement('td');
      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.type = 'button';
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);
  
      tbody.appendChild(row);
    });
}

window.addEventListener('load', getAllSongs);