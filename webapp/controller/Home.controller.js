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
                if (localStorage.settore_utente === 'Ingegneria') {
                    let indexStatoNuovo = obj.non_conformita.findIndex(x => x.stato == "Nuovo")
                    obj.non_conformita.splice(indexStatoNuovo, 1)
                }
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(obj), "modello")
                this.getView().setModel(new sap.ui.model.json.JSONModel({
                    creatore: null,
                    data: null,
                    stato: null
                }), "modelloFilter")
                debugger

            },
            onNewRev: function (oEvent, state) {
                debugger
                let elemento_selezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                this.openDialogCreaRevisione(oEvent, elemento_selezionato, state)
            },
            handleNavigateToMidColumnPress: function (oEvent) {
                debugger
                let obj = oEvent.getSource().getBindingContext("modello").getObject()
                this.getOwnerComponent().getModel("modelloAppoggio").setProperty("/elemento_selezionato", obj)
                if (obj.stato == 'Nuovo') { this.onNewRev(oEvent, "Review") }
                else {
                    this.bus.publish("flexible", "setDetailPage")
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
                debugger
                let stato
                oEvent.getSource().getText() == 'Crea' ? stato = "In fase di firma" : stato = "Nuovo"
                let obj = oEvent.getSource().getParent().getModel("modelloNewModel").getData()
                let nonConformita = this.getView().getModel("modello").getProperty("/non_conformita")

                // debugger
                let data = {
                    id_revisione: nonConformita.reduce((max, item) => item.id_revisione > max ? item.id_revisione : max, nonConformita[0].id_revisione) + 1,
                    titolo: obj.titolo,
                    creatore: this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome"),
                    data_rilevamento: this.format.formatData(new Date(obj.data)),
                    ENTI: { entiSelezionati: obj.enti_firmatari },
                    PDFNAME: '',
                    stato: stato,
                    NOTE: {}

                }

                this.getView().getModel("modello").getProperty("/non_conformita").push(data)
                this.getView().getModel("modello").updateBindings()
                sap.m.MessageToast.show("Creazione avvenuta con successo")
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
                let datainizio = model.getProperty("/datainizio")
                let datafine = model.getProperty("/datafine")
                let creatore = model.getProperty("/creatore")
                let stato = model.getProperty("/stato")

                if (datainizio && datafine) {
                    arr.push(new sap.ui.model.Filter({
                        path: "data_rilevamento",
                        operator: sap.ui.model.FilterOperator.BT,
                        value1: this.format.formatData(datainizio),
                        value2: this.format.formatData(datafine)
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
            },
            changeUser: function (oEvent) {
                debugger
                let settore_selezionato = oEvent.getSource().getSelectedItem().getKey()

                this.getOwnerComponent().getModel("modelloRuolo").setProperty("/settore", settore_selezionato)
                localStorage.setItem('settore_utente', settore_selezionato)
                location.reload();
            },
            Updatedraft: async function (oEvent) {
                debugger
                let arr = this.getView().getModel("modello").getProperty("/non_conformita")

                let elemento_selezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                let id = elemento_selezionato.id
                let dialog = oEvent.getSource().getParent()
                let model = dialog.getModel("modelloNewModel").getData()
                let index = this.getView().getModel("modello").getProperty("/non_conformita").findIndex(x => x.id == id)

                arr.splice(index, 1)

                let data = {

                    id,
                    id_revisione: elemento_selezionato.id_revisione,
                    responsabile: elemento_selezionato.responsabile,
                    revisione: elemento_selezionato.revisione,
                    titolo: model.titolo,
                    creatore: this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome"),
                    data_rilevamento: this.format.formatData(new Date()),
                    ENTI: { entiSelezionati: model.enti_firmatari },
                    PDFNAME: '',
                    stato: 'In fase di firma',
                    NOTE: {}

                }
                arr.push(data)
                this.getView().getModel("modello").setProperty("/non_conformita", arr)
                this.getView().getModel("modello").updateBindings()


                dialog.close();
                // this.createModel()
                debugger

            }
        });
    });
