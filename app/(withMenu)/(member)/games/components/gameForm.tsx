'use client'

import Link from "next/link";
import { Controller, useForm} from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import { GameInput, gameSchema } from "../lib/schema"
import { type GameActionResult } from "../lib/action";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/alert";
import { FormField, errorId } from "@/components/form-field";
import { SectionCard } from "@/components/section-card";
import { CategoryBadge } from "@/components/category-badge";
import type { Tags } from "@/app/(withMenu)/(public)/games/lib/get-tags";
import { MechanicsPicker } from "./mechanics-picker";

type GameFormProps = {
    // Server action called with the validated values (createGame or updateGame bound to an id).
    action: (values: GameInput) => Promise<GameActionResult>;
    defaultValues?: Partial<GameInput>;
    // Categories and mechanics the user can pick.
    tags: Tags;
    submitLabel: string;
    // Where the "Annuler" link goes.
    cancelHref: string;
}

export const GameForm = ({action, defaultValues, tags, submitLabel, cancelHref}: GameFormProps) => {
    const [serverError,setServerError] = useState<string|null>(null);
    const {register, control, watch, handleSubmit, formState: {errors, isSubmitting}} = useForm<GameInput>({
        resolver: zodResolver(gameSchema),
        defaultValues: { mechanic_ids: [], ...defaultValues },
    })

    const category = tags.categories.find(({id}) => id === watch('category_id'));

    const onSubmit = async (values: GameInput) => {
        setServerError(null);
        const result = await action(values);
        if(result?.error){
            setServerError(result.error);
        }

    }

    // Accessibility attributes linking a field to its error message.
    const describe = (name: keyof GameInput) => ({
        'aria-invalid': Boolean(errors[name]),
        'aria-describedby': errors[name] ? errorId(name) : undefined,
    });

 return (<form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500 md:min-h-64 md:w-1/2" aria-hidden>
                <ImageIcon className="size-10"/>
                <p className="font-medium">Images bientôt disponibles</p>
            </div>

            <div className="flex flex-col gap-6 rounded-xl bg-white/80 p-6 shadow-lg md:w-1/2">
                <FormField id="name" label="Nom du jeu" error={errors.name?.message}>
                    <Input id="name" placeholder="Nom du jeu" className="h-auto py-2 text-2xl font-extrabold text-brand-dark md:text-3xl" {...describe('name')} {...register('name')}/>
                </FormField>

                <FormField id="age_threshold" label="À partir de (ans)" error={errors.age_threshold?.message}>
                    <Input type="number" min={0} id="age_threshold" placeholder="8" className="sm:w-32" {...describe('age_threshold')} {...register('age_threshold', {valueAsNumber: true})}/>
                </FormField>

                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-sm font-semibold text-gray-700">Nombre de joueurs</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <RangeInput id="min_players" label="Minimum" placeholder="1" error={errors.min_players?.message} {...describe('min_players')} {...register('min_players', {valueAsNumber:true})}/>
                        <RangeInput id="max_players" label="Maximum" placeholder="8" error={errors.max_players?.message} {...describe('max_players')} {...register('max_players', {valueAsNumber:true})}/>
                    </div>
                </fieldset>

                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-sm font-semibold text-gray-700">Durée d&apos;une partie (minutes)</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <RangeInput id="min_time_minutes" label="Minimum" placeholder="15" error={errors.min_time_minutes?.message} {...describe('min_time_minutes')} {...register('min_time_minutes', {valueAsNumber: true})}/>
                        <RangeInput id="max_time_minutes" label="Maximum" placeholder="120" error={errors.max_time_minutes?.message} {...describe('max_time_minutes')} {...register('max_time_minutes', {valueAsNumber:true})}/>
                    </div>
                </fieldset>
            </div>
        </div>

        <SectionCard title="Catégorie et mécaniques">
            <div className="flex flex-col gap-6">
                <FormField id="category_id" label="Catégorie (public visé)" error={errors.category_id?.message}>
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            id="category_id"
                            className="h-9 rounded-md border border-input bg-white px-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-invalid:border-destructive"
                            {...describe('category_id')}
                            {...register('category_id', {setValueAs: (value) => value === '' ? undefined : Number(value)})}
                        >
                            <option value="">Choisir une catégorie</option>
                            {tags.categories.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
                        </select>
                        {category && <CategoryBadge name={category.name} color={category.color}/>}
                    </div>
                </FormField>

                <FormField
                    id="mechanic_ids"
                    label="Mécaniques"
                    error={errors.mechanic_ids?.message}
                    hint="Une mécanique manque ? Tapez son nom puis « Proposer » : elle sera visible sur le site une fois validée par un administrateur."
                >
                    <Controller
                        control={control}
                        name="mechanic_ids"
                        render={({field}) => (
                            <MechanicsPicker
                                id="mechanic_ids"
                                options={tags.mechanics}
                                value={field.value ?? []}
                                onChange={field.onChange}
                                invalid={Boolean(errors.mechanic_ids)}
                                describedBy={errors.mechanic_ids ? errorId('mechanic_ids') : undefined}
                            />
                        )}
                    />
                </FormField>
            </div>
        </SectionCard>

        <SectionCard title={<Label htmlFor="description" className="text-2xl font-bold text-brand-dark">Description</Label>}>
            <Textarea id="description" rows={8} className="min-h-48" placeholder="Présentez votre jeu : thème, but du jeu, déroulement d'une partie…" {...describe('description')} {...register('description')}/>
            {errors.description && <p id={errorId('description')} role="alert" className="mt-2 text-sm text-destructive">{errors.description.message}</p>}
        </SectionCard>

        {serverError && <Alert>{serverError}</Alert>}

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link href={cancelHref} className={buttonVariants({variant: "outline", size: "lg"})}>Annuler</Link>
            <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Enregistrement…" : submitLabel}</Button>
        </div>
    </form>)
}

type RangeInputProps = React.ComponentProps<typeof Input> & {id: string; label: string; error?: string};

const RangeInput = ({id, label, error, ...props}: RangeInputProps) => (
    <FormField id={id} label={<span className="font-normal text-gray-500">{label}</span>} error={error}>
        <Input type="number" min={1} id={id} {...props}/>
    </FormField>
)
