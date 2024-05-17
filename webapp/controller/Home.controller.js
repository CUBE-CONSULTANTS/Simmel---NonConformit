sap.ui.define([
    "sap/ui/core/mvc/Controller", "./BaseController", 'sap/ui/model/FilterOperator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BaseController, FilterOperator) {
        "use strict";

        return BaseController.extend("flexcollay.controller.Home", {
            getGroup: function (oContext) {
                return oContext.getProperty(oContext.sPath).id_revisione;
            },
            getGroupHeader: function (oGroup) {
                return new sap.m.GroupHeaderListItem({
                    // type: sap.m.ListType.Navigation,
                    title: "Non conformità " + oGroup.key,
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
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "modello")
                this.getView().setModel(new sap.ui.model.json.JSONModel({
                    creatore: null,
                    data: null,
                    stato: null
                }), "modelloFilter")
                debugger

            },
            onNewRev: function (oEvent) {
                debugger
                let elemento_selezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                this.openDialogCreaModello(oEvent, elemento_selezionato)
            },
            handleNavigateToMidColumnPress: function (oEvent) {
                debugger
                let obj = oEvent.getSource().getBindingContext("modello").getObject()
                this.getOwnerComponent().getModel("modelloAppoggio").setProperty("/elemento_selezionato", obj)
                if (obj.stato == 'Nuovo') {
                    this.onNewRev(oEvent)
                } else {
                    this.bus.publish("flexible", "setDetailPage");
                }
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
                // this.handleUploadPress(oEvent)
                sap.m.MessageToast.show("Creazione avvenuta con successo")
                debugger
                oEvent.getSource().getParent().close()
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


            ///////funzioni per i filtri
            removeFilter: function () {
                let obj =
                {
                    dataFiltro: null,
                    creatoreFiltro: null,
                    localeFiltro: null
                }
                this.getView().getModel("modelloFilter").setData(obj)
                this.byId("tableRichieste").getBinding("items").filter([])
            },
            onSearch: function (evt) {
                let arr = []
                ///* //debugger */

                let model = this.getView().getModel("modelloFilter")
                let data = model.getProperty("/data")
                let creatore = model.getProperty("/creatore")
                let stato = model.getProperty("/stato")

                if (data) {
                    arr.push(new sap.ui.model.Filter(
                        "data_rilevamento",
                        FilterOperator.Contains,
                        this.formatData(data)
                    ))
                }
                if (creatore) {
                    arr.push(new sap.ui.model.Filter(
                        "creatore",
                        FilterOperator.Contains,
                        creatore
                    ))
                }
                if (stato) {
                    arr.push(new sap.ui.model.Filter(
                        "stato",
                        FilterOperator.Contains,
                        stato
                    ))
                }
                this.byId("tableRichieste").getBinding("items").filter(arr)
            },
        });
    });
