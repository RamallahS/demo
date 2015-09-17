<?php

namespace Sailpay;

trait Gifts
{

    private $_gifts_categories = false;
    private $_gifts_list = false;

    public function commitTransaction($gift_public_key)
    {
        $response = $this->getWithTokenRequest('v1/ecommerce/gifts/commit-transaction', ['gift_public_key' => $gift_public_key]);
        if ($result = json_decode($response, true)) {
            return $result;
        } else {
            return false;
        }
    }

    /**
     * Cписок категорий подарков.
     */
    public function categories()
    {
        if (!$this->_gifts_categories) {
            $response = $this->getWithTokenRequest('v2/gifts/manage/categories');

            if ($result = json_decode($response, true)) {
                if (isset($result['status'])
                    && $result['status'] === 'ok'
                    && isset($result['categories'])
                ) {
                    $this->_gifts_categories = $result['categories'];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        return $this->_gifts_categories;
    }

    public function getList()
    {
        if (!$this->_gifts_list) {
            $response = $this->getWithTokenRequest('v2/gifts/list');

            if ($result = json_decode($response, true)) {
                if (isset($result['status'])
                    && $result['status'] === 'ok'
                    && isset($result['gifts'])
                ) {
                    $this->_gifts_list = $result['gifts'];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        return $this->_gifts_list;
    }

}