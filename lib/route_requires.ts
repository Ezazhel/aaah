import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

/**
 * Check if user is connected.
 * If false : authorize
 * If true, check if user fulfilled firstname, lastname
 * Else redirect to profile/setup
 */
export async function requireUserSetup(){
    const isConnected = await requireUser();
    if(!isConnected){
        return;
    }

    const supabase = await createClient();
    const {data: user} = await supabase.auth.getUser();
    if(!user.user){
        return;
    }
    const author = await supabase.from('authors').select('first_name, last_name').eq('id', user.user.id).single();

    if(!author.data?.first_name || !author.data?.last_name){
        redirect('/account');
    }
}

/**
 * Check user is connected
 */
export async function requireUser(){
    const supabase = await createClient();

    const { data } = await supabase.auth.getClaims();

    return Boolean(data);
}

/**
 * True if the user is connected and has the admin role.
 */
export async function isAdmin(){
    const supabase = await createClient();

    const { data: auth } = await supabase.auth.getClaims();
    if(!auth?.claims){
        return false;
    }

    const { data } = await supabase.rpc('is_admin');
    return data === true;
}

/**
 * Admin pages: the user must be connected AND admin.
 * Not connected: redirect to login. Connected but not admin: redirect home.
 */
export async function requireAdmin(){
    const isConnected = await requireUser();
    if(!isConnected){
        redirect('/auth/login');
    }

    if(!(await isAdmin())){
        redirect('/');
    }
}

/**
 * True if the connected user's membership is active (admins always are).
 */
export async function isActiveMember(){
    const supabase = await createClient();
    const { data } = await supabase.rpc('is_active_member');
    return data === true;
}

/**
 * Member pages: a connected user whose membership expired is signed out.
 * The sign-out route clears the session cookies (a Server Component cannot).
 */
export async function requireActiveMember(){
    if(!(await isActiveMember())){
        redirect('/auth/sign-out?reason=membership');
    }
}
