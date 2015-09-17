<?php

namespace Sailpay;

define('TAG_OWNER_POLO', 'Владелец Polo');
define('TAG_ACCEPT_AGREEMENT','Принял пользовательское соглашение');
define('TAG_LOYALTY_MEMBER', 'Участник программы лояльности');
define('TAG_NOTIFICATION_REPLIES', 'Получать уведомления об ответах');
define('TAG_SUBSCRIBE_LETTER', 'Подписался на рассылку');
define('TAG_SUBSCRIBE_PERSONAL_MESSAGE', 'Получать уведомления о личных сообщениях');
define('TAG_TIED_SOCIAL', 'Привязал соцсеть');
define('TAG_FORM_PERSONAL_COMPLETE', 'Заполнил анкету пользователя');
define('TAG_FORM_AUTO_COMPLETE', 'Заполнил информацию об автомобиле');
define('TAG_ADD_COMMENT', 'Коментарий');
define('TAG_REGULAR_EVENT', 'регулярное событие');

//Тегия начисления бонусных баллов за действия на сайтах.
define('TAG_BLOG_POST', 'Пост в блог');
define('TAG_BLOG_COMMENT', 'Прокомментировал статью');
define('TAG_FORUM_POST', 'Пост на форуме');

//Другие теги
define('TAG_ADD_FAVORITE', 'Добавил в избранное');
define('TAG_SEARCH', 'Поиск на сайте');
define('TAG_AUTH_SITE', 'Авторизация на сайте');
define('TAG_RATING_PULL', 'Принял участие в опросе');
define('TAG_SEND_TO_ADMIN', 'Написал письмо администрации клуба');
define('TAG_POLO_PULL', 'Оценил Polo седан');
define('TAG_TIME_ON_SITE', 'Время на сайте');
define('TAG_HAS_LIKE', 'Получил лайк сообщения');
define('TAG_POST_SHARED', 'Расшарил пост');

trait Tag
{

    private $_tag_response_message = [];
    private $user_tags = [];
    private $_tags_loaded = false;

    /**
     * Загрузка тегов пользователя.
     */
    public function loadTags()
    {
        $response = $this->getWithTokenRequest('v2/users/tags/list', ['origin_user_id' => $this->getOriginUserId()]);

        if ($result = json_decode($response, true)) {
            $this->_tag_response_message = $result;
            if (isset($result['status']) && $result['status'] === 'ok') {
                $this->user_tags = $result;
                $this->_tags_loaded = true;
                return true;
            } else {
                return false;
            }
        } else {
            $this->_tag_response_message = [
                'message' => 'No connect to API'
            ];
            return false;
        }
    }

    public function getTags()
    {
        return $this->user_tags;
    }

    public function hasTag($tag)
    {
        if (!isset($this->user_tags['events'])) {
            return false;
        }

        foreach ($this->user_tags['events'] as $key => $value) {
            if ($value['name'] === $tag) {
                return $value;
            }
        }
        return false;
    }

    /**
     * Добавление тега.
     * @param {Array} $value
     * @return mixed
     */
    public function addTag(Array $value)
    {
        $addTags = [];
        foreach ($value as $tag) {
            if (!$this->hasTag($tag)) {
                $addTags[] = $tag;
            }
        }

        if ($addTags) {
            $tags = implode(',', $addTags);
            $response = $this->getWithTokenRequest('v2/users/tags/add', ['origin_user_id' => $this->getOriginUserId(), 'tags' => $tags]);

            if ($result = json_decode($response, true)) {
                $this->_tag_response_message = $result;
                if (isset($result['status']) && $result['status'] === 'ok') {
                    return true;
                } else {
                    return false;
                }
            } else {
                $this->_tag_response_message = [
                    'message' => 'No connect to API'
                ];
                return false;
            }
        } else {
            return true;
        }
    }

    /**
     * Удаление тега.
     * @param array $value
     * @return bool
     */
    public function removeTag(Array $value)
    {
        foreach ($value as $key => $tag) {
            if (!$this->hasTag($tag)) {
                unset($value[$key]);
            }
        }

        if (!$value) {
            return true;
        }

        $tags = implode(',', $value);
        $response = $this->getWithTokenRequest('v2/users/tags/delete', ['origin_user_id' => $this->getOriginUserId(), 'tags' => $tags]);

        if ($result = json_decode($response, true)) {
            $this->_tag_response_message = $result;
            if (isset($result['status']) && $result['status'] === 'ok') {
                return true;
            } else {
                return false;
            }
        } else {
            $this->_tag_response_message = [
                'message' => 'No connect to API'
            ];
            return false;
        }
    }

}