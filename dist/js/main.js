// Init SpeechSynth API
const synth = window.speechSynthesis;

const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');

const body = document.querySelector('body');

// Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create an option(array) for each one.
  voices.forEach((voice) => {
    // Create option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';

    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    // Append options, this was already declared
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  // Check if empty string
  if (textInput.value !== '') {
    // Start background animation
    body.style.background = '#141414 url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    // Speak End --> runs when it's done speaking
    speakText.onend = (e) => {
      console.log('Done speaking...');
      body.style.background = '#141414'; // set background back
    };
    // Speak error
    speakText.onerror = (e) => {
      console.error('Something went wrong');
    };

    // Select a voice
    const selectedVoice =
      voiceSelect.selectedOptions[0].getAttribute('data-name'); // We set that in getVoices function;

    // Loop through voices and match the voice with selection on web page
    voices.forEach((voice) => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set rate
    speakText.rate = rate.value;
    // Set pitch
    speakText.pitch = pitch.value;
    // Speak
    synth.speak(speakText);
  }
};

// Event Listeners

// Text form submit
textForm.addEventListener('submit', (e) => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate value change
rate.addEventListener('change', (e) => {
  // rate is connected to slider
  rateValue.textContent = rate.value;
});

pitch.addEventListener('change', (e) => {
  // pitch is connected to slider
  pitchValue.textContent = pitch.value;
});

// Voice select change
voiceSelect.addEventListener('change', (e) => {
  speak();
});
