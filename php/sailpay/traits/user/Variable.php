<?php

namespace Sailpay;

define('VARIABLE_PASSWORD', 'password');
define('VARIABLE_AVATAR_URL', 'avatar url');
define('VARIABLE_NICKNAME', 'никнейм');
define('VARIABLE_VIN', '<vin>');
define('VARIABLE_CITY', '<Город>');

trait Variable
{

    private $user_variables = [];
    private $user_variables_loaded = false;

    public function updateVariables()
    {
        if (!$this->user_variables) {
            return true;
        }

        //var_dump('----------',$this->user_variables);
        //var_dump(json_encode($this->user_variables, true));

        $request = [
            'origin_user_id' => $this->getOriginUserId(),
            'vars' => json_encode($this->user_variables, JSON_UNESCAPED_UNICODE)
        ];

        $this->getWithTokenRequest('v2/users/custom-vars/add', $request);
    }

    /**
     * Список пользовательских переменных.
     */
    public function listVariables()
    {
        $response = $this->getWithTokenRequest('v2/users/custom-vars/list', ['origin_user_id' => $this->getOriginUserId()]);
        $response = json_decode($response, true);
        if ($response && $response['status'] === "ok") {
            $this->user_variables = $response['custom_vars'];
            $this->user_variables_loaded = true;
        }
    }

    public function loadVariable($name)
    {
        if (!array_key_exists($name, $this->user_variables)) {
            $response = $this->getWithTokenRequest('v2/users/custom-vars/get', [
                'origin_user_id' => $this->getOriginUserId(),
                'name' => $name
            ]);
            $response = json_decode($response, true);

            if ($response && $response['status'] === "ok") {
                $this->user_variables[$name] = $response['value'];
            } else {
                $this->user_variables[$name] = null;
            }
        }
        return $this->user_variables[$name];
    }

    /**
     * Добавление переменной.
     * @param array $variables
     */
    public function setVariable($key, $value)
    {
        $this->user_variables[$key] = $value;
    }

}