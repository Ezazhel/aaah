"use client"

import { useActionState } from "react";
import { signInWithMagicLink } from "./actions/auth";
import { Button } from "@/components/ui/button";

export default function Login() {
 const [state, formAction, pending] = useActionState(signInWithMagicLink, {success: false, error: null});
  return (
    <>
    <h1>Connectez-vous !</h1>
    <form id="form" action={formAction}>
        <div>
            <label htmlFor="email">Email</label>
            <input name="email" id="email" type='email' placeholder="Enter your email" />
        </div>
        <Button type="submit" disabled={pending}>Send link</Button>
    </form>
    {state.success && 'Vérifiez vos mails !'}
    {state.error}
    </>
  );
}
