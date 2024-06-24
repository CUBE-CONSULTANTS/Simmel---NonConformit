/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "flexcollay/model/models", "sap/ui/core/IconPool", "./model/Utenti"
],
    function (UIComponent, Device, models, IconPool, Utenti) {
        "use strict";

        return UIComponent.extend("flexcollay.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            //funzioni per i token 
            _getToken: function () {
                return JSON.parse(localStorage.getItem("simmel_user_data")).user_token.value;
            },
            _getTokenTimeout: function () {
                return new Date().getTime();
            },
            checkAuth: function () {
                if (!localStorage.getItem("simmel_user_data")) return false;

                const { user_token } = JSON.parse(
                    localStorage.getItem("simmel_user_data")
                );

                if (!user_token) return false;

                const { expiry } = user_token;

                if (this._getToken.Timeout() - expiry >= 86400 * 1000) {
                    localStorage.removeItem("simmel_user_data");
                    return false;
                }

                return true;
            },


            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                //set icon pool

                let b = [];
                let c = {};

                let t = {
                    fontFamily: "SAP-icons-TNT",
                    fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
                };

                IconPool.registerFont(t);
                b.push(IconPool.fontLoaded("SAP-icons-TNT"));
                c["SAP-icons-TNT"] = t;

                let B = {
                    fontFamily: "BusinessSuiteInAppSymbols",
                    fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
                };

                IconPool.registerFont(B);
                b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
                c["BusinessSuiteInAppSymbols"] = B;

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.setModel(new sap.ui.model.json.JSONModel(), "modelloAppoggio");

                let nome = JSON.parse(localStorage.getItem("simmel_current_user")).user.givenName

                // let nome = 'cube'

                let arrayPromise = [new Promise((resolve) => {
                    resolve(Utenti.getInfoUserLog({ nome, token: this._getToken() }))
                })]
                Promise.all(arrayPromise).then(results => {
                    let obj = {
                        nome: results[0][0].nome,
                        email: results[0][0].email,
                        settore: results[0][0].ruolo
                    }
                    this.setModel(new sap.ui.model.json.JSONModel(obj), "modelloRuolo");
                    debugger
                })

            }
        });
    }
);