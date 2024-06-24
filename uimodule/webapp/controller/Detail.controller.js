sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast', "./BaseController",
    "sap/ui/core/Fragment", "../model/Revisioni"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, BaseController, Fragment, Revisioni) {
        "use strict";

        return BaseController.extend("flexcollay.controller.FlexibleColumnLayout", {
            onInit: function () {
                this.bus = this.getOwnerComponent().getEventBus();
            },
            showPopoverEntiFragment: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
                let entiSelezionati = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato/enti/entiSelezionati")
                //debugger
                // create popover
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "flexcollay.view.Fragments.PopoverEntiFirmatariSelect",
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        //debugger
                        oPopover.setModel(new sap.ui.model.json.JSONModel(), "modelloPopover")
                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    oPopover.getModel("modelloPopover").setProperty("/entiSelezionati", entiSelezionati)
                    oPopover.openBy(oButton);
                });
            },

        });
    });
