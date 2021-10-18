// Mostra il tasto per scaricare l'app
// ( ! ) disattivato fino a rilascio nuova applicazione react native!
// if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
//     $('#scarica-app').html('<a href="market://details?id=net.gbfactory.euganeoorario"><img src="./images/googleplay_it.png" alt="Disponibile su Google Play"></a>');
// }

// Navbar responsiva
$(".navbar-burger").click(function() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
});