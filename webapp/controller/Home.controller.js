sap.ui.define([
    "sap/ui/core/mvc/Controller", "./BaseController",
    "../model/Revisioni", "../model/ModelNonConf",
    'sap/ui/model/FilterOperator', "../model/Utenti"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BaseController, Revisioni, ModelNonConf, FilterOperator, Utenti) {
        "use strict";



        return BaseController.extend("flexcollay.controller.Home", {
            getGroup: function (oContext) {
                return oContext.getProperty(oContext.sPath).id_nonconf;
            },
            getGroupHeader: function (oGroup) {
                return new sap.m.GroupHeaderListItem({
                    title: "Non conformità " + oGroup.key,
                })
            },
            onInit: function () {
                this.bus = this.getOwnerComponent().getEventBus();
            },

            onAfterRendering: function (oEvent) {
                this.createModel()

            },
            createModel: async function () {
                let ruolo = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")
                let nome = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome")
                debugger
                let data = await Revisioni.getAll({ ruolo, nome })
                let arrayPromise = []
                //
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "modelloDatiNode");
                data.map((x, index, data) => data[index].data_ora = this.format.formatData(x.data_ora))

                this.getView().getModel("modelloDatiNode").setProperty("/", data)

                arrayPromise.push(new Promise((resolve) => resolve(Utenti.getAll())))
                Promise.all(arrayPromise).then(results => {
                    debugger
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({ utenti: results[0] }), "modello")
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({
                        creatore: null,
                        datainizio: null,
                        datafine: null,
                        stato: null,
                        tipologia: null
                    }), "modelloFilter")
                })

            },
            handleNavigateToMidColumnPress: function (oEvent) {
                debugger

                let obj = oEvent.getSource().getBindingContext("modelloDatiNode").getObject()
                this.getOwnerComponent().getModel("modelloAppoggio").setProperty("/elemento_selezionato", obj)
                if (obj.stato == 'Nuovo') { this.onNewRev(oEvent, "Review") }
                else {
                    debugger
                    this.bus.publish("flexible", "setDetailPage")
                    // this.bus.publish("flexible", "setDetailPage");
                }
            },

            getGroupHeaderMultiCombobox: function (oGroup) {
                debugger
                return new sap.ui.core.SeparatorItem({
                    text: oGroup.key
                });
            },

            createModelloNonConf: async function (oEvent) {
                await this.getSetLavUser(oEvent)
                debugger
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
                sap.m.MessageToast.show("Creazione avvenuta con successo") //aggiustare
                let obj = oEvent.getSource().getParent().getModel("modelloNewModel").getData()
                debugger
                let data = {
                    TITOLO: obj.titolo,
                    CREATORE: this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome"),
                    DATA_ORA: new Date(obj.data),
                    ENTI: { entiSelezionati: obj.enti_firmatari },
                    PDFNAME: filename,
                    STATO: stato,
                    TIPOLOGIA: obj.tipologia,
                    NOTE: {}

                }
                await ModelNonConf.createFirstModel({ data })
                oEvent.getSource().getParent().getModel("modelloNewModel").setData()
                oEvent.getSource().getParent().close()
                this.createModel()

            },
            filterData: function (oEvent) {
                debugger
                let modello = oEvent.getSource().oPropagatedProperties.oModels.modelloNewModel,
                    entiSelezionati = modello.getProperty("/entiSelezionati"),
                    listaUtenti = modello.getProperty("/listaUtenti").filter(x => entiSelezionati.includes(x.ruolo))
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
                    localeFiltro: null,
                    tipologia: null
                }
                this.getView().getModel("modelloFilter").setData(obj)
                this.byId("tableRichieste").getBinding("items").filter([])
            },
            onSearch: function (evt) {
                let arr = []
                debugger
                let model = this.getView().getModel("modelloFilter")
                let datainizio = model.getProperty("/datainizio")
                let datafine = model.getProperty("/datafine")

                let creatore = model.getProperty("/creatore")
                let stato = model.getProperty("/stato")
                let tipologia = model.getProperty("/tipologia")

                if (datainizio && datafine) {
                    arr.push(new sap.ui.model.Filter({
                        path: "data_ora",
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
                if (tipologia) {
                    arr.push(new sap.ui.model.Filter(
                        "tipologia",
                        FilterOperator.Contains,
                        tipologia
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
                var dialog = oEvent.getSource().getParent()
                let data = dialog.getModel("modelloNewModel").getData()

                var aSelectedItems = data.firmatari

                var aSettoriLavorativi = [];



                if (aSelectedItems) {
                    let promise = aSelectedItems.map(function (oItem) {
                        return new Promise((resolve) => {
                            resolve(Utenti.getOne({ nome: oItem }))
                        })
                        // 
                    });
                    return Promise.all(promise).then(results => {
                        results.forEach(x => {
                            aSettoriLavorativi.push({ nome: x[0].nome, firmato: false, settore_lavorativo: x[0].ruolo });
                        })
                        const groupedData = aSettoriLavorativi.reduce((acc, item) => {
                            const key = Object.keys(item)[0];
                            if (!acc[key]) {
                                acc[key] = [];
                            }
                            acc[key].push(item[key]);
                            return acc;
                        }, {});
                        debugger
                        dialog.getModel("modelloNewModel").setProperty("/enti_firmatari", aSettoriLavorativi)
                    })
                } else {
                    // let promise = data.enti.map(function (oItem) {
                    //     return new Promise((resolve) => {
                    //         resolve(Utenti.getOne({ nome: oItem }))
                    //     })
                    //     // 
                    // });

                    data.enti.forEach(x => {
                        debugger
                        aSettoriLavorativi.push({ nome: '', firmato: false, settore_lavorativo: x[0].ruolo });
                    })
                    const groupedData = aSettoriLavorativi.reduce((acc, item) => {
                        const key = Object.keys(item)[0];
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push(item[key]);
                        return acc;
                    }, {});
                    debugger
                    return dialog.getModel("modelloNewModel").setProperty("/enti_firmatari", aSettoriLavorativi)

                }

            },
            Updatedraft: async function (oEvent) {
                let elemento_selezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                let id = elemento_selezionato.id
                let dialog = oEvent.getSource().getParent()
                let model = dialog.getModel("modelloNewModel").getData()
                await ModelNonConf.updateModelAndRev({ id, data: model, objrev: elemento_selezionato })
                dialog.close();
                this.createModel()
                debugger

            },
            navToGestioneRuoli: function () {
                debugger
                sap.ui.core.UIComponent.getRouterFor(this).navTo('GestioneRuoli')

                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.navTo("GestioneRuoli");
                // this.getRouter().navTo("GestioneRuoli");

            },


        });
    });
