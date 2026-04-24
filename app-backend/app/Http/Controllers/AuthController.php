<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
     public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'email' => 'required|unique:users,email',
            'password' => 'required|min:8',
        ]);
        if($validator->fails()){
            return response(["ValidationError"=>$validator->errors()], 400);       
        }
        User::create(['name'=>$request->input('name'),
        'email' => $request->input('email'),
        'password'=>$request->input('password')]);
        Auth::attempt(['email' => $request->email, 'password' => $request->password]);
        $user = Auth::user(); 
        $user['token'] =  $user->createToken('MyApp')->plainTextToken; 
        return response($user, 200);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);
        if($validator->fails()){
            return response(["ValidationError"=>$validator->errors()], 400);       
        }
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){ 
             $user = Auth::user(); 
            $user['token'] =  $user->createToken('MyApp')->plainTextToken; 
            return response($user, 200);
        }else{
            return  response(["ValidationError"=>["Wrong credentials"]],404);
        } 
    }

    public function logout(Request $request){
         $request->user()->currentAccessToken()->delete();
        return response(["message" => "Logged out"], 200);
    }
}
