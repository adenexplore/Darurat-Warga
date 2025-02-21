function requestName(type) {
    Swal.fire({
        title: "Masukkan Lokasi atau Nama",
        input: "text",
        inputPlaceholder: "Contoh: Rumah Pak Budi",
        showCancelButton: true,
        confirmButtonText: "Kirim",
        cancelButtonText: "Batal",
        inputValidator: (value) => {
            if (!value) {
                return "Nama lokasi harus diisi!";
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            playAlert(type, result.value);
        }
    });
}

function playAlert(type, name) {
    let message = "";
    switch (type) {
        case 'maling':
            message = `Perhatian! Perhatian! Ada maling di rumah ${name}. Segera periksa dan waspada!`;
            break;
        case 'kebakaran':
            message = `Perhatian! Perhatian! Ada kebakaran di rumah ${name}. Segera ambil tindakan!`;
            break;
        case 'tawuran':
            message = `Perhatian! Perhatian! Ada tawuran di sekitar rumah ${name}. Segera waspada dan hindari area tersebut!`;
            break;
    }

    let sirene = document.getElementById('sirene');

    // Cek apakah audio bisa dimainkan
    sirene.play().then(() => {
        console.log("Audio sirene diputar!");
    }).catch(error => {
        console.log("Autoplay diblokir, klik tombol untuk memulai!", error);
        Swal.fire("Klik tombol untuk memutar suara!");
    });

    // Pastikan suara Bahasa Indonesia dimuat dulu sebelum berbicara
    window.speechSynthesis.onvoiceschanged = function() {
        console.log("Muat ulang daftar suara...");
        speakMessage(message);
    };
    
    // Jika suara sudah tersedia, langsung bicara
    speakMessage(message);
}

function speakMessage(message) {
    let voices = window.speechSynthesis.getVoices();
    let indoVoice = voices.find(voice => voice.lang === 'id-ID') || null;

    if (!indoVoice) {
        console.warn("Suara Bahasa Indonesia tidak ditemukan! Gunakan default.");
    }

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            let speech = new SpeechSynthesisUtterance(message);
            speech.lang = 'id-ID'; 
            speech.rate = 0.9;
            speech.pitch = 1.0;
            
            if (indoVoice) {
                speech.voice = indoVoice;
            }

            window.speechSynthesis.speak(speech);
        }, i * 3000);
    }
}
