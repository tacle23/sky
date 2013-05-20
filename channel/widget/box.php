<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link href="../common/css/base.css?x=1" rel="stylesheet" media="all" type="text/css" />
        <script type="text/javascript" src="http://www.google.com/jsapi"></script>
        <script type="text/javascript" src="../common/js/function.js?x=2"></script>

        <title>Sky</title>
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
                            $priContextID = 0;
                            $secContextID = 0;
                            $answerID = 0;
                            if (isset($_SESSION["response"])) {
                                foreach ($_SESSION["response"] as $response) {
                                    ?>
                                    <strong class="userName">Voc&ecirc; diz::</strong> <span><?= $response["sentence"] ?></span><br />
                                    <?
                                    if ($response["answer"] != "") {
                                        ?>
                                        <span class="respuesta_bot"><strong class="userName">SKY diz:</strong> <span><?= $response["answer"] ?></span></span><br />
                                        <?
                                    }
                                    $priContextID = $response["priContextID"];
                                    $secContextID = $response["secContextID"];
                                    $answerID = $response["answerID"];
                                }
                            }
                            ?>
                        </div>
                    </div>
                </div>

                <div style="overflow:hidden;">
                    <div id="box-input">
                        <textarea id="msg" name="msg" title="Escreva aqui sua consulta" class="defaultText"></textarea>
                        <input id="priContextID" type="hidden" value="<?= $priContextID ?>" />
                        <input id="secContextID" type="hidden" value="<?= $secContextID ?>" />
                        <input id="answerID" type="hidden" value="<?= $answerID ?>" />
                        <input id="protocolID" type="hidden" value="3" />
                        <input id="mediaID" type="hidden" value="<?php echo isset($_GET['media']) ? $_GET['media'] : 0; ?>" />
                        <input id="idd" type="hidden" value="<?=isset($_GET['idd']) ? $_GET['idd'] : ''; ?>" />
                        <input id="origem" type="hidden" value="<?=isset($_GET['origem']) ? $_GET['origem'] : ''; ?>" />
                        <input id="email" type="hidden" value="<?=isset($_GET['email']) ? $_GET['email'] : ''; ?>" />
                        <input id="customernr" type="hidden" value="<?=isset($_GET['customernr']) ? $_GET['customernr'] : ''; ?>" />
                        <input id="nome_usuario" type="hidden" value="<?=isset($_GET['nome_usuario']) ? $_GET['nome_usuario'] : ''; ?>" />
                        
                        <input id="question1" type="hidden" value="" />
                        <input id="question2" type="hidden" value="" />
                        <input id="error" type="hidden" value="" />
                    </div>
                    <a href="#" id="btn_enviar">Enviar</a>
                </div>

                <span id="loading_chat"><img src="../common/imgs/loading_chat.gif" alt="Cargando" width="40" height="7" /> buscando</span>
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
                <iframe src="" id="chatHuman" name="chatHuman" width="457" height="548"></iframe>
            </div>
            <!-- FIN SOLAPA CHAT -->


            <!-- FOOTER -->
            <div id="footer">
                <span class="sair"><a href="javascript:void(0)" onclick="window.close()"><img src="../common/imgs/sair.jpg" alt="" /></a></span>
                <span class="atendimento"><a href="javascript:void(0)" onclick="loadChatHelp()"><img src="../common/imgs/atendimento.jpg" alt="" /></a></span>
                <span class="dtagentbot"><a href="http://www.agentbot.net" target="_blank"><img src="../common/imgs/dtagentbot.png" alt="" /></a></span>
            </div>
            <!-- FOOTER -->
        </div>
    </body>
</html>
