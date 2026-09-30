import { Author } from "@/app/model/author";
import { GetAuthors } from "./lib/get-authors";
import AuthorCard from "./card";

export default async function Authors() {
    const authors = await GetAuthors();
    return <div>
        <h1>Auteur.ices</h1>
        {authors.length ? authors.map(author => (
           <AuthorCard firstName={author.first_name} lastName={author.last_name} key={author.slug} slug={author.slug!}/>
       )) : <div>Il n'y a actuellement pas d'auteurs </div>
       }
    </div>
}