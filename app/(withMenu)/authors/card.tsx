import Typography from "@/components/typography";

type AuthorProps = {
    fullName: string;
}

export default function AuthorCard({fullName}:AuthorProps) {
    const [first, last] = fullName.split(' ');
    const initial = `${first[0]}${last[0]}`;
    return (
        <div className="bg-background size-48 min-h-0 flex flex-col flex-1 items-center gap-4 p-4">
            <div className="bg-gray-500 rounded-full size-24 border flex flex-col justify-center items-center">
                <Typography className="uppercase text-4xl">{initial}</Typography>
            </div>
            <div className="flex flex-col">
                <strong>{fullName}</strong>
            </div>
        </div>
    )
}