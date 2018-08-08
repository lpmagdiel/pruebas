var dominio = "http://loretobaja.mx/phpDev/";
var dominio_image = "http://loretobaja.mx/cmsDev/uploads/";

var idioma = "es";
var currentModule = "";
var currentTipo = "";
var currentId = "";
var viewStack = ["root"];
var helpShowed = false;
var willShowHelp = false;

console.log("View Stack:" + JSON.stringify(viewStack));

console.log("Current module: " + currentModule);
console.log("Current ID: " + currentId);
console.log("Current tipo: " + currentTipo);


// Export selectors engine
var $$ = Dom7;

// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true
});

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true
});

function initMap() {
    map = new GMaps({
        div: '#gmap',
        lat: 26.009169,
        lng: -111.344211,
        zoom: 15
    });

    /*map2 = new GMaps({
        div: '#gmap2',
        lat: 20.110283,
        lng: -98.415337,
        zoom: 15
    });*/
    map2 = new GMaps({
        div: '#gmap',
        lat: 26.009169,
        lng: -111.344211,
        zoom: 15
    });
}

$(document).ready(function () {
    $("a").click(function () {
        var status = true;

        if (!helpShowed) {
            var href = this.href;
            var objClasses = this.classList;
            var id = ("id" in this) ? (this.id) : ("");

            console.log("Clicked to: " + href);

            if (!href.includes("#help")) {
                if (!objClasses.contains("link_expan") && id != "temp" && !("idioma" in this.dataset)) {
                    if (href.includes("#") && !href.includes("tab")) {
                        var aux = href.split("#");

                        if (aux.length > 1 && aux[1] != "") {
                            var newView = aux[1];
                            var lastView = arrayTop(viewStack);

                            if (newView != lastView) {
                                currentModule = aux[1];
                                console.log("Current module: " + currentModule);
                                viewStack.push(currentModule);
                            }
                        }
                        else {
                            viewStack.pop();
                            currentModule = arrayTop(viewStack);

                            if (currentModule == undefined) {
                                currentModule = "root";
                                viewStack.push(currentModule);
                            }

                            console.log("Current module: " + currentModule);
                        }
                    }
                }

                updateHelpLayer();
            }
            else {
                showHelp();

                status = false;
            }
        }
        else {
            hideHelp();

            status = false;
        }

        console.log("View Stack:" + JSON.stringify(viewStack));
        console.log("Current module: " + currentModule);
        console.log("Current ID: " + currentId);
        console.log("Current tipo: " + currentTipo);

        return status;
    });

    $('.btnir').click(function (event) {
        mainView.router.load({pageName: 'services'});
    });

    $(window).resize(function () {
        $('#gmap, #gmap2, #gmap3').height($(window).height() - 25);
        $('#gmap, #gmap2, #gmap3').width($(window).width());
        $('#dScroll, #dScroll2').height($(window).height() - 45);
    });

    $(window).trigger('resize');

    $('.link_expan').click(function (event) {
        $("#dLista").toggleClass("bajar");
        $("#dLista2").toggleClass("bajar");
    });

    var inicializacion = function () {
        directorio();

        eventos();

        changeIdiomCustom();
        updateTermsAndConditions();
    };

    setTimeout(inicializacion, 2000);

    $('#tabPrefer2').click(function (event) {
        $("#m_conoce").trigger("click");
    });

    $('#m_conoce').click(function (event) {
        showOverlay();

        $.ajax({
            cache: true,
            url: dominio + "lista_conoce.php",
            data: {idioma: idioma},
            type: "POST",
            //  contentType: "application/javascript",
            dataType: "json",
            async: true,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                hideOverlay();
            },
            success: function (datos) {
                hideOverlay();

                /*LIMPIAR*/
                $(".lista04").html("");

                $.each(datos, function (i, dato) {

                    var newRow = '<li>' +
                        '<a data-id="' + dato.id + '" href="#det_conoce">' +
                        '<div></div>' +
                        '<span>' + dato.nombre + '</span>' +
                        '<img class="responsive" src="' + dominio_image + dato.thumb + '">' +
                        '</a>' +
                        '</li>';

                    $(newRow).appendTo(".lista04");

                });

                $('.lista04 li a').click(function (event) {
                    var idc = $(this).attr('data-id');
                    det_conoce(idc);
                });

            }
        });
    });

    $('#m_menu1').click(function (event) {
        tit = $(this).attr('data-tit');
        $('#titLista').html('');
        $('#titLista').html(getHotels(idioma));
        lista_establecomientos(1);

        currentId = "m1";
        currentTipo = 1;
    });

    $('#m_menu2').click(function (event) {
        tit = $(this).attr('data-tit');
        $('#titLista').html('');
        $('#titLista').html(getRestaurants(idioma));
        lista_establecomientos(2);

        currentId = "m2";
        currentTipo = 2;
    });

    $('#m_menu3').click(function (event) {
        tit = $(this).attr('data-tit');
        $('#titLista').html('');
        $('#titLista').html(getToursAndMore(idioma));
        lista_establecomientos(3);

        currentId = "m3";
        currentTipo = 3;
    });

    $('#l_menu1').click(function (event) {
        $('#titLista').html('');
        $('#titLista').html(getHotels(idioma));
        lista_establecomientos(1);

        currentId = "l1";
        currentTipo = 1;
    });

    $('#l_menu2').click(function (event) {
        $('#titLista').html('');
        $('#titLista').html(getRestaurants(idioma));
        lista_establecomientos(2);

        currentId = "l2";
        currentTipo = 2;
    });

    $('#l_menu3').click(function (event) {
        $('#titLista').html('');
        $('#titLista').html(getToursAndMore(idioma));
        lista_establecomientos(3);

        currentId = "l3";
        currentTipo = 3;
    });

    $.simpleWeather({
        location: 'Loreto, MX',
        woeid: '',
        unit: 'c',
        success: function (weather) {
            html = '<h2>' + weather.temp + '&deg;' + weather.units.temp + ' <i class="icon-' + weather.code + '"></i></h2>';

            $("#weather").html(html);
        },
        error: function (error) {
            $("#weather").html('<p>' + error + '</p>');
        }
    });

    /*INICIA FORM AGREGAR*/
    var options_agregar = {
        url: dominio + "lista_menu.php",
        target: '#output_agregar',
        success: showResponse_agregar
    };

    $('#form_busqueda').ajaxForm(options_agregar);

    /*FIN FORM AGREGAR*/

    $(".idiomas a").click(function () {
        idioma = $(this).data('idioma');

        myApp.confirm('Cambiar idioma / Change language?', 'Cambiar / Change?', function () {
            changeIdiomCustom(idioma, false);

        });
    });

    $("#openmap").click(function () {
        $("#dScroll2").toggleClass("bajar");
        lista_mapa_establecomientos(currentTipo);
        map2.removeMarkers();

        var textosearch = $('#txtBuscar').val();
        var estrellas = $('#ESTRELLAS option:selected').val();
        var zonas = $('#UBICACION option:selected').val();
        var categoria = "";

        if(currentTipo == 3) {
            categoria = $('#CMBTOUR option:selected').val();
        }
        else if(currentTipo == 2) {
            categoria = $('#CMBRESTAURANT option:selected').val();
        }
        else {
            categoria = "";
        }

        showOverlay();

        $.ajax({
            cache: true,
            url: dominio + "lista_mapa_search.php",
            data: {
                idioma: idioma,
                tipo: currentTipo,
                palabra: textosearch,
                estrellas: estrellas,
                zonas: zonas,
                categoria: categoria
            },
            type: "POST",
            dataType: "json",
            async: true,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                hideOverlay();
            },
            success: function (datos) {
                hideOverlay();

                var jsonString = JSON.stringify(datos);
                var jsonObject = JSON.parse(jsonString);
                //alert(JSON.stringify(jsonObject[1].latitud));


                $.each(datos, function (i, dato) {

                    map2.addMarker({
                        lat: dato.latitud,
                        lng: dato.longitud,
                        infoWindow: {
                            content: '<a class="link_list_mapa" data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' + dato.nombre + '</a>',
                            domready: function (e) {
                                $('.link_list_mapa').on("click", function () {
                                    var idc = $(this).attr('data-id');
                                    var tipo = $(this).attr('data-tipo');
                                    det_menu(idc, tipo);
                                    myApp.showTab('#tab1');
                                });
                            }
                        },
                        click: function (e) {
                            map2.map.panTo(e.position);
                        }
                    });


                });

                try {

                    google.maps.event.trigger(map2, 'resize');
                    map2.setCenter(jsonObject[1].latitud, jsonObject[1].longitud);
                    map2.setZoom(15);

                }
                catch (err) {

                }

                $('.link_expan').trigger("click");
            }
        });

    });

    $('#contactMail').click(function (event) {
        window.location.href = "mailto:contact@loretobaja.mx";
    });

    updateHelpLayer();
});

