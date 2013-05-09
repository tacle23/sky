<?php
session_start();
header('Content-type: application/json');
if (isset($_POST["qr"])) {
    include_once 'config.php';
	
	$protocol = $_POST['protocolID'];
	$media = isset($_POST["media"]) ? $_POST["media"] : '0';
	$token = isset($_POST["media"]) ? md5(BOT.'-'.$protocol.'-'.$_POST["media"]) : md5(BOT.'-'.$protocol);
	$qr=$_REQUEST['qr']; 
    
    $params = array(
        'token' => $token,
        'qr' => $qr
    );
	//print_r($params);
    $postdata = http_build_query($params);
    require_once 'curl.php';
    $curl = new curl(array('debug' => false));
    $result = $curl->post(QRCODE, $postdata);
    echo $result;
} else {
    echo json_encode(array('error' => 1));
}
/*

if(isset($_REQUEST["qr"])) {
    include_once 'config.php';
    header('Content-type: application/json');
    ini_set("soap.wsdl_cache_enabled", "0");
    $api = new SoapClient(API);
    $qr=$_REQUEST['qr'];
    $response=$api->decodeQrQuestion(TOKEN,$qr);
	//$response='[{"mediaQrID":"1","question":"\u00bfD\u00f3nde puedo encontrar talleres oficiales Fiat?"}]';
	
    echo $response;
}
else {
    header('HTTP/1.1 403 Forbidden');
    echo("<html>
        <head>
        <title>403 Forbidden</title>
        </head>
        <body>
        <h1>Forbidden</h1>
        <p>You are not authorized to perform this action.</p>
        <hr>
        <address>agentbot.net - ".date(DATE_ATOM)."</address>
        </body>
        </html>");
}*/
?>
