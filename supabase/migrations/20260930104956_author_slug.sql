create extension if not exists unaccent;


ALTER TABLE authors
    add COLUMN slug text unique;

create or replace function public.set_author_slug()
returns trigger
language plpgsql
as $$
declare
    base_slug text;
    candidate text;
    n int := 1;
begin
    if new.first_name is null or new.last_name is null then
        return new;
    end if;

    base_slug := lower(
        trim(both '-' from regexp_replace(
            unaccent(new.first_name || '-' || new.last_name),
            '[^a-zA-Z0-9]+', '-', 'g'
        ))
    );
    candidate := base_slug;

    while exists (
        select 1 from public.authors
        where slug = candidate and id <> new.id
    ) loop
        n := n + 1;
        candidate := base_slug || '-' || n;
    end loop;

    new.slug := candidate;
    return new;
end;
$$;

create trigger authors_set_slug
    before update of first_name, last_name on public.authors
    for each row execute function public.set_author_slug();