import React, { useEffect, useState } from 'react'
import Home from './screens/Home'
import Quiz from './screens/Quiz'
import Result from './screens/Result'
import Leaderboard from './screens/Leaderboard'
import { onUser, loginWithGoogle, logout, resumeRedirect } from './services/firebase'

export default function App(){
  const [screen, setScreen] = useState('home')
  const [config, setConfig] = useState({ level: 'CCNA' })
  const [score, setScore] = useState(0)
  const [user, setUser] = useState(null)
  const [soundOn, setSoundOn] = useState(true)

  useEffect(()=>{
  const off = onUser(u=> setUser(u))
  // Captura resultado del redirect al volver de Google:
  resumeRedirect().then(()=> {
    // Limpia querystrings raros si quedaron:
    if (location.search.includes('state=') || location.search.includes('code=')) {
      history.replaceState({}, document.title, '/')
    }
  })
  return ()=>off && off()
},[])

  return (
    <div className="container">
      
      <div className="bg-dc">
  <div className="dc-aisle" />
  <div className="dc-racks left" />
  <div className="dc-racks right" />
  <div className="dc-leds" />
  <div className="dc-vignette" />
</div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <div style={{display:'flex', gap:8}}>
          <button className="btn secondary" onClick={()=>setScreen('home')}>Inicio</button>
          <button className="btn secondary" onClick={()=>setScreen('top')}>Ranking</button>
          <button className="btn secondary" onClick={()=>setSoundOn(s=>!s)}>{soundOn ? '🔊 Sonido' : '🔇 Silencio'}</button>
        </div>
        <div>
          {user ? (
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <span className="badge">{user.displayName || user.email}</span>
              <button className="btn" onClick={logout}>Salir</button>
            </div>
          ) : (
            <button className="btn" onClick={loginWithGoogle}>Entrar con Google</button>
          )}
        </div>
      </div>

      {screen === 'home' && (
        <Home onStart={(cfg)=>{ setConfig(cfg); setScreen('quiz') }} />
      )}
      {screen === 'quiz' && (
        <Quiz level={config.level} user={user} soundOn={soundOn} onFinish={(s)=>{ setScore(s); setScreen('result') }} />
      )}
      {screen === 'result' && (
        <Result score={score} user={user} onRetry={()=>setScreen('home')} />
      )}
      {screen === 'top' && (
        <Leaderboard level={config.level} />
      )}
    </div>
  )
}