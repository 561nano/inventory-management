<?php

if (!isset($PATH)) {
    $PATH = $_SERVER['DOCUMENT_ROOT'] . '/php/';
}

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader(); //Req'd since not using Composer

// CHANGE THE VERSION NUMBER HERE
// ====================================
$app_version = '1.0.6 (Beta)';
// ====================================

$app = new \Slim\Slim(array(
    // Configuration parameters
    'templates.path' => './templates',
    'log.enabled' => true,
    'log.level' => \Slim\Log::INFO
));

$app->get('/', function() use ($app) {
    $app->view();
    $app->render('html.php', array(
        'title' => 'RoboJackets Inventory',
        'mode' => 'barcode',
        'tab' => 'default',
        'version' => $GLOBALS['app_version']
    ));
});

$app->get('/add', function() use ($app) {
    $app->view();
    $app->render('add.php', array(
        'title' => 'Add a Component',
        'tab' => 'add',
        'version' => $GLOBALS['app_version']
    ));
});

// Include routes that are in other files
// include 'php/r_server.php';
require 'php/r_search.php';
require 'php/r_validation.php';
require 'php/r_add.php';
require 'php/r_livesearch.php';


$app->run();