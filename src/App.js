import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback'
import Login from './Login'
import Round from './Round';
import './App.css';

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();
    console.log('Authorization: Bearer ' + token);


  }, []);

  return (
    <>
        { (token === '') ? 
        <Login/> 
        : 
        <Round token={token} /> }
    </>
  );
}


export default App;
