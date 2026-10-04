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

    console.log(author);
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