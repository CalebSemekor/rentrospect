'use client'

interface MeetupQrDialogProps {
    open: boolean
    loading: boolean
    qrCodeUrl: string | null
    errorMessage?: string | null
    onClose: () => void
}

const MeetupQrDialog: React.FC<MeetupQrDialogProps> = ({ open, loading, qrCodeUrl, errorMessage, onClose }) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
            <div
                className="flex w-full max-w-xs flex-col items-center gap-5 rounded-3xl bg-white px-6 py-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="montserrat-font text-base font-bold text-black">Meetup Code</p>

                {loading ? (
                    <div className="flex size-56 items-center justify-center">
                        <div className="size-12 rounded-full border-4 border-[#EAECF0] border-t-teal-600 animate-spin" />
                    </div>
                ) : qrCodeUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- object URL from a fetched blob, not a static/remote asset Next's Image can optimize
                    <img src={qrCodeUrl} alt="Meetup QR code" className="size-56 rounded-xl object-contain" />
                ) : (
                    <div className="flex size-56 items-center justify-center text-center">
                        <p className="dmSans-font text-sm text-smallGreyText">
                            {errorMessage ?? "Couldn't generate a code. Try again."}
                        </p>
                    </div>
                )}

                <p className="dmSans-font text-center text-xs text-smallGreyText leading-relaxed">
                    Have the renter scan this code to confirm the meetup.
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="h-11 w-full rounded-2xl bg-teal-600 text-sm font-semibold text-white hover:bg-teal-700 transition-colors dmSans-font cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default MeetupQrDialog
