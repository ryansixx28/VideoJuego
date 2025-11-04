const KEY = 'qqsir_attempts'
export function saveAttempt(a){
  const prev = getAttempts()
  const next = [{...a, at: Date.now()}, ...prev].slice(0, 50)
  localStorage.setItem(KEY, JSON.stringify(next))
}
export function getAttempts(){
  try{ return JSON.parse(localStorage.getItem(KEY)) || [] }catch{ return [] }
}
