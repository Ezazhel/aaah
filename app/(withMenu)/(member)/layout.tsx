import { requireUser } from "@/lib/route_requires";
import { redirect } from "next/navigation";

export default async function Layout({children}:LayoutProps<"/">) {
    const isConnected = await requireUser();
    if(!isConnected){
        redirect('/auth/login')
    }
    return children;
}