function updateHelpIcon() {
    if (helpShowed) {
        $("#helpIcon").css("transform", "translate(0%,-100%)");
    }
    else {
        $("#helpIcon").css("transform", "translate(0%,0%)");
    }
}

function updateHelpLayer() {

    var lastView = arrayTop(viewStack);
    if (lastView == "main" || lastView == "help") {
        $("#help").show();

        if (willShowHelp) {
            if (lastView == "main") {
                willShowHelp = false;
                showHelp();
            }
        }
    }
    else {
        $("#help").hide();
    }
}

function hideHelp() {
    helpShowed = false;

    $("#overlay").hide();
    $("#helpLogo").hide();
    $("#helpMessage").hide();
    $("#helpF1").hide();
    $("#helpF2").hide();
    $("#helpF3").hide();
    $("#helpF4").hide();
    $("#helpF5").hide();
    $("#helpF1Message").hide();
    $("#helpF2Message").hide();
    $("#helpF3Message").hide();
    $("#helpF4Message").hide();
    $("#helpF5Message").hide();

    $("#dScroll").css("opacity", "1");
    $("#gmap").css("opacity", "1");

    updateHelpIcon();
}

function showHelp() {
    helpShowed = true;

    $("#overlay").show();
    $("#helpLogo").show();
    $("#helpMessage").show();
    $("#helpF1").show();
    $("#helpF2").show();
    $("#helpF3").show();
    $("#helpF4").show();
    $("#helpF5").show();
    $("#helpF1Message").show();
    $("#helpF2Message").show();
    $("#helpF3Message").show();
    $("#helpF4Message").show();
    $("#helpF5Message").show();

    $("#dScroll").css("opacity", "0.2");
    $("#gmap").css("opacity", "0.2");
    updateHelpIcon();
}

function markWillShowHelp() {
    willShowHelp = true;
}

function directorio() {
    showOverlay();

    $.ajax({
        cache: true,
        url: dominio + "lista_directorio.php",
        data: {idioma: idioma},
        type: "POST",
        //  contentType: "application/javascript",
        dataType: "json",
        async: true,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            if (idioma == "es") {
                $("#tit8").text("Directorio de Emergencias");
            }
            else {
                $("#tit8").text("Emergency Directory");
            }

            /*LIMPIAR*/
            $("#directorio .lista03").html("");

            $.each(datos, function (i, dato) {

                var newRow = '<li>' +
                    '<p><a class="external" style="color: #213357;" href="tel:' + dato.telefono + '"><strong style="font-size: 19px;">' + dato.nombre + ':</strong><br>' +
                    '<span>' + dato.telefono + '</span></a></p>' +
                    '</li>';

                $(newRow).appendTo("#directorio .lista03");

            });
        }
    });
}

function lista_establecomientos(tipo) {
    leer_combos();

    if (tipo == '1') {
        $('#ESTRELLAS, #UBICACION').show();
        $('#CMBRESTAURANT').hide();
        $('#CMBTOUR').hide();
    }
    if (tipo == '2') {
        $('#ESTRELLAS, #UBICACION').hide();
        $('#CMBRESTAURANT').show();
        $('#CMBTOUR').hide();
    }
    if (tipo == '3') {
        $('#ESTRELLAS, #UBICACION').hide();
        $('#CMBRESTAURANT').hide();
        $('#CMBTOUR').show();
    }

    establecimientos_default(tipo);

    $('#ESTRELLAS, #UBICACION').on('change', function () {
        estrellas = $('#ESTRELLAS option:selected').val();
        zonas = $('#UBICACION option:selected').val();
        buscar_establecimientos_hotel(estrellas, zonas);
    });

    $('#CMBRESTAURANT').on('change', function () {
        categoria = $('#CMBRESTAURANT option:selected').val();
        buscar_establecimientos_restaurant(categoria);
    });

    $('#CMBTOUR').on('change', function () {
        categoria = $('#CMBTOUR option:selected').val();
        buscar_establecimientos_tour(categoria);
    });
}

