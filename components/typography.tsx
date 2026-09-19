export default function Typography({children,...props}: React.ComponentProps<'div'>) {
    return <span {...props}>{children}</span>
}