import { createOidcAuth, SignInType } from 'vue-oidc-client/vue3';

// note the ending '/'
const appUrl = 'https://mydomain.com/myapp/';
export const oidc = createOidcAuth('main', SignInType.Window, appUrl , {
    authority: 'https://demo.identityserver.io/',
    client_id: 'implicit',
    response_type: 'id_token token',
    scope: 'openid profile email api'
});