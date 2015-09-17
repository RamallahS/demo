<?php

namespace Sailpay;

/**
 * Логгер модуля.
 *
 * Файлы логгирования сохраняются с посуточной разбивкой и следующей структуре:
 *  -- Год
 *    -- Месяц
 *      -- День месяца
 *
 * Class Log
 * @package Sailpay
 */
class Log
{

    use Singleton {
        instance as SingletonInstance;
    }

    private $log_rows = [];

    /**
     * @return Log
     */
    public static function instance()
    {
        return self::SingletonInstance();
    }

    /**
     * Регистрация функции, которая будет выполнена по окончанию работы инстанса.
     */
    public function __construct()
    {
        register_shutdown_function(array($this, 'logSave'));
    }

    /**
     * Добавление записи в логфайл.
     *
     * @param array $message
     *
     * @example
     *      Log::instance()->logAdd(['часть строки 1', 'часть строки 2','Часть строки n...']);
     */
    public function logAdd(Array $message)
    {
        $date = date('d.m.Y H:i:s');
        array_unshift($message, $date, ' - ');
        array_push($message, "\r");
        $message = urldecode(implode(' ', $message));
        array_push($this->log_rows, $message);
    }

    /**
     * Сохранение в файл.
     *
     * Служебный метод класса. Регистрируется как событие.
     * Выполняется по окончанию работы инстанса.
     * Регистрация онисана в конструкторе данного класса.
     *
     * @see \Sailpay\Log::__construct
     */
    public function logSave()
    {
        $path = __DIR__ . '/../log/' . date('Y/m/');
        $file = date('d') . '.log';

        if (!$fileHandle = file_exists($path)) {
            if ($fileHandle = mkdir($path, 0777, true)) {
                $fileHandle = file_put_contents($path . $file, "Start log\n");
                if ($fileHandle) {
                    chmod($path . $file, 0777);
                }
            }
        }

        if ($fileHandle) {
            array_unshift($this->log_rows, "\r");
            file_put_contents($path . $file, implode("\n", $this->log_rows), FILE_APPEND);
        }
    }
}