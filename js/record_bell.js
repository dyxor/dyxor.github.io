let audioContext = new AudioContext();

// create audio nodes
let analyser = audioContext.createAnalyser();
analyser.fftSize = 512;
analyser.smoothingTimeConstant = 0.0;
analyser.minDecibels = -58;
// connect nodes
navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => {
    var microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
  })
  .catch(err => { alert("Microphone is required."); });
// buffer for analyser output
let buffer = new Uint8Array(analyser.frequencyBinCount);

// helper functions
const frequencyBinValue = (f) => {
  const hzPerBin = (audioContext.sampleRate) / (2*analyser.frequencyBinCount);
  const index = parseInt((f + hzPerBin/2) / hzPerBin);
  return buffer[index];
};
const isActive = (value) => {
  let threshold = +document.querySelector('#bin-value-threshold').value;
  return value > threshold;
};
const getState = () => {
  return [space_freq, mark_freq]
    .map(frequencyBinValue)
    .reduce((acc, val, idx) => {
      if (isActive(val)) {
        acc += (1 << idx);
      }
      return acc;
    }, 0);
}
const output = (state) => {
  let textarea = document.querySelector('textarea[readonly]');
  textarea.innerHTML += String.fromCharCode(state % 256);
}
const trace = (state) => {
  let str = state.toString(2);
  let pad = "0b00000000"
  let text = pad.substring(0, pad.length - str.length) + str
  document.querySelector('code').innerHTML = text;
}

const decode = () => {
  let prevState = 0;
  let duplicates = 0;
  const iteration = () => {
    analyser.getByteFrequencyData(buffer);
    let state = getState();
    if(state)log(state)

    let duplicateThreshold = +$('#duplicate-state-threshold').val();
    if (state === prevState) {
      duplicates++;
    }else {
      trace(state);
      prevState = state;
      duplicates = 0;
    }
    if (duplicates === duplicateThreshold) {
      output(state);
    }
    window.setTimeout(iteration, 1);
  };
  iteration();
};

decode();

// config behaviour
for (let input of document.querySelectorAll('input')) {
  const selector = `label[for="${input.getAttribute('id')}"] [data-val]`;
  let label = document.querySelector(selector);
  label.innerHTML = input.value;
  input.addEventListener('change', (e) => {
    label.innerHTML = e.target.value;
  });
};