<?php

/**
 * Сервис регистрации пользователя.
 */
namespace Sailpay;

trait Register
{

    private $_register_response_message = [];

    public function getRegisterResponse()
    {
        return $this->_register_response_message;
    }

    /**
     * Регистрация пользователя.
     * @return array
     */
    public function register()
    {
        $response = $this->getWithTokenRequest('v2/users/add', $this->user_data);

        if ($result = json_decode($response, true)) {
            $this->_register_response_message = $result;
            if (isset($result['status']) && $result['status'] === 'ok') {
                return true;
            } else {
                return false;
            }
        } else {
            $this->_register_response_message = [
                'message' => 'No connect to API'
            ];
            return false;
        }
    }

}