function buscar_establecimientos_hotel(estrellas, zonas) {
    showOverlay();

    $.ajax({
        url: dominio + "busquedas_establecimientos.php",
        data: {idioma: idioma, m: 'Hotel', estrellas: estrellas, zonas: zonas},
        type: "POST",
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $("#noResults").hide();
            $(".lista02 ul").hide();

            $(".lista02 ul").html("");

            if (datos != null) {
                $(".lista02 ul").show();

                $.each(datos, function (i, dato) {
                    if (dato.tipo == 'Hotel') {
                        $('.tabServicio').show();
                        $('.tabTarifa').show();
                        $('.tabMenu').hide();
                    }

                    if (dato.tipo == 'Restaurant') {
                        $('.tabMenu').show();
                        $('.tabServicio').hide();
                        $('.tabTarifa').hide();
                    }

                    if (dato.tipo == 'Hotel') {
                        $('.tabServicio').show();
                        $('.tabTarifa').show();
                        $('.tabMenu').hide();
                    }

                    if (dato.tipo == 'Turistico') {
                        $('.tabMenu').hide();
                        $('.tabServicio').hide();
                        $('.tabTarifa').hide();
                    }

                    if (dato.thumb == null || dato.thumb == "" || dato.thumb == "null") {
                        dato.thumb = "images/noImage.png";
                    }
                    else {
                        dato.thumb = dominio_image + 'thumb-' + dato.thumb;
                    }

                    var newRow = '<li class="col-50">' +
                        '<a data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' +
                        '<img src="' + dato.thumb + '">' +
                        '<span class="lista02H">' +
                        '<h4>' + dato.nombre + '</h4>' +
                        '<h5>' + dato.cat2 + '</h5>' +
                        '<span class="minfo">' + getMoreInformation(idioma) + '</span>' +
                        '</span>' +
                        '</a>' +
                        '</li>';

                    $(newRow).appendTo(".lista02 ul");
                });

                $('.lista02 a').click(function (event) {
                    var idc = $(this).attr('data-id');
                    var tipo = $(this).attr('data-tipo');
                    det_menu(idc, tipo);
                    myApp.showTab('#tab1');
                });
            }
            else {
                $("#noResults").show();
            }
        }
    });
}

function buscar_establecimientos_restaurant(categoria) {
    showOverlay();

    $.ajax({
        url: dominio + "busquedas_establecimientos.php",
        data: {idioma: idioma, m: 'Restaurant', categoria: categoria},
        type: "POST",
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $("#noResults").hide();
            $(".lista02 ul").hide();

            $(".lista02 ul").html("");

            if (datos != null) {
                $(".lista02 ul").show();

                $.each(datos, function (i, dato) {
                    if (dato.tipo == 'Hotel') {
                        $('.tabServicio').show();
                        $('.tabTarifa').show();
                        $('.tabMenu').hide();
                    }

                    if (dato.tipo == 'Restaurant') {
                        $('.tabMenu').show();
                        $('.tabServicio').hide();
                        $('.tabTarifa').hide();
                    }

                    if (dato.tipo == 'Hotel') {
                        $('.tabServicio').show();
                        $('.tabTarifa').show();
                        $('.tabMenu').hide();
                    }

                    if (dato.tipo == 'Turistico') {
                        $('.tabMenu').hide();
                        $('.tabServicio').hide();
                        $('.tabTarifa').hide();
                    }

                    if (dato.thumb == null || dato.thumb == "" || dato.thumb == "null") {
                        dato.thumb = "images/noImage.png";
                    }
                    else {
                        dato.thumb = dominio_image + 'thumb-' + dato.thumb;
                    }

                    var newRow = '<li class="col-50">' +
                        '<a data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' +
                        '<img src="' + dato.thumb + '">' +
                        '<span class="lista02H">' +
                        '<h4>' + dato.nombre + '</h4>' +
                        '<h5>' + dato.cat2 + '</h5>' +
                        '<span class="minfo">' + getMoreInformation(idioma) + '</span>' +
                        '</span>' +
                        '</a>' +
                        '</li>';

                    $(newRow).appendTo(".lista02 ul");
                });

                $('.lista02 a').click(function (event) {
                    var idc = $(this).attr('data-id');
                    var tipo = $(this).attr('data-tipo');
                    det_menu(idc, tipo);
                    myApp.showTab('#tab1');
                });

                $(".link_verenmapa a").click(function () {
                    $("#dScroll2").toggleClass("bajar");
                    lista_mapa_establecomientos(currentTipo);
                    map2.removeMarkers();

                    var textosearch = $('#txtBuscar').val();
                    var estrellas = $('#ESTRELLAS option:selected').val();
                    var zonas = $('#UBICACION option:selected').val();
                    var categoria = "";

                    if(currentTipo == 3) {
                        categoria = $('#CMBTOUR option:selected').val();
                    }
                    else if(currentTipo == 2) {
                        categoria = $('#CMBRESTAURANT option:selected').val();
                    }
                    else {
                        categoria = "";
                    }

                    showOverlay();

                    $.ajax({
                        cache: true,
                        url: dominio + "lista_mapa_search.php",
                        data: {
                            idioma: idioma,
                            tipo: currentTipo,
                            palabra: textosearch,
                            estrellas: estrellas,
                            zonas: zonas,
                            categoria: categoria
                        },
                        type: "POST",
                        dataType: "json",
                        async: true,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            hideOverlay();
                        },
                        success: function (datos) {
                            hideOverlay();

                            $.each(datos, function (i, dato) {

                                map2.addMarker({
                                    lat: dato.latitud,
                                    lng: dato.longitud,
                                    infoWindow: {
                                        content: '<a class="link_list_mapa" data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' + dato.nombre + '</a>',
                                        domready: function (e) {
                                            $('.link_list_mapa').on("click", function () {
                                                var idc = $(this).attr('data-id');
                                                var tipo = $(this).attr('data-tipo');
                                                det_menu(idc, tipo);
                                                myApp.showTab('#tab1');
                                            });
                                        }
                                    },
                                    click: function (e) {
                                        map2.map.panTo(e.position);
                                    }
                                });

                            });

                            $('.link_expan').trigger("click");
                        }
                    });

                });
            }
            else {
                $("#noResults").show();
            }
        }
    });
}

