<?php

/**
 * Сервис загрузки данных пользователя.
 */
namespace Sailpay;

trait Loader
{

    private $_loader_response_message = [];

    public function getLoaderResponse()
    {
        return $this->_loader_response_message;
    }

    /**
     * Загрузка данных о пользователе пользователя.
     * @return array
     */
    public function load()
    {
        $response = $this->getWithTokenRequest('v2/users/info', ['origin_user_id' => $this->getOriginUserId()]);

        if ($result = json_decode($response, true)) {
            $this->_loader_response_message = $result;
            if (isset($result['status']) && $result['status'] === 'ok') {
                $this->user_data = $result;
                return true;
            } else {
                return false;
            }
        } else {
            $this->_loader_response_message = [
                'message' => 'No connect to API'
            ];
            return false;
        }
    }

    public function loadWithHistory()
    {
        $response = $this->getWithTokenRequest('v2/users/info', ['history' => 1, 'origin_user_id' => $this->getOriginUserId()]);
        if ($result = json_decode($response, true)) {
            $this->_loader_response_message = $result;
            if (isset($result['status']) && $result['status'] === 'ok') {
                $this->user_data = $result;
                return true;
            } else {
                return false;
            }
        } else {
            $this->_loader_response_message = [
                'message' => 'No connect to API'
            ];
            return false;
        }
    }

}