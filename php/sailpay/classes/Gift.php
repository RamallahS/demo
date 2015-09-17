<?php
/**
 * Created by PhpStorm.
 * User: bogachev
 * Date: 20.04.15
 * Time: 23:18
 */

namespace Sailpay;

class Gift
{

    use Singleton {
        instance as SingletonInstance;
    }

    use Gifts, Net;

    /**
     * @return Gift
     */
    public static function instance()
    {
        return self::SingletonInstance();
    }

    public function getGift($id)
    {
        $gifts = $this->getList();

        foreach ($gifts as $gift) {
            if ($gift['id'] == $id) {
                return $gift;
            }
        }
    }

    /**
     * @param $params
     * limit, offset
     */
    public function getGifts($params)
    {
        $gifts = $this->getList();

        if (!$params['offset'])
            $offset = 1;
        else
            $offset = $params['offset'];

        if (!$params['limit'])
            $limit = 8;
        else
            $limit = $params['limit'];

        $result = [];
        for ($i = $offset - 1; $i < $offset + $limit - 1; $i++) {
            if (isset($gifts[$i]))
                $result[] = $gifts[$i];
            else
                break;
        }

        return $result;
    }

    public function getCountActiveGifts()
    {
        $gifts = $this->getList();
        $count = 0;
        foreach ($gifts as $gift) {
            if ($gift['enabled']) {
                $count++;
            }
        }
        return $count;
    }

    public function addToUser($userId, $giftId){
        $hash = md5($userId.$giftId.uniqid());
        return $hash;
    }

}