function buscar_establecimientos_tour(categoria) {
    showOverlay();

    $.ajax({
        url: dominio + "busquedas_establecimientos.php",
        data: {idioma: idioma, m: 'Tour', categoria: categoria},
        type: "POST",
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $("#noResults").hide();
            $(".lista02 ul").hide();

            $(".lista02 ul").html("");

            if (datos != null) {
                $(".lista02 ul").show();

                $.each(datos, function (i, dato) {
                    if (dato.tipo == 'Hotel') {
                        $('.tabServicio').show();
                        $('.tabTarifa').show();
                        $('.tabMenu').hide();
                    }

                    if (dato.tipo == 'Restaurant') {
                        $('.tabMenu').show();
                        $('.tabServicio').hide();
                        $('.tabTarifa').hide();
                    }

                    if (dato.tipo == 'Hotel') {
                        $('.tabServicio').show();
                        $('.tabTarifa').show();
                        $('.tabMenu').hide();
                    }

                    if (dato.tipo == 'Turistico') {
                        $('.tabMenu').hide();
                        $('.tabServicio').hide();
                        $('.tabTarifa').hide();
                    }

                    if (dato.thumb == null || dato.thumb == "" || dato.thumb == "null") {
                        dato.thumb = "images/noImage.png";
                    }
                    else {
                        dato.thumb = dominio_image + 'thumb-' + dato.thumb;
                    }

                    var newRow = '<li class="col-50">' +
                        '<a data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' +
                        '<img src="' + dato.thumb + '">' +
                        '<span class="lista02H">' +
                        '<h4>' + dato.nombre + '</h4>' +
                        '<h5>' + dato.cat2 + '</h5>' +
                        '<span class="minfo">' + getMoreInformation(idioma) + '</span>' +
                        '</span>' +
                        '</a>' +
                        '</li>';

                    $(newRow).appendTo(".lista02 ul");
                });

                $('.lista02 a').click(function (event) {
                    var idc = $(this).attr('data-id');
                    var tipo = $(this).attr('data-tipo');
                    det_menu(idc, tipo);
                    myApp.showTab('#tab1');
                });

                $(".link_verenmapa a").click(function () {
                    $("#dScroll2").toggleClass("bajar");
                    lista_mapa_establecomientos(currentTipo);
                    map2.removeMarkers();

                    var textosearch = $('#txtBuscar').val();
                    var estrellas = $('#ESTRELLAS option:selected').val();
                    var zonas = $('#UBICACION option:selected').val();
                    var categoria = "";

                    if(currentTipo == 3) {
                        categoria = $('#CMBTOUR option:selected').val();
                    }
                    else if(currentTipo == 2) {
                        categoria = $('#CMBRESTAURANT option:selected').val();
                    }
                    else {
                        categoria = "";
                    }

                    showOverlay();

                    $.ajax({
                        cache: true,
                        url: dominio + "lista_mapa_search.php",
                        data: {
                            idioma: idioma,
                            tipo: currentTipo,
                            palabra: textosearch,
                            estrellas: estrellas,
                            zonas: zonas,
                            categoria: categoria
                        },
                        type: "POST",
                        dataType: "json",
                        async: true,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            hideOverlay();
                        },
                        success: function (datos) {
                            hideOverlay();

                            $.each(datos, function (i, dato) {

                                map2.addMarker({
                                    lat: dato.latitud,
                                    lng: dato.longitud,
                                    infoWindow: {
                                        content: '<a class="link_list_mapa" data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' + dato.nombre + '</a>',
                                        domready: function (e) {
                                            $('.link_list_mapa').on("click", function () {
                                                var idc = $(this).attr('data-id');
                                                var tipo = $(this).attr('data-tipo');
                                                det_menu(idc, tipo);
                                                myApp.showTab('#tab1');
                                            });
                                        }
                                    },
                                    click: function (e) {
                                        map2.map.panTo(e.position);
                                    }
                                });

                            });

                        }
                    });

                });
            }
            else {
                $("#noResults").show();
            }
        }
    });
}

function establecimientos_default(tipo) {
    showOverlay();

    $.ajax({
        cache: true,
        url: dominio + "lista_menu.php",
        data: {idioma: idioma, tipo: tipo},
        type: "POST",
        //  contentType: "application/javascript",
        dataType: "json",
        async: true,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $("#noResults").hide();
            $(".lista02 ul").hide();

            $(".lista02 ul").html("");

            if (datos != null) {
                $(".lista02 ul").show();

                $.each(datos, function (i, dato) {
                    if (dato.tipo == 'Hotel') {
                        $('.tabServicio').show();
                        $('.tabTarifa').show();
                        $('.tabMenu').hide();
                    }

                    if (dato.tipo == 'Restaurant') {
                        $('.tabMenu').show();
                        $('.tabServicio').hide();
                        $('.tabTarifa').hide();
                    }

                    if (dato.tipo == 'Hotel') {
                        $('.tabServicio').show();
                        $('.tabTarifa').show();
                        $('.tabMenu').hide();
                    }

                    if (dato.tipo == 'Turistico') {
                        $('.tabMenu').hide();
                        $('.tabServicio').hide();
                        $('.tabTarifa').hide();
                    }

                    if (dato.thumb == null || dato.thumb == "" || dato.thumb == "null") {
                        dato.thumb = "images/noImage.png";
                    }
                    else {
                        dato.thumb = dominio_image + 'thumb-' + dato.thumb;
                    }

                    var newRow = '<li class="col-50">' +
                        '<a data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' +
                        '<img src="' + dato.thumb + '">' +
                        '<span class="lista02H">' +
                        '<h4>' + dato.nombre + '</h4>' +
                        '<h5>' + dato.cat2 + '</h5>' +
                        '<span class="minfo">' + getMoreInformation(idioma) + '</span>' +
                        '</span>' +
                        '</a>' +
                        '</li>';

                    $(newRow).appendTo(".lista02 ul");
                });

                $('.lista02 a').click(function (event) {
                    var idc = $(this).attr('data-id');
                    var tipo = $(this).attr('data-tipo');
                    det_menu(idc, tipo);
                    myApp.showTab('#tab1');
                });

                $(".link_verenmapa a").click(function () {
                    $("#dScroll2").toggleClass("bajar");
                    lista_mapa_establecomientos(currentTipo);
                    map2.removeMarkers();

                    var textosearch = $('#txtBuscar').val();
                    var estrellas = $('#ESTRELLAS option:selected').val();
                    var zonas = $('#UBICACION option:selected').val();
                    var categoria = "";

                    if(currentTipo == 3) {
                        categoria = $('#CMBTOUR option:selected').val();
                    }
                    else if(currentTipo == 2) {
                        categoria = $('#CMBRESTAURANT option:selected').val();
                    }
                    else {
                        categoria = "";
                    }

                    showOverlay();

                    $.ajax({
                        cache: true,
                        url: dominio + "lista_mapa_search.php",
                        data: {
                            idioma: idioma,
                            tipo: currentTipo,
                            palabra: textosearch,
                            estrellas: estrellas,
                            zonas: zonas,
                            categoria: categoria
                        },
                        type: "POST",
                        dataType: "json",
                        async: true,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            hideOverlay();
                        },
                        success: function (datos) {
                            hideOverlay();

                            $.each(datos, function (i, dato) {

                                map2.addMarker({
                                    lat: dato.latitud,
                                    lng: dato.longitud,
                                    infoWindow: {
                                        content: '<a class="link_list_mapa" data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' + dato.nombre + '</a>',
                                        domready: function (e) {
                                            $('.link_list_mapa').on("click", function () {
                                                var idc = $(this).attr('data-id');
                                                var tipo = $(this).attr('data-tipo');
                                                det_menu(idc, tipo);
                                                myApp.showTab('#tab1');
                                            });
                                        }
                                    },
                                    click: function (e) {
                                        map2.map.panTo(e.position);
                                    }
                                });

                            });

                        }
                    });

                });
            }
            else {
                $("#noResults").show();
            }
        }
    });


}

