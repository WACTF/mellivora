<?php

require('../../../include/mellivora.inc.php');

enforce_authentication(CONST_USER_CLASS_MODERATOR);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    validate_xsrf_token($_POST[CONST_XSRF_TOKEN_KEY]);

    if ($_POST['action'] == 'new') {

        if (!is_valid_id(array_get($_POST, 'category'))) {
            message_error('You must select a category to create a challenge!');
        }

        require_fields(array('title'), $_POST);

        $id = db_insert(
            'challenges',
            array(
                'added' => time(),
                'added_by' => $_SESSION['id'],
                'title' => $_POST['title'],
                'description' => $_POST['description'],
                'flag' => $_POST['flag'],
                'automark' => 1,
                'case_insensitive' => $_POST['case_insensitive'],
                'points' => empty_to_zero($_POST['points']),
                'category' => $_POST['category'],
                'num_attempts_allowed' => empty_to_zero($_POST['num_attempts_allowed']),
                'min_seconds_between_submissions' => empty_to_zero($_POST['min_seconds_between_submissions']),
                'relies_on'=>$_POST['relies_on'],
                'exposed' => 1,
                'available_from' => strtotime(wactf_start()),
                'available_until' => strtotime(wactf_end())
            )
        );

        if ($id) {
            redirect(Config::get('MELLIVORA_CONFIG_SITE_ADMIN_RELPATH') . 'edit_challenge.php?id=' . $id);
        } else {
            message_error('Could not insert new challenge.');
        }
    }
}