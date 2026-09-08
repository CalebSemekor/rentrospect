import Image from 'next/image';
import { Asset } from '@/types/asset';
import AssetTile from "@/components/AssetTile";
import HeroPicture from "@/components/HeroPicture";
import ArrivalTile from "@/components/ArrivalTile";
import { categories } from "@/constants/categories";
import CategoryOval from '@/components/CategoryOval';
import CategoryTile from '@/components/CategoryTile';
import ScrollSection from '@/components/ScrollSection';
import { ovalCategories } from '@/constants/oval_categories';

// This page is auth-protected by proxy.ts and its data is fetched no-store, so
// it can never usefully be prerendered. Without this, `next build` tries to
// render it statically and the whole build fails whenever the backend isn't
// reachable from the build machine.
export const dynamic = 'force-dynamic';

async function getAssets(): Promise<Asset[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_MASTER}assets/getAssets`, {
            method: 'GET',
            cache: 'no-store', // fetch fresh data on every request; use next: { revalidate: N } instead if you want caching
        });

        if (!res.ok) {
            throw new Error('Failed to fetch assets');
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function getAssetsCategory(categoryId: string): Promise<Asset[]> {
    try {
        const headers: HeadersInit = {}

        if (categoryId) {
            headers['categoryId'] = categoryId
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_MASTER}assets/getCategory`, {
            method: 'GET',
            cache: 'no-store', // fetch fresh data on every request; use next: { revalidate: N } instead if you want caching
            headers,
        });

        if (!res.ok) {
            throw new Error('Failed to fetch assets');
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function Home() {
    const assets = await getAssets();
    const catId = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
    const categoryId = (catId as unknown) as string;
    const categorizedAssets = await getAssetsCategory(categoryId)

    return (
        <main className='flex flex-col gap-4 md:gap-6'>
            <div className='flex gap-3.25 md:gap-5.25 overflow-x-auto whitespace-nowrap mx-auto no-scrollbar w-full md:justify-center'>
                {categories.map((category) => (
                    <div key={category.id} className="shrink-0">
                        <CategoryTile
                            id={category.id}
                            label={category.label}
                            image={category.image}
                        />
                    </div>
                ))}
            </div>
            <HeroPicture />

            <ScrollSection title="Assets Nearby" scrollAmount={320}>
                {assets.map((asset, index) => (
                    <div key={index} className='shrink-0'>
                        <AssetTile
                            rate={asset.rate}
                            title={asset.name}
                            id={asset.assetId}
                            type={asset.category}
                            howOld={asset.condition}
                            location={asset.location}
                            pricingUnit={asset.pricingUnit}
                            assetImage={asset.primaryImage}
                        />
                    </div>
                ))}
            </ScrollSection>

            <ScrollSection title="new arrivals" scrollAmount={200}>
                {categorizedAssets.map((categorizedAsset, index) => (
                    <div key={index} className='shrink-0'>
                        <ArrivalTile
                            owner={categorizedAsset.name}
                            profileImg='/images/Avatar.png'
                            rate={categorizedAsset.rate}
                            src={categorizedAsset.primaryImage}
                            assetType={categorizedAsset.category}
                            pricingUnit={categorizedAsset.pricingUnit}
                        />
                    </div>
                ))}
            </ScrollSection>

            <div className='flex justify-between items-center'>
                <h2 className='dmSans-font text-[1.25rem] font-medium capitalize text-sectionTitle p-2.5'>top selling categories</h2>
                <div className='flex gap-5'>
                    <div className='flex size-10 bg-arrowBackground rounded-xl items-center justify-center'>
                        <Image width={16} height={16} alt='left-arrow' src='/svgs/chevron_left.svg' className='size-3' />
                    </div>
                    <div className='flex size-10 bg-arrowBackground rounded-xl items-center justify-center'>
                        <Image width={16} height={16} alt='right-arrow' src='/svgs/chevron_right.svg' className='size-3' />
                    </div>
                </div>
            </div>
            <div className='flex overflow-x-auto whitespace-nowrap items-center gap-11.25 justify-center'>
                {ovalCategories.map((category, index) => (
                    <div key={index} className='shrink-0'>
                        <CategoryOval src={category.src} label={category.label} />
                    </div>
                ))}
            </div>
        </main>
    );
}