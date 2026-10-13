"use client"

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { confirmLink } from "./actions/confirm";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "Connexion…" : label}</Button>;
}

export function ConfirmForm({ tokenHash, type, label }: { tokenHash: string, type: string, label: string }) {
  return (
    <form action={confirmLink}>
      <input type="hidden" name="token_hash" value={tokenHash}/>
      <input type="hidden" name="type" value={type}/>
      <SubmitButton label={label}/>
    </form>
  );
}
