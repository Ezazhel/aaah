"use client"

import { createClient } from "@/lib/supabase/client"
import { signInWithMagicLink } from "./_lib/actions/auth";
import { useState } from "react";

export default function Login() {
    const [emailSent, setEmailSent] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const email = data.get('email')?.valueOf() as string;
        
        if(!email){
            return;
        }

        const {success} = await signInWithMagicLink(email)
        
        setEmailSent(success);
    }
  return (
    <>
    <form id="form" onSubmit={handleSubmit}>
        <div>
            <label htmlFor="email">Email</label>
            <input name="email" id="email" type='email' placeholder="Enter your email" />
        </div>
        <button type="submit">Send link</button>
    </form>
    {emailSent && <div>
        An email was sent. Validate the link to login</div>}
    </>
  );
}
