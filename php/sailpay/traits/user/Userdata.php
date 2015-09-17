<?php

namespace Sailpay;

trait Userdata
{

    private $user_data = [];

    public function getStatus()
    {
        return (isset($this->user_data['status']) ? $this->user_data['status'] : false);
    }

    /**
     * Установить дату рождения.
     * @param {String} $value - yyyy-mm-dd
     * @return $this
     */
    public function setBirthDate($value)
    {
        $this->user_data['birth_date'] = $value;
        return $this;
    }

    /**
     * Выдать дату рождения.
     */
    public function getBirthDate()
    {
        return (isset($this->user_data['birth_date']) ? $this->user_data['birth_date'] : false);
    }

    /**
     * Установить пол.
     * @param $value
     * @return $this
     */
    public function setSex($value)
    {
        if (strtoupper($value) === 'M' || strtoupper($value) === 'MALE') {
            $this->user_data['sex'] = '1';
        } else {
            $this->user_data['sex'] = '2';
        }
        return $this;
    }

    /**
     * Выдать пол.
     */
    public function getSex()
    {
        return (isset($this->user_data['sex']) ? $this->user_data['sex'] : null);
    }

    /**
     * Установить имя.
     * @param $value
     * @return $this
     */
    public function setFirstName($value)
    {
        $this->user_data['first_name'] = $value;
        return $this;
    }

    /**
     * Выдать имя.
     * @return bool
     */
    public function getFirstName()
    {
        return (isset($this->user_data['first_name']) ? $this->user_data['first_name'] : false);
    }

    /**
     * Установить фамилию.
     * @param $value
     * @return $this
     */
    public function setLastName($value)
    {
        $this->user_data['last_name'] = $value;
        return $this;
    }

    /**
     * Выдать Фамилию.
     * @return bool
     */
    public function getLastName()
    {
        return (isset($this->user_data['last_name']) ? $this->user_data['last_name'] : false);
    }

    /**
     * Установить отчество.
     * @param $value
     * @return $this
     */
    public function setMiddleName($value)
    {
        $this->user_data['middle_name'] = $value;
        return $this;
    }

    /**
     * Выдать отчество.
     * @return bool
     */
    public function getMiddleName()
    {
        return (isset($this->user_data['middle_name']) ? $this->user_data['middle_name'] : false);
    }

    /**
     * Установить телефон.
     * @param $value
     * @return $this
     */
    public function setPhone($value)
    {
        $oldPhone = preg_replace('/([^\d])/', '', $this->getPhone());
        $newPhone = preg_replace('/([^\d])/', '', $value);

        if ($oldPhone === $newPhone)
            return $this;

        if ($this->getStatus() === 'ok') {
            unset($this->user_data['phone']);
            if ($oldPhone) {
                $this->user_data['new_phone'] = $value;
            } else {
                $this->user_data['add_phone'] = $value;
            }
        }

        $this->user_data['user_phone'] = $value;

        return $this;
    }

    /**
     * Выдать телефон.
     * @return bool
     */
    public function getPhone()
    {
        return (isset($this->user_data['phone']) ? $this->user_data['phone'] : false);
    }

    /**
     * Устаговить email.
     * @param $value
     * @return $this
     */
    public function setEmail($value)
    {
        if ($this->getEmail() === $value)
            return $this;

        if ($this->getStatus() === 'ok') {
            unset($this->user_data['email']);
            if ($this->getEmail()) {
                $this->user_data['new_email'] = $value;
            } else {
                $this->user_data['add_email'] = $value;
            }
        }

        $this->user_data['email'] = $value;
        return $this;
    }

    /**
     * Выдать e-mail.
     * @return bool
     */
    public function getEmail()
    {
        return (isset($this->user_data['email']) ? $this->user_data['email'] : false);
    }

    public function setOriginUserId($value)
    {
        $this->user_data['origin_user_id'] = md5($value);
        return $this;
    }

    /**
     * Выдать идентификатор.
     * @return mixed
     */
    public function getOriginUserId()
    {
        return $this->user_data['origin_user_id'];
    }

    public function getUserData()
    {
        return $this->user_data;
    }

    /**
     * Установить VIN.
     * @param $value
     * @return $this
     */
    public function setVin($value)
    {
        if (!$value) {
            $value = ' ';
        }
        $this->setVariable(VARIABLE_VIN, $value);
        return $this;
    }

    /**
     * Выдать VIN.
     * @return mixed
     */
    public function getVin()
    {
        return $this->loadVariable(VARIABLE_VIN);
    }

    /**
     * Установить никнейм.
     * @param $value
     * @return $this
     */
    public function setNickName($value)
    {
        $this->setVariable(VARIABLE_NICKNAME, $value);
        return $this;
    }

    /**
     * Вернуть никнейм.
     * @return mixed
     */
    public function getNickName()
    {
        return $this->loadVariable(VARIABLE_NICKNAME);
    }

    /**
     * Установить аватар.
     * @param $value
     * @return $this
     */
    public function setAvatarUrl($value)
    {
        if (!$value) {
            $value = 'i/default-avatar-man.png';
        }
        if (strpos($value, 'w77-h73-c')) {
            $value = 'http://' . $_SERVER["HTTP_HOST"] . '/' . $value;
        } else {
            $value = 'http://' . $_SERVER["HTTP_HOST"] . '/img/w74-h74-c/' . $value;
        }
        $this->setVariable(VARIABLE_AVATAR_URL, $value);
        return $this;
    }

    /**
     * Установить пароль.
     * @param $value
     * @return $this
     */
    public function setPassword($value)
    {
        if ($value) {
            $this->setVariable(VARIABLE_PASSWORD, $value);
        }
        return $this;
    }

    public function setCity($value)
    {
        if (!$value) {
            $value = ' ';
        }
        $this->setVariable(VARIABLE_CITY, $value);
        return $this;
    }

    public function getCity()
    {
        return $this->loadVariable(VARIABLE_CITY);
    }

}