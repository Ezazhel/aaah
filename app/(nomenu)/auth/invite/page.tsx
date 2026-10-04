import { inviteUser } from "./actions/inviteUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InvitePage(){
    return (<div className="flex flex-1 items-center justify-center bg-page p-4">
        <Card className="w-full max-w-md rounded-xl shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Inviter un membre</CardTitle>
                <CardDescription>Le nouveau membre recevra un lien par e-mail.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={inviteUser} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" id="email" type="email" placeholder="Adresse e-mail du nouveau membre" required/>
                    </div>
                    <Button type="submit" className="w-full">Envoyer l&apos;invitation</Button>
                </form>
            </CardContent>
        </Card>
    </div>)
}
