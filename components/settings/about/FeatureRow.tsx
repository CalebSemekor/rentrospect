import Link from 'next/link'
import Image from 'next/image'
import type { AboutFeature } from '@/constants/about'

interface FeatureRowProps {
    feature: AboutFeature
}

const FeatureRow: React.FC<FeatureRowProps> = ({ feature }) => {
    return (
        <div
            className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 ${
                feature.imagePosition === 'left' ? 'md:flex-row-reverse' : ''
            }`}
        >
            <div className='flex flex-col gap-4 max-w-md'>
                <h3 className='montserrat-font text-xl md:text-2xl font-bold text-black'>{feature.title}</h3>
                <p className='dmSans-font text-sm text-smallGreyText leading-relaxed'>{feature.description}</p>
                <Link href='/vendorAuth' className='flex items-center gap-1.5 dmSans-font text-sm font-semibold text-black w-fit'>
                    Set Up Your Shop
                    <span aria-hidden>→</span>
                </Link>
            </div>

            <div className='relative w-full max-w-90 aspect-382/347 shrink-0'>
                <Image fill alt={feature.title} src={feature.image} className='object-contain' />
            </div>
        </div>
    )
}

export default FeatureRow
