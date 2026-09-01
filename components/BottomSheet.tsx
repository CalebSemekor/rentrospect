"use client";

import Image from 'next/image';
import StatTile from './StatTile';
import Accordion from './Accordion';
import DateSelect from './DateSelectTile';
import QuantityStepper from './QuantityStepper';
import { RentalTileProps } from './RentalTile';

export interface BottomSheetProps extends RentalTileProps {
    about?: string
    owner?: string
    rating?: number
    placed?: boolean
    reviews?: number
    ownerSrc?: string
    category?: string
    isPending?: boolean
    pricingUnit?: string
    description?: string
    max?: number
    startDate?: string
    endDate?: string
    onStartDateChange?: (value: string) => void
    onEndDateChange?: (value: string) => void
    onQuantityChange?: (quantity: number) => void
    onPlaceOrder?: () => void
}

const BottomSheet: React.FC<BottomSheetProps> = ({
    max,
    name,
    price,
    about,
    owner,
    rating,
    reviews,
    ownerSrc,
    category,
    description,
    pricingUnit,
    quantity = 1,
    startDate = '',
    endDate = '',
    onStartDateChange,
    onEndDateChange,
    onPlaceOrder,
    placed = false,
    onQuantityChange,
    isPending = false,
}) => {
    return (
        <div className="relative flex md:hidden flex-col bg-[#F3F4F6] rounded-t-[40px] pt-8 pb-6">

            {/* Center Notch */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12 bg-white rounded-b-4xl" />

            {/* Left Curve */}
            <div className="absolute -top-6 left-0 w-12 h-12 bg-white rounded-full" />

            {/* Right Curve */}
            <div className="absolute -top-6 right-0 w-12 h-12 bg-white rounded-full" />

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-4">
                <div className='flex px-6 justify-between'>
                    <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded">{category}</span>
                    <p className='text-[#0E0E10] dmSans-font text-[1.25rem] font-semibold leading-7.5'>₵{price}/{pricingUnit}</p>
                </div>
                <p className='px-6 leading-32.5 dmSans-font text-2xl font-semibold text-[#121111]'>{name}</p>

                <div className='flex px-6'>
                    <div className='flex items-center'>
                        <div className='flex gap-2'>
                            <Image
                                width={14.887}
                                height={14.217}
                                alt='rating star'
                                src='/svgs/rating-star.svg'
                            />
                            <p className='text-[.75rem] text-[#787676] leading-[14.4px] dmSans-font'>{rating} <span className='text-[#347EFB]'>({reviews} reviews)</span></p>
                        </div>
                    </div>
                    <QuantityStepper max={max} initialValue={quantity} onChange={onQuantityChange} />
                </div>
                <div className='flex flex-col gap-0.5 px-6'>
                    <p className='text-[#878787] dmSans-font text-[12px] leading-4.5'>{description}</p>
                    <p className='text-[#121111] font-semibold dmSans-font text-[.875rem]'>Read More...</p>
                </div>
                {/* White background container */}
                <div className='flex flex-col bg-white px-6'>
                    {/* Inner container */}
                    <div className='flex justify-between my-6.25 items-center'>
                        {/* Owner details */}
                        <div className='flex gap-1.5 items-center'>
                            <Image
                                width={36}
                                height={36}
                                src={ownerSrc ?? '/images/Avatar.png'}
                                alt='business owner'
                                className='rounded-lg'
                            />

                            <div className='flex flex-col'>
                                <p className='capitalize dmSans-font text-[8px] font-medium leading-2 text-black'>Business Owner</p>
                                <p className='capitalize dmSans-font text-[13px] font-bold leading-3.25 text-black'>{owner}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <div className='bg-nearWhiteBg p-2.5 rounded-lg flex cursor-pointer'>
                                <Image
                                    width={11.665}
                                    height={11.665}
                                    alt='call_icon'
                                    src='/svgs/auth/phone.svg'
                                />
                            </div>
                            <div className='bg-nearWhiteBg p-2.5 rounded-lg flex cursor-pointer'>
                                <Image
                                    width={11.665}
                                    height={11.665}
                                    alt='messages_icon'
                                    src='/svgs/messages.svg'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* About the vendor */}
                <div className='flex flex-col bg-white px-6'>
                    <h4 className='capitalize montserrat-font text-[1rem] font-bold mt-4.25'>about vendor</h4>
                    <p className='text-otherSmallText inter-font text-[1rem] leading-6.5 mt-2 mb-5'>{about}</p>
                </div>
                {/* Stat Tiles */}
                <div className='flex bg-white px-6 md:px-1 gap-6 py-7'>
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
                    <div className='flex gap-4 items-center justify-around pb-3'>
                        <DateSelect value={startDate} onChange={onStartDateChange} />

                        <DateSelect value={endDate} onChange={onEndDateChange} />
                    </div>
                </div>
                <div className='flex flex-col gap-4 mt-4'>
                    <Accordion title='asset tags'>

                    </Accordion>
                    <Accordion title='asset condition'>

                    </Accordion>
                    <Accordion title='return policies'>

                    </Accordion>
                    <Accordion title='reviews'>

                    </Accordion>
                </div>

                <div className='flex flex-col gap-2 px-6 mt-4'>
                    <button
                        type="button"
                        onClick={onPlaceOrder}
                        disabled={isPending}
                        className="bg-black rounded-xl px-6 py-3 w-full text-sm font-semibold text-white dmSans-font shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Placing order..." : "Place order"}
                    </button>
                    {placed && (
                        <p className="text-sm text-green-600 dmSans-font">
                            Order placed for {quantity} {quantity === 1 ? "item" : "items"}.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BottomSheet
