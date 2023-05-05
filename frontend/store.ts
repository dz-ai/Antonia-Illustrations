import {makeAutoObservable} from "mobx";

class Store {
    token: string | null = localStorage.getItem('token');
    url:string = import.meta.env.VITE_DEV_SERVER;
    isUserLog: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    userLogToggle(isLog: boolean): void {
        this.isUserLog = isLog;
    }
    authTokenOnLand():void {
        if (this.token !== null) {
            fetch(`${this.url}/api/users/authToken`, {
                headers: { 'auth': `Bearer ${this.token}` },
            })
                .then(res => res.json())
                .then(results => {
                    if (results.isSign) {
                        this.isUserLog = true;
                    } else {
                        localStorage.clear();
                        this.isUserLog = false;
                    }
                })
                .catch(error => console.error(error))
        }
    }
    logOut():void {
        this.isUserLog = false;
        localStorage.clear();
    }
}

const store = new Store();
export default store;