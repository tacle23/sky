google.load("jquery", "1.7.1");

google.setOnLoadCallback(function() {
    /* LOAD PARAMETERS HUMAN CHAT */
    var idd = $('#idd').val();
    var origem = $('#origem').val();
    var email = $('#email').val();
    var customernr = $('#customernr').val();
    var nome_usuario = $('#nome_usuario').val();

    $('<form/>', {
        //'action': 'http://demonstracao.directtalk.com.br/chat/?idd=' + idd + '&idtemplate=' + template + '&origem=GloboEsporte_ROBO&origem_loja=GloboEsporte&nome_usuario=' + $('#chat_alert #nome').val() + '&cpf=' + $('#chat_alert #cpfCnpj').val() + '&email=' + $('#chat_alert #email').val() + '&pedido=' + $('#chat_alert #pedido').val() + '&assunto=' + $('#chat_alert #assunto').val(),
        //'action': 'http://www10.directtalk.com.br/chat31/?idd=' + idd + '&nome_usuario=' + nome_usuario + '&email=' + email + '&origem=' + origem + '&customernr=' + customernr,
        'action': 'http://demonstracao.directtalk.com.br/chat31/?idd=' + idd + '&nome_usuario=' + nome_usuario + '&email=' + email + '&origem=' + origem + '&customernr=' + customernr,
        'target': 'chatHuman',
        'method': 'post',
        'id': 'formChatHuman',
        'html': '<textarea name="dialogo" id="tdialogo"></textarea><input type="submit" />'
    }).appendTo('#solapa_chat');



    /* ALERT DEMO */
    $('#demo_alert a.accept').click(function() {
        $('#demo_alert').fadeOut('slow');
    });



    /* SALUDO INICIAL */
    var answer = 'Olá! Sou agente Virtual da SKY, uma novidade em nosso atendimento! Vou tentar esclarecer suas dúvidas e a qualquer momento você pode acessar o nosso chat. Combinado? Posso ajudar de que forma?';
    var response = '<span class="respuesta_bot"><strong class="userName">SKY diz:</strong> <span>' + answer + '</span></span>';
    $("#dialogo").append(response);

    /* CONTAR CARACTERES MENSAJE */
    $('#msg').keyup(function() {
        contarMsg();
    });
    $('#msg').keydown(function() {
        contarMsg();
    });



    /*
     * Controlamos el clic del boton enviar
     */
    $('#btn_enviar').click(function() {
        if ($("#msg").val() != "" && $("#msg").val() != "Escreva aqui sua consulta") {
            send();
        }

    });

    /*
     * Verificamos si el usuario presiona enter para
     * enviar en mensaje
     */
    $('#msg').bind('keyup', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            send();
        }
    });


    /******* ESCRIBA AQUI SU CONSULTA **********/
    $(".defaultText").focus(function(srcc)
    {
        if ($(this).val() == $(this)[0].title)
        {
            $(this).val("");
        }
        $(this).removeClass("defaultTextActive");
    });

    $(".defaultText").blur(function()
    {
        if ($(this).val() == "")
        {
            $(this).addClass("defaultTextActive");
            $(this).val($(this)[0].title);
        }
    });

    $(".defaultText").blur();

    //setTimeout("scrollDown()",250);
    $('.btn_cerrar_solapa').click(function() {
        $('#solapa_mapa').fadeOut('slow');
        closeActivity();
        hideVideoHelp();
        //parent.AgentBotBox.hideMap();
        loadingOff();
    });



});


/*
 * Scrooleamos la ventana de dialogo
 */
function scrollDown() {
    var scc = document.getElementById('scroll');
    scc.scrollTop = scc.scrollHeight + scc.offsetHeight;
}

/*
 * Funcion destina a copiar un dialogo automaticamente
 */
function Write(txt) {
    $("#msg").val(txt);
    send();
}

/*
 * Verifica el dialogo, envia la solicitud de respuesta
 * y la visualiza
 */
