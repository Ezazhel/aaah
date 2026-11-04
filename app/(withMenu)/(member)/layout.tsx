import { requireSignInAllowed, requireUser } from "@/lib/route_requires";
import { redirect } from "next/navigation";

export default async function Layout({children}:LayoutProps<"/">) {
    const isConnected = await requireUser();
    if(!isConnected){
        redirect('/auth/login')
    }
    // Active membership, or stock manager (a game bar is not a member of the association).
    await requireSignInAllowed();
    return children;
}
