import Link from 'next/link'
import Image from 'next/image'
import AboutHero from '@/components/settings/about/AboutHero'
import CoreValueCard from '@/components/settings/about/CoreValueCard'
import FeatureRow from '@/components/settings/about/FeatureRow'
import MissionStatement from '@/components/settings/about/MissionStatement'
import OurStory from '@/components/settings/about/OurStory'
import { coreValues, aboutFeatures } from '@/constants/about'

export default function AboutUsSettingsPage() {
    return (
        <main className='flex flex-col pb-16'>
            <Link href='/renter/settings' className='flex items-center gap-2 mb-8 w-fit'>
                <Image width={8} height={13} alt='back' src='/svgs/chevron_left.svg' />
                <p className='montserrat-font text-base font-semibold text-black'>About Us</p>
            </Link>

            <AboutHero />

            <div className='flex flex-col items-center text-center gap-4 mb-10 md:mb-14 px-4'>
                <p className='dmSans-font text-xs font-semibold uppercase tracking-wide text-smallGreyText'>Our Process</p>
                <h2 className='montserrat-font text-2xl md:text-3xl font-bold text-black'>Our Core Values</h2>
                <p className='dmSans-font text-sm text-smallGreyText max-w-xl'>
                    At Rentrospect, our core values drive everything we do. We believe in building strong
                    relationships with our clients and delivering exceptional results through collaboration and
                    innovation.
                </p>
            </div>

            <div className='flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-8 mb-16 md:mb-24'>
                {coreValues.map((value) => (
                    <CoreValueCard key={value.id} value={value} />
                ))}
            </div>

            <div className='flex flex-col gap-16 md:gap-24 mb-16 md:mb-24'>
                {aboutFeatures.map((feature) => (
                    <FeatureRow key={feature.id} feature={feature} />
                ))}
            </div>

            <div className='mb-10 md:mb-14'>
                <MissionStatement />
            </div>

            <OurStory />
        </main>
    )
}