function send() {
    var text = $("#msg").val();
    $("#msg").val("");
    text = text.replace(/\n/g, "").replace(/\r/g, "");
    if (text != "") {
        $('#question1').val($('#question2').val());
        $('#question2').val(text);


        var request = '<span class="pregunta_user"><strong class="userName">Voc&ecirc; diz:</strong> <span>' + text + '</span></span>';
        var answerID = $('#answerID').val();
        var priContextID = $('#priContextID').val();
        var secContextID = $('#secContextID').val();
        var protocolID = $('#protocolID').val();
        var mediaID = $('#mediaID').val();
        $('#answerID').val("0");
        $('#priContextID').val("0");
        $('#secContextID').val("0");
        contarMsg();
        loadingOn();
        $("#dialogo").append(request);
        scrollDown();

        $.ajax({
            url: "../../response-api/response.php?ajax=" + Math.round(Math.random() * 99999),
            type: "POST",
            data: {
                priContextID: priContextID,
                secContextID: secContextID,
                sentence: text,
                answerID: answerID,
                protocolID: protocolID,
                mediaID: mediaID
            },
            dataType: "json",
            success: function(msg) {
                $('#footer .atendimento').css('display','inline-block');
                $('#tdialogo').val($('#tdialogo').val() + '\n\r' + $('<div>Você diz: ' + text + '</div>').text());
                $('#tdialogo').val($('#tdialogo').val() + '\n\r' + $('<div>Netshoes diz: ' + msg.answer + '</div>').text() + '\n\r' + '--------------------------');
                
                var answerID = msg.answerID;
                var hasPattern = msg.hasPattern;
                var priContextID = msg.priContextID;
                var secContextID = msg.secContextID;
                var answer = msg.answer;
                if (hasPattern == 0) {
                    var answerID = 0;
                }


                $('#answerID').val(answerID);
                $('#priContextID').val(priContextID);
                $('#secContextID').val(secContextID);
                $('#showAddress').val('1');

                if (answer != "") {

                    var response = '<span class="respuesta_bot"><strong class="userName">SKY diz:</strong> <span>' + answer + '</span></span>';
                    
                    if (msg.patternID > 0) {
                        $('#error').val('0');
                        var messageCode = '';
                        if (msg.extra.message) {
                            messageCode = msg.extra.message;
                        }


                        // FEEDBACK: ME GUSTA - MULTIPLE NO
                        response += '<span class="calificar-respuesta"><span class="nogusta"><a href="javascript:void(0)" onclick="nogusta(this); qualify(\''+messageCode+'\',7,$(this))">NoGusta</a><span class="nogusta_resp"><ul><li><a href="javascript:void(0)" onclick="qualify(\'' + messageCode + '\',4,$(this))">Não entendi a resposta</a></li><li><a href="javascript:void(0)" onclick="qualify(\'' + messageCode + '\',5,$(this))">Resposta incompleta</a></li><li><a href="javascript:void(0)" onclick="qualify(\'' + messageCode + '\',6,$(this))">Não foi isso que perguntei</a></li></ul></span></span><span class="megusta"><a href="javascript:void(0)" onclick="qualify(\''+messageCode+'\',3,$(this))">MeGusta</a></span></span>';

                        // FEEDBACK: SI - NO
                        //response += '<span class="calificar-respuesta">Foi útil? <span><a href="javascript:void(0)" onclick="qualify(\'' + messageCode + '\',1,$(this))">Sim</a></span> - <span class="nogusta"><span><a href="javascript:void(0)" onclick="nogusta(this); qualify(\'' + messageCode + '\',2,$(this))">Não</a><span class="nogusta_resp">\n\<ul><li><a href="javascript:void(0)" onclick="qualify(\'' + messageCode + '\',4,$(this))">Não entendi a resposta</a></li><li><a href="javascript:void(0)" onclick="qualify(\'' + messageCode + '\',5,$(this))">Resposta incompleta</a></li><li><a href="javascript:void(0)" onclick="qualify(\'' + messageCode + '\',6,$(this))">Não foi isso que perguntei</a></li></ul></span></span></span></span>';

                    } else {
                        $('#error').val($('#error').val() + 1);
                        if ($('#error').val() > 1) {
                            //showChatHelp('atencion');
                            $('#error').val('0');
                        }
                    }

                    //response += "<br>";


                    if (msg.extra.action) {
                        if (msg.extra.action == 'PlayVideo') {
                            showVideoHelp(msg.extra.param);
                        }
                        if (msg.extra.action == 'OpenChat') {
                            showChatHelp();
                            //$('#chat_alert .text').html(answer);
                        }
                    }
                    $("#dialogo").append(response);
                    //showChatHelp();
                    loadingOff();
                }
            },
            error: function() {
                var response = '<strong class="userName">SKY diz:</strong> <span>Em este momento não posso responder sua consulta, detectamos um problema de conexão, por favor, revise-la e volva a intenta-lo.</span><br />';
                $("#dialogo").append(response);
                loadingOff();
            }
        });
    }
}


// FEEDBACK: ME GUSTA - MULTIPLE NO
function nogusta(thiss) {
    segundos = 10;
    $(thiss).parent().find('.nogusta_resp').fadeIn('slow');
    espera = function() {
        $(thiss).parent().find('.nogusta_resp').fadeOut('slow');
        clearInterval(a);
    };
    a = setInterval(espera, segundos * 1000);
}
function qualify(message, qualifyID, ob) {
    if (qualifyID != 7 && qualifyID != 2) {
        var parent = ob.parents('.calificar-respuesta');
        parent.html('<em class="thanks">Obrigado!</em>');
        parent.find('em.thanks').fadeIn("slow");

        segundos = 3;
        espera = function() {
            $('em.thanks').fadeOut('slow');
            parent.remove()
        };
        ;
        setTimeout(espera, segundos * 1000);
    }
    scrollDown()
    $.ajax({
        url: "../../response-api/qualify.php?ajax=" + Math.round(Math.random() * 99999),
        type: "POST",
        data: {
            message: message,
            qualifyID: qualifyID
        },
        dataType: "json",
        success: function(data) {
            if(data.bypass){
                if(data.bypass.bypass){
                    if(data.bypass.case_number){
                        $('#case_number').val(data.bypass.bypass.case_number);
                        var response = '<span class="respuesta_bot"><strong class="userName">SKY diz:/<strong> <span>'+data.bypass.bypassText+'</span></span>';
                        $("#dialogo").append(response);
                        showChatHelp();
                    }
                }
            }
        }
    });
}


