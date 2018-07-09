var audioCtx = new AudioContext()
var channels = 2
var myArrayBuffer
var duration = 0.1, mute = 0.02
var ftime = duration + mute
var frameper = ftime * audioCtx.sampleRate

const get_bits = (s)=>{
    let re = []
    s.split('').forEach((x, i)=>{
        let tmp = [], v = x.charCodeAt(0)
        for(let j=0;j<8;++j){
            tmp.push(v & 1)
            v>>=1
        }
        for(let j=7;j>=0;--j)re.push(tmp[j])
    })
    return re
}

const gener_wave = (msg)=>{
    let bits = get_bits(msg)
    let sec = bits.length * ftime
    let frameCount = sec * audioCtx.sampleRate;
    let myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

    bits.forEach((bit, i)=>{
        let k = freqbell[bit] * Math.PI * 2 / audioCtx.sampleRate *2
        for (let channel = 0; channel < channels; channel++) {
            let nowBuffering = myArrayBuffer.getChannelData(channel);
            for (let j = i*frameper; j < i*frameper + duration * audioCtx.sampleRate; j++) {
                nowBuffering[j] = Math.sin(j*k);
            }
        }
    })
    
    let source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start();
}

$('#encode').click(() => {
    gener_wave($('textarea').val())
})

$('#ok').click(() => {
    duration = +$('#dur').val() * 0.001
    mute = +$('#mut').val() * 0.001
    ftime = duration + mute
    frameper = ~~(ftime * audioCtx.sampleRate)
    log(duration, mute, ftime, frameper)
})
