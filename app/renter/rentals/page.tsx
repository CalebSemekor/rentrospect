import { auth } from '@clerk/nextjs/server'
import RentalTile from '@/components/RentalTile'
import { getClientRentals } from '@/services/backend'

const page = async () => {
    const { getToken } = await auth()
    const token = await getToken()

    const rentals = token ? await getClientRentals(token) : []

    return (
        <main className='flex flex-col px-6 md:px-0'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {rentals.map((rental) => (
                    <RentalTile
                        key={rental.id}
                        id={rental.id}
                        name={rental.name}
                        price={rental.price}
                        pricingUnit={rental.pricingUnit}
                        progress={rental.progress}
                        assetSrc={rental.assetSrc}
                        quantity={rental.quantity}
                        status={rental.status}
                        statusDetail={rental.statusDetail}
                        startDate={rental.startDate}
                        endDate={rental.endDate}
                    />
                ))}
            </div>
        </main>
    )
}

export default page
