import makeToast from "./Toaster";
import axios from "axios";
class Auth {
    constructor() {
        this.authenticated = false;
    }

    async login(email, password) {
        try {
            const url = "http://localhost:8000/user/login";
            let res = await axios.post(url, {
                email, password
            });
            this.authenticated = true;
            return res;
        } catch (err) {
            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                makeToast("error", err.response.data.message);
                this.authenticated = false;
                return err;
            }
        }
    }

    logout() {
        this.authenticated = false;
    }
    isauthenticated() {
        return this.authenticated;
    }
}

export default new Auth();