class Auth {
    static BASE_URL = import.meta.env.VITE_BASE_URL;
    static USER = null;
    static async isAuthenticated() {
        try {
            const res = await fetch(`${this.BASE_URL}/api/auth/me`, {
                credentials: 'include' // IMPORTANT: sends cookies
            });
            this.USER = await res.json();
            return res.ok;
        } catch {
            return false;
        }
    }

    static isAuthorize(...roles) {
        if (!this.USER) return false;
        return roles.includes(this.USER.role);
    }


    static async getLoginUser() {
        try {
            const res = await fetch(`${this.BASE_URL}/api/auth/me`, {
                credentials: 'include'
            });

            if (!res.ok) return null;

            return await res.json();
        } catch {
            return null;
        }
    }

    static async logOut() {
        await fetch(`${this.BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    }
}

export default Auth;