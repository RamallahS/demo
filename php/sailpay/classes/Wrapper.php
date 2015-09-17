<?php

namespace Sailpay;

class Wrapper
{

    use Singleton {
        instance as SingletonInstance;
    }

    /**
     * @var User
     */
    public $user;

    /**
     * @return Wrapper
     */
    public static function instance()
    {
        return self::SingletonInstance();
    }

    public function __construct($autoload = false)
    {
        if (\Auth::instance()->logged_in()) {
            $this->user = User::instance(\Auth::instance()->get_user()->id);
        } else {
            $this->user = User::instance();
        }
        return $this->user;
    }

    /**
     * Регистрация пользователя.
     * @param {Array} $userData - [id,sex]
     * @throws Exception
     */
    public function register($userData)
    {
        $this->user->setOriginUserId($userData['id'])
            ->setSex($userData['sex']);
        $isRegistered = $this->user->register();

        if (!$isRegistered) {
            throw new Exception('Пользователь с такими данными уже зарегистрирован.', 501);
        } else {
            $this->user->setPassword($userData['password']);
            $this->user->addTag([TAG_ACCEPT_AGREEMENT]);
            $this->user->updateVariables();
        }

    }

    /**
     * Подтверждение почты.
     * @param {Auth} $userData [id, email]
     */
    public function email_confirm($userData)
    {
        $this->user
            ->setOriginUserId($userData->id)
            ->load();

        $this->user
            ->setEmail($userData->email)
            ->update();
    }

}