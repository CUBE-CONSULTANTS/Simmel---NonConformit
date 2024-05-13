sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        return Controller.extend("project1.controller.BaseController", {
            openDialogShowPDF: function (oEvent) {
                let self = this
                if (!this._dialgPDF) {
                    this._dialgPDF = new sap.ui.core.Fragment.load({
                        id: this.getView().getId(),
                        name: "flexcollay.view.Fragments.PdfFragment",
                        controller: this
                    }).then(function (oDialog) {
                        debugger
                        return oDialog;
                    });
                }
                self._dialgPDF.then(async function (oDialog) {
                    oDialog.open();

                }.bind(this));
            },
            closeDialog: function (oEvent) {
                oEvent.getSource().getParent().getParent().close()
            },
            openDialogCreaModello: async function (oEvent, elemento_selezionato) {
                debugger
                let self = this, obj
                elemento_selezionato !== undefined ? obj = {
                    titolo: elemento_selezionato.titolo,
                    data: self.formatData(new Date()),
                    // firmatari: null,
                    // filename: null,
                    // enti: ["Produzione", "Logistica", "Ingegneria", "Controllo Qualità", "Manutenzione", "Ricerca e Sviluppo"],
                    // entiSelezionati: null,
                    // listaUtenti: self.getView().getModel("modello").getProperty("/utenti"),
                    // utentiSelect: self.getView().getModel("modello").getProperty("/utenti")
                } : obj = {
                    titolo: null,
                    data: self.formatData(new Date()),
                    firmatari: null,
                    filename: null,
                    enti: ["Produzione", "Logistica", "Ingegneria", "Controllo Qualità", "Manutenzione", "Ricerca e Sviluppo"],
                    entiSelezionati: null,
                    listaUtenti: self.getView().getModel("modello").getProperty("/utenti"),
                    utentiSelect: self.getView().getModel("modello").getProperty("/utenti")
                }
                if (!this._dialog) {
                    this._dialog = new sap.ui.core.Fragment.load({
                        id: this.getView().getId(),
                        name: "flexcollay.view.Fragments.creaModello",
                        controller: this
                    }).then(function (oDialog) {
                        debugger

                        oDialog.setModel(new sap.ui.model.json.JSONModel(obj), "modelloNewModel")
                        return oDialog;
                    });
                }
                self._dialog.then(async function (oDialog) {
                    oDialog.open();

                }.bind(this));
            },
            closeDialog: function (oEvent) {
                // oEvent.getSource().getParent().getParent().destroy()
                oEvent.getSource().getParent().getParent().close()
            },
            formatData: function (model) {
                if (model) {
                    let datinizi = new Date(model);
                    let datainizioformat =
                        datinizi.getDate().toString().padStart(2, "0") +
                        "/" +
                        [datinizi.getMonth() + 1].toString().padStart(2, "0") +
                        "/" +
                        datinizi.getFullYear();
                    return datainizioformat;
                } else return
            },
        })
    })