export interface Asset {
    rate: number
    name: string
    vendor: number
    assetId: string
    category: string
    location: string
    condition: string
    pricingUnit: string
    primaryImage: string
}

interface AssetImagesRes {
    imageUrl: string
    isPrimary: boolean
}

export interface LoneAsset {
    rate: number
    tags: string
    vendor: string
    location: string
    category: string
    quantity: number
    condition: string
    assetName: string
    vendorSrc: string
    pricingUnit: string
    description: string
    aboutVendor: string
    returnPolicy: string
    securityDeposit: number
    images: AssetImagesRes[]
}

export interface HeroAsset {
    asset: string
    vendor: string
    dateJoined: Date
    category: string
    profilePic: string
    description: string
    primaryImage: string
}

export enum CategoryId {
    Catering = 1,
    Furniture = 2,
    PartyAndEventSupplies = 3,
    Power = 4,
    ToolsAndEquipment = 5,
    ElectronicsAndGadgets = 6,
    HomeAndGarden = 7,
    ClothingAndApparel = 8,
    PhotographyAndVideography = 9,
    SportsAndOutdoorGear = 10,
    VehiclesAndTransport = 11,
    MusicalInstruments = 12,
    BabyAndKidsGear = 13,
    FitnessAndWellness = 14,
    OtherMiscellaneous = 15,
}

export const categoryMap: Record<string, CategoryId> = {
    "catering": CategoryId.Catering,
    "furniture": CategoryId.Furniture,
    "party & event supplies": CategoryId.PartyAndEventSupplies,
    "power": CategoryId.Power,
    "tools & equipment": CategoryId.ToolsAndEquipment,
    "electronics & gadgets": CategoryId.ElectronicsAndGadgets,
    "home & garden": CategoryId.HomeAndGarden,
    "clothing & apparel": CategoryId.ClothingAndApparel,
    "photography & videography": CategoryId.PhotographyAndVideography,
    "sports & outdoor gear": CategoryId.SportsAndOutdoorGear,
    "vehicles & transport": CategoryId.VehiclesAndTransport,
    "musical instruments": CategoryId.MusicalInstruments,
    "baby & kids gear": CategoryId.BabyAndKidsGear,
    "fitness & wellness": CategoryId.FitnessAndWellness,
    "other / miscellaneous": CategoryId.OtherMiscellaneous,
};