let audioContext = new AudioContext();
let analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.0;

let buffer = new Uint8Array(analyser.frequencyBinCount);
let threshold = 0.8, musa = 2, moku = 18
let got_bits = '', asc = 0
let framesec = 33

// Init
navigator.mediaDevices.getUserMedia({audio: true})
.then(stream => {
  var microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);
})
.catch(err => { alert("Microphone is required."); });

// Work

log(bin_str('a'),bin_str('b'),bin_str('c'))

const add_byte = (x)=>{
    $('textarea').val($('textarea').val()+String.fromCharCode(x)) 
    
}

const add_bit = (x, n)=>{
    if(x<0){ got_bits=''; asc = 0; return; }

    for(let i=0;i<n;++i){
        got_bits+=x.toString()
        asc = (asc << 1) | x
        if(got_bits.length==8){
            add_byte(asc)
            got_bits = ''
            asc = 0
        }
    }

    log(got_bits)
}

const work = () => {
  let last = -1
  let idx_mark = ~~(freqbell[1] / bli), idx_space = ~~(freqbell[0] / bli)
  let tpass = 0
  const loop = ()=>{
    let now = -1
    if(tpass<10000)tpass++
    analyser.getByteFrequencyData(buffer);

    buffer.slice(idx_mark-musa, idx_mark+musa).forEach((x, i)=>{
        let alpha = x / 256.0;
        if(alpha>threshold)now = 1
    })
    if(now==-1)buffer.slice(idx_space-musa, idx_space+musa).forEach((x, i)=>{
        let alpha = x / 256.0;
        if(alpha>threshold)now = 0
    })

    if(last != now){
        if(last==-1){
            if(tpass>=framesec)add_bit(-1, 1);
        }else{
            let nn = ~~(tpass/framesec)
            if(nn) add_bit(last, nn);
            else if(tpass > framesec*0.5)add_bit(last, 1);
        }
        if(tpass > framesec*0.5)log('Signal change:', last,' ',now,' ',tpass, ~~(tpass/framesec))
        tpass = 0
        last = now
    }
  }
  window.setInterval(loop, 1);
}

work();

(()=>{
    $('#fbi').val(threshold)
    $('#cia').val(framesec)
})()

$('#ok').click(() => {
    threshold = +$('#fbi').val()
    framesec = +$('#cia').val()
    log('#', threshold, framesec)
})