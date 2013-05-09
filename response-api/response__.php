<?php
set_time_limit(20);
if(isset($_POST["priContextID"],$_POST["secContextID"],$_POST["sentence"],$_POST["answerID"],$_POST["protocolID"],$_POST["mediaID"])) {
    try {
        include_once 'config.php';
        header('Content-type: application/json');
		ini_set("soap.wsdl_cache_enabled", "0");
        $api = new SoapClient(API);
		$protocol=(int)$_POST['protocolID'];
        $media = (int)$_POST['mediaID'];
		$session_name=COOKIE_NAME."-".$protocol."-".$media."-s";
        $cookie_name=COOKIE_NAME."-".$protocol."-".$media."-c";

        session_name($session_name);
        session_start();

		if(!isset($_SESSION["hash"])) {
			if(isset($_COOKIE[$cookie_name])) {
				$hash = $_COOKIE[$cookie_name];
			}
			else {
				$hash = uniqid();
			}
			
        }
		else {
			$hash = $_SESSION["hash"];
		}
		$_SESSION["hash"] = $hash;
		setcookie($cookie_name, $hash, COOKIE_EXPIRE, "/" );
		        
        $IP=getRealIP();
        $mail='';
        $name='';
        $sentence = $_POST['sentence'];
        $priContextID = $_POST['priContextID'];
        $secContextID = $_POST['secContextID'];
        $answerID = $_POST['answerID'];

        $response=$api->msg(TOKEN,$hash, $mail, $name, $protocol, $media, $IP , $sentence, $priContextID, $secContextID, $answerID);
		
		$response->extra = json_decode($response->extra);
        echo json_encode($response);
        
    } catch (Exception $exc) {
        $error=array(
                'answerID' => 0,
                'hasPattern' => 0,
                'priContextID' => 0,
                'secContextID' => 0,
                'answer' => 'Me podrias repetir la consulta',
                'resultType' => 1
        );
        echo json_encode($error);
        print_r($exc);
    }
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

function getRealIP() {

    if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && $_SERVER['HTTP_X_FORWARDED_FOR'] != '') {
        $client_ip =
                (!empty($_SERVER['REMOTE_ADDR']) ) ?
                $_SERVER['REMOTE_ADDR'] :
                ( (!empty($_ENV['REMOTE_ADDR']) ) ?
                $_ENV['REMOTE_ADDR'] :
                "unknown" );

        // los proxys van a�adiendo al final de esta cabecera
        // las direcciones ip que van "ocultando". Para localizar la ip real
        // del usuario se comienza a mirar por el principio hasta encontrar
        // una direcci�n ip que no sea del rango privado. En caso de no
        // encontrarse ninguna se toma como valor el REMOTE_ADDR

        $entries = split('[, ]', $_SERVER['HTTP_X_FORWARDED_FOR']);

        reset($entries);
        while (list(, $entry) = each($entries)) {
            $entry = trim($entry);
            if (preg_match("/^([0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+)/", $entry, $ip_list)) {
                // http://www.faqs.org/rfcs/rfc1918.html
                $private_ip = array(
                        '/^0\\./',
                        '/^127\\.0\\.0\\.1/',
                        '/^192\\.168\\..*/',
                        '/^172\\.((1[6-9])|(2[0-9])|(3[0-1]))\\..*/',
                        '/^10\\..*/');

                $found_ip = preg_replace($private_ip, $client_ip, $ip_list[1]);

                if ($client_ip != $found_ip) {
                    $client_ip = $found_ip;
                    break;
                }
            }
        }
    } else {
        $client_ip =
                (!empty($_SERVER['REMOTE_ADDR']) ) ?
                $_SERVER['REMOTE_ADDR'] :
                ( (!empty($_ENV['REMOTE_ADDR']) ) ?
                $_ENV['REMOTE_ADDR'] :
                "unknown" );
    }

    return $client_ip;
}
?>
