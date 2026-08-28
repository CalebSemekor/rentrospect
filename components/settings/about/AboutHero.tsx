import Image from 'next/image'

const AboutHero: React.FC = () => {
    return (
        <div className='relative left-1/2 -translate-x-1/2 w-screen h-[441px] md:h-[720px] overflow-hidden mb-14 md:mb-20'>
            <Image
                fill
                priority
                alt='Rentrospect'
                src='/images/about/rentrospect_building.png'
                className='object-cover'
            />
            <div className='absolute inset-0 bg-black/50' />
            <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-6'>
                <h1 className='montserrat-font text-3xl md:text-5xl font-bold text-white mb-4 tracking-wide'>ABOUT US</h1>
                <p className='dmSans-font text-sm md:text-base text-white/90 max-w-xl'>
                    We are committed to providing innovative solutions and exceptional service. Our team of experts is
                    dedicated to helping you achieve your goals through cutting-edge technology and personalized
                    support.
                </p>
            </div>
        </div>
    )
}

export default AboutHero
