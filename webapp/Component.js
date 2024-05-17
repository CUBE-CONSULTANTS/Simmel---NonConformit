/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "flexcollay/model/models"
],
    function (UIComponent, Device, models) {
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

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.setModel(new sap.ui.model.json.JSONModel(), "modelloAppoggio");
                let obj = {
                    nome: "Marco Rossi",
                    email: "marcorossi@gmail.com",
                    // settore: "Qualità"
                    settore: "Ingegneria"
                    // settore: "Responsabile"

                }
                this.setModel(new sap.ui.model.json.JSONModel(obj), "modelloRuolo");
            }
        });
    }
);