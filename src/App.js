import React, { useState, useEffect } from 'react';
import "./App.css"


function App() {
  const [playlist, setPlaylist] = useState([]);
  const [nowPlayingIndex, setNowPlayingIndex] = useState(-1);
  const [audioRef, setAudioRef] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const lastPlayedIndex = parseInt(localStorage.getItem('lastPlayedIndex'));
    const audioTime = parseFloat(localStorage.getItem('audioTime'));
    if (!isNaN(lastPlayedIndex) && audioRef && playlist[lastPlayedIndex]) {
      setNowPlayingIndex(lastPlayedIndex);
      audioRef.currentTime = audioTime;
      audioRef.play();
      setIsPlaying(true);
    }
  }, [audioRef, playlist]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newPlaylist = [...playlist];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newPlaylist.push({ name: file.name, url: URL.createObjectURL(file) });
    }
    setPlaylist(newPlaylist);
  };

  const handlePlay = (index) => {
    setNowPlayingIndex(index);
    if (audioRef && playlist[index]) {
      audioRef.src = playlist[index].url;
      audioRef.load(); // Load the new audio source
      audioRef.addEventListener('canplaythrough', () => {
        audioRef.play(); // Start playback once the audio is ready
        setIsPlaying(true);
        localStorage.setItem('lastPlayedIndex', index);
        localStorage.setItem('audioTime', 0);
      }, { once: true }); // Remove the event listener after it's triggered once
    }
  };
  
  const handleAudioEnded = () => {
    if (nowPlayingIndex < playlist.length - 1) {
      handlePlay(nowPlayingIndex + 1);
    } else {
      setNowPlayingIndex(-1);
      setIsPlaying(false);
    }
  };

  return (
    <div>
    <div className="container">
      <h1 className="heading">Audio Player</h1>
      <label htmlFor="audioFileInput" className="fileInputLabel">
        Select Audio Files
        <input
          id="audioFileInput"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          multiple
          className="fileInput"
        />
      </label>
      <div className="player-container">
        <div className="playlist">
          <h2 className='subheading'>Playlist</h2>
          <ul>
            {playlist.map((audio, index) => (
              <li
                key={index}
                onClick={() => handlePlay(index)}
                className={index === nowPlayingIndex ? 'active' : ''}
              >
                {audio.name}
              </li>
            ))}
          </ul>
        </div>
        {nowPlayingIndex !== -1 && (
          <div className="now-playing">
            <h2 className='subheading'>Now Playing</h2>
            <audio
              ref={(audio) => setAudioRef(audio)}
              src={playlist[nowPlayingIndex].url}
              controls
              onEnded={handleAudioEnded}
            />
            <p>Now Playing: {playlist[nowPlayingIndex].name}</p>
          </div>
        )}
      </div>
    </div>
     <input type="file" accept="audio/*" onChange={handleFileChange} multiple />
     <footer className="footer">Created by Shiv Kumar Sahu</footer>
   </div>
  );
}

export default App;
