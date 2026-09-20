import { requireUser } from "@/lib/route_requires";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Layout({children}:LayoutProps<"/">) {
    const isConnected = await requireUser();
    if(!isConnected){
        revalidatePath('/', 'layout');
        redirect('/auth/login')
    }
    return children;
}