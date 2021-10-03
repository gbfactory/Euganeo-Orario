const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

let dataOdierna = new Date().toLocaleDateString().replace('/', '-');
let dataSelezionata = dataOdierna;

let giornoSelezionato = 0;

// Contatore slide (utilizzato per offset prima slide selezionata).
let slidesCounter = 0;

// Ciclo per le date da visualizzare
for (let d = new Date(2021, 8, 26); d <= new Date(2022, 5, 5); d.setDate(d.getDate() + 1)) {
    const date = d.getDate();
    const month = d.getMonth();
    const nomeGiorno = giorni[d.getDay()];
    const nomeMese = mesi[month];
    const dataIso = d.toLocaleDateString().replace('/', '-');

    // Determina se la box è del giorno corrente
    const attiva = dataIso === dataOdierna ? 'box-active' : '';
    const resetCursore = d.getDay() === 0 ? 'reset-cursore' : '';

    // Aggiunge box data
    $('.swiper-wrapper').append(`
        <div class="box ${attiva} swiper-slide ${resetCursore}" data-day="${d.getDay()}" data-date="${dataIso}">
            <span class="box-mese">${nomeGiorno.toUpperCase()}</span>
            <span class="box-giorno">${date}</span>
            <span class="box-settimana">${nomeMese}</span>
        </div>
    `);

    // Incrementa il contatore delle slide
    if (d <= new Date()) slidesCounter++;
}

// Inizializzatore slider
const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    slidesPerView: 10,
    spaceBetween: 15,
    initialSlide: slidesCounter - 2,

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        3000: {
            slidesPerView: 10
        },

        1425: {
            slidesPerView: 8
        },
        1019: {
            slidesPerView: 6
        },
        860: {
            slidesPerView: 4
        },
        579: {
            slidesPerView: 3
        },
        0: {
            slidesPerView: 2
        }
    }
});

// Inizializzazione
if (!localStorage.getItem('classe')) {
    $('#classeSelezionata').hide();

    $('#orarioClasse').hide();
} else {
    $('#nomeClasseSelezionata').html(localStorage.getItem('classe'));
    $('#selezionaClasse').hide();

    $('#orarioIndefinito').hide();
}

$('.js-example-basic-single').select2();

aggiorna();

// Click sulle date
$('.box').click(function () {
    if (!localStorage.getItem('classe')) {
        return Swal.fire({
            title: 'Attenzione!',
            text: `Prima di visualizzare l'orario devi selezionare una classe!`,
            icon: 'warning',
        })
    };

    // Impedisce il click sulla DOMENICA
    if ($(this).data("day") === 0) return;

    // Cambia la data attiva
    giornoSelezionato = $(this).data("day");

    // Cambia la box attiva
    $('.box').removeClass('box-active');
    $(this).addClass('box-active');

    // Aggiorna i dati della classe
    aggiorna();
});

// Bottone di selezione classe
$('#btnSelClasse').click(function () {
    const inputClasse = $("#classe").val();

    if (orario.hasOwnProperty(inputClasse)) {
        localStorage.setItem('classe', inputClasse);

        $('#nomeClasseSelezionata').html(inputClasse);

        $('#classeSelezionata').show();
        $('#selezionaClasse').hide();

        $('#orarioClasse').show();
        $('#orarioIndefinito').hide();

        aggiorna();
    } else {
        Swal.fire({
            title: 'Errore!',
            text: `La classe ${inputClasse} non esiste!`,
            icon: 'error',
        })
    }
})

// Bottone rimuovi selezione classe
$('#btnCambiaClasse').click(function () {
    localStorage.removeItem('classe');

    $('#classeSelezionata').hide();
    $('#selezionaClasse').show();

    $('#orarioClasse').hide();
    $('#orarioIndefinito').show();

    $('#tabellaOrario').html('');
    $('#lezioniOdierne').html('');
})

// Aggiorna le informazioni in base al giorno
function aggiorna() {
    if (!localStorage.getItem('classe')) return;

    const classe = localStorage.getItem('classe');
    const oggettoClasse = orario[classe];

    // Orario classe
    $('#tabellaOrario').html('');
    oggettoClasse.forEach(element => {
        var riga = $('<tr></tr>');

        element.forEach(lez => {
            if (lez.includes('-')) {
                lez = `${lez.split('-')[0]}<br><i>${lez.split('-')[1]}</i>`;
            }

            riga.append(`<td>${lez}</td>`);
        })

        $('#tabellaOrario').append(riga);
    })

    // Se è domenica non mostra l'orario
    if (giornoSelezionato === 0) return;

    // Informazioni orari ing / int / usc
    const primaOra = oggettoClasse[1][giornoSelezionato];
    const ultimaOra = oggettoClasse[6][giornoSelezionato];

    console.log(primaOra, ultimaOra);

    $('#orarioIngresso').html(primaOra === 'Entrata 8:45' ? '8:45' : '7:45');
    $('#orarioIntervallo').html(primaOra === 'Entrata 8:45' ? '11:20 - 11:35' : '10:20 - 10:35');
    $('#orarioUscita').html(ultimaOra === 'Uscita 12:25' ? '12:25' : '13:15');

    // Orario del giorno
    $('#lezioniOdierne').html('')
    oggettoClasse.forEach(element => {
        $('#lezioniOdierne').append(`<li class="lezione">${element[giornoSelezionato]}</li>`)
    });
}

function zero(num) {
    return ("0" + num).slice(-2);
}

// Bottone info
$('#bottoneInfo').click(function () {
    Swal.fire({
        title: 'Informazioni',
        icon: 'info',
        html:
            'Sito web realizzato da <b>Giacomo Brochin</b> per gli studenti dell\'IIS Euganeo di Este <br><hr>' +
            'Le informazioni presenti in questo sito sono ricavate dalle ultime circolari attraverso un software automatico, per tanto potrebbero presentare errori. Per sicurezza consulta sempre le circolari ufficiali presenti nella bacheca del registro elettronico.',
        footer: 'Supporto e Feedback: <a href="mailto:info@gbfactory.net">info@gbfactory.net</a>',
        showCloseButton: true,
    })
})