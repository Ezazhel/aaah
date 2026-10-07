'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm} from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { GameInput, gameSchema } from "../lib/schema"
import { setGameCover, type GameActionResult } from "../lib/action";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/alert";
import { FormField, errorId } from "@/components/form-field";
import { SectionCard } from "@/components/section-card";
import { GameCover } from "@/components/game-cover";
import { ImagePickerControls } from "@/components/image-picker-controls";
import { GAME_COVER_BUCKET, GAME_COVER_SIZES, gameCoverPath } from "@/lib/game-cover";
import { uploadResizedImage, useImagePicker } from "@/lib/upload-image";
import { CategoryBadge } from "@/components/category-badge";
import type { Tags } from "@/app/(withMenu)/(public)/games/lib/get-tags";
import { MechanicsPicker } from "./mechanics-picker";

type GameFormProps = {
    // Server action called with the validated values (createGame or updateGame bound to an id).
    action: (values: GameInput) => Promise<GameActionResult>;
    defaultValues?: Partial<GameInput>;
    // Edition only: the current cover.
    gameId?: string;
    coverUpdatedAt?: string | null;
    // Categories and mechanics the user can pick.
    tags: Tags;
    submitLabel: string;
    // Where the "Annuler" link goes.
    cancelHref: string;
}

export const GameForm = ({action, defaultValues, gameId, coverUpdatedAt = null, tags, submitLabel, cancelHref}: GameFormProps) => {
    const router = useRouter();
    const [serverError,setServerError] = useState<string|null>(null);
    // New cover chosen but not saved yet, shown as a preview.
    const cover = useImagePicker();
    const {register, control, watch, handleSubmit, formState: {errors, isSubmitting}} = useForm<GameInput>({
        resolver: zodResolver(gameSchema),
        defaultValues: { mechanic_ids: [], ...defaultValues },
    })

    const category = tags.categories.find(({id}) => id === watch('category_id'));

    // The game is saved first: a new game has no id (needed by the cover path) before.
    const onSubmit = async (values: GameInput) => {
        setServerError(null);
        const result = await action(values);
        if('error' in result){
            setServerError(result.error);
            return;
        }

        const failed = (message: string) => setServerError(gameId ? message : `Le jeu a été créé mais ${message.charAt(0).toLowerCase()}${message.slice(1)}`);

        if(cover.file){
            const uploadError = await uploadResizedImage(cover.file, {
                bucket: GAME_COVER_BUCKET,
                sizes: GAME_COVER_SIZES,
                path: size => gameCoverPath(result.id, size),
            });
            if(uploadError){
                failed(uploadError);
                return;
            }
        }
        if(cover.change !== 'unchanged'){
            const saved = await setGameCover(result.id, cover.change);
            if(saved?.error){
                failed(saved.error);
                return;
            }
        }

        router.push(`/games/${result.slug}`);
    }

    const hasCover = Boolean(cover.file) || (Boolean(coverUpdatedAt) && !cover.removed);

    // Accessibility attributes linking a field to its error message.
    const describe = (name: keyof GameInput) => ({
        'aria-invalid': Boolean(errors[name]),
        'aria-describedby': errors[name] ? errorId(name) : undefined,
    });

 return (<form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-col gap-3 md:w-1/2">
                <GameCover
                    gameId={gameId}
                    coverUpdatedAt={cover.removed ? null : coverUpdatedAt}
                    previewUrl={cover.previewUrl}
                    size="lg"
                    fit="contain"
                    className="h-64 rounded-xl shadow-lg md:h-80"
                    diceClassName="text-7xl"
                />
                <ImagePickerControls picker={cover} hasImage={hasCover} noun="l'image" addLabel="Ajouter une image"/>
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
