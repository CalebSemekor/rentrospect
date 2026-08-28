import Image from 'next/image'
import type { CoreValue } from '@/constants/about'

interface CoreValueCardProps {
    value: CoreValue
}

const CoreValueCard: React.FC<CoreValueCardProps> = ({ value }) => {
    return (
        <div className='flex flex-col items-center text-center gap-4 max-w-70'>
            <Image
                width={112}
                height={112}
                alt={value.title}
                src={value.image}
                className='size-28 rounded-full object-cover'
            />
            <div className='flex flex-col gap-2'>
                <h3 className='montserrat-font text-base font-bold text-black'>{value.title}</h3>
                <p className='dmSans-font text-sm text-smallGreyText leading-relaxed'>{value.description}</p>
            </div>
        </div>
    )
}

export default CoreValueCard
