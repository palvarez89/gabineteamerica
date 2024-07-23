"use strict";

var actionAceptar = "cerrar",
        actionCerrar = "cerrar",
        cookieTime = 100000,
        cookieType = "persistente",
        showAvisoCookiesOnlyOneTime = true,
        COOKIES_POLICY_COOKIE_NAME = "COOKIES_POLICY", /*Nombre de la cookie de sesión que indica que la política de cookies ha sido aceptada por parte del usuario.*/
        COOKIES_POLICY_COOKIE_VALUE = "true", /*Valor de la cookie de sesión que indica que la política de cookies ha sido aceptada por parte del usuario.*/
        SESSIONCOOKIETYPE = "sesion",
        PERSISTANTCOOKIETYPE = "persistente",
        ACEPTAR = "aceptar",
        CERRAR = "cerrar";

/*La función getCookie devuelve el valor de la cookie cuyo nombre se corresponde con el indicado como parámetro (cookieName)*/
function getCookie(cookieName) {
    var c_value = document.cookie,
            c_start = c_value.indexOf(" " + cookieName + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(cookieName + "=");
    }
    if (c_start == -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

/*La función setCookie crea un cookie según los parámetros especificacos:
 - cookieName: Indica el nombre de la cookie.
 - value: Indica el valor de la cookie.
 - domain: Indica el dominio de validez de la cookie. Si no se especifica, el dominio de validez será la página actual.
 - exDays: Indica el número de días de validez de la cookie (a partir del día de hoy). Si no se especifica, se crea una cookie de sesión.*/
function setCookie(cookieName, value, domain, exDays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exDays);
    var cookieValue = escape(value) + ((exDays == null) ? "" : "; expires=" + exdate.toUTCString()) + ((domain == null) ? "" : "; path=" + domain);
    document.cookie = cookieName + "=" + cookieValue;
}

function executeAction(action) {
    switch (action) {
        case ACEPTAR:
            $(".cookie-wrapper").slideUp(500, function () {
                $(this).remove();
            });
            if (!showAvisoCookiesOnlyOneTime) {
                if (cookieType == SESSIONCOOKIETYPE) {
                    setCookie(COOKIES_POLICY_COOKIE_NAME, COOKIES_POLICY_COOKIE_VALUE, "/", null);
                } else {
                    setCookie(COOKIES_POLICY_COOKIE_NAME, COOKIES_POLICY_COOKIE_VALUE, "/", cookieTime);
                }
            }
            break;
        case CERRAR:
            $(".cookie-wrapper").slideUp(500);
            break;
    }
}
/*La función processCookieNotification evalúa si se ha de mostrar el aviso de cookies; en cuyo caso, lo muestra.*/
function processCookieNotification() {
    var cookieValue = getCookie(COOKIES_POLICY_COOKIE_NAME);
    if (cookieValue != null && cookieValue != "") {
        /*Si existe la cookie significa que se ha aceptado la política de cookies, por lo que se elimina el aviso de cookies*/
        $(".cookie-wrapper").remove();
    } else {
        /*Si no existe la cookie significa que no se ha aceptado la política de cookies, por lo que no se elimina el aviso de cookies, sino que se añaden los eventos de los botones. Los eventos de los botones se añaden mediante JavaScript ya que, si el cliente no dispone de JavaScript, el aviso de cookies no podrá ser eliminado en caso de aceptar la política de cookies. Esto se debe a que la cookie de sesión que indica que la política ha sido aceptada se crea mediante JavaScript. Por tanto, el aviso será meramente informativo, sin antender a las interacciones del usuario.*/
        $(".cookie-wrapper").css("display", "block").slideDown(500);
        /*Si solo se quiere mostrar el aviso de cookies la primera vez que se acceda, se crea la cookie*/
        if (showAvisoCookiesOnlyOneTime) {
            if (cookieType == SESSIONCOOKIETYPE) {
                setCookie(COOKIES_POLICY_COOKIE_NAME, COOKIES_POLICY_COOKIE_VALUE, "/", null);
            } //Se crea una cookie de sesión
            else {
                setCookie(COOKIES_POLICY_COOKIE_NAME, COOKIES_POLICY_COOKIE_VALUE, "/", cookieTime);
            } //Se crea una cookie permanente
        }
        $("a.aceptar-cookies").click(function (event) {
            event.preventDefault();
            executeAction(actionAceptar);
        });
        $("a.cerrar").click(function (event) {
            event.preventDefault();
            executeAction(actionCerrar);
        });
    }
}

function getBaseURL() {
    var url = location.href, /* entire url including querystring - also: window.location.href; */
            baseURL = url.substring(0, url.indexOf("/", 14));
    if (baseURL.indexOf("http://localhost") != -1) {
        // Base Url for localhost
        var pathname = location.pathname, /* window.location.pathname; */
                index1 = url.indexOf(pathname),
                index2 = url.indexOf("/", index1 + 1),
                baseLocalUrl = url.substr(0, index2);
        return baseLocalUrl + "/";
    } else {
        // Root Url for domain name
        return baseURL + "/";
    }
}

// Copyright 2014-2015 Twitter, Inc.
// Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style')
    msViewportStyle.appendChild(
            document.createTextNode(
                    '@-ms-viewport{width:auto!important}'
                    )
            )
    document.querySelector('head').appendChild(msViewportStyle)
}
$(function () {
    var nua = navigator.userAgent
    var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1)
    if (isAndroid) {
        $('select.form-control').removeClass('form-control').css('width', '100%')
    }
});

