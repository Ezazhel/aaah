import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request){
    const supabase = await createClient();
    await supabase.auth.signOut();
    
    revalidatePath('/','layout');

    // Signed out because the membership expired: explain it on the login page.
    const { searchParams } = new URL(request.url);
    if(searchParams.get('reason') === 'membership'){
        redirect('/auth/login?error=membership');
    }
    redirect('/')
}
