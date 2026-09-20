'use client'

import { type User } from "@supabase/supabase-js";


export function User({user}: {user: User | null}){
if(!user){
    return <a href='./auth/login'>Login</a>
}

  return <div>
    <span>{user.email}</span>
    <a href="auth/sign-out">Deconnexion</a>
    </div>
}