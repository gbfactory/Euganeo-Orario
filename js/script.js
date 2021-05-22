const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

let codiceOdierno = zero(new Date().getDate()) + zero(new Date().getMonth() + 1);

let codSel = codiceOdierno;
let daySel = giorni[new Date().getDay()].slice(0, 3).toUpperCase();

let classeSel;
let turnoSel;

let btnAttivo = false;

let slidesCounter = 0;

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

    if (d <= new Date()) {
        slidesCounter++;
    }
}

const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    slidesPerView: 10,
    spaceBetween: 15,
    initialSlide: slidesCounter - 3,

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
        sentinella();
        orarioClasse();
    }
});

// Bottone di selezione classe
$('#btnSelClasse').click(function () {
    let classe = $("#classe").val();
    let sezione = $("#sezione").val();
    let indirizzo = $("#indirizzo").val();

    let cl = classe + sezione + indirizzo;

    if (gruppi.hasOwnProperty(cl)) {
        btnAttivo = true;
        classeSel = cl;
        turnoSel = gruppi[cl];

        updateClasse();
        eccezioni();
        sentinella();
        orarioClasse();
    } else {
        alert(`La classe ${cl} non esiste!`);
    }
})

// Bottone rimuovi selezione classe
$('#btnCambiaClasse').click(function () {
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

$('#turnodad').click(function () {
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
        } else if (cod === '100') {
            messaggio = 'Al 100% in presenza!';
            attivaTurnoDad();
        } else {
            messaggio = '?';
        }

        $('#spanOrari').html(messaggio);
    }
}

// Orario classe
function orarioClasse() {
    if (indice.hasOwnProperty(classeSel)) {
        $.getJSON(`https://spreadsheets.google.com/feeds/cells/1FP_MO0qLgHBhhTGMOmJCLYSvq3s8y1S5K83iHJ1aC9w/${indice[classeSel]}/public/full?alt=json`, function (data) {
            let i = 0;
            const sheet = data.feed.entry;
    
            $('#orarioClasse').html('');
            $('#orarioClasse').append('<tr>');
    
            sheet.forEach(d => {
                let c = d.content.$t;
    
                if (!isNaN(c.charAt(0))) {
                    $('#orarioClasse').append('</tr><tr>')
                } else {
                    let orario = orari[i] != undefined ? orari[i] : '';
                    let materia = c.length === 3 ? `<b>${sett[c]}</b>` : (c === '.' ? '' : `<br>${c.split('-')[0]}`);
                    let prof = c === '.' ? '' : (c.split('-')[1] != undefined ? `<br>${c.split('-')[1]}` : '');
                    // console.log(c)

                    $('#orarioClasse').append(`<td id="${i}"> <b>${orario}</b> <span>${materia}</span> <i>${prof}</i> </td>`);
                    i++;
                }
            })

            $('#orarioClasse').append('</tr>');
        });
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

    if (e.length > 0) {
        $('.ecce').html(`<div class="notification is-success is-light"><b>Attenzione: </b> ${e}</div>`);
    } else {
        $('.ecce').html('');
    }

    // assemblea studentesca
    if (codSel == '0506') {
        console.log('ciaop')
        $('.assemblea').html(`<div class="notification is-warning is-light"><b>Assemblea Generale Studentesca</b> dalle ore 07:55 alle ore 12:15, tutte le classi saranno online.</div>`);
    } else {
        $('.assemblea').html('');
    }
}

npPresenza1 = ["2AE", "2BB", "2AL", "2AB", "1AMF", "1BMF"];
npPresenza2 = ["3AM", "3AE", "3BM", "3AI", "4AI"];
npDistanza = ["4AM", "2BM", "2AM", "4BM", "2AI", "2BI", "3BI"];

function sentinella() {
    if (codSel == '2805') {
        if (npPresenza1.includes(classeSel)) {
            $('.sentinella').html(`<div class="notification is-danger is-light"><b>Progetto Sentinella: </b>classe in presenza non prevista dalle ore 7:55 alle ore 12:15</div>`);
            attivaTurno1();
        } else if (npPresenza2.includes(classeSel)) {
            $('.sentinella').html(`<div class="notification is-danger is-light"><b>Progetto Sentinella: </b>classe in presenza non prevista dalle ore 8:55 alle ore 13:15</div>`);
            attivaTurno2();
        } else if (npDistanza.includes(classeSel)) {
            $('.sentinella').html(`<div class="notification is-danger is-light"><b>Progetto Sentinella: </b>classe in didattica a distanza non prevista</div>`);
            attivaTurnoDad();
        } else {
            $('.sentinella').html('');
        }
    } else {
        $('.sentinella').html('');
    }
}

function zero(num) {
    return ("0" + num).slice(-2);
}