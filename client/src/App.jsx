import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/gemini-test', {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({ prompt: "Say hello gemini!" })
    })
    .then(res => res.json())
    .then(res => setData(res.response))

  }, []);

  return (
    <>
      <div>
        {data}
      </div>
    </>
  )
}

export default App
