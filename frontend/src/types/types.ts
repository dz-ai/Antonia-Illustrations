export type categories = string[];

interface ImageData {
    category: string;
    description: string;
}

export interface IImage {
    [key: string]: ImageData;
}
