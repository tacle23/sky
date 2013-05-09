google.load("jquery", "1.7.1");
google.load("jqueryui", "1.8.16");
google.load("maps", "3.x",  {
    other_params:"sensor=false&libraries=places"
});

var markers = [];
var infowindows = [];

google.setOnLoadCallback(function() {
	/* ALERT DEMO */
	$('#demo_alert a.accept').click(function(){
		$('#demo_alert').fadeOut('slow');
	});
	
	
	
	/* SALUDO INICIAL */
    var answer
    var timedate=new Date();
    if (timedate.getHours() <= 12 && timedate.getHours() > 5) {
        answer = 'Bom dia';
    }else{
        if (timedate.getHours() < 20 && timedate.getHours() > 12) {
            answer = 'Boa tarde';
        }else{
            answer='Boa noite';
        }
    }
    answer +=', sou o Agente Virtual da Sky. Em que posso ajudar?';
    var response = '<span class="respuesta_bot"><strong class="userName">SKY diz:</strong> <span>'+answer+'</span></span>';
    $("#dialogo").append(response);
	
	/* CONTAR CARACTERES MENSAJE */
	$('#msg').keyup(function(){
		contarMsg();
	});
	$('#msg').keydown(function(){
		contarMsg();
	});
	
	

    /*
                 * Controlamos el clic del boton enviar
                 */
    $('#btn_enviar').click(function() {
        if($("#msg").val() != "" && $("#msg").val() != "Escreva aqui sua consulta") {
            send();
        }
        else if($('#address').val() != '') {
            searchAddress('Boton enviar');
        }
    });

    $('#ver').click(function() {
        searchAddress('Boton ver');
    });

    /*
                 * Verificamos si el usuario presiona enter para
                 * enviar en mensaje
                 */
    $('#msg').bind('keyup', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
            send();
        }
    });

    $('#address').bind('keyup', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) {
            if($('#address').val() != '') {
                searchAddress('input address');
            }
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

    var input = document.getElementById('address');
    //var inputMap = document.getElementById('address-map');
    var options = {
        componentRestrictions: {
            country: 'ar'
        }
    };
    var autocomplete = new google.maps.places.Autocomplete(input,options);
    //var autocompleteMap = new google.maps.places.Autocomplete(inputMap,options);
    /*
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        //searchAddress('autocomplete');
    });
    */
/*
    google.maps.event.addListener(autocompleteMap, 'place_changed', function() {
        searchAddress('map');
    });
    */

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
    text = text.replace(/\n/g,"").replace(/\r/g,"");
    if(text!="") {
		$('#question1').val($('#question2').val());
		$('#question2').val(text);
		
		
        var request = '<span class="pregunta_user"><strong class="userName">Voc&ecirc; diz:</strong> <span>'+text+'</span></span>';
        var answerID = $('#answerID').val();
        var priContextID = $('#priContextID').val();
        var secContextID = $('#secContextID').val();
		var protocolID = $('#protocolID').val();
		var mediaID = $('#mediaID').val();
        var userLat = $('#userLat').val();
        var userLng = $('#userLng').val();
        $('#answerID').val("0");
        $('#priContextID').val("0");
        $('#secContextID').val("0");
		contarMsg();
        loadingOn();
        $("#dialogo").append(request);
        scrollDown();

        $.ajax({
            url: "../../response-api/response.php?ajax="+Math.round(Math.random()*99999),
            type: "POST",
            data: {
                priContextID: priContextID,
                secContextID: secContextID,
                sentence: text,
                answerID: answerID,
                protocolID: protocolID,
				mediaID: mediaID,
                userLat: userLat,
                userLng: userLng
            },
            dataType: "json",
            success: function(msg){
                var answerID=msg.answerID;
                var hasPattern=msg.hasPattern;
                var priContextID=msg.priContextID;
                var secContextID=msg.secContextID;
                var answer = msg.answer;
                if(hasPattern==0) {
                    var answerID=0;
                }


                $('#answerID').val(answerID);
                $('#priContextID').val(priContextID);
                $('#secContextID').val(secContextID);
                $('#showAddress').val('1');

                if (answer != "") {
					
                    var response = '<span class="respuesta_bot"><strong class="userName">SKY diz:</strong> <span>'+answer+'</span></span>';
                    if(msg.resultType == 2) {
                        $('#responseType').val(msg.resultType);
                        $('#diaDescuento').val('');
                        $('#rubroID').val(msg.result.rubroID);
                        $('#category').val(msg.result.category);
                    }
                    if(msg.resultType == 3) {
                        $('#diaDescuento').val(msg.result.dia);
                        $('#rubroID').val(0);
                        $('#category').val('');
                    }
                    if(msg.resultType == 4) {
                        $('#diaDescuento').val(0);
                        $('#rubroID').val(0);
                        $('#category').val('');
                        $('#marca').val(msg.result.marca);
                    }
					
					
					
					if(msg.patternID>0){
						$('#error').val('0');
						var messageCode = '';
						if(msg.extra.message) {
							messageCode = msg.extra.message;
						}
					
					
						// FEEDBACK: ME GUSTA - MULTIPLE NO
						//response += '<span class="calificar-respuesta"><span class="nogusta"><a href="javascript:void(0)" onclick="nogusta(this); qualify(\''+messageCode+'\',7,$(this))">NoGusta</a><span class="nogusta_resp"><ul><li><a href="javascript:void(0)" onclick="qualify(\''+messageCode+'\',4,$(this))">No me gusta</a></li><li><a href="javascript:void(0)" onclick="qualify(\''+messageCode+'\',5,$(this))">Falt&oacute; informaci&oacute;n</a></li><li><a href="javascript:void(0)" onclick="qualify(\''+messageCode+'\',6,$(this))">Respuesta incorrecta</a></li></ul></span></span><span class="megusta"><a href="javascript:void(0)" onclick="qualify(\''+messageCode+'\',3,$(this))">MeGusta</a></span></span>';
						
						// FEEDBACK: SI - NO
						response += '<span class="calificar-respuesta">Foi útil? <span><a href="javascript:void(0)" onclick="qualify(\''+messageCode+'\',1,$(this))">Sim</a></span> - <span><a href="javascript:void(0)" onclick="nogusta(this); qualify(\''+messageCode+'\',2,$(this))">Não</a><span class="nogusta_resp"><ul><li><a href="javascript:void(0)" onclick="qualify(\''+messageCode+'\',4,$(this))">Não gostei</a></li><li><a href="javascript:void(0)" onclick="qualify(\''+messageCode+'\',5,$(this))">Faltou informação</a></li><li><a href="javascript:void(0)" onclick="qualify(\''+messageCode+'\',6,$(this))">Resposta incorreta</a></li></ul></span></span></span>';
					
					}else{
						$('#error').val($('#error').val()+1);
						if($('#error').val()>1){
							//showChatHelp('atencion');
							$('#error').val('0');
						}
					}
					
                    response+="<br>";
                    
					
                    if(msg.extra.action){
						if(msg.extra.action == 'SearchAddress') {
							$('#msg').hide();
							$('#address').show();
							$('#address').focus();
							$('#responseType').val(msg.resultType);
	
							if (msg.extra.param != '') {
								$('#showAddress').val('0');
								$('#address').val(msg.extra.param);
								response="";
								searchAddress();
	
							}
						}
						if(msg.extra.action == 'PlayVideo') {
							showVideoHelp(msg.extra.param);
						}
						if(msg.extra.action == 'OpenChat') {
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
function nogusta(thiss){
	segundos = 10;
	$(thiss).parent().find('.nogusta_resp').fadeIn('slow');
	espera = function () {
	$(thiss).parent().find('.nogusta_resp').fadeOut('slow');
	clearInterval(a);
	};
	a = setInterval(espera, segundos*1000); 
}
function qualify(message,qualifyID,ob) {
	if(qualifyID!=7 && qualifyID!=2){
    	var parent=ob.parents('.calificar-respuesta');
		parent.html('<em class="thanks">Obrigado!</em>');
		parent.find('em.thanks').animate({right:10 }, "slow");
		
		segundos = 3;
		espera = function () {
			//alert(parent.html());
			//parent.fadeOut('slow');
			$('em.thanks').fadeOut('slow');
			//parent.hide();
			clearInterval(a);
		};
		a = setInterval(espera, segundos*1000); 
	}
    scrollDown()
    $.ajax({
        url: "../../response-api/qualify.php?ajax="+Math.round(Math.random()*99999),
        type: "POST",
        data: {
            message: message,
            qualifyID: qualifyID
        },
        dataType: "json",
        success: function(data){

        }
    });
}


// FEEDBACK: SI - NO
function qualify2(message,qualifyID,ob) {
	ob.parent().parent().hide('slow');
	scrollDown();
	$.ajax({
		url: "../../response-api/qualify.php?ajax="+Math.round(Math.random()*99999),
		type: "POST",
		data: {
			message: message,
			qualifyID: qualifyID
		},
		dataType: "json",
		success: function(data){

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
	if(IEversion()>7){
    	$('#preguntas a.write').attr('onClick','');
	}
    scrollDown();
}

function loadingOff(debug) {
    //alert("off: "+debug);
    $('#loading_chat').hide();
    $("#msg").removeAttr('disabled');
	if(IEversion()>7){
    	$('#preguntas a.write').attr('onClick','faqWrite(this)');
	}
    scrollDown();
}

var dealsPage = 3
function showDeals(msg,page,isNew,contenedor) {
    var response = '';
    //response+="<br>";

    if(isNew) {
        response+= '<div class="response-listado">';
    }
    var i = page * dealsPage;
    $.each(msg, function(key, val) {
        //alert(key);
        if ((i < ((page*dealsPage)+dealsPage)) && (key == i)) {
            
			response+= '<div class="title">';
            response+= val['marca'];
			if (val['imagenChica'] != '') {
                response+= '<img src="'+val['imagenChica']+'" alt="'+val['marca']+'" />';
            }
			response+= '</div>';
            response+= '<div>'+val['descripcionCorta']+'</div>';
            response+= '<div>'+val['direccion']+' - '+val['localidad']+' - '+val['provincia']+'</div>';
            response+= '<div>'+val['telefono']+'</div>';

            response+= '<hr />';
            i++;
        }
        
    //if (key>=((page*dealsPage)+dealsPage)) return false;
    });
    if(msg.length > dealsPage) {
        response+= '<div class="paginador">';
        if(page > 0) {
            response+= '<a href="javascript:void(0)" class="deals-anterior">Anterior</a>';
        }
        if(msg.length > i) {
            response+= '<a href="javascript:void(0)" class="deals-siguiente">Siguiente</a>';
        }
        response+= '</div><br />';
    }
    if(isNew) {
        response+= '</div>';
        $("#dialogo").append(response);
        $('.deals-siguiente:last').click(function() {
            showDeals(msg,page+1,false,$(this).parent().parent());
        });
    }
    else {
        contenedor.html(response);
        contenedor.find('.deals-siguiente').click(function() {
            showDeals(msg,page+1,false,$(this).parent().parent());
        });
        contenedor.find('.deals-anterior').click(function() {
            showDeals(msg,page-1,false,$(this).parent().parent());
        });
    }
	scrollDown();
}

function searchAddress(origen) {
    //alert(origen);
    var address = document.getElementById("address").value;
    var infowindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( {
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var arrAddress = results[0].address_components;
            // iterate through address_component array
            var country = '';
            $.each(arrAddress, function (i, address_component) {
                if (address_component.types[0] == "country") { // locality type
                    country = address_component.long_name;
                    return false; // break the loop
                }
                });
            if(country == "Argentina") {
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();

                $('#userLat').val(lat);
                $('#userLng').val(lng);
                $('#userAddress').val(results[0].formatted_address);
                $('#msg').show();
                $('#address').hide();
                //$('#address').val('');
                $('#msg').focus();
                if($('#responseType').val() == 1) {
                    Write(results[0].formatted_address);
                }
                if($('#responseType').val() == 2) {
                    mostrarRubro(results);
                }
                if($('#responseType').val() == 3) {
                    mostrarDescuentos(results);
                }
                if($('#responseType').val() == 4) {
                    mostrarMarca(results);
                }
            }
        } else {
            switch(status) {
                case 'ZERO_RESULTS':
                    alert('No se ha encontrado ningún resultado para esta solicitud');
                    break;
                case 'INVALID_REQUEST':
                    alert('La solicitud no es válida.');
                    break;
                case 'ERROR':
                    alert('Se ha producido un error al establecer la comunicaci&oacute;n con los servidores de Google.');
                    break;
                default:
                    alert("Se ha producido un error: " + status);
                    break;
            }
        }
    });
}

function mostrarRubro(results) {
    loadingOn();
    loadMap();

    var response = '<strong class="userName">Voc&ecirc; diz:</strong> <span>'+results[0].formatted_address+'</span><br />';
    if($('#showAddress').val() == 1) {
        $("#dialogo").append(response);
    }

    var radio = $('#radio').val();
    var rubroID = $('#rubroID').val();
    var category = $('#category').val();
    
    var data = {
        rubroID: rubroID,
        category: category,
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
        radio: radio
    }

    $.ajax({
        url: "../response-api/deals-rubro.php?ajax="+Math.round(Math.random()*99999),
        type: "POST",
        data: data,
        dataType: "json",
        success: function(msg){
            deleteOverlays();
            bounds = new google.maps.LatLngBounds();
            if(msg.length > 0) {
                mostrarEnMapa(msg);
                showDeals(msg,0,true,null);
            }
            else {
                response = '<span class="respuesta_bot"><strong class="userName">SKY diz:</strong> <span>No encontramos resultado en la direccion seleccionada</span></span><br />';
                $("#dialogo").append(response);
            }

            if(markers.length > 0) {
                map.fitBounds(bounds);
                if(map.zoom > 16) {
                    map.setZoom(16);
                }
            }

            loadingOff();
        }
    });
    

    loadingOff();
}

function mostrarDescuentos(results) {
    loadingOn();
    loadMap();
    var dia = $('#diaDescuento').val();
    var response = '<strong class="userName">Voc&ecirc; diz:</strong> <span>'+results[0].formatted_address+'</span><br />';
    $("#dialogo").append(response);

    var radio = $('#radio').val();

    var data = {
        day: dia,
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
        radio: radio
    }

    $.ajax({
        url: "../response-api/deals-day.php?ajax="+Math.round(Math.random()*99999),
        type: "POST",
        data: data,
        dataType: "json",
        success: function(msg){
            deleteOverlays();
            bounds = new google.maps.LatLngBounds();
            if(msg.length > 0) {
                mostrarEnMapa(msg);
                showDeals(msg,0,true,null);
            }
            else {
                response = '<span class="respuesta_bot"><strong class="userName">SKY diz:</strong> <span>No encontramos resultado en la direccion seleccionada</span></span><br />';
                $("#dialogo").append(response);
            }
            

            if(markers.length > 0) {
                map.fitBounds(bounds);
                if(map.zoom > 16) {
                    map.setZoom(16);
                }
            }

            loadingOff();
        }
    });

    loadingOff();
}

function mostrarMarca(results) {
    loadingOn();
    loadMap();
    var marca = $('#marca').val();
    var response = '<strong class="userName">Voc&ecirc; diz:</strong> <span>'+results[0].formatted_address+'</span><br />';
    $("#dialogo").append(response);
    
    var radio = $('#radio').val();
    
    var data = {
        name: marca,
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
        radio: radio
    }

    $.ajax({
        url: "../response-api/deals-name.php?ajax="+Math.round(Math.random()*99999),
        type: "POST",
        data: data,
        dataType: "json",
        success: function(msg){
            deleteOverlays();
            bounds = new google.maps.LatLngBounds();
            
            if(msg.length > 0) {
                mostrarEnMapa(msg);
                showDeals(msg,0,true,null);
            }
            else {
                response = '<span class="respuesta_bot"><strong class="userName">SKY diz:</strong> <span>No encontramos resultado en la direccion seleccionada</span></span><br />';
                $("#dialogo").append(response);
            }
            
            if(markers.length > 0) {
                map.fitBounds(bounds);
                if(map.zoom > 16) {
                    map.setZoom(16);
                }
            }

            loadingOff();
        }
    });
    

    loadingOff();
}


function loadMap() {
    $('#map_canvas').html();

    var myOptions = {
        zoom: 5,
        center: new google.maps.LatLng(-34, -64),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    }
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    
    
}

function mostrarEnMapa(result) {

    var pos = 0;
    $.each(result, function(key, val) {
        var contentString = '';
        var name = val['marca']
        contentString = '<div class="map-info">';



        contentString+= '<h3>'+val['marca']+'</h3>';
        if (val['imagenChica'] != '') {
            contentString+= '<div><img src="'+val['imagenChica']+'" alt="'+val['marca']+'" width="150" /></div>';
        }
        contentString+= '<div>'+val['descripcionCorta']+'</div>';
        contentString+= '<div>'+val['direccion']+' - '+val['localidad']+' - '+val['provincia']+'</div>';
        contentString+= '<div>'+val['telefono']+'</div>';
        contentString+= '</div>';

        var arrowSize = (val['latitud'].length && val['longitud'].length) ? 20 : 0;

        var infowindow = new InfoBubble({
            content: contentString,
            arrowStyle: 0,
            arrowSize: arrowSize,
            padding: 10,
            minWidth: 150
        //padding: 20,
        //minWidth: 300
        });

        infowindows[pos] = infowindow;

        var myLatlng = new google.maps.LatLng(val['latitud'],val['longitud']);
        bounds.extend(myLatlng);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: name
        });
        markers[pos]=marker;
        var posMaker = pos;
        google.maps.event.addListener(marker, 'click', function() {
            verMaker(posMaker);
        });
        pos++;
        
        
    });
}

function verMaker(i) {
    infoWindowsClose();
    if(markers[i]) {
        infowindows[i].open(map,markers[i]);
    //map.setZoom(16);
    }
    else {
        if(infowindows[i]) {
            infowindows[i].setPosition(map.getCenter());
            infowindows[i].open(map);
        }
    }
}
// Deletes all markers in the array by removing references to them.
function deleteOverlays() {
    clearOverlays();
    infoWindowsClose();
    markers = [];
    infowindows = [];
}
// Removes the overlays from the map, but keeps them in the array.
function clearOverlays() {
    setAllMap(null);
}
function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        if(markers[i]) {
            markers[i].setMap(map);
        }
    }
}
function infoWindowsClose() {
    for (var i = 0; i < infowindows.length; i++) {
        infowindows[i].close();
    }
}

function openActivity(){
	$(window.parent.document).find('#agentbotbox_main').css('width','824px');
}

function closeActivity(){
	$(window.parent.document).find('#agentbotbox_main').css('width','458px');
}

function showVideoHelp(code){
	openActivity();
	$('#solapa_video').fadeIn('slow');
	$('#video_canvas').html('<iframe width="332" height="300" frameborder="0" src="http://www.youtube.com/embed/'+code+'?rel=0&amp;autoplay=0&amp;wmode=transparent&amp;theme=light&amp;color=red" allowfullscreen></iframe>');
}
function hideVideoHelp(){
	$('#solapa_video').fadeOut('slow');
	$('#video_canvas').html('');
}

function showChatHelp(timeout){
	
	if(!timeout){ timeout=1000;}
	//openActivity();
	var time = new Date();
	window.setTimeout("loadChatHelp();",timeout);
	//loadChatHelp();
	//$('#chat_alert').fadeIn('slow');
}
function loadChatHelp(){
	var question1=escape($('#question1').val()); //ANTEULTIMA_PREGUNTA
	var question2=escape($('#question2').val()); //ULTIMA_PREGUNTA
	
	$('.print').hide();
	$('.email').hide();
	$('#cuerpo').hide();
	$('#solapa_chat').show();
	$('#header').hide();
	
	
	$('#chatHuman').attr('src','http://www10.directtalk.com.br/chat/?idd=132000063D07100148D3&idtemplate=20&especiais=Não&origem_loja=Sky_Directtalk&origem=Sky_Directtalk_Robo&nome_usuario=Test&email=pp@pp.com&pedido=&assunto=Test&cpf=&telefone=1111111111&dialogo='+question1+' - '+question2);
	
	/*$(window.parent.document).find('#agentbotbox_iframe').attr('style','margin: 0 auto; width: 287px; border: 0 none; display: block;');
	$(window.parent.document).find('#agentbotbox_content').attr('style','height:520px');
	
	$(window.parent.document).find('#agentbotbox_main').css('width','300px');
	$(window.parent.document).find('#agentbotbox_header').attr('style','width:298px; background: url("http://demo.agentbot.net/telefonica/channel/common/imgs/header-min.jpg") no-repeat;');*/
	/*$(window.parent.document).find('#agentbotbox_header .close').attr('style','left: auto; right: 3px;');	*/
	 
	//$('#header').addClass('min');
}

function contarMsg(){
	
	//$('#contador').text('Límite: '+$('#msg').val().length+'/100');
	$('#contador').text($('#msg').val().length+'/100');
	if($('#msg').val()=='Escreva aqui sua consulta'){$('#contador').text('');}
	if($('#msg').val().length==0){$('#contador').text('');}
	if($('#msg').val().length<50){ 
		$('#contador').removeClass('error');
		$('#contador').removeClass('warning');
		$('#contador').addClass('ok');
	}
	if($('#msg').val().length>=50){ 
		$('#contador').removeClass('error');
		$('#contador').removeClass('ok');
		$('#contador').addClass('warning');
	}
	if($('#msg').val().length>99){
		$('#contador').removeClass('warning');
		$('#contador').removeClass('ok');
		$('#contador').addClass('error');
	}
}

function IEversion(){
	var version=/*@cc_on function(){ switch(@_jscript_version){
case 1.0:return 3; case 3.0:return 4;case 5.0:return 5;
case 5.1:return 5; case 5.5:return 5.5; case 5.6:return 6;
case 5.7:return 7; }}()||@*/8;
	return version;
};