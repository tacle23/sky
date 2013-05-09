<? require("includes/phpmailer/class.phpmailer.php");





$subject = 'Tu conversacion con Sofia - Telefonica';
$html=utf8_decode($_POST['div']);
$html= str_replace('<span','<div',$html);
$html= str_replace('</span','</div',$html);
$html.='<p><br>By <a href="http://www.agentbot.net">AgentBot</a></p>';
$email = $_POST['email'];
$from='noreply@telefonica.com';

if($html!="" && $email!=""){
    $mail = new PHPMailer();

    try {
      $mail->Encoding = "base64";

      $mail->IsSMTP();
	  
		$mail->Host = 'ssl://smtp.gmail.com';
		
		$mail->Port = 465;

		$mail->SMTPAuth = true;

		$mail->Username = 'noreply.agentbot@gmail.com';

		$mail->Password = 'j0nHPSqq';
	  
	  $mail->IsHTML(true);

      $mail->AddReplyTo($from, 'Sofia - Telefonica');
      
      $mail->AddAddress($email, $email);

      $mail->SetFrom($from, 'Sofia - Telefonica');

      $mail->Subject = $subject;

      $bodyhtml = $html;

      $mail->AltBody = $bodyhtml;

      $mail->MsgHTML($bodyhtml);

      $mail->Send();
	  
	  echo 'true';
    } catch (phpmailerException $e) {
      echo $e->errorMessage(); //Pretty error messages from PHPMailer
    } catch (Exception $e) {
      echo $e->getMessage(); //Boring error messages from anything else!
    }
}else{
	echo 'false';
}
?>