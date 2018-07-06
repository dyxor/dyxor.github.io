let audioContext = new AudioContext();
let analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.0;

let buffer = new Uint8Array(analyser.frequencyBinCount);
let threshold = 0.8, musa = 3, moku = 50
let got_bits = ''

// connect nodes
navigator.mediaDevices.getUserMedia({audio: true})
.then(stream => {
  var microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);
})
.catch(err => { alert("Microphone is required."); });

// recieve 700+ signals for 1s audio

const add_bit = (x)=>{
    if(x<0){
        got_bits=''
        return
    }
    got_bits = x.toString() + got_bits
    log(got_bits)
    if(got_bits.length==8){
        log(got_bits)
    }
}

const work = () => {
  let last = -1, dup = 0
  let idx_mark = ~~(freqbell[1] / bli), idx_space = ~~(freqbell[0] / bli)
  const loop = ()=>{
    let ms = 0, now = -1
    analyser.getByteFrequencyData(buffer);
    buffer.slice(idx_mark-musa, idx_mark+musa).forEach((x, i)=>{
        let alpha = x / 256.0;
        if(alpha>threshold)now = 1
    })
    if(!ms)buffer.slice(idx_space-musa, idx_space+musa).forEach((x, i)=>{
        let alpha = x / 256.0;
        if(alpha>threshold)now = 0
    })
    if(last != now){
        last = now
        dup = 0
        return
    }
    if(now>=0)log(now)
    dup++
    if(dup == moku){
        dup = 0
        last = -1
        add_bit(now)
    }
  }
  window.setInterval(loop, 1);
}

work()