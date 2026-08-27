interface DocSectionProps {
    id: string
    heading: string
    children: React.ReactNode
}

// `scroll-mt-24` keeps the section from landing flush under the sticky back
// header when the "On this page" sidebar scrolls it into view.
export const DocSection: React.FC<DocSectionProps> = ({ id, heading, children }) => (
    <section id={id} className='scroll-mt-24 mb-9'>
        <h2 className='montserrat-font text-base font-bold text-black uppercase mb-3'>{heading}</h2>
        {children}
    </section>
)

export const DocParagraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className='dmSans-font text-sm text-otherSmallText leading-relaxed mb-3'>{children}</p>
)

export const DocLead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className='font-semibold text-black'>{children}&nbsp;</span>
)

export const DocList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ul className='list-disc pl-5 flex flex-col gap-2 mb-3'>{children}</ul>
)

export const DocListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className='dmSans-font text-sm text-otherSmallText leading-relaxed'>{children}</li>
)
