import { requireLocationManager } from "@/lib/route_requires";

/**
 * Stock manager pages (members of the association or partners such as a game bar,
 * who sign in without a membership).
 */
export default async function Layout({children}: LayoutProps<"/">) {
    await requireLocationManager();
    return children;
}
