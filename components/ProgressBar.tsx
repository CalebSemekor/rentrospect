interface ProgressBarProps {
    progress: number
    total: number
    barColorClass?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    total,
    barColorClass = 'bg-[#1E293B]',
}) => {
    const percentage = (progress / total) * 100

    return (
        <div className='relative w-full h-2 rounded-full bg-[#D1D5DB] overflow-visible'>
            <div
                className={`h-full rounded-full ${barColorClass}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}

export default ProgressBar
