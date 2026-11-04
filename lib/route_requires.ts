import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";
import type { Database } from "@/database.types";

export type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * Authors must fill their first and last name (shown on their games and in /authors).
 * Not connected, or not an author (e.g. a game bar managing its stock): nothing to do.
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
    if(!(await hasRole('author'))){
        return;
    }
    const member = await supabase.from('members').select('first_name, last_name').eq('id', user.user.id).single();

    if(!member.data?.first_name || !member.data?.last_name){
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
 * Roles of the connected user ([] if not connected).
 */
export async function getRoles(): Promise<AppRole[]>{
    const supabase = await createClient();

    const { data: auth } = await supabase.auth.getClaims();
    if(!auth?.claims){
        return [];
    }

    const { data } = await supabase.from('user_roles').select('role').eq('user_id', auth.claims.sub);
    return (data ?? []).map((row) => row.role);
}

export async function hasRole(role: AppRole){
    return (await getRoles()).includes(role);
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
 * True if the connected user is an author with an active membership.
 */
export async function isActiveAuthor(){
    const supabase = await createClient();
    const { data } = await supabase.rpc('is_active_author');
    return data === true;
}

/**
 * Pages for connected users: active membership, or stock manager (not a member of the association).
 * Otherwise the user is signed out. The sign-out route clears the session cookies (a Server Component cannot).
 */
export async function requireSignInAllowed(){
    const supabase = await createClient();
    const { data } = await supabase.rpc('can_sign_in');
    if(data !== true){
        redirect('/auth/sign-out?reason=membership');
    }
}

/**
 * Author pages (games, inventory): author role and active membership. Otherwise home.
 */
export async function requireAuthor(){
    if(!(await isActiveAuthor())){
        redirect('/');
    }
}

/**
 * Stock manager pages. Not connected: login. Not a stock manager: home.
 */
export async function requireLocationManager(){
    if(!(await requireUser())){
        redirect('/auth/login');
    }
    await requireSignInAllowed();
    if(!(await hasRole('location_manager'))){
        redirect('/');
    }
}
