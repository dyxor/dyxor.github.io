let oscillators = (function initialize() {
    audioContext = new AudioContext();
    // create audio nodes
    let masterGain = audioContext.createGain();
    masterGain.gain.value = 1.0/frequencies.length;
    let sinusoids = frequencies.map(f => {
      let oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = f;
      oscillator.start();
      return oscillator;
    });
    let oscillators = frequencies.map(f => {
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


const char2oscillators = (char) => {
  return oscillators.filter((_, i) => {
    let charCode = char.charCodeAt(0);
    return charCode & (1 << i);
  })
}

const mute = () => {
  oscillators.forEach(osc => {
    osc.gain.value = 0
  })
}

const encodeChar = (char, duration) => {
  let activeOscillators = char2oscillators(char);
  activeOscillators.forEach(osc => {
    osc.gain.value = 1;
  });
  window.setTimeout(mute, duration);
}

const encode = (text, onComplete) => {
  const pause = +$('#pause-duration').val();
  const duration = +$('#active-duration').val();
  const timeBetweenChars = pause + duration;
  text.split('').forEach((char, i) => {
    window.setTimeout(() => {
      encodeChar(char, duration);
    }, i * timeBetweenChars);
  });
  window.setTimeout(onComplete, text.length * timeBetweenChars);
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