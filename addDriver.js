window.onload = function() {
    const addButton = document.getElementById('add');
    var title = document.getElementById('title');
    var artist = document.getElementById('artist');
    var genre = document.getElementById('genre');
    var rating = document.getElementById('rating');
    var released = document.getElementById('released');
  
    addButton.addEventListener('click', function() {
      if (title.value === '' || artist.value === '' || genre.value === '' || rating.value === '' || released.value === '') {
        alert('Please fill out all the fields before adding the song to the playlist.');
      } else {
        uploadSong();
      }
    });
  
    function uploadSong() {
      const songData = {
        title: title.value,
        artist: artist.value,
        genre: genre.value,
        popularity: rating.value,
        date: released.value
      };
      
      fetch('http://localhost:3000/create-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(songData)
      })
        .then(response => {
          if (response.ok) {
            title.value = ""
            artist.value = ""
            genre.value = ""
            rating.value = ""
            released.value = ""
            console.log('Song created successfully');
          } else {
            alert('Error:', response.statusText);
          }
        })
        .catch(error => {
          alert('Error:', error.message);
        });
    }
}