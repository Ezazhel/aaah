import { inviteUser } from "./actions/inviteUser";

export default function InvitePage(){
    return (<form action={inviteUser}>
        <div>
            <input name="email" id="email" type="email" placeholder="Adresse-mail du nouveau membre" required/>
        </div>
        <button type="submit">Envoyer l'invitation</button>
    </form>)
}