sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("flexcollay.controller.Home", {
            getGroup: function (oContext) {
                return oContext.getProperty(oContext.sPath).id_revisione;
            },
            getGroupHeader: function (oGroup) {
                return new sap.m.GroupHeaderListItem({
                    // type: sap.m.ListType.Navigation,
                    title: "Modello " + oGroup.key,
                    // press: this.nav.bind(this)
                })
                    .addStyleClass("typeLink");
            },
            onInit: function () {
                this.bus = this.getOwnerComponent().getEventBus();
                var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
                this.getView().setModel(oModel);
                this.createModel()

            },

            createModel: async function () {
                let call = await fetch("../model/modelloDatiMock.json")
                let obj = await call.json()
                console.log(obj)
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "modello")

            },
            handleNavigateToMidColumnPress: function (oEvent) {
                debugger
                
                let obj = oEvent.getSource().getBindingContext("modello").getObject()
                this.getOwnerComponent().getModel("modelloAppoggio").setProperty("/elemento_selezionato", obj)
                this.bus.publish("flexible", "setDetailPage");
            },
            openDialogCreaModello: async function (oEvent) {
                let self = this
                if (!this._dialog) {
                    this._dialog = new sap.ui.core.Fragment.load({
                        id: this.getView().getId(),
                        name: "flexcollay.view.Fragments.creaModello",
                        controller: this
                    }).then(function (oDialog) {
                        debugger
                        let obj = {
                            titolo: null,
                            data: self.formatData(new Date()),
                            firmatari: null,
                            filename: null,
                            enti: ["Produzione", "Logistica", "Ingegneria", "Controllo Qualità", "Manutenzione", "Ricerca e Sviluppo"],
                            entiSelezionati: null,
                            listaUtenti: self.getView().getModel("modello").getProperty("/utenti"),
                            utentiSelect: self.getView().getModel("modello").getProperty("/utenti")
                        }
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


            getGroupHeaderMultiCombobox: function (oGroup) {
                debugger
                return new sap.ui.core.SeparatorItem({
                    text: oGroup.key
                });
            },
            handleUploadPress: function (oEvent) {
                let oFileUploader = this.byId("myFileUpload").getValue()
                let filename = oFileUploader.getValue().split(".")[0],
                    filetype = oFileUploader.getValue().split(".")[1],
                    self = this
                debugger
                oFileUploader.checkFileReadable().then(function () {
                    oFileUploader.upload();
                }, function (error) {
                    console.log(error)
                    new sap.m.MessageToast.show("Errore nel caricamento del file");
                }).then(function () {
                    new sap.m.MessageToast.show("File caricato con successo");
                    oFileUploader.clear();
                    self.getView().getModel("modelloPDF").setProperty("/descrizione", null)

                });
            },
            createModelloNonConf: function (oEvent) {
                this.handleUploadPress(oEvent)
                ///funzione di salvataggio

            },
            filterData: function (oEvent) {
                debugger
                let modello = oEvent.getSource().oPropagatedProperties.oModels.modelloNewModel,
                    entiSelezionati = modello.getProperty("/entiSelezionati"),
                    listaUtenti = modello.getProperty("/listaUtenti").filter(x => entiSelezionati.includes(x.settore_lavorativo))
                modello.setProperty("/utentiSelect", listaUtenti)
                entiSelezionati.length === 0 ?  modello.setProperty("/entiSelezionati", null) : null

                modello.updateBindings()
            },

        });
    });
