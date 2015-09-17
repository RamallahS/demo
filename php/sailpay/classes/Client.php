<?php

namespace Sailpay;

/**
 * Класс в разработке. Не используется.
 * Class Client
 * @package Sailpay
 */
class Client
{
    use Singleton {
        instance as SingletonInstance;
    }

    private $client;

    /**
     * @return Client
     */
    public static function instance()
    {
        return self::SingletonInstance();
    }

    public function __construct()
    {
        if (\Auth::instance()->logged_in()) {
            $this->client = User::instance(\Auth::instance()->get_user()->id);
        } else {
            $this->user = User::instance();
        }
        return $this->user;
    }
}