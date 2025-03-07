import React, { useRef, useState } from 'react';

const App = () => {
  const [usedWords, setUsedWords] = useState([])
  const [playerActive, setPlayerActive] = useState(1)
  const [currentWord, setCurrentWord] = useState('')
  const [error, setError] = useState('')
  const [scores, setScores] = useState({ 1: 0, 2: 0 })

  const inputRef1 = useRef(null)
  const inputRef2 = useRef(null)

  const getLastLetter = () => {
    if (usedWords.length === 0) return ""
    return usedWords[usedWords.length - 1].slice(-1).toUpperCase()
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const lowerWord = currentWord.toLowerCase()
          const lastWord = usedWords[usedWords.length - 1]
          const lastLetter = lastWord ? lastWord.slice(-1) : null

          const points = lastLetter && lowerWord.startsWith(lastLetter) ? 5 : 3;
          setScores((prevScores) => ({
            ...prevScores,
            [playerActive]: prevScores[playerActive] + points
          }))

          setUsedWords((prevWords) => [...prevWords, lowerWord])
          setCurrentWord("")
          setError("")

          setPlayerActive(playerActive == 1 ? 2 : 1)
        } else {
          alert("this word does not exist in  the dictionary")
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className='mb-5'>
      <div className='mb-5'>
        <form onSubmit={handleSubmit}>
          <h2>Player 1 (Score:{scores[1]})</h2>
          <input
            placeholder={playerActive == 1? getLastLetter():""}
            disabled={playerActive !== 1}
            className='border-2 mb-2' value={(playerActive == 1 ? currentWord : '')} type='text' ref={inputRef1} onChange={(e) => setCurrentWord(e.target.value)} />
          <button type='submit'>submit</button>
          {playerActive == 1 && error && < p className='text-red-400'>{error}</p>}
        </form>
      </div>


      <div>
        <form onSubmit={handleSubmit}>
        <h2>Player 1 (Score:{scores[2]})</h2>
        <input
            placeholder={playerActive == 2? getLastLetter():""}
            disabled={playerActive !== 2}
            className='border-2 mb-2' value={(playerActive == 2 ? currentWord : '')} type='text' ref={inputRef2} onChange={(e) => setCurrentWord(e.target.value)} />
          <button type='submit'>submit</button>
          {playerActive == 2 && error && < p className='text-red-400'>{error}</p>}
        </form>
      </div>



      <div>
        <h3>Used Words</h3>
        <ul>
          {usedWords.map((word, index) => {
            <li key={index}>{word}</li>
          })}
        </ul>
      </div>
    </div>
  );
};

export default App;