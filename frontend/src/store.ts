import {makeAutoObservable} from "mobx";

class Store {
    url: string = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';
    isUserLog: boolean = false;
    categories: string[] = [];

    rerender: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    userLogToggle(isLog: boolean): void {
        this.isUserLog = isLog;
    }

    verifyToken(): Promise<boolean | undefined> {
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({val: categoryToAdd})
        })
            .then(res => res.json())
            .then(results => this.categories = results)
            .catch(error => console.log(error));
    }
}

const store = new Store();
export default store;