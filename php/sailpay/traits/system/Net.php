<?php

namespace Sailpay;

/**
 * Обмен данными с CRM. Все запросы в СРМ проходят только через меотды этого класса.
 * Class Net
 * @package Sailpay
 */
trait Net
{

    /**
     * Точка входа API CRM.
     * @private
     * @var string
     */
    private $net_api_host = 'http://sailplay.ru/api/';

    /**
     * Кеш токена запроса.
     * @private
     * @var array
     */
    private $cache_net_token = [];

    private function getTokenData()
    {
        if (!$this->cache_net_token) {
            $token_data = file_get_contents(__DIR__ . '/../../.authdata');
            $token_data_parse = json_decode($token_data, true);
            $this->cache_net_token = [
                'token' => $token_data_parse['token'],
                'store_department_id' => $token_data_parse['store_department_id']
            ];
        }
        return $this->cache_net_token;
    }

    /**
     * Запрос к серверу без авторизационных токенов приложения.
     * Используется только в одном случае - получения аторизационного токена приложения.
     * @see \Sailpay\App::Auth
     * @param $path
     * @param array $parameters
     * @return mixed
     */
    public function getRequest($path, $parameters = [])
    {
        $parameters = array_merge($parameters, $this->getTokenData());
        $url = $this->net_api_host . $path . '?' . http_build_query($parameters);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        $request = curl_exec($curl);
        return $request;
    }

    public function getWithTokenRequest($path, $parameters = [])
    {
        $parameters = array_merge($parameters, $this->getTokenData());

        $url = $this->net_api_host . $path . '?' . http_build_query($parameters);

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        $request = curl_exec($curl);

        Log::instance()->logAdd(['Request:', $url]);
        Log::instance()->logAdd(['-- Response:', $request]);

        return $request;
    }

}