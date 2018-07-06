let oscillators = (function initialize() {
    audioContext = new AudioContext();
    // create audio nodes
    let masterGain = audioContext.createGain();
    masterGain.gain.value = 0.5;

    let sinusoids = [space_freq, mark_freq].map(f => {
      let oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = f;
      oscillator.start();
      return oscillator;
    });
    let oscillators = [mark_freq, space_freq].map(f => {
      let volume = audioContext.createGain();
      volume.gain.value = 0;
      return volume;
    });
    // connect nodes
    sinusoids.forEach((sine, i) => sine.connect(oscillators[i]));
    oscillators.forEach((osc) => osc.connect(masterGain));
    masterGain.connect(audioContext.destination);
    return oscillators;
})();

const mute = () => {
  oscillators.forEach(osc => {
    osc.gain.value = 0
  })
}

const encode = (text, onComplete) => {
  const pause = +$('#pause-duration').val();
  const duration = +$('#active-duration').val();
  const timeBetweenChars = pause + duration;

  text.split('').forEach((char, i) => {
    let charCode = char.charCodeAt(0)
    let bits = []
    for(let j=0;j<8;++j){
      bits.push(charCode & 1)
      charCode >>= 1
    }

    bits.forEach(
      (bit, j) => {
        window.setTimeout(
          () => {
            oscillators[bit].gain.value = 1;
            window.setTimeout(mute, duration);
          }, 
          (i*8+j) * timeBetweenChars
        );
        }
    );
  })
  window.setTimeout(onComplete, text.length * timeBetweenChars * 8);
}


let enc_btn = $('#encode')
enc_btn.click(() => {
  enc_btn.attr('disabled', 'disabled')
  encode($('textarea').val(), ()=>{
    enc_btn.removeAttr('disabled');
  })
})

$('#clear').click(() => {
  $('textarea').val('');
})

for (let input of document.querySelectorAll('input')) {
  const selector = `label[for="${input.getAttribute('id')}"] [data-val]`;
  let label = document.querySelector(selector);
  label.innerHTML = input.value;
  input.addEventListener('change', (e) => {
    label.innerHTML = e.target.value;
  })
}