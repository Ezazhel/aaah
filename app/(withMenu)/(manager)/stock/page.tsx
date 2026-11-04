import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form-field";
import { H2 } from "@/components/typography";
import { LOAN_STATUS_LABELS, memberName } from "@/app/model/inventory";
import { GetCatalogItems, GetManagedLocations, type ManagedLocation } from "./lib/get-stock";
import { createItem, createLocation, setStock } from "./lib/action";
import { ActionForm } from "./components/action-form";
import { LoanActions } from "./components/loan-actions";

export const metadata: Metadata = { title: "Mon stock" };

const selectClass = "h-9 w-full rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: 'Europe/Paris' }).format(new Date(value));

function LocationFields() {
    return (<>
        <FormField id="location-name" label="Nom du lieu">
            <Input id="location-name" name="name" maxLength={120} required placeholder="Ex. Le bar à jeux, chez Camille…"/>
        </FormField>
        <FormField id="location-address" label="Adresse ou indication (facultatif)">
            <Input id="location-address" name="address" maxLength={300}/>
        </FormField>
        <FormField id="location-description" label="Infos pratiques (facultatif)" hint="Horaires, comment récupérer le matériel…">
            <Textarea id="location-description" name="description" maxLength={2000} rows={3}/>
        </FormField>
    </>);
}

function LocationSection({ location, catalog }: { location: ManagedLocation; catalog: Awaited<ReturnType<typeof GetCatalogItems>> }) {
    const inStock = new Set(location.stock.map((row) => row.item_id));
    const addable = catalog.filter((item) => !inStock.has(item.id));
    const field = (name: string) => `${name}-${location.id}`;

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <H2>{location.name}</H2>
                {location.address && <p className="flex items-center gap-1.5 text-gray-600"><MapPin className="size-4" aria-hidden/>{location.address}</p>}
                {location.description && <p className="text-gray-700">{location.description}</p>}
            </div>

            <SectionCard title="Prêts en cours">
                {location.loans.length ? (
                    <ul className="flex flex-col divide-y divide-gray-200">
                        {location.loans.map((loan) => (
                            <li key={loan.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex flex-col gap-1">
                                    <p className="font-semibold text-brand-dark">{loan.quantity} × {loan.item?.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {memberName(loan.borrower)} · {LOAN_STATUS_LABELS[loan.status]} · {loan.borrowed_at ? `emprunté le ${formatDate(loan.borrowed_at)}` : `demandé le ${formatDate(loan.created_at)}`}
                                    </p>
                                    {loan.message && <p className="text-sm text-gray-700">« {loan.message} »</p>}
                                </div>
                                <LoanActions loanId={loan.id} status={loan.status}/>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-600">Aucune demande ni prêt en cours.</p>}
            </SectionCard>

            <SectionCard title="Stock">
                <div className="flex flex-col gap-6">
                    {location.stock.length ? (
                        <ul className="flex flex-col divide-y divide-gray-200">
                            {location.stock.map((row) => (
                                <li key={row.item_id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-brand-dark">{row.item?.name}</span>
                                        <span className="text-sm text-gray-600">
                                            {row.available} disponible{row.available > 1 ? 's' : ''}{row.reserved > 0 && ` · ${row.reserved} réservé${row.reserved > 1 ? 's' : ''}`}
                                        </span>
                                    </div>
                                    <ActionForm action={setStock} submitLabel="Enregistrer" compact>
                                        <input type="hidden" name="location_id" value={location.id}/>
                                        <input type="hidden" name="item_id" value={row.item_id}/>
                                        <Input aria-label={`Quantité en stock : ${row.item?.name}`} name="quantity" type="number" min={0} defaultValue={row.quantity} className="w-24" required/>
                                    </ActionForm>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-600">Aucun article dans ce lieu pour le moment.</p>}

                    {addable.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold text-brand-dark">Ajouter un article du catalogue</h3>
                            <ActionForm action={setStock} submitLabel="Ajouter" compact>
                                <input type="hidden" name="location_id" value={location.id}/>
                                <select aria-label="Article" name="item_id" className={`${selectClass} sm:w-72`} required>
                                    {addable.map((item) => <option key={item.id} value={item.id}>{item.name}{item.category && ` (${item.category})`}</option>)}
                                </select>
                                <Input aria-label="Quantité" name="quantity" type="number" min={0} defaultValue={1} className="w-24" required/>
                            </ActionForm>
                        </div>
                    )}

                    <details className="rounded-lg border border-gray-200 p-4">
                        <summary className="cursor-pointer font-semibold text-brand-dark">Nouvel article (ajouté au catalogue commun)</summary>
                        <ActionForm action={createItem} submitLabel="Créer l'article" className="mt-4">
                            <input type="hidden" name="location_id" value={location.id}/>
                            <div className="grid gap-3 sm:grid-cols-[1fr_12rem_7rem]">
                                <FormField id={field('item-name')} label="Nom">
                                    <Input id={field('item-name')} name="name" maxLength={120} required placeholder="Ex. Dés 6 faces rouges"/>
                                </FormField>
                                <FormField id={field('item-category')} label="Type (facultatif)">
                                    <Input id={field('item-category')} name="category" maxLength={60} placeholder="Boîte, dés, cartes…"/>
                                </FormField>
                                <FormField id={field('item-quantity')} label="Quantité">
                                    <Input id={field('item-quantity')} name="quantity" type="number" min={0} defaultValue={1} required/>
                                </FormField>
                            </div>
                            <FormField id={field('item-description')} label="Description (facultatif)">
                                <Textarea id={field('item-description')} name="description" maxLength={2000} rows={2} placeholder="Dimensions, couleur…"/>
                            </FormField>
                        </ActionForm>
                    </details>
                </div>
            </SectionCard>
        </section>
    );
}

export default async function StockPage() {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getClaims();
    if(!auth?.claims){
        redirect('/auth/login');
    }
    const [locations, catalog] = await Promise.all([GetManagedLocations(auth.claims.sub), GetCatalogItems()]);

    return (<>
        <PageHeader title="Mon stock" subtitle="Le matériel que vous prêtez aux auteur·ices de l'association."/>
        <Container className="flex max-w-5xl flex-col gap-14 py-10">
            {locations.map((location) => (
                <LocationSection key={location.id} location={location} catalog={catalog}/>
            ))}

            <SectionCard title={locations.length ? "Ajouter un autre lieu" : "Créer mon lieu de stockage"}>
                {!locations.length && <p className="mb-4 text-gray-700">Commencez par décrire l&apos;endroit où le matériel est stocké. Vous pourrez ensuite y ajouter des articles.</p>}
                <ActionForm action={createLocation} submitLabel="Créer le lieu">
                    <LocationFields/>
                </ActionForm>
            </SectionCard>
        </Container>
    </>)
}
