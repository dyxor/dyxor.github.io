const mark_freq = 1200.0, space_freq = 2200.0
const freqbell = [space_freq, mark_freq]
const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
const AudioContext = window.AudioContext || window.webkitAudioContext
const bli = 11.697906909355563
const pre_code = '01011'.split('').map((x)=>+x)
const pre_len = pre_code.length

const chr = (x)=>x.charCodeAt(0)

const bin_str = (x)=>{
    let re = ''
    for(let i of x){
        let r = chr(i).toString(2)
        for (let j = 1; j <= 8-r.length; j++) {
            r = '0' + r
        }
        re += (re.length?'_':'') + r
    }
    return re
}