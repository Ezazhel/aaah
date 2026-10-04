"use client"

import Image from "next/image";
import { useActionState } from "react";
import { signInWithMagicLink } from "./actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
 const [state, formAction, pending] = useActionState(signInWithMagicLink, {success: false, error: null});
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Image src="/aaah_logo.svg" alt="AAAH!" width={240} height={111} className="mx-auto" priority/>
          <CardTitle>Connectez-vous !</CardTitle>
          <CardDescription>Recevez un lien de connexion par e-mail.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form" action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input name="email" id="email" type="email" placeholder="vous@exemple.fr" className="ml-0" required/>
            </div>
            <Button type="submit" className="w-full" disabled={pending}>Envoyer le lien</Button>
            {state.success && <p>Vérifiez vos mails !</p>}
            {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