$(document).ready(function () {
    $("input:file").on("change",function(){
        var ext = $(this)[0].files[0].name.substring($(this)[0].files[0].name.lastIndexOf('.'));
        if(ext == '.pdf' || ext == '.doc' || ext == '.docx' || ext == '.odt'){
            $(".nombre-archivo").val($(this)[0].files[0].name);
        }else{
            alert("Tipo de archivo no admitido");
            $(this)[0].value="";
            $(this)[0].files[0].name="";
            
        }
        //$(".nombre-archivo").val($(this)[0].files[0].name);
    });
    if ($(".cookie-wrapper").length > 0) {
        processCookieNotification();
    } //Si el aviso de cookies no se está mostrando, no se ejecuta el código JavaScript asociado.
    
    /* Translated default messages for the jQuery validation plugin. Locale: ES (Spanish; Español) */
    $.extend($.validator.messages, {
        required: "Este campo es obligatorio.",
        remote: "Por favor, rellena este campo.",
        email: "Por favor, escribe una dirección de correo válida.",
        url: "Por favor, escribe una URL válida.",
        date: "Por favor, escribe una fecha válida.",
        dateISO: "Por favor, escribe una fecha (ISO) válida.",
        number: "Por favor, escribe un número válido.",
        digits: "Por favor, escribe sólo dígitos.",
        creditcard: "Por favor, escribe un número de tarjeta válido.",
        equalTo: "Por favor, escribe el mismo valor de nuevo.",
        extension: "Por favor, escribe un valor con una extensión aceptada.",
        maxlength: $.validator.format("Por favor, no escribas más de {0} caracteres."),
        minlength: $.validator.format("Por favor, no escribas menos de {0} caracteres."),
        rangelength: $.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
        range: $.validator.format("Por favor, escribe un valor entre {0} y {1}."),
        max: $.validator.format("Por favor, escribe un valor menor o igual a {0}."),
        min: $.validator.format("Por favor, escribe un valor mayor o igual a {0}."),
        nifES: "Por favor, escribe un NIF válido.",
        nieES: "Por favor, escribe un NIE válido.",
        cifES: "Por favor, escribe un CIF válido."
    });

    $('#formContacto').validate({
        // Add requirements to each of the fields
        rules: {
            nombre: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            consulta: {
                required: true
            }
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            if ($("#politicaLegal").is(":checked")) {
                var datos = $(form).serialize();
                $(".info-contacto").addClass("d-none");
                $("#contactoMsgEspera").removeClass("d-none");
                $.ajax({
                    type: "POST",
                    url: phpConfiguracion.url + "ajax/ajEnviarCorreo.php",
                    data: datos
                }).done(function (data) {
                    $(".info-contacto").addClass("d-none");
                    switch (data) {
                        case 'ok':
                            $("#contactoMsgOk").removeClass("d-none");
                            break;
                        case 'error':
                        case 'error_formulario':
                            $("#contactoMsgError").removeClass("d-none");
                            break;
                        case 'error_captcha':
                            $("#contactoMsgErrorCaptcha").removeClass("d-none");
                            break;
                        default:
                            alert("Error");
                            break;
                    }
                });
            } else {
                $(".info-contacto").addClass("hidden");
                $("#msgTerminos").removeClass("d-none");
            }
        }
    });
    
    $('#formEmpleo').validate({
        // Add requirements to each of the fields
        rules: {
            nombre: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            consulta: {
                required: true
            }
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            if ($("#politicaLegal").is(":checked")) {
                var datos = $(form).serialize();
                
                $(".info-contacto").addClass("d-none");
                $("#contactoMsgEspera").removeClass("d-none");
                $.ajax({
                    type: "POST",
                    url: phpConfiguracion.url + "ajax/ajEnviarEmpleo.php",
                    data: new FormData(form),
                    contentType: false,
                    cache: false,
                    processData:false
                }).done(function (data) {
                    $(".info-contacto").addClass("d-none");
                    switch (data) {
                        case 'ok':
                            $("#contactoMsgOk").removeClass("d-none");
                            break;
                        case 'error':
                        case 'error_formulario':
                            $("#contactoMsgError").removeClass("d-none");
                            break;
                        case 'error_captcha':
                            $("#contactoMsgErrorCaptcha").removeClass("d-none");
                            break;
                        default:
                            alert("Error");
                            break;
                    }
                });
            } else {
                $(".info-contacto").addClass("hidden");
                $("#msgTerminos").removeClass("d-none");
            }
        }
    });
});
//opciones jQuery validate
jQuery.validator.setDefaults({
    ignore: ":hidden:not(select)",
    errorElement: "span",
    errorClass: "help-inline",
    highlight: function (element, errorClass, validClass) {
        $(element).closest('.control-group').addClass('error');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).closest('.control-group').removeClass('error');
    },
    errorPlacement: function (error, element) {
        if (element.parent('.input-group').length || element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});


/*** añadido ***/

//Slider paginas
$('.slider').slick({
    autoplay: true,
    autoplaySpeed: 6000,
    easing: 'easeInOutCubic',
    speed: 800,
    adaptiveHeight: true,
    dots: false,
    arrows: false,
    fade: true
});

//Anclas animados
$('.ancla').click(function (e){
    e.preventDefault();
    var id=$(this).attr('href');
    var aTag = $(id).offset().top - 86;
    $('html,body').animate({scrollTop: aTag},600, 'easeOutCubic');
});


//Desplegar menu principal
var cabMenu = $('.menu-principal');
$('#menu').click(function (e){
    e.preventDefault();
    e.stopPropagation();
    cabMenu.toggleClass('visible');
});
$('body').click(function (){
    cabMenu.removeClass('visible');
});
$('#cerrarMenu').click(function (){
    cabMenu.removeClass('visible');
});
cabMenu.click(function (e){
    e.stopPropagation();
});
//Submenu móvil
$('.menu-principal > li.submenu > a').click(function (e){
    e.preventDefault();
    if ( $(document).width() < 1199 ) {
        $(this).next('ul').slideToggle();
    }
});
$(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        cabMenu.removeClass('visible');
    }
});


