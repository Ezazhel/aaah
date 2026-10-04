"use client"

import Image from "next/image";
import { useActionState } from "react";
import { signInWithMagicLink } from "./actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
 const [state, formAction, pending] = useActionState(signInWithMagicLink, {success: false, error: null});
  return (
    <div className="flex flex-1 items-center justify-center bg-page p-4">
      <Card className="w-full max-w-md rounded-xl shadow-lg">
        <CardHeader className="text-center">
          <Image src="/aaah_logo.svg" alt="AAAH!" width={240} height={111} className="mx-auto" loading="eager"/>
          <CardTitle>Connectez-vous !</CardTitle>
          <CardDescription>Recevez un lien de connexion par e-mail.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form" action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" placeholder="vous@exemple.fr" autoComplete="email" required/>
            </div>
            <Button type="submit" className="w-full" disabled={pending}>Envoyer le lien</Button>
            {state.success && <Alert variant="success">Vérifiez vos mails !</Alert>}
            {state.error && <Alert>{state.error}</Alert>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
