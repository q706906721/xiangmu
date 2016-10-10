<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class SignController extends Controller
{
	public function sign()
	{
		return view('sign');
	}
    
    public function dosign(Request $request)
    {
    	// return $request->code.'<br>'.$request->uname.'<br>'.$request->pword.'<br>'.$request->rpword;
    	//验证码
    	$mycode = session()->get('code');
    	if($mycode!=$request->input('code')){
    		return back()->with("msg",'验证码错误');
    	}
    	$uname = $request->input('uname');
    	$pword = $request->input('pword');
    	\DB::insert('insert into user (username, password) values (?, ?)', [$uname, $pword]);
    	// \DB::statement('insert table user');
        return redirect('login');

    }
   
}
