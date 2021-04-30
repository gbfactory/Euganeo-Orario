const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

let codiceOdierno = zero(new Date().getDate()) + zero(new Date().getMonth() + 1);

let codSel = codiceOdierno;
let daySel = giorni[new Date().getDay()].slice(0, 3).toUpperCase();

let classeSel;
let turnoSel;

let btnAttivo = false;

for (let d = new Date(2021, 3, 26); d <= new Date(2021, 5, 5); d.setDate(d.getDate() + 1)) {
    let date = d.getDate();
    let month = d.getMonth();
    let nomeGiorno = giorni[d.getDay()];
    let nomeMese = mesi[month];

    let active = "";
    if (zero(date) + zero(month + 1) === codiceOdierno) {
        active = "box-active";
    }

    $('.swiper-wrapper').append(`
        <div class="box ${active} swiper-slide" data-cod="${zero(date)}${zero(month + 1)}" data-day="${nomeGiorno.slice(0, 3).toUpperCase()}">
            <span class="box-mese">${nomeMese.toUpperCase()}</span>
            <span class="box-giorno">${date}</span>
            <span class="box-settimana">${nomeGiorno}</span>
        </div>
    `)
}

const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    slidesPerView: 10,
    spaceBetween: 15,

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

updateInfo();

$('.box').click(function () {
    codSel = $(this).data("cod");
    daySel = $(this).data("day");

    if (daySel === "DOM") return;

    $('.box').removeClass('box-active');
    $(this).addClass('box-active');

    updateInfo();

    if (btnAttivo) {
        updateClasse();
        eccezioni();
    }
});

// Bottone di selezione classe
$('#btnSelClasse').click(function () {
    let classe = $("#classe").val();
    let sezione = $("#sezione").val();
    let indirizzo = $("#indirizzo").val();

    let cl = classe + sezione + indirizzo;

    if (classe == "5") {
        return alert('Gli studenti di classe quinta sono al 100% in presenza ed entreranno sempre alla prima ora ed usciranno sempre all’ultima ora.');
    }

    if (gruppi.hasOwnProperty(cl)) {
        btnAttivo = true;
        classeSel = cl;
        turnoSel = gruppi[cl];

        updateClasse();
        eccezioni();
    } else {
        alert(`La classe ${cl} non esiste!`);
    }
})

// Bottone rimuovi selezione classe
$('#btnCambiaClasse').click(function() {
    $('.selettore-class').css('display', 'block');
    $('.informazioni-class').css('display', 'none');
    btnAttivo = false;
})

// Gestione tab (potrebbe essere ottimizzata...)
$('#turno1').click(function () {
    attivaTurno1();
})

$('#turno2').click(function () {
    attivaTurno2();
})

$('#turnodad').click(function() {
    attivaTurnoDad();
})

// Aggiorna le informazioni in base al giorno
function updateInfo() {
    if (daySel === "LUN" || daySel === "MER" || daySel === "VEN") {
        $('#int-t1').html('dalle 10:20 alle 10:35');
        $('#int-t2').html('dalle 11:10 alle 11:25');
        $('#exit-t1').html('12:15');
        $('#exit-t2').html('13:15');
        $('#exit-dad').html('13:15');
    } else if (daySel === "MAR" || daySel === "GIO") {
        $('#int-t1').html('dalle 9:55 alle 10:10');
        $('#int-t2').html('dalle 10:55 alle 11:10');
        $('#exit-t1').html('11:55');
        $('#exit-t2').html('12:55');
        $('#exit-dad').html('12:55');
    } else if (daySel === "SAB") {
        $('#int-t1').html('dalle 9:55 alle 10:10');
        $('#int-t2').html('dalle 10:55 alle 11:10');
        $('#exit-t1').html('10:55');
        $('#exit-t2').html('11:55 (12:55 per le 2°)');
        $('#exit-dad').html('11:55 (12:55 per le 2°)');
    }
}

// Aggiorna le informazioni sulla classe in base al giorno
function updateClasse() {
    if (turnoSel && turni[turnoSel].hasOwnProperty(codSel)) {
        let cod = turni[turnoSel][codSel];

        $('.selettore-class').css('display', 'none');
        $('.informazioni-class').css('display', 'block');

        $('#spanClassName').html(classeSel);

        let messaggio;
        if (cod === 'ET1') {
            messaggio = 'In presenza dalle 7:55';
            attivaTurno1();
        } else if (cod === 'ET2') {
            messaggio = 'In presenza dalle 8:55';
            attivaTurno2();
        } else if (cod === 'DAD') {
            messaggio = 'In Didattica a Distanza';
            attivaTurnoDad();
        } else if (cod === 'VAC') {
            messaggio = 'In Vacanza!';
        } else {
            messaggio = '?';
        }

        $('#spanOrari').html(messaggio);
    }
}

function attivaTurno1() {
    $('#turno1').addClass('is-active');
    $('#turno2, #turnodad').removeClass('is-active');
    $('#turno1c').css('display', 'block');
    $('#turno2c, #turnodadc').css('display', 'none');
}

function attivaTurno2() {
    $('#turno2').addClass('is-active');
    $('#turno1, #turnodad').removeClass('is-active');
    $('#turno2c').css('display', 'block');
    $('#turno1c, #turnodadc').css('display', 'none');
}

function attivaTurnoDad() {
    $('#turnodad').addClass('is-active');
    $('#turno1, #turno2').removeClass('is-active');
    $('#turnodadc').css('display', 'block');
    $('#turno1c, #turno2c').css('display', 'none');
}

function eccezioni() {
    e = [];

    if (daySel == "LUN") {
        if (classeSel == "2AB" || classeSel == "2AMF" || classeSel == "2AOF") e.push('Entrata alle 7:55');
        if (classeSel == "1AMF") e.push('Uscita dopo ultima ora');
    } else if (daySel == "MAR") {
        if (classeSel == "1AMF" || classeSel == "2AMF" || classeSel == "2AOF") e.push('Entrata alle 7:55');
        if (classeSel == "3AE" || classeSel == "4AB") e.push('Uscita dopo ultima ora');
    } else if (daySel == "MER") {
        if (classeSel == "4AS") e.push('Entrata alle 7:55');
        if (classeSel == "4AE") e.push('Uscita dopo ultima ora');
    } else if (daySel == "GIO") {
        if (classeSel == "3BM") e.push('Entrata alle 7:55');
        if (classeSel == "1AMF") e.push('Uscita dopo ultima ora');
    } else if (daySel == "VEN") {
        if (classeSel == "4AM") e.push('Entrata alle 7:55');
        if (classeSel == "4BM") e.push('Uscita dopo ultima ora');
    } else if (daySel == "SAB") {
        if (classeSel == "2AOF" || classeSel == "3BS" || classeSel == "4BI") e.push('Entrata alle 7:55');
        if (classeSel == "2AMF" || classeSel == "3AB" || classeSel == "4AI") e.push('Uscita dopo ultima ora');
    }

    if (classeSel == "2AMF" || classeSel == "4AMF" || classeSel == "4AS") {
        e.push('la metà classe che rimane a casa svolge le attività asincrone assegnate dai docenti. Ad ogni inizio ora gli studenti sono tenuti a collegarsi per l’appello e per l’assegnazione delle attività. In caso contrario risulteranno assenti.');
    }

    $('.ecce').html(`<div class="notification is-success is-light"><b>Attenzione: </b> ${e}</div>`);
}

function zero(num) {
    return ("0" + num).slice(-2);
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/orario/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err));
    });
  }