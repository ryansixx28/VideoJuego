let _ctx
function ctx(){ if(!_ctx){ _ctx = new (window.AudioContext||window.webkitAudioContext)() } return _ctx }
function tone(freq=440, dur=0.12, type='sine', vol=0.04){
  const c = ctx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.value = vol; o.connect(g); g.connect(c.destination);
  const now = c.currentTime; o.start(now); o.stop(now+dur);
}
export function playClick(on=true){ if(!on) return; tone(600, 0.06, 'square', 0.03) }
export function playCorrect(on=true){ if(!on) return; tone(880, 0.18, 'sine', 0.04); setTimeout(()=>tone(1175,0.12,'sine',0.035),140) }
export function playWrong(on=true){ if(!on) return; tone(220, 0.18, 'sawtooth', 0.05); setTimeout(()=>tone(180,0.18,'sawtooth',0.04),140) }
export function playTick(on=true){ if(!on) return; tone(900, 0.045, 'square', 0.025) }
export function playJoker(on=true){ if(!on) return; tone(500, 0.08, 'triangle', 0.04); setTimeout(()=>tone(750,0.08,'triangle',0.035),90) }
