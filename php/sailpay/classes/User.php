<?php

namespace Sailpay;

class User
{

    use Singleton {
        instance as SingletonInstance;
    }

    use Net, Userdata, Register, Loader, Updater, Tag, Variable, Social;

    /**
     * @return User
     */
    public static function instance($user_id = null)
    {
        $class = self::SingletonInstance();
        if ($user_id) {
            $class->setOriginUserId($user_id);
        }
        return $class;
    }

}