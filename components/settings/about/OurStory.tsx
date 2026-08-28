import Image from 'next/image'

const OurStory: React.FC = () => {
    return (
        <div className='flex flex-col md:flex-row items-center gap-8 md:gap-14 bg-white rounded-3xl p-6 md:p-10'>
            <div className='relative w-full md:w-2/5 h-56 md:h-72 rounded-2xl overflow-hidden shrink-0'>
                {/* Placeholder — swap for a real team/office photo when one is available */}
                <Image fill alt='Rentrospect' src='/images/about/rentrospect_building.png' className='object-cover' />
            </div>
            <div className='flex flex-col gap-4'>
                <h3 className='montserrat-font text-xl md:text-2xl font-bold text-black'>Our Story</h3>
                <p className='dmSans-font text-sm text-smallGreyText leading-relaxed'>
                    In our communities, events are more than just gatherings—they are milestones. Whether it&apos;s
                    the joy of a wedding, the blessing of a naming ceremony, or the respectful farewell of a funeral,
                    these moments bring us together with a logistical mountain of finding, securing, and
                    transporting the right equipment.
                </p>
                <p className='dmSans-font text-sm text-smallGreyText leading-relaxed'>
                    We noticed a gap. Vendors with high-end equipment were relying on word-of-mouth, while families
                    and event planners were stressing over unreliable deliveries and hidden costs.
                </p>
                <p className='dmSans-font text-sm text-smallGreyText leading-relaxed'>
                    We built Rentrospect to fix that. We wanted to replace the uncertainty of event planning with a
                    verified, digital handshake. By removing upfront holding fees and prioritizing in-person
                    meetups, we&apos;ve created a platform where local rental businesses can thrive and communities
                    can celebrate with absolute peace of mind.
                </p>
            </div>
        </div>
    )
}

export default OurStory
