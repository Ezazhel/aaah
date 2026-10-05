'use client'

import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/alert";
import { FormField, errorId } from "@/components/form-field";
import { sendContactMessage, type ContactState } from "./lib/action";
import type { ContactField } from "./lib/schema";

type Turnstile = {
    render: (el: HTMLElement, options: Record<string, unknown>) => string;
    reset: (widgetId: string) => void;
    remove: (widgetId: string) => void;
};
declare global {
    interface Window { turnstile?: Turnstile }
}

export function ContactForm({ defaultEmail }: { defaultEmail?: string }) {
    const widgetRef = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const token = useRef("");
    // Time the form was shown: a bot sends it immediately.
    const startedAt = useRef(0);
    const [values, setValues] = useState<Record<string, string>>({});

    useEffect(() => { startedAt.current = Date.now(); }, []);

    const [state, formAction, pending] = useActionState(async (prev: ContactState, formData: FormData) => {
        formData.set('started_at', String(startedAt.current));
        formData.set('cf-turnstile-response', token.current);
        // Kept to refill the form if the message is refused.
        setValues(Object.fromEntries([...formData].filter(([, v]) => typeof v === 'string')) as Record<string, string>);
        const result = await sendContactMessage(prev, formData);
        // A Turnstile token can only be used once.
        token.current = "";
        if(widgetId.current) window.turnstile?.reset(widgetId.current);
        if(result && 'success' in result) setValues({});
        return result;
    }, undefined);

    const renderWidget = () => {
        if(!widgetRef.current || !window.turnstile || widgetId.current) return;
        widgetId.current = window.turnstile.render(widgetRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            language: 'fr',
            'response-field': false,
            callback: (t: string) => { token.current = t; },
            'expired-callback': () => { token.current = ""; },
        });
    };

    useEffect(() => () => {
        if(widgetId.current) window.turnstile?.remove(widgetId.current);
        widgetId.current = null;
    }, []);

    const fieldErrors = state && 'fieldErrors' in state ? state.fieldErrors ?? {} : {};
    const field = (name: ContactField) => ({
        id: name,
        name,
        defaultValue: values[name] ?? (name === 'email' ? defaultEmail : undefined),
        'aria-invalid': fieldErrors[name] ? true : undefined,
        'aria-describedby': fieldErrors[name] ? errorId(name) : undefined,
    });

    return (
        <form action={formAction} className="flex flex-col gap-4" noValidate>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={renderWidget}/>

            {state && 'error' in state && <Alert>{state.error}</Alert>}
            {state && 'success' in state && <Alert variant="success">Merci, votre message a bien été envoyé. Nous vous répondrons au plus vite.</Alert>}

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="first_name" label="Prénom" error={fieldErrors.first_name}>
                    <Input {...field('first_name')} autoComplete="given-name" required/>
                </FormField>
                <FormField id="last_name" label="Nom" error={fieldErrors.last_name}>
                    <Input {...field('last_name')} autoComplete="family-name" required/>
                </FormField>
            </div>
            <FormField id="email" label="E-mail" hint="Pour que nous puissions vous répondre." error={fieldErrors.email}>
                <Input {...field('email')} type="email" autoComplete="email" required/>
            </FormField>
            <FormField id="subject" label="Objet" error={fieldErrors.subject}>
                <Input {...field('subject')} required/>
            </FormField>
            <FormField id="message" label="Message" error={fieldErrors.message}>
                <Textarea {...field('message')} rows={8} required/>
            </FormField>

            {/* Honeypot: invisible for humans, filled by bots. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Ne pas remplir</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"/>
            </div>

            <div ref={widgetRef}/>

            <Button type="submit" className="w-full sm:w-auto sm:self-end" disabled={pending}>
                {pending ? "Envoi…" : "Envoyer le message"}
            </Button>
        </form>
    );
}