// FEEDBACK: SI - NO
function qualify2(message, qualifyID, ob) {
    ob.parent().parent().hide('slow');
    scrollDown();
    $.ajax({
        url: "../../response-api/qualify.php?ajax=" + Math.round(Math.random() * 99999),
        type: "POST",
        data: {
            message: message,
            qualifyID: qualifyID
        },
        dataType: "json",
        success: function(data) {

        }
    });
}

function faqWrite(ethis) {
    Write($(ethis).text());
}

function loadingOn() {
    //alert("on");
    $('#loading_chat').show();
    $("#msg").attr('disabled', true);
    if (IEversion() > 7) {
        $('#preguntas a.write').attr('onClick', '');
    }
    scrollDown();
}

function loadingOff(debug) {
    //alert("off: "+debug);
    $('#loading_chat').hide();
    $("#msg").removeAttr('disabled');
    if (IEversion() > 7) {
        $('#preguntas a.write').attr('onClick', 'faqWrite(this)');
    }
    scrollDown();
}

function openActivity() {
    $(window.parent.document).find('#agentbotbox_main').css('width', '824px');
}

function closeActivity() {
    $(window.parent.document).find('#agentbotbox_main').css('width', '458px');
}

function showVideoHelp(code) {
    openActivity();
    $('#solapa_video').fadeIn('slow');
    $('#video_canvas').html('<iframe width="332" height="300" frameborder="0" src="http://www.youtube.com/embed/' + code + '?rel=0&amp;autoplay=0&amp;wmode=transparent&amp;theme=light&amp;color=red" allowfullscreen></iframe>');
}
function hideVideoHelp() {
    $('#solapa_video').fadeOut('slow');
    $('#video_canvas').html('');
}

function showChatHelp(timeout) {

    if (!timeout) {
        timeout = 1000;
    }
    //openActivity();
    var time = new Date();
    window.setTimeout("loadChatHelp();", timeout);
    //loadChatHelp();
    //$('#chat_alert').fadeIn('slow');
}
function loadChatHelp() {
    $('#footer .atendimento').css('display','none');
    var question1 = escape($('#question1').val()); //ANTEULTIMA_PREGUNTA
    var question2 = escape($('#question2').val()); //ULTIMA_PREGUNTA

    $('.print').hide();
    $('.email').hide();
    $('#cuerpo').hide();
    $('#solapa_chat').show();
    $('#header').hide();
    
    $('#solapa_chat form').submit();

    //$('#chatHuman').attr('src', 'http://www10.directtalk.com.br/chat/?idd=132000063D07100148D3&idtemplate=20&especiais=Não&origem_loja=Sky_Directtalk&origem=Sky_Directtalk_Robo&nome_usuario=Test&email=pp@pp.com&pedido=&assunto=Test&cpf=&telefone=1111111111&dialogo=' + question1 + ' - ' + question2);

    /*$(window.parent.document).find('#agentbotbox_iframe').attr('style','margin: 0 auto; width: 287px; border: 0 none; display: block;');
     $(window.parent.document).find('#agentbotbox_content').attr('style','height:520px');
     
     $(window.parent.document).find('#agentbotbox_main').css('width','300px');
     $(window.parent.document).find('#agentbotbox_header').attr('style','width:298px; background: url("http://demo.agentbot.net/telefonica/channel/common/imgs/header-min.jpg") no-repeat;');*/
    /*$(window.parent.document).find('#agentbotbox_header .close').attr('style','left: auto; right: 3px;');	*/

    //$('#header').addClass('min');
}

function contarMsg() {

    //$('#contador').text('Límite: '+$('#msg').val().length+'/100');
    $('#contador').text($('#msg').val().length + '/100');
    if ($('#msg').val() == 'Escreva aqui sua consulta') {
        $('#contador').text('');
    }
    if ($('#msg').val().length == 0) {
        $('#contador').text('');
    }
    if ($('#msg').val().length < 50) {
        $('#contador').removeClass('error');
        $('#contador').removeClass('warning');
        $('#contador').addClass('ok');
    }
    if ($('#msg').val().length >= 50) {
        $('#contador').removeClass('error');
        $('#contador').removeClass('ok');
        $('#contador').addClass('warning');
    }
    if ($('#msg').val().length > 99) {
        $('#contador').removeClass('warning');
        $('#contador').removeClass('ok');
        $('#contador').addClass('error');
    }
}

function IEversion() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : 8;
}
;