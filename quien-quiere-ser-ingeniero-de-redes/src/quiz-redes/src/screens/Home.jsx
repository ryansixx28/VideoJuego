import React, { useState } from 'react'

export default function Home({ onStart }){
  const [level, setLevel] = useState('CCNA')
  return (
    <div className="card">
      <div className="header">
        <h1 className="title">¿Quién quiere ser Ingeniero de Redes?</h1>
        <span className="badge">Demo 1.1</span>
      </div>
      <p className="subtitle">Elige el nivel y comienza el reto.</p>
      <div style={{display:'flex', gap:12, margin:'16px 0'}}>
        {['CCNA','CCNP','CCIE'].map(l => (
          <button key={l} className={`btn ${l===level? '':'secondary'}`} onClick={()=>setLevel(l)}>{l}</button>
        ))}
      </div>
      <button className="btn" onClick={()=>onStart({level})}>Comenzar</button>
    </div>
  )
}
