<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: text/plain; charset=utf8');

$mail = new PHPMailer(true);

try {
    // Перевірка наявності всіх полів
    if (!isset($_POST["user-name"], $_POST["user-email"], $_POST["user-tel"], $_POST["user-message"])) {
        echo "Error: not all fields are filled in!";
        exit;
    }

    // Отримуємо значення всіх полів
    $userName = htmlspecialchars($_POST["user-name"]);
    $userEmail = filter_var($_POST["user-email"], FILTER_SANITIZE_EMAIL);
    $userTel = htmlspecialchars($_POST["user-tel"]);
    $userMessage = htmlspecialchars($_POST["user-message"]);

    // Перевірка коректності email
    if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
        echo "Error: invalid email!";
        exit;
    }

    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'antonchuk03@gmail.com'; // Твоя пошта
    $mail->Password = 'gzgpirmutvjcaoxx'; // Пароль додатка
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('antonchuk03@gmail.com', 'Top Gip');
    $mail->addAddress('antonchuk03@gmail.com'); // Куди надсилати лист

    $mail->addReplyTo($userEmail, $userName); // Автоматичне поле "Відповісти на"

    $mail->isHTML(false);
    $mail->Subject = 'New message from Top Gip Website';
    $mail->Body = "Name: $userName\n"
        . "Email: $userEmail\n"
        . "Tel: $userTel\n"
        . "Message:\n$userMessage";

    if ($mail->send()) {
        echo 'success';
    } else {
        echo "Error: " . $mail->ErrorInfo;
    }
} catch (Exception $e) {
    echo "Error: " . $mail->ErrorInfo;
}
?>