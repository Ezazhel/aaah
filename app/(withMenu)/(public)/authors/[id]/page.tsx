import { GetAuthor } from "../lib/get-author"
import { AuthorDetail } from "./details";

export default async function AuthorDetailPage({params}:{params: Promise<{id:string}>}) {
    const { id } = await params;

    const author = await GetAuthor(id);

    return <AuthorDetail firstName={author.first_name} lastName={author.last_name}/>
}