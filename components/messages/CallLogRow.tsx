import Image from 'next/image'
import type { CallLogEntry } from '@/types/messages'
import { formatCallTimestamp } from '@/utils/formatMessageTime'

interface CallLogRowProps {
    call: CallLogEntry
}

const directionMeta: Record<CallLogEntry['direction'], { icon: string; label: string; className: string }> = {
    outgoing: { icon: '/svgs/messages/call-outgoing.svg', label: 'Outgoing', className: 'text-green-600' },
    incoming: { icon: '/svgs/messages/call-incoming.svg', label: 'Incoming', className: 'text-green-600' },
    missed: { icon: '/svgs/messages/call-missed.svg', label: 'Missed', className: 'text-red-500' },
}

const formatDuration = (secs: number): string => {
    const minutes = Math.floor(secs / 60)
    const seconds = secs % 60
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

const CallLogRow: React.FC<CallLogRowProps> = ({ call }) => {
    const meta = directionMeta[call.direction]

    return (
        <div className='flex items-center gap-3 w-full px-3 py-3 rounded-2xl'>
            <Image width={44} height={44} alt={call.name} src={call.avatar} className='size-11 rounded-full object-cover shrink-0' />
            <div className='flex flex-col min-w-0 flex-1'>
                <p className='dmSans-font text-sm font-semibold text-black truncate'>{call.name}</p>
                <div className='flex items-center gap-1'>
                    <Image width={12} height={12} alt='' src={meta.icon} />
                    <p className={`dmSans-font text-xs ${meta.className}`}>
                        {meta.label}
                        {call.direction !== 'missed' && call.durationSecs ? ` · ${formatDuration(call.durationSecs)}` : ''}
                    </p>
                </div>
            </div>
            <span className='dmSans-font text-[.6875rem] text-smallGreyText shrink-0'>
                {formatCallTimestamp(call.occurredAt)}
            </span>
        </div>
    )
}

export default CallLogRow
