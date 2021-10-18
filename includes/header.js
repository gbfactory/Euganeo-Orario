if (navigator.userAgent != 'EuganeoOrarioApp') {
    document.write('\
    <nav class="navbar" role="navigation" aria-label="main navigation">\
        <div class="container" >\
            <div class="navbar-brand">\
                <div class="navbar-item">\
                    <img src="./images/logo.png">\
                </div>\
    \
                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"\
                    data-target="navbarBasicExample">\
                    <span aria-hidden="true"></span>\
                    <span aria-hidden="true"></span>\
                    <span aria-hidden="true"></span>\
                </a>\
            </div>\
\
            <div id="navbarBasicExample" class="navbar-menu">\
                <div class="navbar-start">\
                    <a class="navbar-item orario-nav-item" href="/">\
                        <span class="icon">\
                            <i class="fas fa-clock"></i>\
                        </span>\
    \
                        <span>Orario</span>\
                    </a>\
    \
                    <a class="navbar-item orario-nav-item" href="">\
                        <span class="icon">\
                            <i class="fas fa-user"></i>\
                        </span>\
    \
                        <span>Docenti</span>\
                    </a>\
                </div>\
    \
                <div class="navbar-end">\
                    <a class="navbar-item orario-nav-item" href="info.html">\
                        <span class="icon">\
                            <i class="fas fa-question"></i>\
                        </span>\
    \
                        <span>Info</span>\
                    </a>\
    \
                    <a class="navbar-item orario-nav-item" href="form.html">\
                        <span class="icon">\
                            <i class="fas fa-pen-nib"></i>\
                        </span>\
    \
                        <span>Segnalazione</span>\
                    </a>\
                </div>\
            </div>\
        </div >\
    </nav >\
    ');
}
