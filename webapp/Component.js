/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "flexcollay/model/models", "sap/ui/core/IconPool"
],
    function (UIComponent, Device, models, IconPool) {
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
                let obj = {
                    nome: "Mario Rossi",
                    email: "marcorossi@gmail.com",
                    // settore: "Qualità"
                    // 
                    settore: "Produzione"
                    // settore: "Responsabile"

                }
                this.setModel(new sap.ui.model.json.JSONModel(obj), "modelloRuolo");
            }
        });
    }
);