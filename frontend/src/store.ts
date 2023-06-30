import {makeAutoObservable} from "mobx";

class Store {
    url: string = import.meta.env.VITE_DEV_SERVER;
    isUserLog: boolean = false;

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
}

const store = new Store();
export default store;