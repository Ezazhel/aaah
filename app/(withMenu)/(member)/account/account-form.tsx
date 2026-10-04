'use client'

import { createClient } from "@/lib/supabase/client"
import { SubmitEventHandler, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";


type Claims = {sub?:string};

export default function AccountForm({claims}: {claims: Claims | undefined}) {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
   
    const getProfile = useCallback(async () => {
        try {
            if(!claims?.sub){
                setLoading(false);
                return;
            }

            setLoading(true);
            const { data, error, status } = await supabase
            .from('authors')
            .select('first_name,last_name')
            .eq('id', claims.sub)
            .single();

            if(error && status !== 406){
                console.log(error);
                throw error;
            }

            if(data){
                setFirstName(data.first_name!);
                setLastName(data.last_name!);
            }
        }
        catch(error){
            alert('Error loading user data!');
        }
        finally {
            setLoading(false);
        }
    }, [supabase,claims])

    const updateProfile: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const firstName = data.get('firstName') as string;
        const lastName = data.get('lastName') as string;

        if(!firstName || !lastName){
            return;
        }

        try {
            if(!claims?.sub){
                alert('You must be logged in to update your profile');
                return;
            }
            setLoading(true);
            const { error } = await supabase.from('authors').upsert({
                id: claims.sub,
                first_name: firstName,
                last_name: lastName,
                updated_at: new Date().toISOString()
            })
            setFirstName(firstName);
            setLastName(lastName);
        }
        catch(error){
            alert("Couldn't update your profile");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProfile()
    }, [claims, getProfile])


    if(loading){
        return <div>Loading...</div>
    }

    return (<form onSubmit={updateProfile}>
        <div>
            <label htmlFor="firstName">Prénom</label>
            <input type="text" name="firstName" required defaultValue={firstName ?? ''}/>
        </div>
        <div>
            <label htmlFor="lastName">Nom</label>
            <input type="text" name="lastName" required defaultValue={lastName ?? ''}/>
        </div>
        <Button type="submit">Modifier</Button>
        </form>)
}