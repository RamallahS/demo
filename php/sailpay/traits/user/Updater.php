<?php

/**
 * Сервис обновления данных пользователя.
 */
namespace Sailpay;

trait Updater
{

    private $_updater_response_message = [];

    public function getUpdaterResponse()
    {
        return $this->_updater_response_message;
    }

    /**
     * Обновление пользователя.
     * @return array
     */
    public function update()
    {
        # Обновление профиля.
        $keys = ['origin_user_id', 'first_name', 'last_name', 'middle_name', 'birth_date', 'sex', 'add_phone', 'add_email', 'new_phone', 'new_email'];
        $request = [];
        foreach ($this->user_data as $key => $value) {
            if (in_array($key, $keys)) {
                $request[$key] = $value;
            }
        }

        $response = $this->getWithTokenRequest('v2/users/update', $request);

        # Обновление переменных
        $this->updateVariables();

        if ($result = json_decode($response,  JSON_UNESCAPED_UNICODE)) {
            $this->_updater_response_message = $result;
            if (isset($result['status']) && $result['status'] === 'ok') {
                $this->user_data = $result;
                return true;
            } else {
                return false;
            }
        } else {
            $this->_updater_response_message = [
                'message' => 'No connect to API'
            ];
            return false;
        }
    }

}