import { useState } from 'react';
import WebPlayback from '../../WebPlayback';
import MultiRangeSlider from '../multiRangeSlider/MultiRangeSlider';
import MultiRangeTypes from '../multiRangeSlider/MultiRangeTypes';

const request = require('request');

function Song({track}) {
    const [time_range, setTimeRange] = useState({min: 0, max: track.duration_ms});

    function getTimeRange() {
        return time_range
    } 

    return  <li>
                Title: {track.title} --- Artist(s): {track.artists.map(a => a.name)}

                <MultiRangeSlider min={0} max={track.duration_ms} type={MultiRangeTypes.MS_TO_TIMESTAMPS} onChange={setTimeRange}></MultiRangeSlider>

            </li>
}

function Round(props) {
    const [tracks, setTracks] = useState([]);
    const [add_song_id, setAddSongId] = useState('');
    const [playing_index, setPlayingIndex] = useState(-1);

    const token = props.token;

    async function AddSong(token, song_id) {
        var req_headers = new Headers({
            'Authorization': 'Bearer ' + token
        });

        const resp = await fetch('/tracks/' + song_id, {
            headers: req_headers
        }).then(async r => await r.json());

        console.log("Response for " + song_id + ": \n" + JSON.stringify(resp))

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
                    {tracks.map(track => <Song track={track}></Song>)}
                </ul>
                
                <WebPlayback token={token} />
            </div>
        </>
    )
// https://open.spotify.com/track/4ItvsNSOAAoSCvgxTVZtKx?si=a6a42d40e3034de5
// https://open.spotify.com/track/275XKjLmQFuZnxTvvtJ6VZ?si=7c9e27cbafd54a81
// https://open.spotify.com/track/4R2DDseYW2tsmMhvdQQ2Po?si=e401ce7fe0c24b4d

}


export default Round;