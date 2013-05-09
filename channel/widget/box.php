<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link href="../common/css/base.css?x=1" rel="stylesheet" media="all" type="text/css" />
        <!--script type="text/javascript" src="../common/js/cufon-yui.js"></script>
        <script type="text/javascript" src="../common/js/Myriad_Pro_BoldCond.js"></script>
        <script type="text/javascript" src="../common/js/cufon_replace.js"></script-->
        <script type="text/javascript" src="../common/js/infobubble-compiled.js"></script>
		<script type="text/javascript" src="http://www.google.com/jsapi"></script>
        <script type="text/javascript" src="../common/js/function.js?x=1"></script>

        <title>Sky Directtalk</title>
    </head>

    <body>
        <div id="wrapper">
        	<div id="header"><a class="logo" href="http://www.sky.com.br" target="_blank"></a></div>
            <!-- CUERPO -->
            <div id="cuerpo">
                <div id="box-dialogo">
                    <div id="scroll">
                        <div id="dialogo">
                            <?
                            $priContextID=0;
                            $secContextID=0;
                            $answerID=0;
                            if(isset($_SESSION["response"])) {
                                foreach($_SESSION["response"] as $response) {

                                    ?>
                            <strong class="userName">Voc&ecirc; diz::</strong> <span><?=$response["sentence"]?></span><br />
                                    <?
                                    if ($response["answer"] != "") {
                                        ?>
                            <span class="respuesta_bot"><strong class="userName">SKY diz:</strong> <span><?=$response["answer"]?></span></span><br />
                                        <?
                                    }
                                    $priContextID=$response["priContextID"];
                                    $secContextID=$response["secContextID"];
                                    $answerID=$response["answerID"];
                                }
                            }
                            ?>
                        </div>
                    </div>
                </div>

                <div style="overflow:hidden;">
                    <div id="box-input">
                        <textarea id="msg" name="msg" title="Escreva aqui sua consulta" class="defaultText"></textarea>
                        <input id="address" name="address" type="text" value="" />
                        <input id="priContextID" type="hidden" value="<?=$priContextID?>" />
                        <input id="secContextID" type="hidden" value="<?=$secContextID?>" />
                        <input id="answerID" type="hidden" value="<?=$answerID?>" />
                        <input id="protocolID" type="hidden" value="3" />
                        <input id="mediaID" type="hidden" value="<?php echo isset($_GET['media']) ? $_GET['media'] : 0; ?>" />
                        <input id="userLat" type="hidden" value="" />
                        <input id="userLng" type="hidden" value="" />
                        <input id="userAddress" type="hidden" value="" />
                        <input id="showAddress" type="hidden" value="1" />
                        <input id="responseType" type="hidden" value="" />
                        <input id="diaDescuento" type="hidden" value="0" />
                        <input id="rubroID" type="hidden" value="0" />
                        <input id="category" type="hidden" value="" />
                        <input id="marca" type="hidden" value="" />
                        <input id="question1" type="hidden" value="" />
                        <input id="question2" type="hidden" value="" />
                        <input id="error" type="hidden" value="" />
                    </div>
                    <a href="#" id="btn_enviar">Enviar</a>
                </div>

                <span id="loading_chat"><img src="../common/imgs/loading_chat.gif" alt="Cargando" width="40" height="7" /></span>
                <span id="contador"></span>
                <div id="demo_alert">
                	<p>
                    	Você esta por aceder a uma versão DEMO de AgentBot, é uma versão reduzida do desarrolho final. Tenha em conta que AgentBot melhora seu entendimento com o correr do tempo e o uso. O conteúdo de este Demo se encontra no seguinte link:
                    	<br /><br />
                    	<a href="http://go.aivo.co/resolvidonetshoes" target="_blank">http://go.aivo.co/resolvidonetshoes</a>.
                    </p>
                    <a href="javascript:void(0)" class="accept">Entendo e aceito</a>
                </div>
            </div>
            <!-- FIN CUERPO -->
            
            <!-- SOLAPA CHAT -->
            <div id="solapa_chat" style="display:none">
                <iframe src="" id="chatHuman" width="457" height="548"></iframe>
            </div>
            <!-- FIN SOLAPA CHAT -->
            
            
            <!-- FOOTER -->
            <div id="footer">
                <span class="dtagentbot"><a href="http://www.agentbot.net" target="_blank"><img src="../common/imgs/dtagentbot.png" alt="" /></a></span>
            </div>
            <!-- FOOTER -->
        </div>
    </body>
</html>
