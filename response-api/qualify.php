<?php
if(isset($_REQUEST["message"],$_REQUEST["qualifyID"])) {
    include_once 'config.php';
    require_once 'curl.php';
    header('Content-type: application/json');
    $curl = new curl(array('debug' => false));
    
    $message=$_REQUEST['message'];
    $qualifyID = (int)$_REQUEST['qualifyID'];
    
    $params = array(
            'message' => $message,
            'qualifyID' => $qualifyID
        );
    
    $postdata = http_build_query($params);
    $response = $curl->post(QUALIFY, $postdata);
    
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
