interface AuthorDetailProps {
    firstName: string | null;
    lastName?: string | null;
}
export const AuthorDetail = ({firstName, lastName}:AuthorDetailProps) => {
    return <div>
        {firstName} {lastName}
    </div> 
}