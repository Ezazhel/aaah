import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { requireAdmin } from "@/lib/route_requires";
import { GetAdminTags } from "./lib/get-tags";
import { PendingMechanic } from "./components/pending-mechanic";
import { CategoriesEditor } from "./components/categories-editor";
import { MechanicsEditor } from "./components/mechanics-editor";

export const metadata: Metadata = { title: "Catégories et mécaniques" };

export default async function AdminTagsPage() {
    await requireAdmin();
    const { categories, pending, approved } = await GetAdminTags();

    return (<>
        <PageHeader title="Catégories et mécaniques" subtitle="Validez les mécaniques proposées par les auteur·ices et gérez les listes."/>
        <Container className="flex max-w-5xl flex-col gap-8 py-10">
            <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-brand-dark">
                    Mécaniques à valider
                    {pending.length > 0 && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 align-middle text-sm text-white">{pending.length}</span>}
                </h2>
                {pending.length ? (
                    <ul className="flex flex-col gap-4">
                        {pending.map((mechanic) => <PendingMechanic key={mechanic.id} mechanic={mechanic}/>)}
                    </ul>
                ) : (
                    <p className="rounded-xl bg-white/90 p-6 text-center text-gray-600 shadow">Aucune mécanique en attente.</p>
                )}
            </section>

            <SectionCard title="Catégories">
                <CategoriesEditor categories={categories}/>
            </SectionCard>

            <SectionCard title="Mécaniques">
                <MechanicsEditor mechanics={approved}/>
            </SectionCard>
        </Container>
    </>)
}
