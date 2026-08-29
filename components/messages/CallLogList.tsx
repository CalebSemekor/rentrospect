import type { CallLogEntry } from '@/types/messages'
import CallLogRow from './CallLogRow'

interface CallLogListProps {
    calls: CallLogEntry[]
}

const CallLogList: React.FC<CallLogListProps> = ({ calls }) => {
    return (
        <div className='flex flex-col gap-1 overflow-y-auto min-h-0'>
            {calls.length === 0 ? (
                <p className='dmSans-font text-sm text-smallGreyText text-center py-10'>No calls yet.</p>
            ) : (
                calls.map((call) => <CallLogRow key={call.id} call={call} />)
            )}
        </div>
    )
}

export default CallLogList
