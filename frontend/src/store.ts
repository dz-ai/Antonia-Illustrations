import {makeAutoObservable} from "mobx";
import {IImage} from "./types/types";

class Store {
    url: string = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';
    isUserLog: boolean = false;
    categories: string[] = [];
    images: IImage = {};
    imagesArray: string[] = [];

    rerender: boolean = false;

    constructor() {
        makeAutoObservable(this);
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

    triggerRerender(): void {
        this.rerender = !this.rerender;
    }

    async getImages(): Promise<boolean> {
        return fetch(`${this.url}/api/uploadImage/getImages`)
            .then(res => res.json())
            .then(data => {
                this.images = data;
                this.imagesArray = Array.from(Object.keys(data));
                return Array.from(Object.keys(data)).length > 0;
            });
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

    addCategory(categoryToAdd: string): void {
        fetch(`${this.url}/api/categories/addCategory`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'auth': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({val: categoryToAdd})
        })
            .then(res => res.json())
            .then(results => this.categories = results)
            .catch(error => console.log(error));
    }

    // TODO check if categoryToRemove is still in use in existing images before remove.
    removeCategory(categoryToRemove: string): void {
        fetch(`${this.url}/api/categories/removeCategory`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'auth': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({val: categoryToRemove})
        })
            .then(res => res.json())
            .then(results => this.categories = results)
            .catch(error => console.log(error));
    }
}

const store = new Store();
export default store;