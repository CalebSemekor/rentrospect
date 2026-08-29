import Link from 'next/link'
import Image from 'next/image'
import ProgressBar from './ProgressBar'

export type RentalStatus = 'completed' | 'pending' | 'in_progress' | 'delayed' | 'shipped' | 'cancelled'

export interface RentalTileProps {
    id?: string
    name: string
    price?: number
    pricingUnit?: string
    assetSrc: string
    quantity?: number
    progress: number
    // The backend sends a plain string (not a strict enum), so this is
    // normalized against `statusMeta` at render time rather than trusted
    // as-is — see `resolveStatusMeta`.
    status?: string
    statusDetail?: string
    startDate?: string
    endDate?: string
}

const statusMeta: Record<RentalStatus, { label: string; textClass: string; barClass: string }> = {
    completed: { label: 'Completed', textClass: 'text-black', barClass: 'bg-[#1E293B]' },
    in_progress: { label: 'In Progress', textClass: 'text-[#2563EB]', barClass: 'bg-[#2563EB]' },
    pending: { label: 'Pending', textClass: 'text-smallGreyText', barClass: 'bg-[#9CA3AF]' },
    delayed: { label: 'Delayed', textClass: 'text-[#DC2626]', barClass: 'bg-[#DC2626]' },
    shipped: { label: 'Shipped', textClass: 'text-[#0891B2]', barClass: 'bg-[#0891B2]' },
    cancelled: { label: 'Cancelled', textClass: 'text-smallGreyText', barClass: 'bg-[#9CA3AF]' },
}

// Tolerates casing/separator differences from the backend (e.g. "In Progress",
// "in-progress") and falls back to a neutral style for anything unrecognized
// instead of crashing on a missing lookup.
const resolveStatusMeta = (raw?: string) => {
    const key = (raw ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_')
    return statusMeta[key as RentalStatus] ?? { label: raw || 'Unknown', textClass: 'text-smallGreyText', barClass: 'bg-[#9CA3AF]' }
}

const formatDateRange = (start?: string, end?: string) => {
    if (!start || !end) return ''
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return ''
    const startLabel = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endLabel = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return `${startLabel} - ${endLabel}`
}

const RentalTile: React.FC<RentalTileProps> = ({
    id,
    name,
    price,
    pricingUnit,
    assetSrc,
    quantity,
    progress,
    status,
    statusDetail,
    startDate,
    endDate,
}) => {
    const meta = resolveStatusMeta(status)

    return (
        <Link
            href={`/renter/rentals/${id}`}
            className='flex flex-col w-full h-full rounded-4xl py-7 px-6 shadow-md bg-white'
        >
            <div className='flex gap-6.75 mb-4.25'>
                <Image
                    width={112}
                    height={112}
                    src={assetSrc}
                    alt={name}
                    className='size-28 shrink-0 object-cover rounded-[20px]'
                />
                <div className='flex flex-col gap-0.5 min-w-0'>
                    <p className='poppins-font text-[12px] text-black truncate'>ID:&nbsp;<span className='font-semibold'>{id}</span></p>
                    <p className='poppins-font text-[12px] text-black line-clamp-2'>Name:&nbsp;<span className='font-semibold'>{name}</span></p>
                    <p className='poppins-font text-[12px] text-black'>Quantity:&nbsp;<span className='font-semibold'>{quantity}</span></p>
                    {price !== undefined && (
                        <p className='poppins-font text-[12px] text-black'>
                            Cost:&nbsp;<span className='font-semibold'>₵{price}{pricingUnit ? `/${pricingUnit}` : ''}</span>
                        </p>
                    )}
                </div>
            </div>

            <div className='flex items-center justify-between gap-2 mb-1.5'>
                <p className={`poppins-font text-[.75rem] font-semibold shrink-0 ${meta.textClass}`}>{meta.label}</p>
                {statusDetail && <p className='poppins-font text-[.75rem] text-loginTextClr text-right truncate'>{statusDetail}</p>}
            </div>

            <div className='mb-4.25'>
                <ProgressBar total={100} progress={progress} barColorClass={meta.barClass} />
            </div>

            <div className='flex items-center mt-auto'>
                <Image
                    height={17.5}
                    alt='calender'
                    width={17.917}
                    className='mr-1.5 shrink-0'
                    src='/svgs/auth/calender.svg'
                />
                <p className='poppins-font text-[.75rem] text-loginTextClr font-medium mr-auto truncate'>
                    {formatDateRange(startDate, endDate)}
                </p>
                <Image
                    width={8}
                    height={8}
                    alt='chevron-right'
                    src='/svgs/chevron_right.svg'
                    className='shrink-0 ml-2'
                />
            </div>
        </Link>
    )
}

export default RentalTile
