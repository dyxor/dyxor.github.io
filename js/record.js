var audioContext = new AudioContext();
var analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.0;

var buffer = new Uint8Array(analyser.frequencyBinCount);
var threshold = 0.8, musa = 2, moku = 18
var got_bits = '', asc = 0, pre_id = 0
var framesec = 15

// Init
navigator.mediaDevices.getUserMedia({audio: true})
.then(stream => {
  var microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);
})
.catch(err => { alert("Microphone is required."); });

// Work

// log(bin_str('abc'))

const add_byte = (x)=>{
    $('textarea').val($('textarea').val()+String.fromCharCode(x)) 
}

const add_bit = (x, n)=>{
    if(x<0){ got_bits=''; asc = 0; pre_id=0; log('Pre-code lost!'); return; }

    if(pre_id < pre_len){
        for(let i=1;i<=n;++i){
            if(x==pre_code[pre_id]){
                ++pre_id;
                if(pre_id>=pre_len){
                    log('Pre-code got!')
                    if(n>i)add_bit(x, n-i)
                }
            }else{
                pre_id=0
            }
        }
        log(pre_id)
        return
    }

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

const cal_n = (t)=>{
    let re = ~~(t/framesec)
    t -= re*framesec
    return re + (t > framesec*0.6 ? 1 : 0)
}

const work = () => {
  log('Start listening.')
  let last = -1, tpass = 0, last_show = 0
  let idx_mark = ~~(freqbell[1] / bli), idx_space = ~~(freqbell[0] / bli)

  const loop = ()=>{
    let now = -1
    if(tpass<1000)tpass++
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
            let nn = cal_n(tpass)
            add_bit(last, nn);
        }
        if(tpass > framesec*0.45 && (now!=-1 || last_show!=-1)){
            log('Signal change:', last,'->',now,' ',tpass, cal_n(tpass))
            last_show = now
        }
        tpass = 0
        last = now
    }
  }
  window.setInterval(loop, 1);
}

work();

// functions

const arg_show=()=>{
    $('#fbi').val(threshold)
    $('#cia').val(framesec)
}

(()=>arg_show())()

const set_arg = (x,y)=>{
    threshold, framesec = (x, y)
    arg_show()
    log('Set args:', threshold, framesec)
}

$('#ok').click(()=>{set_arg(+$('#fbi').val(), +$('#cia').val())})
$('#fast').click(()=>{set_arg(0.8, 15)})
$('#normal').click(()=>{set_arg(0.8, 32)})