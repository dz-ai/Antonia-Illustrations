import {makeAutoObservable} from "mobx";
import {IImage} from "./types/types";
import {ImagesGroupsNamesEnum} from "./components/popupEditImage/popupEditImage";

class Store {
    url: string = '';
    isUserLog: boolean = false;
    categories: string[] = [];
    images: IImage = {};
    imagesArray: string[] = [];
    currentCategory: string = 'All Categories';

    reloadPortfolioImages: boolean = false;
    triggerDownScrollOnSearch: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this.getFetchUel();
    }

    getFetchUel(): void {
        switch (import.meta.env.VITE_DEV) {
            case 'true':
                this.url = import.meta.env.VITE_DEV_SERVER;
                break
            case 'AWS':
                this.url = import.meta.env.VITE_AWS_SERVER;
                break
            case 'false':
                this.url = '';
        }
    }

    userLogToggle(isLog: boolean): void {
        this.isUserLog = isLog;
    }

    async verifyToken(): Promise<boolean | undefined> {
        const token: string | null = localStorage.getItem('token');

        if (token !== null) {
            return fetch(`${this.url}/api/users/authToken`, {
                headers: {'auth': `Bearer ${token}`},
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }
                    return res.json();
                })
                .then(results => {
                    if (results.isSign) {
                        this.isUserLog = true;
                        return true;
                    }
                })
                .catch(error => {
                    console.error(error);
                    localStorage.clear();
                    this.isUserLog = false;
                    return Promise.reject(`Not authorized - ${error} - log in first`);
                });
        } else {
            return Promise.reject('User not log in (token is messing');
        }
    }

    logOut(messageCB: (message: string) => void): void {
        this.isUserLog = false;
        localStorage.clear();
        messageCB('You have logged out');
    }

    triggerRerender(whatToRender: 'downSearchScroll' | 'reloadPortfolioImages'): void {
        if (whatToRender === 'reloadPortfolioImages') this.reloadPortfolioImages = !this.reloadPortfolioImages;
        if (whatToRender === 'downSearchScroll') this.triggerDownScrollOnSearch = !this.triggerDownScrollOnSearch;
        console.log('running', this.reloadPortfolioImages);
    }

    async getImages(imagesGroupName: ImagesGroupsNamesEnum): Promise<boolean> {
        return fetch(`${this.url}/api/uploadImage/getImages/${imagesGroupName}`)
            .then(res => res.json())
            .then(data => {
                // todo What happen when for some reason there is no data?
                this.images = data;
                this.imagesArray = Array.from(Object.keys(data));
                return Array.from(Object.keys(data)).length > 0;
            });
    }

    setCategory(category: string): void {
        this.currentCategory = category;
    }

    filterCategory(category: string): void {
        if (category === 'All Categories' || !category) {
            this.imagesArray = Array.from(Object.keys(this.images));
            return
        }
        this.imagesArray = Array.from(Object.keys(this.images)).filter(image => this.images[image].imageCategory === category);
    }

    getCategories(): void {
        fetch(`${this.url}/api/categories/getCategories`)
            .then(res => res.json())
            .then(results => this.categories = results)
            .catch(error => console.log(error));
    }

    async addCategory(categoryToAdd: string): Promise<string> {
        return fetch(`${this.url}/api/categories/addCategory`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'auth': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({val: categoryToAdd})
        })
            .then(res => res.json())
            .then(results => {
                if (typeof results !== 'string') {
                    this.categories = results;
                    return `${categoryToAdd} has added`;
                } else {
                    return results;
                }
            })
            .catch(error => {
                console.log(error);
                return 'Error, check console for more info';
            });
    }

    async removeCategory(categoryToRemove: string): Promise<string> {
        return fetch(`${this.url}/api/categories/removeCategory`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'auth': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({val: categoryToRemove})
        })
            .then(res => res.ok ? res.json() : res.json().then(err => {
                throw err
            }))
            .then(results => {
                this.categories = results;
                return `${categoryToRemove} has removed`;
            });
    }

    async renameCategory(categoryToRename: string, newName: string, imageGroupName: ImagesGroupsNamesEnum): Promise<string> {
        return fetch(`${this.url}/api/categories/renameCategory/${imageGroupName}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'auth': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({categoryToRename, newName})
        })
            .then(res => res.ok ? res.json() : res.json().then(err => {
                throw err
            }))
            .then(results => {
                this.categories = results.categoriesArr;
                this.images = results.updatedImages;
                return results.updatedCategory
            });
    }

    searchFilter(searchTerm: string): string[] {

        const resultsArray: string[] = [];
        const storeImageArr: string[] = [];

        Array.from(Object.keys(this.images)).forEach(image => {
            const imageFileNameMatch: boolean = image.toLowerCase().includes(searchTerm.toLowerCase());
            const imageCategoryMatch: boolean = this.images[image].imageCategory.toLowerCase().includes(searchTerm.toLowerCase());
            const imageDescriptionMatch: boolean = this.images[image].imageDescription.toLowerCase().includes(searchTerm.toLowerCase());

            if (imageFileNameMatch || imageCategoryMatch || imageDescriptionMatch) {
                storeImageArr.push(image);
            }

            if (imageFileNameMatch) {
                resultsArray.push(image);
            }
            if (imageCategoryMatch) {
                resultsArray.push(this.images[image].imageCategory);
            }
            if (imageDescriptionMatch) {
                resultsArray.push(this.images[image].imageDescription);
            }
        });
        this.imagesArray = storeImageArr; /* update the image array, so the relevant images will show on the screen */
        return [...new Set(resultsArray)]; /* return all possible matches and those will be shown as a result list */
    }
}

const store = new Store();
export default store;