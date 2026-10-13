import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmForm } from "./confirm-form";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

// Opening the link only shows this page: the token is used on click (see actions/confirm.ts).
export default async function Confirm({ searchParams }: PageProps<"/auth/confirm">) {
  const { token_hash, type } = await searchParams;
  if (typeof token_hash !== "string" || typeof type !== "string") {
    redirect("/error");
  }

  const isInvite = type === "invite";

  return (
    <div className="flex flex-1 items-center justify-center bg-page p-4">
      <Card className="w-full max-w-md rounded-xl shadow-lg">
        <CardHeader className="text-center">
          <Image src="/aaah_logo.svg" alt="AAAH!" width={240} height={111} className="mx-auto" loading="eager"/>
          <CardTitle>{isInvite ? "Bienvenue !" : "Connectez-vous !"}</CardTitle>
          <CardDescription>
            {isInvite ? "Cliquez pour activer votre compte." : "Cliquez pour vous connecter."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConfirmForm tokenHash={token_hash} type={type} label={isInvite ? "Activer mon compte" : "Me connecter"}/>
        </CardContent>
      </Card>
    </div>
  );
}
