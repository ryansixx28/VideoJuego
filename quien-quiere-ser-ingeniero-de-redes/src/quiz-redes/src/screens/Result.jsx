import React from 'react'
import { getAttempts } from '../store/storage'

export default function Result({ score, onRetry }){
  const last = getAttempts()[0]
  return (
    <div className="card grid" style={{gap:12}}>
      <h2 className="title" style={{fontSize:22}}>Resultado</h2>
      <div>Tu puntaje: <b>{score}</b>{last? ` / ${last.total}`: ''}</div>
      {last && (
        <div className="subtitle">Nivel {last.level} · {new Date(last.at).toLocaleString()}</div>
      )}
      <div style={{display:'flex', gap:12}}>
        <button className="btn" onClick={onRetry}>Volver al inicio</button>
      </div>
    </div>
  )
}