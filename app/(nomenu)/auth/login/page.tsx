"use client"

import { useActionState } from "react";
import { signInWithMagicLink } from "./actions/auth";

export default function Login() {
 const [state, formAction, pending] = useActionState(signInWithMagicLink, {success: false, error: null});
  return (
    <>
    <form id="form" action={formAction}>
        <div>
            <label htmlFor="email">Email</label>
            <input name="email" id="email" type='email' placeholder="Enter your email" />
        </div>
        <button type="submit">Send link</button>
    </form>
    {state.success && 'Vérifiez vos mails !'}
    {state.error}
    </>
  );
}
