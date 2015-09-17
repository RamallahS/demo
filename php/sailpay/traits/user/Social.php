<?php

namespace Sailpay;

trait Social
{

    /**
     * Привязка социальной сети.
     * @param $type
     * @param $id
     * @param $session_secret_key
     * @param null $access_token
     */
    public function addSocial($type, $id, $access_token)
    {
        $request = ['origin_user_id' => $this->getOriginUserId()];

        if (strtoupper($type) === 'VK') {
            $request['type'] = 'vk';
            $request['account_id'] = $id;
            $request['access_token'] = $access_token;
            $request['session_secret_key']=$access_token;
        }

        $req = $this->getWithTokenRequest('v2/users/sync-social', $request);
        return $req;
    }

}