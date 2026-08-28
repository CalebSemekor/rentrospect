const MissionStatement: React.FC = () => {
    return (
        <div className='relative bg-greenBookingBg rounded-3xl px-8 py-12 md:px-16 md:py-16 overflow-hidden'>
            <span
                aria-hidden
                className='absolute top-4 right-8 md:top-6 md:right-12 text-white/10 text-8xl md:text-9xl font-serif leading-none select-none'
            >
                &rdquo;
            </span>
            <p className='dmSans-font text-xs font-semibold uppercase tracking-wide text-white/60 mb-4'>Mission Statement</p>
            <p className='montserrat-font text-2xl md:text-4xl font-bold text-white leading-tight max-w-2xl'>
                To power community celebrations by building the most trusted, transparent, and seamless equipment
                rental network in Ghana.
            </p>
        </div>
    )
}

export default MissionStatement
