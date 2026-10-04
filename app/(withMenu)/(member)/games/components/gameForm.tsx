'use client'

import { useForm} from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { GameInput, gameSchema } from "../lib/schema"
import { type GameActionResult } from "../lib/action";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type GameFormProps = {
    // Server action called with the validated values (createGame or updateGame bound to an id).
    action: (values: GameInput) => Promise<GameActionResult>;
    defaultValues?: GameInput;
    submitLabel: string;
}

export const GameForm = ({action, defaultValues, submitLabel}: GameFormProps) => {
    const [serverError,setServerError] = useState<string|null>(null);
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<GameInput>({
        resolver: zodResolver(gameSchema),
        defaultValues,
    })

    const onSubmit = async (values: GameInput) => {
        setServerError(null);
        const result = await action(values);
        if(result?.error){
            setServerError(result.error);
        }

    }


 return (<form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
            <label htmlFor="name">Nom</label>
            <input id="name" placeholder="Nom du jeu" {...register('name')}/>
            {errors.name && <p role="alert">{errors.name.message}</p>}
        </div>
        <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" className="block w-full" rows={5} {...register('description')}/>
            {errors.description && <p role="alert">{errors.description.message}</p>}
        </div>
        <div>
            <label htmlFor="age_threshold">À partir de (ans)</label>
            <input type="number" min={0} className="w-16" id="age_threshold" placeholder="8" {...register('age_threshold', {valueAsNumber: true})}/>
            {errors.age_threshold && <p role="alert">{errors.age_threshold.message}</p>}
        </div>
        <fieldset>
            <legend>Durée d&apos;une partie (minutes)</legend>
            <div>
                <input type="number" min={1} className="w-16" id="min_time_minutes" placeholder="15" pattern="[0-9]+" {...register('min_time_minutes', {valueAsNumber: true})}/>
                {errors.min_time_minutes && <p role="alert">{errors.min_time_minutes.message}</p>}
                <span>-</span>
                <input type="number" min={1} className="w-16" placeholder="120" id="max_time_minutes" pattern="[0-9]+" {...register('max_time_minutes', {valueAsNumber:true})}/>
                {errors.max_time_minutes && <p role="alert">{errors.max_time_minutes.message}</p>}
            </div>

        </fieldset>
        <fieldset>
            <legend>Nombre de joueurs</legend>
            <div>
                <input type="number" min={1} className="w-16" id="min_players" placeholder="1" pattern="[0-9]+" {...register('min_players', {valueAsNumber:true})}/>
                {errors.min_players && <p role="alert">{errors.min_players.message}</p>}
                <span>-</span>
                <input type="number" min={1} className="w-16" placeholder="8" pattern="[0-9]+" {...register('max_players', {valueAsNumber:true})}/>
                {errors.max_players && <p role="alert">{errors.max_players.message}</p>}
            </div>
        </fieldset>
        {serverError && <p role="alert">{serverError}</p>}
        <Button type="submit" disabled={isSubmitting}>{submitLabel}</Button>
    </form>)
}
