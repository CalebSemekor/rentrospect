import { getAssetById } from '@/services/backend'
import AssetDetailsClient from '@/components/AssetDetailsClient'

const AssetDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id
    const assetProps = await getAssetById(id)

    if (!assetProps) {
        return (
            <main className='flex items-center justify-center py-24'>
                <p className='dmSans-font text-sm text-otherSmallText'>We couldn&apos;t find that asset.</p>
            </main>
        )
    }

    return <AssetDetailsClient id={id} assetProps={assetProps} />
}

export default AssetDetails
