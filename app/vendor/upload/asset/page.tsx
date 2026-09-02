'use client'

import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import VendorInputField from '@/components/input/VendorInput'
import { updateAsset, uploadAsset, verifySession } from '@/services/backend'
import VendorTextAreaField from '@/components/input/VendorTextArea';
import AssetImageUpload from '@/components/vendor/AssetImageUpload';
import VendorSelectField from '@/components/input/VendorSelectField';
import { categoryOptions, conditions, pickupLocations } from '@/constants/category_options';
import { readAssetDraft, saveAssetDraft } from '@/services/assetDraftStorage';

const VendorUploadForm = () => {
    const [asset, setAsset] = useState("");
    const [assetTags, setAssetTags] = useState("");
    const [dailyRate, setDailyRate] = useState("0.00")
    const [securityDeposit, setSecurityDeposit] = useState("50.00")
    const [submitting, setSubmitting] = useState(false)
    const [assetCategory, setAssetCategory] = useState("");
    const [assetQuantity, setAssetQuantity] = useState("1");
    const [assetCondition, setAssetCondition] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [assetImages, setAssetImages] = useState<File[]>([])
    const [assetDescription, setAssetDescription] = useState("")
    const [returnPolicy, setReturnPolicy] = useState("")
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([])
    const [editingAssetId, setEditingAssetId] = useState<string | null>(null)
    const [availability, setAvailability] = useState<'available' | 'paused'>('paused')

    const router = useRouter();
    const searchParams = useSearchParams();
    const { getToken } = useAuth();

    // "Edit Post" round-trip: prefill the form from the draft saved when
    // this asset was first submitted. There's no GET-by-id backend route
    // yet, so this only works for assets created/edited earlier in this
    // browser session.
    useEffect(() => {
        const editingId = searchParams.get('assetId')
        if (!editingId) return

        const draft = readAssetDraft(editingId)
        if (!draft) return

        setEditingAssetId(editingId)
        setAsset(draft.name)
        setAssetTags(draft.tags)
        setDailyRate(draft.rate)
        setSecurityDeposit(draft.securityDeposit)
        setAssetCategory(draft.category)
        setAssetQuantity(draft.quantity)
        setAssetCondition(draft.condition)
        setPickupLocation(draft.location)
        setAssetDescription(draft.description)
        setReturnPolicy(draft.returnPolicy)
        setExistingImageUrls(draft.imagePreviewUrls)
        setAvailability(draft.availability)
    }, [searchParams])

    const handleSubmit = async () => {
        try {
            setSubmitting(true)

            const token = await getToken()
            if (!token) {
                throw new Error('Not signed in')
            }

            // The vendor id must come from the verified session, not from
            // anything the client could tamper with.
            const session = await verifySession(token)

            const assetDetails = {
                vendor: Number(session.user_id),
                category: Number(assetCategory),
                name: asset,
                availability: 'available',
                description: assetDescription,
                returnPolicy,
                rate: Number(dailyRate),
                securityDeposit: Number(securityDeposit),
                tags: assetTags,
                pricingUnit: "day",
                location: pickupLocation,
                condition: assetCondition,
                quantity: Number(assetQuantity),
                primaryImage: 0,
            }

            // Editing an existing listing PATCHes it in place; a fresh
            // upload POSTs a new one — assets/update/{id} expects the full
            // payload either way, same shape as assets/upload.
            let resultAssetId: string | number
            if (editingAssetId) {
                await updateAsset(token, { assetId: editingAssetId, ...assetDetails }, assetImages)
                resultAssetId = editingAssetId
            } else {
                resultAssetId = (await uploadAsset(token, assetDetails, assetImages)).assetId
            }

            saveAssetDraft({
                assetId: String(resultAssetId),
                name: asset,
                tags: assetTags,
                category: assetCategory,
                description: assetDescription,
                returnPolicy,
                rate: dailyRate,
                securityDeposit,
                pricingUnit: assetDetails.pricingUnit,
                location: pickupLocation,
                condition: assetCondition,
                quantity: assetQuantity,
                availability,
                imagePreviewUrls: assetImages.length
                    ? assetImages.map((file) => URL.createObjectURL(file))
                    : existingImageUrls,
            })

            router.push(`/vendor/upload/asset/preview/${resultAssetId}`)

        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className='flex flex-col md:flex-row gap-18.75 px-6 md:px-13.75 pb-6.5'>
            <div className='hidden md:flex flex-col flex-1 gap-2 md:sticky md:top-6 md:self-start'>
                {existingImageUrls.length > 0 && (
                    <>
                        <p className="text-sm font-semibold leading-5 tracking-[-0.0088rem] dmSans-font">Current Images</p>
                        <div className='flex gap-3'>
                            {existingImageUrls.map((url, index) => (
                                <Image key={index} src={url} alt={`Current image ${index + 1}`} width={80} height={80} className='rounded-xl object-cover' />
                            ))}
                        </div>
                    </>
                )}
                <p className="text-sm font-semibold leading-5 tracking-[-0.0088rem] dmSans-font">Asset Image</p>
                <AssetImageUpload
                    onImagesChange={setAssetImages}
                />
            </div>
            <div className='flex flex-col gap-4 w-full flex-1'>
                <VendorInputField
                    label='Asset Name'
                    value={asset}
                    onChange={setAsset}
                />
                <div className='flex flex-col my-3 md:hidden gap-2.5'>
                    {existingImageUrls.length > 0 && (
                        <>
                            <p className="text-sm font-semibold leading-5 tracking-[-0.0088rem] dmSans-font">Current Images</p>
                            <div className='flex gap-3'>
                                {existingImageUrls.map((url, index) => (
                                    <Image key={index} src={url} alt={`Current image ${index + 1}`} width={80} height={80} className='rounded-xl object-cover' />
                                ))}
                            </div>
                        </>
                    )}
                    <p className="text-sm font-semibold leading-5 tracking-[-0.0088rem] dmSans-font">Asset Image</p>
                    <AssetImageUpload onImagesChange={setAssetImages} />
                </div>
                <VendorSelectField
                    label='Asset Category'
                    value={assetCategory}
                    options={categoryOptions}
                    onChange={setAssetCategory}
                />
                <VendorInputField
                    label='Asset Tags'
                    value={assetTags}
                    onChange={setAssetTags}
                    placeholder='#speaker #JBL'
                />
                <VendorInputField
                    label='Asset Quantity'
                    value={assetQuantity}
                    onChange={setAssetQuantity}
                />
                <VendorSelectField
                    label='Pickup Location'
                    options={pickupLocations}
                    value={pickupLocation}
                    onChange={setPickupLocation}
                />
                <VendorInputField
                    label='Daily Rate (GH₵)'
                    value={dailyRate}
                    onChange={setDailyRate}
                />
                <VendorInputField
                    type='number'
                    label='Security Deposit (GH₵)'
                    value={securityDeposit}
                    onChange={setSecurityDeposit}
                />
                <VendorSelectField
                    label='Asset Condition'
                    options={conditions}
                    value={assetCondition}
                    onChange={setAssetCondition}
                />
                <VendorTextAreaField
                    label='Asset Description'
                    value={assetDescription}
                    onChange={setAssetDescription}
                />
                <VendorTextAreaField
                    label='Return Policy'
                    value={returnPolicy}
                    onChange={setReturnPolicy}
                />
                <div className='flex gap-5 items-center justify-end sticky'>
                    <button className='cursor-pointer w-51 py-4 px-5 dmSans-font text-[1rem] font-semibold leading-6 text-loginTextClr bg-[#F2F4F8] hover:bg-[#E6EBF2] rounded-2xl'>Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className='cursor-pointer w-51 py-4 px-5 dmSans-font text-[16px] font-semibold leading-6 text-white rounded-3xl bg-[#3E4E50] hover:bg-[#506668] disabled:opacity-60'
                    >
                        {submitting ? 'Uploading...' : 'Submit'}
                    </button>
                </div>
            </div>
        </main>
    )
}

const VendorUploadPage = () => (
    <Suspense>
        <VendorUploadForm />
    </Suspense>
)

export default VendorUploadPage