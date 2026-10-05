"use server"

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderEmail } from "@/lib/email/layout";
import { sendEmail } from "@/lib/email/send";
import { contactSchema, type ContactField } from "./schema";

export type ContactState =
    | { error: string; fieldErrors?: Partial<Record<ContactField, string>> }
    | { success: true }
    | undefined;

// A human needs more than this to fill the form.
const MIN_FILL_MS = 3000;
// Messages per sender (IP) and per hour.
const MAX_PER_HOUR = 3;

const verifyTurnstile = async (token: string, ip: string | undefined) => {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY ?? "", response: token, ...(ip ? { remoteip: ip } : {}) }),
        cache: "no-store",
    });
    const json = await res.json();
    return json.success === true;
}

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
    // Bots: hidden field filled or form sent too fast. Fake success, nothing sent.
    const startedAt = Number(formData.get('started_at'));
    if(formData.get('website') || !startedAt || Date.now() - startedAt < MIN_FILL_MS){
        console.warn("[contact] envoi bloqué (pot de miel ou trop rapide)");
        return { success: true };
    }

    const parsed = contactSchema.safeParse(Object.fromEntries(formData));
    if(!parsed.success){
        const fieldErrors: Partial<Record<ContactField, string>> = {};
        for(const issue of parsed.error.issues){
            const field = issue.path[0] as ContactField;
            fieldErrors[field] ??= issue.message;
        }
        return { error: "Vérifiez les informations saisies.", fieldErrors };
    }

    const requestHeaders = await headers();
    const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0].trim() || requestHeaders.get('x-real-ip') || undefined;

    const token = formData.get('cf-turnstile-response');
    if(typeof token !== 'string' || !token || !(await verifyTurnstile(token, ip))){
        return { error: "La vérification anti-robot a échoué. Réessayez." };
    }

    const supabase = createAdminClient();
    // Salted hash: the IP itself is never stored.
    const ipHash = createHash('sha256').update(`${ip ?? 'unknown'}:${process.env.TURNSTILE_SECRET_KEY}`).digest('hex');
    const { count } = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', new Date(Date.now() - 3600_000).toISOString());
    if((count ?? 0) >= MAX_PER_HOUR){
        return { error: "Vous avez déjà envoyé plusieurs messages. Réessayez dans une heure." };
    }

    const { first_name, last_name, email, subject, message } = parsed.data;
    const { html, text } = renderEmail({
        title: subject,
        paragraphs: [`De : ${first_name} ${last_name} <${email}>`, message],
    });

    try{
        // The recipient is fixed: the form can never be used to email anyone else.
        await sendEmail({ to: process.env.CONTACT_EMAIL!, subject: `[Contact] ${subject}`, html, text, replyTo: email });
    } catch(err){
        console.error("[contact] échec de l'envoi", err);
        return { error: "Le message n'a pas pu être envoyé. Réessayez plus tard ou écrivez-nous sur les réseaux." };
    }

    const { error } = await supabase.from('contact_messages').insert({ first_name, last_name, email, subject, message, ip_hash: ipHash });
    if(error) console.error("[contact] message envoyé mais non enregistré", error);

    return { success: true };
}
