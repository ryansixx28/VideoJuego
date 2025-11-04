import React, { useEffect, useMemo, useState } from 'react'
import { loadQuestions as loadLocal } from '../store/questions'
import { saveAttempt } from '../store/storage'
import { initFirebase, db } from '../services/firebase'
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { playClick, playCorrect, playWrong, playTick, playJoker } from '../utils/sfx'

const PER_QUESTION_SECONDS = 30

export default function Quiz({ level, onFinish, user, soundOn }){
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(PER_QUESTION_SECONDS)
  const [source, setSource] = useState('firebase')

  // Lifelines
  const [used50, setUsed50] = useState(false)
  const [usedTime, setUsedTime] = useState(false)
  const [usedSkip, setUsedSkip] = useState(false)
  const [disabledIdx, setDisabledIdx] = useState([])

  useEffect(()=>{
    let mounted = true
    async function fetchQs(){
      try{
        initFirebase()
        const q1 = query(collection(db,'questions'), where('level','==',level), orderBy('order','asc'))
        let snap
        try { snap = await getDocs(q1) } catch { const q2 = query(collection(db,'questions'), where('level','==',level)); snap = await getDocs(q2) }
        const rows = snap.docs.map(d=>({id:d.id, ...d.data()})).sort((a,b)=> (a.order??0) - (b.order??0))
        if(mounted){ setAll(rows.length? rows : loadLocal(level)); setSource(rows.length? 'firebase':'local'); setLoading(false); setI(0); setSelected(null); setTimeLeft(PER_QUESTION_SECONDS); setScore(0); setUsed50(false); setUsedTime(false); setUsedSkip(false); setDisabledIdx([]) }
      }catch(e){ if(mounted){ setAll(loadLocal(level)); setSource('local'); setLoading(false) } }
    }
    fetchQs();
    return ()=>{ mounted=false }
  }, [level])

  useEffect(()=>{
    if(timeLeft<=0){ handleAnswer(null); return }
    if(timeLeft<=5 && timeLeft>0 && selected===null){ playTick(soundOn) }
    const t = setTimeout(()=>setTimeLeft(s=>s-1), 1000)
    return ()=>clearTimeout(t)
  }, [timeLeft])

  const q = all[i]
  const steps = useMemo(()=> all.map((_, idx)=> ({ pos: idx+1, prize: `${idx+1}/${all.length}` })), [all])

  if(loading) return <div className="card">Cargando preguntas…</div>
  if(!q) return <div className="card">No hay preguntas para {level}.</div>

  async function saveAttemptCloud(payload){
    try{
      initFirebase()
      await addDoc(collection(db,'attempts'), { ...payload, uid: user?.uid || null, name: user?.displayName || user?.email || null, email: user?.email || null, at: serverTimestamp() })
    }catch(err){ console.error('[attempts addDoc]', err) }
  }

  function goNext(finalScore){
    const next = i+1
    if(next>=all.length){
      const final = finalScore
      saveAttempt({ level, score: final, total: all.length })
      saveAttemptCloud({ level, score: final, total: all.length })
      onFinish(final)
    } else {
      setI(next); setSelected(null); setTimeLeft(PER_QUESTION_SECONDS); setDisabledIdx([])
    }
  }

function handleAnswer(choice){
  if (selected !== null) return
  const correct = choice === q.answer
  playClick(soundOn)
  setSelected(choice)

  if (correct) { 
    playCorrect(soundOn); 
    setScore(s => s + 1) 
  } else { 
    playWrong(soundOn) 
  }

  setTimeout(() => { 
    goNext(correct ? score + 1 : score) 
  }, 1100)
}
  // Lifelines
function lifeline5050(){
  if (used50 || selected !== null) return
  const wrongs = [0,1,2,3].filter(x => x !== q.answer)
  const toDisable = wrongs.sort(() => Math.random() - 0.5).slice(0, 2)
  setDisabledIdx(toDisable); 
  setUsed50(true); 
  playJoker(soundOn)
}
  function lifelineTime(){ if(usedTime || selected!==null) return; setTimeLeft(t=>t+15); setUsedTime(true); playJoker(soundOn) }
  function lifelineSkip(){ if(usedSkip || selected!==null) return; setUsedSkip(true); playJoker(soundOn); goNext(score) }

  const reveal = selected!==null
  const wrongChosen = reveal && selected!==q.answer
  const timerClass = `badge timer ${timeLeft<=10? 'danger':''}`

  return (
    <div className={`millionaire ${wrongChosen? 'quiz-shake':''}`}>
      <div className="qa-box">
        <div className="header">
          <h2 className="title" style={{fontSize:22}}>Nivel {level}</h2>
          <div>
            <span className="badge">Pregunta {i+1}/{all.length}</span>{' '}
            <span className={timerClass}>⏱ {timeLeft}s</span>{' '}
            <span className="badge">{source==='firebase'?'☁ Firestore':'📦 Local'}</span>
          </div>
        </div>
        <div className="lifelines" style={{marginBottom:12}}>
          <button className={`lifeline ${used50?'used':''}`} onClick={lifeline5050}>50 / 50</button>
          <button className={`lifeline ${usedTime?'used':''}`} onClick={lifelineTime}>+15s</button>
          <button className={`lifeline ${usedSkip?'used':''}`} onClick={lifelineSkip}>Saltar</button>
        </div>
        <div style={{fontWeight:800, fontSize:20, marginBottom:12}}>{q.text}</div>
        <div className="options">
          {[0,1,2,3].map((idx)=>{
            const label = q.options[idx]
            const isCorrect = reveal && idx===q.answer
            const isWrong = reveal && idx===selected && !isCorrect
            const disabled = disabledIdx.includes(idx)
            const cls = `option big ${isCorrect? 'correct':''} ${isWrong? 'wrong':''} ${disabled? 'disabled':''} ${reveal? 'reveal':''}`
            return (
              <div key={idx} className={cls} onClick={()=>!disabled && handleAnswer(idx)}>
                {String.fromCharCode(65+idx)}. {label}
              </div>
            )
          })}
        </div>
      </div>
      <div className="ladder">
        <h4>Escalera de puntos</h4>
        <ul>
          {steps.map((s, idx)=>{
            const active = idx===i
            const done = idx<i
            return (
              <li key={idx} className={`step ${active?'active':''} ${done?'done':''}`}>
                <span className="pos">{s.pos.toString().padStart(2,'0')}</span>
                <span>{s.prize}</span>
              </li>
            )
          }).reverse()}
        </ul>
      </div>
    </div>
  )
}