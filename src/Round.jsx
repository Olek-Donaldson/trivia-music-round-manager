import { useState } from 'react';
import WebPlayback from './WebPlayback';

const request = require('request');

function Song(props) {
    return <li>Title: {props.title} --- Artist(s): {props.artists.join(", ")}</li>
}



function Round(props) {
    const [tracks, setTracks] = useState([]);
    const [add_song_id, setAddSongId] = useState('');
    const token = props.token;

    async function AddSong(token, song_id) {
        var req_headers = new Headers({
            'Authorization': 'Bearer ' + token
        });

        const resp = await fetch('/tracks/' + song_id, {
            headers: req_headers
        }).then(async r => await r.json());

        console.log("Response for " + song_id + ": \n" + resp)

        setTracks([...tracks, resp])
    }

    return (
        <>
            <div className='Round'>
                
                <h1>Music Round!</h1>
                <label>
                    Song ID: 
                    <input name='songId' value={add_song_id} onChange={e => setAddSongId(e.target.value)} />
                    <button onClick={() => AddSong(token, add_song_id)}>Add Song</button>
                </label>
                <ul>
                    {tracks.map(track => <li>Title: {track.name} --- Artist(s): {track.artists.map(a => a.name).join(", ")}</li>)}
                </ul>
                
                <WebPlayback token={token} />
            </div>
        </>
    )
// https://open.spotify.com/track/4ItvsNSOAAoSCvgxTVZtKx?si=a6a42d40e3034de5
// https://open.spotify.com/track/275XKjLmQFuZnxTvvtJ6VZ?si=7c9e27cbafd54a81

}


export default Round;