//Parallax (Stellar.js)
//$(function(){
//    $.stellar({
//        horizontalScrolling: false,
//        verticalOffset: 0
//    });
//});

// initialize paroller.js
//$(window).paroller();


//lanzar efectos de entrada
var altoScroll = 0;
$(document).scroll(lanzaEfecto);
$(document).ready(lanzaEfecto);
function lanzaEfecto() {
    altoScroll = $(document).scrollTop();
    $('.anim').each(function (i, e) {
        var altoTotal = altoScroll + $(window).height() - 100;
        if ( $(e).offset().top < altoTotal) {
            $(e).addClass('visible');
        }
    });
}



//Cabecera fija al bajar
$(document).ready(controlCabecera);
$(document).scroll(controlCabecera);
function controlCabecera() {
    if ($(window).scrollTop() > 300) {
        $('.cabecera').addClass('fija');
    } else {
        $('.cabecera').removeClass('fija');
    }
}


//Abrir lightbox
//Esto es para poder hacer click dentro del slider, llamando a los enlaces de lightbox que estan fuera del mismo. De esta manera evitamos el duplicado de capas
$('.abrir-lightbox').click(function (e){
    e.preventDefault();
    var idAbrir = $(this).attr('href');
    $(idAbrir).click();
});


//Buscador
$('#botonBuscar').click(function (){
    $('.modbuscar').addClass('visible');
    setTimeout(function (){
        $('.modbuscar').find('input').focus();
    }, 300);
});
$('.modbuscar-cerrar-buscador').click(function (){
    $('.modbuscar').removeClass('visible');
});
$(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        $('.modbuscar').removeClass('visible');
    }
});
