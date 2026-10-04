import { inviteUser } from "./actions/inviteUser";
import { Button } from "@/components/ui/button";

export default function InvitePage(){
    return (<form action={inviteUser}>
        <div>
            <input name="email" id="email" type="email" placeholder="Adresse-mail du nouveau membre" required/>
        </div>
        <Button type="submit">Envoyer l'invitation</Button>
    </form>)
}