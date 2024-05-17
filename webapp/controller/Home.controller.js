sap.ui.define([
    "sap/ui/core/mvc/Controller", "./BaseController", "../model/Revisioni", "../model/ModelNonConf",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BaseController, Revisioni, ModelNonConf) {
        "use strict";

        return BaseController.extend("flexcollay.controller.Home", {
            getGroup: function (oContext) {
                return oContext.getProperty(oContext.sPath).id_nonconf;
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
                let data = await Revisioni.getAll()
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "modelloDatiNode");
                this.getView().getModel("modelloDatiNode").setProperty("/", data)
                let call = await fetch("../model/modelloDatiMock.json")
                let obj = await call.json()
                console.log(obj)
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "modello")

            },
            handleNavigateToMidColumnPress: function (oEvent) {
                debugger

                let obj = oEvent.getSource().getBindingContext("modelloDatiNode").getObject()

                this.getOwnerComponent().getModel("modelloAppoggio").setProperty("/elemento_selezionato", obj)
                this.bus.publish("flexible", "setDetailPage");
            },

            getGroupHeaderMultiCombobox: function (oGroup) {
                debugger
                return new sap.ui.core.SeparatorItem({
                    text: oGroup.key
                });
            },

            createModelloNonConf: async function (oEvent) {
                // this.handleUploadPress(oEvent)
                let filename=this.getFileName()
                let oFileUploader = this.byId("myFileUpload")
                oFileUploader.checkFileReadable().then(function () {
                    oFileUploader.upload();
                }, function (error) {
                    console.log(error)
                    new sap.m.MessageToast.show("Errore nel caricamento del file");
                }).then(function () {
                    new sap.m.MessageToast.show("File caricato con successo");
                    oFileUploader.clear();
                    // this.getView().getModel("modelloPDF").setProperty("/descrizione", null)

                });
                sap.m.MessageToast.show("Creazione avvenuta con successo")
                debugger
                let obj = oEvent.getSource().getParent().getModel("modelloNewModel").getData()
                let data = {
                    TITOLO: obj.titolo,
                    CREATORE: this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome"),
                    DATA_ORA: new Date(obj.data),
                    ENTI: obj.entiSelezionati,
                    FIRMATARI: obj.firmatari,
                    PDFNAME: filename,
                    STATO: 'Aperto',
                    NOTE:{}

                }
                debugger
                await ModelNonConf.createFirstModel({ data })
                oEvent.getSource().getParent().getModel("modelloNewModel").setData()
                oEvent.getSource().getParent().close()
                this.createModel()
                ///funzione di salvataggio

            },
            filterData: function (oEvent) {
                debugger
                let modello = oEvent.getSource().oPropagatedProperties.oModels.modelloNewModel,
                    entiSelezionati = modello.getProperty("/entiSelezionati"),
                    listaUtenti = modello.getProperty("/listaUtenti").filter(x => entiSelezionati.includes(x.settore_lavorativo))
                modello.setProperty("/utentiSelect", listaUtenti)
                entiSelezionati.length === 0 ? modello.setProperty("/entiSelezionati", null) : null

                modello.updateBindings()
            },

        });
    });
