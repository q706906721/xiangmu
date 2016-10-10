<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('find',function () {
	return view('find');
});
Route::get('login',"LoginController@login");
Route::post('dologin','LoginController@dologin');
Route::get("captcha/{tmp}","LoginController@captcha");
Route::get('sign',"SignController@sign");
Route::post('dosign','SignController@dosign');
Route::get('payfor',function () {
	return view('payfor');
});
