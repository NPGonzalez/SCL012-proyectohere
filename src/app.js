let rec;
const responder = (texto) => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
};
const startDialog = (event) => {

    for (i = event.resultIndex; i < event.results.length; i++) {
        document.getElementById('text').value = event.results[i][0].transcript;
        let a = document.getElementById('text').value;
        console.log(a);
        if (a === ' hola' || ' Hola') {
            document.getElementById('textOne').value = 'Hola. En qué te puedo ayudar? ';
        };
        if (a === ' mapa') {
            document.getElementById('textOne').value = 'Qué ruta quieres?';
        };
        if (a === ' casa trabajo') {
            document.getElementById('textOne').value = 'Aquí está tu ruta Here que estabas esperando';
            document.getElementById('mapContainer').style.visibility = 'visible';
        };
        if (document.getElementById('text').value === ' chao') {
            document.getElementById('textOne').value = 'Hasta la próxima iteración!!!';
        };
    };

};

if (!('webkitSpeechRecognition' in window)) {
    alert("Disculpa, no puedes usar la API");
} else {
    rec = new webkitSpeechRecognition();
    rec.lang = 'es-ES';
    rec.continuous = true;
    rec.interim = true;
    rec.addEventListener('result', startDialog);
}

rec.start();