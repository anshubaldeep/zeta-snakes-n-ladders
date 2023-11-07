import { useState } from 'react';
import './App.css'
import { useMemo } from 'react';
import image from './assets/1.jpeg';

const ladders = [
  { start: 2, end: 38 },
  { start: 7, end: 14 },
  { start: 8, end: 31 },
  { start: 15, end: 26 },
  { start: 21, end: 42 },
  { start: 28, end: 84 },
  { start: 36, end: 44 },
  { start: 51, end: 67 },
  { start: 71, end: 91 },
  { start: 78, end: 98 },
  { start: 87, end: 94 },
]

const snakes = [
  { start: 16, end: 6 },
  { start: 46, end: 25 },
  { start: 49, end: 11 },
  { start: 62, end: 19 },
  { start: 64, end: 60 },
  { start: 74, end: 53 },
  { start: 89, end: 68 },
  { start: 92, end: 88 },
  { start: 95, end: 75 },
  { start: 99, end: 80 },
]

const turnPoints = () => {
  const arr = [];
  for(let i=0; i<10; i++){
    for(let j=0; j<10; j++)
    {
      arr.push({i, j, value: (i*10+j+ 1)});
    }
  }
  return arr;
}

function App() {
  const [players, setNumber] = useState(0);
  const [turnValue, setTurnValue] = useState({});
  const [currentTurn, setCurrentTurn] = useState(0);
  const [rolledVal, setRolledVal] = useState(0);
  const [message, setMessage] = useState('');
  const tps = useMemo(()=>turnPoints(), []);
  const rows = () => {
    let res = []
    for(let i =0; i<10; i++){
      res.push(tps.slice(i*10, (i+1)*10));
    }
    res = res.reverse();
    for(let i=0; i<10; i++){
      if(i%2 === 0){
        res[i].reverse();
      }
    }
    return res;
  }

  return (
    <div className='flex flex-col p-4'>
      <h1 className='text-red-800 text-4xl font-extrabold'>Game</h1>
      <div>
      <input
        value={players}
        onChange={(e) => setNumber(e.target.value)}
        className='border-2 border-gray-400 rounded-md p-2 mt-2 w-20'
      />
      <button
        onClick={()=>{
          if(players>0){
            const turnValues = {};
            for(let i=0;i<players;i++){
              turnValues[`player_${i+1}`]= {
                value: 0,
                color: `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`
              }
            }
            setTurnValue(turnValues);
          }
        }}
      >Start</button>
      </div>
      <div
        style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                height: '500px',
                width: '500px',
              }}
        className='mt-10'
      >
      {
        rows().map((i, index)=>{
          return (
            <div key={index} className='flex flex-row'>
              {
                i.map((j, index)=>{
                  return (
                    <div key={index} className={`rounded-md p-2 m-1 w-20 h-[2.65rem] flex`}
                      style={{
                        backgroundColor: Object.values(turnValue).find((k)=>k.value === (j?.value))?.color
                      }}
                    >
                      
                      
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }
      </div>
      <div className='mt-10'>
        <div>
          {`Player ${currentTurn+1}'s turn`}
        </div>
        <button 
          className='border-2 border-blue-400 bg-blue-200 rounded-md p-2 m-1 w-20 flex items-center justify-center mt-10'
          onClick={()=> {
            const val = Math.floor(Math.random()*6)+1;
            setRolledVal(val);
            const turnValues = {...turnValue};
            console.log(turnValues)
            turnValues[`player_${currentTurn+1}`].value += val;
            if(turnValues[`player_${currentTurn+1}`].value > 100){
              turnValues[`player_${currentTurn+1}`].value -= val;
            }
            const snake = snakes.find((i)=>i.start === turnValues[`player_${currentTurn+1}`].value);
            const ladder = ladders.find((i)=>i.start === turnValues[`player_${currentTurn+1}`].value);
            if(snake){
              turnValues[`player_${currentTurn+1}`].value = snake.end;
              setMessage(`Player ${currentTurn+1} got bitten by snake`);
            }
            else if(ladder){
              turnValues[`player_${currentTurn+1}`].value = ladder.end;
              setMessage(`Player ${currentTurn+1} got ladder`);
            } else if(turnValues[`player_${currentTurn+1}`].value === 100){
              setMessage(`Player ${currentTurn+1} won`);
              return;
            } 
            else {
              setMessage('');
            }
            
            setTurnValue(turnValues);
            if(val !== 6){
              setCurrentTurn((currentTurn+1)%players);
            }
          }}
        >
          Roll
        </button>
        <div>
          Value: {rolledVal}
        </div>
        <div>
          {message}
        </div>
      </div>
    </div>
  )
}

export default App
