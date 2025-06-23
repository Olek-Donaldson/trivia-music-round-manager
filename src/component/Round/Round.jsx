import { useEffect, useState } from 'react';
import WebPlayback from '../../WebPlayback';
import MultiRangeSlider from '../multiRangeSlider/MultiRangeSlider';
import MultiRangeTypes from '../multiRangeSlider/MultiRangeTypes';
import './Round.scss'

const request = require('request');

function Song({track}) {
    return  <div style={{flexGrow: 1}}>
                Title: {track.name} --- Artist(s): {track.artists.map(a => a.name)}
            </div>     
}

function Round(props) {
    const [tracks, setTracks] = useState([]);
    const [add_song_id, setAddSongId] = useState('');
    const [playing_index, setPlayingIndex] = useState(0); // conceptually uses 1-indexing
    const [time_ranges, setTimeRanges] = useState([]);

    const token = props.token;
    const req_headers = new Headers({
            'Authorization': 'Bearer ' + token
        });
    
    async function AddSong(song_id) {
        var req_headers = new Headers({
            'Authorization': 'Bearer ' + token
        });

        const resp = await fetch('/tracks/' + song_id, {
            headers: req_headers
        }).then(async r => await r.json());

        console.log("Response for " + song_id + ": \n" + JSON.stringify(resp))

        setTracks([...tracks, resp])
        setTimeRanges([...time_ranges, {min: 0, max: resp.duration_ms}])
    }

    async function PauseSong() {
        console.log("StopSong called");

        // make request
        // if request is successful, toggle isPlaying
        setPlayingIndex(-1 * playing_index);
    }

    async function PlaySongByIdx(idx) {
        console.log("PlaySongByIdx called for idx: " + idx.toString());

        var track = tracks[idx];
        var time_range = time_ranges[idx];

        // make request
        // if request is successful, toggle isPlaying
        setPlayingIndex(idx + 1);
    }

    async function ResumeSong(params) {
        console.log("PlaySongByIdx called for idx: " + idx.toString());
        
        setPlayingIndex(-1 * playing_index);
    }

    function UpdateTimeRange(idx, range) {
        var tempRanges = time_ranges;
        tempRanges[idx] = range;
        setTimeRanges(tempRanges);
    }

    return (
        <>
            <div className='Round'>
                
                <h1>Music Round!</h1>
                <label>
                    Song ID: 
                    <input name='songId' value={add_song_id} onChange={e => setAddSongId(e.target.value)} />
                    <button onClick={() => AddSong(add_song_id)}>Add Song</button>
                </label>
                <button onClick={() => PlaySongByIdx(0)}>Play All From Start</button>
                {playing_index > 0 && <button onClick={() => PauseSong()}>Stop Current Song</button>}
                {playing_index < 0 && <button onClick={() => ResumeSong()}>Resume Current Song</button>}
                {tracks.map((track, idx) => 
                    <div className='track-container' key={track.id + idx.toString()}> 
                        <Song track={track} />
                        <div className="p-4" style={{flexGrow: 1}}>
                            { playing_index - 1 == idx ? <button onClick={() => PauseSong()}>Pause</button> : <button onClick={() => PlaySongByIdx(idx)}>Play</button>}
                        </div>
                        <div className="p-4" style={{flexGrow: 1}}>
                            <MultiRangeSlider min={0} max={track.duration_ms} type={MultiRangeTypes.MS_TO_TIMESTAMPS} onChange={UpdateTimeRange}></MultiRangeSlider>
                        </div>
                    </div>
                )}
                <WebPlayback token={token} />

            </div>
        </>
    )
// https://open.spotify.com/track/4ItvsNSOAAoSCvgxTVZtKx?si=a6a42d40e3034de5
// https://open.spotify.com/track/275XKjLmQFuZnxTvvtJ6VZ?si=7c9e27cbafd54a81
// https://open.spotify.com/track/4R2DDseYW2tsmMhvdQQ2Po?si=e401ce7fe0c24b4d
// https://open.spotify.com/track/63XfetE4xpara0D3DJBmjZ?si=070358c53fbc43b9

}


export default Round;