function eventos() {
    showOverlay();

    $.ajax({
        cache: true,
        url: dominio + "lista_eventos_inicio.php",
        data: {idioma: idioma},
        type: "POST",
        //  contentType: "application/javascript",
        dataType: "json",
        async: true,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $(".lista01").html("");

            $.each(datos, function (i, dato) {


                var newRow = '<li>' +
                    '<a data-id="' + dato.id + '" href="#det_evento" class="item-link item-content">' +
                    '   <div class="item-media"><img src="' + dominio_image + 'thumb-' + dato.thumb + '" width="80"></div>' +
                    '   <div class="item-inner">' +
                    '       <div class="dFecha">' +
                    '        ' + dato.mes + ' <span>' + dato.dia + '</span>' +
                    '       </div>' +
                    '      <div class="item-text">' +
                    '           <strong>' + dato.nombre + '</strong>' +
                    '       </div>' +
                    '   </div>' +
                    '</a>' +
                    '</li>';


                $(newRow).appendTo(".lista01");


            });

            $('.lista01 a').click(function (event) {
                var idc = $(this).attr('data-id');
                det_evento(idc);
            });


        }
    });
}

function leer_combos() {
    showOverlay();

    $.ajax({
        url: dominio + "busquedas.php",
        data: {idioma: idioma, m: 'ubicacion'},
        type: "POST",
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $("#UBICACION").html("");
            $("<option value='' id='opZones'>" + getZones(idioma) + "</option>").appendTo("#UBICACION");
            $.each(datos, function (i, dato) {
                var newRow = '<option value="' + dato.UBICACION + '">' +
                    dato.UBICACION +
                    '</option>';
                $(newRow).appendTo("#UBICACION");
            });
        }
    });

    showOverlay();

    $.ajax({
        url: dominio + "busquedas.php",
        data: {idioma: idioma, m: 'restaurant'},
        type: "POST",
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $("#CMBRESTAURANT").html("");
            $("<option value='' id='opCategories1'>" + getCategories(idioma) + "</option>").appendTo("#CMBRESTAURANT");

            $.each(datos, function (i, dato) {
                var newRow = '<option value="' + dato.ID + '">' +
                    dato.TITULO +
                    '</option>';
                $(newRow).appendTo("#CMBRESTAURANT");
            });
        }
    });

    showOverlay();

    $.ajax({
        url: dominio + "busquedas.php",
        data: {idioma: idioma, m: 'tour'},
        type: "POST",
        dataType: "json",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $("#CMBTOUR").html("");
            $("<option value='' id='opCategories2'>" + getCategories(idioma) + "</option>").appendTo("#CMBTOUR");

            $.each(datos, function (i, dato) {
                var newRow = '<option value="' + dato.ID + '">' +
                    dato.TITULO +
                    '</option>';
                $(newRow).appendTo("#CMBTOUR");
            });
        }
    });

}

function lista_mapa_establecomientos(tipo) {
    var textosearch = $('#txtBuscar').val();
    var estrellas = $('#ESTRELLAS option:selected').val();
    var zonas = $('#UBICACION option:selected').val();
    var categoria = "";

    if(currentTipo == 3) {
        categoria = $('#CMBTOUR option:selected').val();
    }
    else if(currentTipo == 2) {
        categoria = $('#CMBRESTAURANT option:selected').val();
    }
    else {
        categoria = "";
    }

    showOverlay();

    $.ajax({
        cache: true,
        url: dominio + "lista_menu.php",
        data: {
            idioma: idioma,
            tipo: tipo,
            palabra: textosearch,
            estrellas: estrellas,
            zonas: zonas,
            categoria: categoria
        },
        type: "POST",
        //  contentType: "application/javascript",
        dataType: "json",
        async: true,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $(".lista02m ul").html("");

            $.each(datos, function (i, dato) {
                if (dato.thumb == null || dato.thumb == "" || dato.thumb == "null") {
                    dato.thumb = "images/noImage.png";
                }
                else {
                    dato.thumb = dominio_image + 'thumb-' + dato.thumb;
                }

                var newRow = '<li class="col-50">' +
                    '<a data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' +
                    '<img src="' + dato.thumb + '">' +
                    '<span class="lista02H">' +
                    '<h4>' + dato.nombre + '</h4>' +
                    '<h5>' + dato.cat2 + '</h5>' +
                    '<span class="minfo">' + getMoreInformation(idioma) + '</span>' +
                    '</span>' +
                    '</a>' +
                    '</li>';

                $(newRow).appendTo(".lista02m ul");

            });


            $('.lista02m a').click(function (event) {
                var idc = $(this).attr('data-id');
                var tipo = $(this).attr('data-tipo');
                det_menu(idc, tipo);
            });

            $('.lista02 a').click(function (event) {
                var idc = $(this).attr('data-id');
                var tipo = $(this).attr('data-tipo');
                det_menu(idc, tipo);
                myApp.showTab('#tab1');
            });

            $(".link_verenmapa a").click(function () {
                $("#dScroll2").toggleClass("bajar");
                map2.removeMarkers();

                var textosearch = $('#txtBuscar').val();
                var estrellas = $('#ESTRELLAS option:selected').val();
                var zonas = $('#UBICACION option:selected').val();
                var categoria = "";

                if(currentTipo == 3) {
                    categoria = $('#CMBTOUR option:selected').val();
                }
                else if(currentTipo == 2) {
                    categoria = $('#CMBRESTAURANT option:selected').val();
                }
                else {
                    categoria = "";
                }

                showOverlay();

                $.ajax({
                    cache: true,
                    url: dominio + "lista_mapa_search.php",
                    data: {
                        idioma: idioma,
                        tipo: currentTipo,
                        palabra: textosearch,
                        estrellas: estrellas,
                        zonas: zonas,
                        categoria: categoria
                    },
                    type: "POST",
                    dataType: "json",
                    async: true,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        hideOverlay();
                    },
                    success: function (datos) {
                        hideOverlay();

                        $.each(datos, function (i, dato) {

                            map2.addMarker({
                                lat: dato.latitud,
                                lng: dato.longitud,
                                infoWindow: {
                                    content: '<a class="link_list_mapa" data-id="' + dato.id + '" data-tipo="' + dato.tipo + '" href="#det_cliente">' + dato.nombre + '</a>',
                                    domready: function (e) {
                                        $('.link_list_mapa').on("click", function () {
                                            var idc = $(this).attr('data-id');
                                            var tipo = $(this).attr('data-tipo');
                                            det_menu(idc, tipo);
                                            myApp.showTab('#tab1');
                                        });
                                    }
                                },
                                click: function (e) {
                                    map2.map.panTo(e.position);
                                }
                            });

                        });

                    }
                });

            });


        }
    });
}

