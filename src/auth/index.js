import Vue from "vue";
import { Auth0LockPasswordless } from "auth0-lock";
let instance;
export const getInstance = () => instance;
export const useAuth0 = options => {
  if (instance) return instance;
  instance = new Vue({
    data() {
      return {
        loading: true,
        isAuthenticated: false,
        user: {},
        auth0Lock: null,
        popupOpen: false,
        error: null,
        accessToken: null
      };
    },
    methods: {
      login(loginOptions) {
        this.popupOpen = true;
        this.auth0Lock.show(loginOptions);
      },
      checkSession() {
        return new Promise((resolve, reject) => {
          this.auth0Lock.checkSession({}, (error, authResult) => {
            if (error || !authResult) {
              this.auth0Lock.show();
            } else {
              this.auth0Lock.getUserInfo(
                authResult.accessToken,
                (error, profile) => {
                  if (error) {
                    reject(error);
                  }
                  this.setProfileDetails(authResult.accessToken, profile);
                  resolve(profile);
                }
              );
            }
          });
        });
      },
      logout(o) {
        return this.auth0Lock.logout(o);
      },
      setProfileDetails(token, profile) {
        this.accessToken = token;
        this.user = profile;
        this.isAuthenticated = true;
      }
    },
    async created() {
      this.auth0Lock = new Auth0LockPasswordless(
        options.clientId,
        options.domain
      );
      this.auth0Lock.on("authenticated", authResult => {
        this.auth0Lock.getUserInfo(
          authResult.accessToken,
          (error, profileResult) => {
            if (error) {
              throw error;
            }
            this.setProfileDetails(authResult.accessToken, profileResult);
          }
        );
      });
    }
  });
  return instance;
};

export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options);
  }
};