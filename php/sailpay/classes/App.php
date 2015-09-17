<?php

namespace Sailpay;

class App
{

    use Net;

    private $config;

    public function __construct()
    {
        $this->config = require(__DIR__ . '/../config/sailpay.php');
    }

    public function Auth()
    {
        $result = $this->getRequest('v1/login', $this->config['app_auth']);

        $auth_data = json_decode($result, true);
        $auth_data['store_department_id'] = $this->config['app_auth']['store_department_id'];

        file_put_contents(__DIR__ . '/../.authdata', json_encode($auth_data));
    }

}