'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Add() {
  const [squareColor, setSquareColor] = useState('red');
  const [effectText, setEffectText] = useState('beep');

  function changeSquare() {
    // if (squareColor == 'red') {
    //   setSquareColor('blue');
    // } else {
    //   setSquareColor('red');
    // }

    squareColor === "red" ? setSquareColor("blue") : setSquareColor("red")
  }

  useEffect(() => {
    squareColor === "red" ? setEffectText("beep") : setEffectText("boop")
  }, [squareColor]);

  const [time, setTime] = useState(new Date());
  const [squareColor2, setSquareColor2] = useState('green');
  const [squareHeight, setSquareHeight] = useState('10rem');
  
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setTime(currentTime);

      const seconds = currentTime.getSeconds();

      if (seconds > 30) {
        setSquareColor2('yellow');
        setSquareHeight('10rem');
      } else {
        setSquareColor2('purple');
        setSquareHeight('20rem');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    // just to mess around with what react can do
      <div className='vertical'>
        <h1>Add Appointment Page</h1>
        <Link href="..">Back</Link>

        <div className='square' style={{ backgroundColor: squareColor }}></div>
        <button onClick={changeSquare} style={{width:"10rem"}}>Change Square</button>
        
        <h1>Effect Change: {effectText}</h1>

        <p>{time.toLocaleTimeString()}</p>

        <div className='square' style={{ backgroundColor: squareColor2, height: squareHeight }}></div>
      </div>
  );
}
