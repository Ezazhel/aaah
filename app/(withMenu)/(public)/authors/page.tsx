import { Author } from "@/app/model/author";
import { GetAuthor } from "./lib/get-author";
import AuthorCard from "./card";

export default async function Authors() {
    const authors: Author[] = await GetAuthor();
    return <div>
        <h1>Auteur.ices</h1>
        {authors.length ? authors.map(author => (
           <AuthorCard firstName={author.firstName} lastName={author.lastName} key={author.id}/>
       )) : <div>Il n'y a actuellement pas d'auteurs </div>
       }
    </div>
}