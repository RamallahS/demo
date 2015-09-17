<?php

namespace Sailpay;

/**
 * Реализация паттерна Singletone
 * Class Single
 * @package Sailpay
 */
trait Singleton
{

    static $singe_instance = null;

    public static function instance()
    {
        if (!self::$singe_instance) {
            $class_name = __CLASS__;
            self::$singe_instance = new $class_name();
        }
        return self::$singe_instance;
    }

}