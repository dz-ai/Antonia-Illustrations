export type categories = string[];

interface ImageData {
    imageCategory: string;
    imageDescription: string;
}

export interface IImage {
    [key: string]: ImageData;
}