function det_evento(idc) {
    showOverlay();

    $.ajax({
        cache: true,
        url: dominio + "evento_detalle.php",
        data: {idioma: idioma, idc: idc},
        type: "POST",
        //contentType: "application/javascript",
        dataType: "json",
        async: true,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $('#det_evento .dStage').html('');
            $('#det_evento .dFecha2').html('');
            $('#det_evento .dTit').html('');
            $('#det_evento .lugar').html('');
            $('#det_evento .hora').html('');
            $('#det_evento .descripcion').html('');

            $.each(datos, function (i, dato) {
                $('#det_evento .dStage').html('<img class="responsive" src="' + dominio_image + dato.thumb + '">');
                $('#det_evento .dFecha2').html(dato.mes + "<span>" + dato.dia + "</span>");
                $('#det_evento .dTit').html(dato.nombre);
                $('#det_evento .lugar').html(dato.lugar);
                $('#det_evento .hora').html(dato.hora);
                $('#det_evento .descripcion').html(dato.descripcion);

            });

        }
    });

    currentModule = "d_evento";
    currentId = idc;
    viewStack.push(currentModule);
    console.log("View Stack:" + JSON.stringify(viewStack));
    console.log("Current module: " + currentModule);
    console.log("Current ID: " + currentId);
    console.log("Current tipo: " + currentTipo);
}

function det_conoce(idc) {
    showOverlay();

    $.ajax({
        cache: true,
        url: dominio + "conoce_detalle.php",
        data: {idioma: idioma, idc: idc},
        type: "POST",
        //contentType: "application/javascript",
        dataType: "json",
        async: true,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $('#det_conoce .dStage').html('');
            $('#det_conoce .dTit').html('');
            $('#det_conoce .mapa').attr('data-latitud', '');
            $('#det_conoce .mapa').attr('data-longitud', '');
            $('#det_conoce .link_panoramica').attr('data-panoramica', '');
            $('#det_conoce .descripcion').html('');

            $.each(datos, function (i, dato) {
                $('#det_conoce .dStage').html('<img class="responsive" src="' + dominio_image + dato.thumb + '">');
                $('#det_conoce .dTit').html(dato.nombre);
                $('#det_conoce .mapa').attr('data-latitud', dato.latitud);
                $('#det_conoce .mapa').attr('data-longitud', dato.longitud);
                $('#det_conoce .mapa').attr('data-nombre', dato.nombre);
                if (dato.panoramica == null || dato.panoramica == '') {
                    $('.det_conoce_panoramica').hide();
                    $("#panoramica div").html();
                } else {
                    $('.det_conoce_panoramica').show();
                    $("#panoramica div").html(dato.panoramica);
                }

                $('#panoramica div iframe').height($(window).height() - 25);

                $('#det_conoce .link_panoramica').attr('data-panoramica', dato.panoramica);
                $('#det_conoce .descripcion').html(dato.descripcion);

            });

            $(".det_conoce_mapa").click(function () {
                latitud = $(this).attr('data-latitud');
                longitud = $(this).attr('data-longitud');
                nombre = $(this).attr('data-nombre');
                det_mapa(latitud, longitud, nombre);
            });

        }
    });

    currentModule = "d_conoce";
    currentId = idc;
    viewStack.push(currentModule);
    console.log("View Stack:" + JSON.stringify(viewStack));
    console.log("Current module: " + currentModule);
    console.log("Current ID: " + currentId);
    map2console.log("Current tipo: " + currentTipo);
}

function det_mapa(latitud, longitud, nombre) {
    map2.removeMarkers();
    map2.addMarker({
        lat: latitud,
        lng: longitud,
        infoWindow: {
            content: nombre
        },
        click: function (e) {
            map2.map.panTo(e.position);
        }
    });
    map2.setCenter(latitud, longitud);
    map2.setZoom(12);
}

