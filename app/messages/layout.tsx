import NavBar from "@/components/nav/NavBar"

export default function MessagesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className='flex flex-col min-h-full px-4 md:px-30'>
            <NavBar location='Kumasi ' />
            {children}
        </section>
    )
}
