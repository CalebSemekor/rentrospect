import Link from 'next/link'
import Image from 'next/image'

interface ComingSoonProps {
    title: string
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
    return (
        <main className='flex flex-col pb-16'>
            <Link href='/renter/settings' className='flex items-center gap-2 mb-8 w-fit'>
                <Image width={8} height={13} alt='back' src='/svgs/chevron_left.svg' />
                <p className='montserrat-font text-base font-semibold text-black'>{title}</p>
            </Link>

            <div className='flex flex-col items-center text-center py-10 md:py-16'>
                <Image
                    width={640}
                    height={674}
                    alt='We are coming soon!! Stay tuned for something amazing'
                    src='/images/coming_soon.png'
                    className='w-80 md:w-125 h-auto'
                />
            </div>
        </main>
    )
}

export default ComingSoon
