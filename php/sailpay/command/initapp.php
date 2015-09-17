<?php

##
# Авторизация приложения
##
require_once('../vendor/autoload.php');
$app = new \Sailpay\App();
$app->Auth();

?>