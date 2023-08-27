import {ChangeEvent} from "react";
import {IKCore} from "imagekitio-react";
import store from "../../store";
import {ImagesGroupsNamesEnum} from "./popupEditImage";

export interface IImageMetaData {
    existingImageFileName: string;
    imageCategory: string;
    imageDescription: string;
    imageToUpLoad?: string;
}

// util ver
const devServer = 'http://localhost:3001';
const productServer = 'https://antonia-illustrations.onrender.com';
const dev = import.meta.env.VITE_DEV;

const uploadMetaDataEndpoint: string = `${dev === 'true' ? devServer : productServer}/api/uploadImage/setImageMetaData`;

const imagekit = new IKCore({
    publicKey: "public_mvSjUFM9xBvSh8H9560m37S+jD8=",
    urlEndpoint: "https://ik.imagekit.io/thfdl6dmv",
    authenticationEndpoint: `${dev === 'true' ? devServer : productServer}/api/uploadImage/auth`,
});
// end util ver //

// util functions
export function standardFileName(fileName: string) {
    return fileName.toLowerCase().replace(' ', '_').replace(/'/g, '_');
}

function checkFileExtension(fileName: string): boolean {
    const imageTypes: string[] = ['png', 'jpeg', 'jpg'];
    return imageTypes.includes(fileName.split('.')[1].toLowerCase());
}

function limitImageSize(file: File): boolean {
    const fileSizeInBytes = file.size;
    return (fileSizeInBytes / 1024 / 1024) < 7;
}

export const handleFileChange = (event: ChangeEvent<HTMLInputElement>, cbSuccess: (file: File, imagePreview: string | ArrayBuffer | null) => void, cbFail: (errorMessage: string) => void): void => {

    if (!event.target.files || !event.target.files[0]) return;

    const file: File = event.target.files[0];

    if (!checkFileExtension(file.name)) {
        cbFail(`${file.name.split('.')[1]} format not supported`);
        return;
    }

    if (!limitImageSize(file)) {
        cbFail('Image size exceeds the 7 MB limit');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const imagePreview = reader.result;
        cbSuccess(file, imagePreview);
    };
    reader.readAsDataURL(file);
};

export async function uploadImageFun(uploadImage: File) {
    return store.verifyToken()
        .then(() => {
            return imagekit.upload({
                file: uploadImage as File,
                fileName: uploadImage.name.toLowerCase(),
                folder: "/antonia-illustrations",
                useUniqueFileName: false,
            });
        })
        .catch(error => Promise.reject(error));
}

export function deleteImage(imagesGroupName: ImagesGroupsNamesEnum, fileName: string, cbSuccess: (results: any) => void, cbFail: (error: any) => void): void {
    const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

    fetch(`${url}/api/uploadImage/deleteImage/${imagesGroupName}`, {
        method: 'delete',
        headers: {
            'content-type': 'application/json',
            'auth': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({fileName})
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .then(cbSuccess)
        .catch(cbFail);
}

export function setImageMetaData(image: IImageMetaData, imageGroupName: ImagesGroupsNamesEnum, imageID: string | undefined, cbRes: (res: any) => void, cbErr: (error: any) => void): void {
    const {existingImageFileName, imageCategory, imageDescription, imageToUpLoad} = image;

    fetch(uploadMetaDataEndpoint + '/' + imageGroupName,
        {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'auth': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                existingImageFileName: standardFileName(existingImageFileName),
                imageCategory,
                imageDescription,
                imageToUpLoad: imageToUpLoad,
                imageID,
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .then(cbRes)
        .catch(cbErr);

}
