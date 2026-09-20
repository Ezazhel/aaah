'use client'

import { type User } from "@supabase/supabase-js";


export function User({user}: {user: User | null}){
if(!user){
    return <a href='./auth/login'>Login</a>
}

  return <span>{user.email}</span>
}