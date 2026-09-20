import { requireUserSetup } from "@/lib/route_requires";

export default async function Layout({children}: LayoutProps<"/">){
    await requireUserSetup();
    return children
}