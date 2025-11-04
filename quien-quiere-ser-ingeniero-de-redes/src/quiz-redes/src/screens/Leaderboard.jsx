import React, { useEffect, useState } from 'react'
import { initFirebase, db } from '../services/firebase'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

export default function Leaderboard({ level='CCNA' }){
  const [rows, setRows] = useState([])

  useEffect(()=>{
    async function run(){
      try{
        initFirebase()
        const baseCol = collection(db,'attempts')

        // 1) Intento con índice (where + orderBy)
        let snap
        try {
          const q1 = query(baseCol, where('level','==', level), orderBy('score','desc'), limit(10))
          snap = await getDocs(q1)
        } catch (e) {
          // 2) Si falta índice, traemos sin orderBy y ordenamos en memoria
          const q2 = query(baseCol, where('level','==', level))
          snap = await getDocs(q2)
        }

        const data = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a,b) => (b.score ?? 0) - (a.score ?? 0))
          .slice(0, 10)

        setRows(data)
      }catch(e){
        console.error('[leaderboard]', e)
        setRows([])
      }
    }
    run()
  }, [level])

  return (
    <div className="card">
      <div className="header">
        <h2 className="title">Ranking Top 10 · {level}</h2>
        <span className="badge">Beta</span>
      </div>
      <div className="grid" style={{gap:8}}>
        {rows.length===0 && <div className="subtitle">Aún sin puntajes. Juega y vuelve 😉</div>}
        {rows.map((r,idx)=> (
          <div key={r.id} className="option" style={{display:'flex', justifyContent:'space-between'}}>
            <div><b>#{idx+1}</b> · {r.name || r.email || r.uid || 'Anónimo'}</div>
            <div><b>{r.score}</b> / {r.total}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
