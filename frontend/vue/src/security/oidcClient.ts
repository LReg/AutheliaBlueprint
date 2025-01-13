import {environment} from "@/environment/environment.ts";
import {Log, User, UserManager, type UserManagerSettings} from "oidc-client-ts";
import {ref, type Ref} from "vue";
import router from "@/router";

Log.setLogger(console)
window.location.hash = decodeURIComponent(window.location.hash);

const config: UserManagerSettings = {
    authority: environment.authUrl,
    client_id: environment.clientId,
    redirect_uri: `${environment.baseUrl}/home`,
    post_logout_redirect_uri: `${environment.baseUrl}`,
    response_type: 'code',
    response_mode: 'query',
    redirectMethod: 'assign',
    redirectTarget: 'self',
    scope: 'openid profile email offline_access',
};

export const user: Ref<null | User> = ref(null);

const userManager = new UserManager(config);

export const login = async () => {
    try {
        await userManager.signinRedirect();
    } catch(e) {
        console.error(e)
    }
};

export const loginCb = async () => {
    try {
        const res = await userManager.signinRedirectCallback();
        user.value = res;
    } catch(e) {
        console.error(e)
    }
}

export const logout = async () => {
    return await userManager.signoutRedirect();
};

export const guardLoggedIn =  (to, from, next) => {
    userManager.getUser().then((u) => {
        if (u) {
            user.value = u;
            next();
            return;
        } else {
            loginCb().then(() => {
                if (user.value != null) {
                    next();
                    return;
                }
                router.push({name: 'login'});
            });
        }
    });
}