function det_menu(idc, tipo) {
    var $rateYo = $("#rateYo").rateYo();

    showOverlay();

    $.ajax({
        cache: true,
        url: dominio + "menu_detalle.php",
        data: {idioma: idioma, idc: idc, tipo: tipo},
        type: "POST",
        //contentType: "application/javascript",
        dataType: "json",
        async: true,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $('#det_cliente .dStage').html('');
            $('#det_cliente .dTit').html('');
            $('#det_cliente .tZona').html('');
            $('#det_cliente .tsubcategoria').html('');
            $('#det_cliente .facebook').attr('href', '');
            $('#det_cliente .twitter').attr('href', '');
            $('#det_cliente .telefono').html('');
            $('#det_cliente .email').html('');
            $('#det_cliente .www').html('');
            $('#det_cliente .direccion').html('');
            $('#det_cliente .tarifa').html('');
            $('#det_cliente .descripcion').html('');
            $('#det_cliente .mapa').attr('data-latitud', '');
            $('#det_cliente .mapa').attr('data-longitud', '');
            $('#det_cliente .mapa').attr('data-nombre', '');

            $('#det_cliente .link_panoramica').attr('data-panoramica', '');

            $("#det_cliente .servicios").html('');
            $("#det_cliente .galeria").html('');
            $("#det_cliente .promo").html('');
            $("#det_cliente .menu").html('');

            $("#panoramica div").html('');

            $rateYo.rateYo("destroy");


            $.each(datos, function (i, dato) {
                if (dato.thumb == null || dato.thumb == "" || dato.thumb == "null") {
                    dato.thumb = "images/noImage.png";
                }
                else {
                    dato.thumb = dominio_image + 'thumb-' + dato.thumb;
                }

                $('#det_cliente .dStage').html('<img class="responsive" src="' + dato.thumb + '">');

                $('#det_cliente .dTit').html(dato.nombre);
                $('#det_cliente .tZona').html(dato.cat2);
                $('#det_cliente .tSubcategoria').html(dato.subcategoria);

                if (dato.facebook != null && dato.facebook != "") {
                    $('#det_cliente .facebook').attr('href', dato.facebook);
                    $('#det_cliente .facebook').show();
                }
                else {
                    $('#det_cliente .facebook').hide();
                }

                if (dato.twitter != null && dato.twitter != "") {
                    $('#det_cliente .twitter').attr('href', dato.twitter);
                    $('#det_cliente .twitter').show();
                } else {
                    $('#det_cliente .twitter').hide();
                }

                $('#det_cliente .telefono').html(dato.telefono).attr('href', 'tel:' + dato.telefono);
                $('#det_cliente .email').html(dato.email).attr('href', 'mailto:' + dato.email);
                $('#det_cliente .www').html(dato.www).attr('href', dato.www);
                $('#det_cliente .direccion').html(dato.direccion);
                $('#det_cliente .tarifa').html(dato.tarifa);
                $('#det_cliente .dTarifas').html(dato.tarifas);

                $('#det_cliente .descripcion').html(dato.descripcion);

                $('#det_cliente .mapa').attr('data-latitud', dato.latitud);
                $('#det_cliente .mapa').attr('data-longitud', dato.longitud);
                $('#det_cliente .mapa').attr('data-nombre', dato.nombre);

                $('#det_cliente .link_panoramica').attr('data-panoramica', dato.panoramica);

                if (dato.panoramica == null || dato.panoramica == '') {
                    $('.mTop20').hide();
                    $("#panoramica div").html();
                } else {
                    $('.mTop20').show();
                    $("#panoramica div").html(dato.panoramica);
                }

                $('#panoramica div iframe').height($(window).height() - 25);

                if (dato.galeria.id != '') {
                    for (r in dato.galeria.id) {
                        var newRow3 = '<a href="' + dominio_image + dato.galeria.thumb[r] + '"><img src="' + dominio_image + 'thumb-' + dato.galeria.thumb[r] + '"></a>';
                        $(newRow3).appendTo("#det_cliente .galeria");
                    }
                }

                if (dato.promo.id != '') {
                    for (r in dato.promo.id) {
                        if (dato.promo.thumb[r] == null || dato.promo.thumb[r] == "" || dato.promo.thumb[r] == "null") {
                            dato.promo.thumb[r] = "images/noImage.png";
                        }
                        else {
                            dato.promo.thumb[r] = dominio_image + dato.promo.thumb[r];
                        }

                        var newRow4 = '<a href="' + dominio_image + dato.promo.thumb[r] + '"><img class="responsive" src="' + dato.promo.thumb[r] + '"></a>';
                        $(newRow4).appendTo("#det_cliente .promo");

                    }
                }

                if (dato.cliente.id != '') {
                    for (r in dato.cliente.id) {  /*Recorre el 3 subnivel del json*/
                        if (dato.cliente.thumb[r] == null || dato.cliente.thumb[r] == "" || dato.cliente.thumb[r] == "null") {
                            dato.cliente.thumb[r] = "images/noImage.png";
                        }
                        else {
                            dato.cliente.thumb[r] = dominio_image + dato.cliente.thumb[r];
                        }

                        var newRow2 = '<div class="col-25 text-center"><img class="responsive" src="' + dato.cliente.thumb[r] + '"><span class="text01">' + dato.cliente.titulo[r] + '</span></div>';
                        $(newRow2).appendTo("#det_cliente .servicios");
                    }
                }

                if (dato != null && dato != undefined && dato.menu != null && dato.menu != undefined && "id" in dato.menu && dato.menu.id != '') {
                    for (r in dato.menu.id) {  /*Recorre el 3 subnivel del json*/
                        if (dato.menu.thumb[r] == null || dato.menu.thumb[r] == "" || dato.menu.thumb[r] == "null") {
                            dato.menu.thumb[r] = "images/noImage.png";
                        }
                        else {
                            dato.menu.thumb[r] = dominio_image + dato.menu.thumb[r];
                        }

                        var newRow5 = '<a href="' + dominio_image + dato.menu.thumb[r] + '"><img class="responsive" src="' + dato.menu.thumb[r] + '"></a>';
                        $(newRow5).appendTo("#det_cliente .menu");
                    }
                }
                // TODO - Debug - Just to debug the code
                else {
                    console.log("No id menu");
                }

                if (dato.cat1 != '') {

                    $("#rateYo").rateYo({
                        rating: dato.cat1,
                        starWidth: "20px",
                        fullStar: true,
                        readOnly: true
                    });
                }

                /*Destruir y reiniciaz galeria*/
                var $lg = $('.galeria');
                var $lg2 = $('.promo');
                var $lg3 = $('.menu');

                setTimeout(function () {
                    $lg.lightGallery({
                        download: false
                    });
                    $lg2.lightGallery({
                        download: false
                    });
                    $lg3.lightGallery({
                        download: false
                    });
                }, 300);

                /*
                $lg.data('lightGallery').destroy(true);
                $lg2.data('lightGallery').destroy(true);
                $lg3.data('lightGallery').destroy(true);
                */
            });

            $(".det_conoce_mapa").click(function () {
                latitud = $(this).attr('data-latitud');
                longitud = $(this).attr('data-longitud');
                nombre = $(this).attr('data-nombre');
                det_mapa(latitud, longitud, nombre);
            });

        }
    });

    currentModule = "d_menu";
    currentId = idc;
    currentTipo = tipo;

    viewStack.push(currentModule);
    console.log("View Stack:" + JSON.stringify(viewStack));
    console.log("Current module: " + currentModule);
    console.log("Current ID: " + currentId);
    console.log("Current tipo: " + currentTipo);
}

