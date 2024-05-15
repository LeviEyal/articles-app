export interface Article {
    id: string;
    title: string;
    description: string;
    body?: string;
    categoryId: string;
    tags: Tag[];
}

export interface Category {
    id?: string;
    title: string;
    description: string;
}

export interface Tag {
    id: string;
    title: string;
    description: string;
}