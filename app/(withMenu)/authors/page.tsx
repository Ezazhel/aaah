import { GetAuthor } from "./_lib/get-author";
import AuthorCard from "./card";

export default async function Authors() {
    const authors = GetAuthor();
    return <div>
        <h1>Auteur.ices</h1>
       {authors.map(author => (
           <AuthorCard fullName="Steven Jeanne" key={author.id}/>
       ))}
    </div>
}