function changeIdiomCustom(lang, flag) {
    var value = window.localStorage.getItem("key");

    if (lang == '' || lang == undefined || lang == null) {

        lang = 'es';
    }
    idioma = lang;

    updateTermsAndConditions();
    updateData();

    if (lang == 'es') {
        $("#esSelector").css('visibility', "visible");
        $("#enSelector").css('visibility', "hidden");

        $("#languageMessage").html("Al ingresar a <b >Discover Loreto</b > estoy aceptando los <b >Términos y condiciones</b > de la misma.");
        $("#lbPhone").text("Teléfono:");
        $("#lbAddress").text("Dirección:");

        $("#tabTitle1").text("Info");
        $("#tabTitle2").text("Servicios");
        $("#tabTitle3").text("Fotos");
        $("#tabTitle4").text("Promociones");
        $("#tabTitle5").text("Menú");
        $("#tabTitle6").text("Tarifas");

        $("#txtBuscar").attr('placeholder', 'Buscar...');
        $("#hPlace").text("Lugar:");
        $("#hTime").text("Hora:");

        $("#opCategories1").text("Categorías");
        $("#opCategories2").text("Categorías");
        $("#opStars").text("Estrellas");

        $("#mapaTit1").text("Próximos Eventos");
        $("#indexTit1").text("Próximos Eventos");

        $("#tit4").text("Conoce Loreto");
        $("#tit5").text("Hoteles");
        $("#tit6").text("Restaurantes");
        $("#tit7").text("Tours y más");
        $("#tit8").text("Directorio de Emergencias");
        $("#tit9").text("Eventos");
        $("#tit11").text("Directorio de Emergencias");
        $("#tit12").text("Preferencias");

        $("#titPref1").text("Nuestras Secciones");
        $("#titPref2").text("Home");
        $("#titPref3").text("Conoce Loreto");
        $("#titPref4").text("Próximos Eventos");
        $("#titPref5").text("Directorio de Emergencias");
        $("#titPref6").text("Hoteles");
        $("#titPref7").text("Restaurantes");
        $("#titPref8").text("Tours y más");
        $("#titPref9").text("¿Cómo usar esta app?");
        $("#titPref10").text("Dudas o Comentarios");
        $("#titPref11").text("Escribenos a: ");
        $("#titPref12").text("Términos y Condiciones");
        $("#titPref14").text("Términos y Condiciones");


        $("#noResults").text("Lo sentimos, no hay opciones con esas características. Favor de hacer otra búsqueda.");

        if (value) {
            $("#titPref13").text("Idioma");
        } else {
            window.localStorage.setItem("key", true);
            $("#titPref13").text("Idioma/Languaje");
        }
    } else {
        $("#esSelector").css('visibility', "hidden");
        $("#enSelector").css('visibility', "visible");

        $("#languageMessage").html("By entering to <b>Discover Loreto</b> I accept the <b>Terms and Conditions</b> of this App.");
        $("#lbPhone").text("Phone Number:");
        $("#lbAddress").text("Address:");

        $("#tabTitle1").text("Info");
        $("#tabTitle2").text("Services");
        $("#tabTitle3").text("Photos");
        $("#tabTitle4").text("Promotions");
        $("#tabTitle5").text("Menu");
        $("#tabTitle6").text("Rates");

        $("#txtBuscar").attr('placeholder', 'Search...');
        $("#hPlace").text("Place:");
        $("#hTime").text("Time:");

        $("#opCategories1").text("Categories");
        $("#opCategories2").text("Categories");
        $("#opStars").text("Stars");
        $("#opZones").text("Zones");

        $("#mapaTit1").text("Upcomming Events");
        $("#indexTit1").text("Upcomming Events");

        $("#tit4").text("Discover Loreto");
        $("#tit5").text("Hotels");
        $("#tit6").text("Restaurants");
        $("#tit7").text("Tours and more");
        $("#tit8").text("Emergency Directory");
        $("#tit9").text("Events");
        $("#tit11").text("Emergency Directory");
        $("#tit12").text("Preferences");

        $("#titPref1").text("Our Sections");
        $("#titPref2").text("Home");
        $("#titPref3").text("Discover Loreto");
        $("#titPref4").text("Events");
        $("#titPref5").text("Emergency Directory");
        $("#titPref6").text("Hotels");
        $("#titPref7").text("Restaurants");
        $("#titPref8").text("Tours and more");
        $("#titPref9").text("How to use this app?");
        $("#titPref10").text("Questions or Comments");
        $("#titPref11").text("Write us at: ");
        $("#titPref12").text("Terms and Conditions");
        $("#titPref14").text("Terms and Conditions");

        $("#noResults").text("Sorry, we didn't find any results. Please try another search.");

        if (value) {
            $("#titPref13").text("Languaje");

        } else {
            window.localStorage.setItem("key", true);
            $("#titPref13").text("Idioma/Languaje");
        }
    }

    $.each($(".minfo"), function (i, dato) {
        dato.innerHTML = getMoreInformation(idioma);
    });

    if (currentTipo == "Hotel") {
        $("#titLista")[0].innerHTML = getHotels(idioma);
    }
    else if (currentTipo == "Restaurant") {
        $("#titLista")[0].innerHTML = getRestaurants(idioma);
    }
    else if (currentTipo == "Turistico") {
        $("#titLista")[0].innerHTML = getToursAndMore(idioma);
    }

    $('#slogan').attr("src", 'images/ExploraViveLoreto_' + lang + '.png');
    $('#menuTitle').attr("src", 'images/ExploraViveLoreto_' + lang + '.png');
    $('#logoexplora').attr("src", 'images/bglogo_logo_' + lang + '.png');
    $('#icoubicar').attr("src", 'images/ubicar2_' + lang + '.png');
    $('#icovermapa').attr("src", 'images/verenmapa_' + lang + '.png');

    $('#helpLogo').attr("src", 'images/ayuda_' + lang + '.png');
    $('#helpMessage').attr("src", 'images/ayuda_msg_' + lang + '.png');
    $('#helpF1Message').attr("src", 'images/f1_' + lang + '.png');
    $('#helpF2Message').attr("src", 'images/f2_' + lang + '.png');
    $('#helpF3Message').attr("src", 'images/f3_' + lang + '.png');
    $('#helpF4Message').attr("src", 'images/f4_' + lang + '.png');
    $('#helpF5Message').attr("src", 'images/f5_' + lang + '.png');

}

function getMoreInformation(lang) {
    var text = "Más Información";

    if (lang == "en") {
        text = "More Information";
    }

    return text;
}

function getZones(lang) {
    var text = "Zonas";

    if (lang == "en") {
        text = "Zones";
    }

    return text;
}

function getCategories(lang) {
    var text = "Categorías";

    if (lang == "en") {
        text = "Categories";
    }

    return text;
}

function getHotels(lang) {
    var text = "Hoteles";

    if (lang == "en") {
        text = "Hotels";
    }

    return text;
}

function getRestaurants(lang) {
    var text = "Restaurantes";

    if (lang == "en") {
        text = "Restaurants";
    }

    return text;
}

function getToursAndMore(lang) {
    var text = "Tours y más";

    if (lang == "en") {
        text = "Tours and more";
    }

    return text;
}

function updateLanguage(lang) {
    changeIdiomCustom(lang, false);
}

function updateTermsAndConditions() {
    showOverlay();

    $.ajax({
        cache: true,
        url: dominio + "termsAndConditions.php",
        data: {idioma: idioma},
        type: "POST",
        dataType: "json",
        async: true,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            hideOverlay();
        },
        success: function (datos) {
            hideOverlay();

            $("#termsAndConditionsBody").html(datos.text);
        }
    });
}

function updateData() {
    directorio();
    eventos();

    var tmp = viewStack.pop();
    var module = arrayTop(viewStack);
    viewStack.push(tmp);

    if (module != "") {
        if (module == "d_evento") {
            det_evento(currentId);
        }
        else if (module == "conoce") {
            $("#m_conoce").trigger("click");
        }
        else if (module == "d_conoce") {
            det_conoce(currentId);
        }
        else if (module == "busqueda") {
            if (module == "m1" || module == "l1") {
                $("#m_menu1").trigger("click");
            }
            else if (module == "m2" || module == "l2") {
                $("#m_menu2").trigger("click");
            }
            else if (module == "m3" || module == "l3") {
                $("#m_menu3").trigger("click");
            }
        }
        else if (module == "d_menu") {
            det_menu(currentId, currentTipo);
        }
    }
}

function getLoadingMesage(idioma) {
    var message = "";

    if (idioma == "en") {
        message = "Loading...";
    }
    else {
        message = "Cargando...";
    }

    return message;
}

function showResponse_agregar(responseText, statusText, xhr, $form) {
    $('#form_busqueda').resetForm();
    lista_establecomientos(currentTipo);
}

function showOverlay() {
    myApp.showPreloader();
    $(".modal-title").text(getLoadingMesage(idioma));
    $(".modal-overlay.modal-overlay-visible").show();
}

function hideOverlay() {
    myApp.hidePreloader();
    myApp.hidePreloader();
    myApp.hidePreloader();
    $(".modal-overlay.modal-overlay-visible").hide();
}

