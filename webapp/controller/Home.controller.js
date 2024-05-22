sap.ui.define([
    "sap/ui/core/mvc/Controller", "./BaseController", "../model/Revisioni", "../model/ModelNonConf", 'sap/ui/model/FilterOperator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BaseController, Revisioni, ModelNonConf, FilterOperator) {
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
            },
            onAfterRendering: function (oEvent) {
                debugger
                var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
                this.getView().setModel(oModel);

                this.createModel()

            },
            createModel: async function () {
                let ruolo = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")

                let data = await Revisioni.getAll({ ruolo })
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "modelloDatiNode");
                this.getView().getModel("modelloDatiNode").setProperty("/", data)
                let call = await fetch("../model/modelloDatiMock.json")
                let obj = await call.json()
                console.log(obj)
                debugger
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(obj), "modello")
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({
                    creatore: null,
                    datainizio: null,
                    datafine: null,
                    stato: null
                }), "modelloFilter")

            },
            handleNavigateToMidColumnPress: function (oEvent) {
                debugger

                let obj = oEvent.getSource().getBindingContext("modelloDatiNode").getObject()
                this.getOwnerComponent().getModel("modelloAppoggio").setProperty("/elemento_selezionato", obj)
                if (obj.stato == 'Nuovo') { this.onNewRev(oEvent, "Review") }
                else {
                    this.bus.publish("flexible", "setDetailPage")
                    this.bus.publish("flexible", "setDetailPage");
                }


            },

            getGroupHeaderMultiCombobox: function (oGroup) {
                return new sap.ui.core.SeparatorItem({
                    text: oGroup.key
                });
            },

            createModelloNonConf: async function (oEvent) {
                let filename = this.getFileName(),
                    oFileUploader = this.byId("myFileUpload"),
                    stato
                oEvent.getSource().getText() == 'Crea' ? stato = "In fase di firma" : stato = "Nuovo"

                oFileUploader.checkFileReadable().then(function () {
                    oFileUploader.upload();
                }, function (error) {
                    console.log(error)
                    new sap.m.MessageToast.show("Errore nel caricamento del file");
                }).then(function () {
                    new sap.m.MessageToast.show("File caricato con successo");
                    oFileUploader.clear();

                });
                sap.m.MessageToast.show("Creazione avvenuta con successo")
                let obj = oEvent.getSource().getParent().getModel("modelloNewModel").getData()
                debugger
                let data = {
                    TITOLO: obj.titolo,
                    CREATORE: this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome"),
                    DATA_ORA: new Date(obj.data),
                    ENTI: { entiSelezionati: obj.enti_firmatari },
                    PDFNAME: filename,
                    STATO: stato,
                    NOTE: {}

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

            //filtri page
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
                let datainizio = model.getProperty("/datainizio")
                let datafine = model.getProperty("/datafine")

                let creatore = model.getProperty("/creatore")
                let stato = model.getProperty("/stato")

                if (datainizio && datafine) {
                    arr.push(new sap.ui.model.Filter({
                        path: "data_rilevamento",
                        operator: sap.ui.model.FilterOperator.BT,
                        value1: datainizio,
                        value2: datafine
                    }));
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
            getSetLavUser: function (oEvent) {
                var oMultiComboBox = oEvent.getSource();

                var aSelectedItems = oMultiComboBox.getSelectedItems();

                var aSettoriLavorativi = [];

                aSelectedItems.forEach(function (oItem) {
                    var oBindingContext = oItem.getBindingContext("modelloNewModel").getObject()
                    aSettoriLavorativi.push({ nome: oBindingContext.nome, firmato: false, settore_lavorativo: oBindingContext.settore_lavorativo });
                });


                const groupedData = aSettoriLavorativi.reduce((acc, item) => {
                    const key = Object.keys(item)[0];
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(item[key]);
                    return acc;
                }, {});
                debugger
                oEvent.getSource().getModel("modelloNewModel").setProperty("/enti_firmatari", aSettoriLavorativi)

            }


        });
    });
