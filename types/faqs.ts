export interface FaqItem {
    question: string
    answer: string
}

export interface FaqTopic {
    id: string
    label: string
    items: FaqItem[]
}

export interface FaqCategory {
    id: string
    label: string
    topics: FaqTopic[]
}
