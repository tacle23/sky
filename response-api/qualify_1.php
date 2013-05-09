<?php
if(isset($_REQUEST["message"],$_REQUEST["qualifyID"])) {
    include_once 'config.php';
    header('Content-type: application/json');
    ini_set("soap.wsdl_cache_enabled", "0");
    $api = new SoapClient(API);
    $message=$_REQUEST['message'];
    $qualifyID = (int)$_REQUEST['qualifyID'];
    $response=$api->qualify($message, $qualifyID);
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
}
?>
