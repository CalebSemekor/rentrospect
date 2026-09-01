'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LoneAsset } from '@/types/asset'
import StatTile from '@/components/StatTile'
import Accordion from '@/components/Accordion'
import BottomSheet from '@/components/BottomSheet'
import DateSelect from '@/components/DateSelectTile'
import QuantityStepper from '@/components/QuantityStepper'

interface AssetDetailsClientProps {
    id: string
    assetProps: LoneAsset
}

const AssetDetailsClient: React.FC<AssetDetailsClientProps> = ({ id, assetProps }) => {
    const router = useRouter()
    const [quantity, setQuantity] = useState(1)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const primaryImage = assetProps.images.find((image) => image.isPrimary) ?? assetProps.images[0]
    const otherImages = assetProps.images.filter((image) => !image.isPrimary)

    const canPlaceOrder = Boolean(startDate && endDate && quantity > 0)

    const handlePlaceOrder = () => {
        if (!canPlaceOrder) return

        const params = new URLSearchParams({
            assetId: id,
            name: assetProps.assetName,
            image: primaryImage.imageUrl,
            rate: String(assetProps.rate),
            pricingUnit: assetProps.pricingUnit,
            quantity: String(quantity),
            startDate,
            endDate,
            category: assetProps.category,
            vendor: assetProps.vendor,
        })

        router.push(`/booking?${params.toString()}`)
    }

    return (
        <main className='flex flex-col md:flex-row md:gap-3 items-center md:items-start'>
            <div className='flex flex-col gap-6'>
                <Image
                    width={430}
                    height={373}
                    alt='asset image'
                    src={primaryImage.imageUrl}
                    className='rounded-md'
                />
                <div className='hidden md:flex gap-6 '>
                    {otherImages.map((imageStruct, index) => (
                        <div key={index} className='shrink-0'>
                            <Image
                                height={103}
                                width={146.66}
                                alt='asset image'
                                src={imageStruct.imageUrl}
                                className='rounded-md'
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className='hidden md:flex flex-col flex-1 mb-7'>
                <div className='hidden md:flex flex-col bg-white pl-6 pr-3.5 py-6 flex-1 mb-4.5'>
                    <h4 className='montserrat-font text-[2rem] font-bold leading-12 tracking-[-0.06rem] mb-1.5'>{assetProps.assetName}</h4>
                    <div className='flex mb-5 gap-2.5 items-center'>
                        {/* Rating stars */}
                        {/* TODO: Some number of reviews */}
                        <p>29 Reviews</p>
                        <div className='flex capitalize px-4 py-0.5 inter-font text-[#5C5F6A] border border-[#E6E7E8] rounded-[100px] text-[12px] font-medium leading-6'>IN STOCK</div>
                    </div>
                    <p className='dmSans-font text-[20px] leading-7.5 text-[#596780] mb-6'>{assetProps.description}</p>
                    <div className='grid grid-cols-4 gap-y-4 gap-x-4 w-full mb-11.5'>
                        <p className='plusJakartaSans-font text-[20px] leading-7.5 tracking-[-0.4px] text-[#90A3BF]'>Category:</p>
                        <p className='plusJakartaSans-font text-[20px] leading-7.5 tracking-[-0.4px] font-semibold text-[#596780] capitalize'>{assetProps.category}</p>
                        <p className='plusJakartaSans-font text-[20px] leading-7.5 tracking-[-0.4px] text-[#90A3BF]'>Condition:</p>
                        <p className='capitalize plusJakartaSans-font text-[20px] leading-7.5 tracking-[-0.4px] font-semibold text-[#596780]'>{assetProps.condition.replace('_', ' ')}</p>
                        <p className='plusJakartaSans-font text-[20px] leading-7.5 tracking-[-0.4px] text-[#90A3BF]'>Location:</p>
                        <p className='plusJakartaSans-font text-[20px] leading-7.5 tracking-[-0.4px] font-semibold text-[#596780]'>{assetProps.location}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p className='text-[28px] font-bold dmSans-font text-[#1A202C]'>₵{assetProps.rate}/<span className='text-[16px] text-gray-600'>{assetProps.pricingUnit}</span></p>
                        <QuantityStepper max={assetProps.quantity} initialValue={quantity} onChange={setQuantity} />
                    </div>
                </div>
                {/* Owner details */}
                <div className='flex justify-between my-6.25 items-center bg-white py-6.25 px-7'>
                    <div className='flex gap-1.5 items-center'>
                        <Image
                            width={36}
                            height={36}
                            alt='business owner'
                            // TODO: Alter for real vendor image
                            src='/images/Avatar.png'
                            className='rounded-lg'
                        />

                        <div className='flex flex-col'>
                            <p className='capitalize dmSans-font text-[.5rem] font-medium leading-2 text-black'>Business Owner</p>
                            <p className='capitalize dmSans-font text-[.8125rem] font-bold leading-3.25 text-black'>{assetProps.vendor}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <div className='bg-nearWhiteBg p-2.5 rounded-lg flex cursor-pointer'>
                            <Image
                                width={16}
                                height={16}
                                alt='call_icon'
                                src='/svgs/auth/phone.svg'
                            />
                        </div>
                        <div className='bg-nearWhiteBg p-2.5 rounded-lg flex cursor-pointer'>
                            <Image
                                width={16}
                                height={16}
                                alt='messages_icon'
                                src='/svgs/messages.svg'
                            />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col pt-8.25 px-6 bg-white mb-4'>
                    <h4 className='uppercase montserrat-font font-bold text-[16px] mb-6.25'>About vendor</h4>
                    <p className='text-otherSmallText inter-font text-[16px] leading-6.5 mb-7'>{assetProps.aboutVendor}</p>
                </div>
                {/* Stat Tiles */}
                <div className='flex bg-white px-6 gap-1.5 py-7'>
                    <StatTile
                        icon={'/svgs/verification_badge.svg'}
                        main={'Verified Vendor'}
                        desc={'Background checked by the Curator'}
                    />
                    <StatTile
                        icon={'/svgs/response_time.svg'}
                        main={'Fast Response'}
                        desc={'Usually replies within 30 minutes'}
                    />
                </div>
                <div className='flex flex-col bg-white mt-4 px-6'>
                    <h4 className='mt-8.25 montserrat-font text-[1rem] font-bold mb-6.25'>Duration</h4>
                    <div className='flex gap-4 items-center justify-around mb-8.25'>
                        <DateSelect value={startDate} onChange={setStartDate} />
                        <DateSelect value={endDate} onChange={setEndDate} />
                    </div>
                </div>
                <div className='flex flex-col gap-4 mt-4'>
                    <Accordion title='asset tags'>

                    </Accordion>
                    <Accordion title='asset quantity'>

                    </Accordion>
                    <Accordion title='asset condition'>

                    </Accordion>
                    <Accordion title='return policies'>

                    </Accordion>
                    <Accordion title='reviews'>

                    </Accordion>
                </div>
                <button
                    type='button'
                    onClick={handlePlaceOrder}
                    disabled={!canPlaceOrder}
                    className='mt-8 bg-black rounded-xl md:rounded-2xl px-6 py-3 w-full text-sm md:text-[16px] font-semibold text-white dmSans-font shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                    Place order
                </button>
            </div>
            <BottomSheet
                price={assetProps.rate}
                owner={assetProps.vendor}
                // TODO: Rating
                rating={4.2}
                name={assetProps.assetName}
                pricingUnit={assetProps.pricingUnit}
                reviews={230}
                quantity={quantity}
                onQuantityChange={setQuantity}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                about={assetProps.aboutVendor}
                category={assetProps.category}
                max={assetProps.quantity}
                // ownerSrc={assetProps.vendorSrc}
                description={assetProps.description}
                assetSrc={primaryImage.imageUrl}
                progress={0}
                onPlaceOrder={handlePlaceOrder}
            />
        </main>
    )
}

export default AssetDetailsClient
