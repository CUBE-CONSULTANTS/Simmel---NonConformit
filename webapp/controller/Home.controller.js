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
                //debugger
                let arrayPromise = []
                //
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "modelloDatiNode");
                arrayPromise.push(new Promise((resolve) => resolve(Utenti.getAll())))
                Promise.all(arrayPromise).then(results => {
                    //debugger
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({ utenti: results[0] }), "modello")
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({
                        creatore: null,
                        datainizio: null,
                        datafine: null,
                        stato: null,
                        tipologia: null
                    }), "modelloFilter")
                })
                await this.renderModelDatiNode()

            },
            handleNavigateToMidColumnPress: function (oEvent) {
                //debugger

                let obj = oEvent.getSource().getBindingContext("modelloDatiNode").getObject()
                this.getOwnerComponent().getModel("modelloAppoggio").setProperty("/elemento_selezionato", obj)
                if (obj.stato == 'Nuovo') { this.onNewRev(oEvent, "Review") }
                else {
                    debugger
                    this.bus.publish("flexible", "setDetailPage")
                }
            },

            getGroupHeaderMultiCombobox: function (oGroup) {
                //debugger
                return new sap.ui.core.SeparatorItem({
                    text: oGroup.key
                });
            },

            createModelloNonConf: async function (oEvent) {
                await this.getSetLavUser(oEvent)
                //debugger
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
                let id = await ModelNonConf.createFirstModel({ data })

                await Revisioni.sendEmail({ id: id[0].id })
                oEvent.getSource().getParent().getModel("modelloNewModel").setData()
                oEvent.getSource().getParent().close()
                this.createModel()

            },
            filterData: function (oEvent) {
                //debugger
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
                //debugger
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
                        creatore.trim()
                    ))
                }
                if (tipologia) {
                    arr.push(new sap.ui.model.Filter(
                        "tipologia",
                        FilterOperator.Contains,
                        tipologia.trim()
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

                var aSelectedItems = data.firmatari && data.firmatari.filter(x => x != '')

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
                        //debugger
                        dialog.getModel("modelloNewModel").setProperty("/enti_firmatari", aSettoriLavorativi)
                    })
                } else {

                    data.entiSelezionati.forEach(x => {
                        //debugger
                        aSettoriLavorativi.push({ nome: '', firmato: false, settore_lavorativo: x });
                    })
                    const groupedData = aSettoriLavorativi.reduce((acc, item) => {
                        const key = Object.keys(item)[0];
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push(item[key]);
                        return acc;
                    }, {});
                    //debugger
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
                //debugger

            },

            //funzioni per la gestione dei ruoli
            navToGestioneRuoli: function () {
                //debugger
                let self = this
                if (!this._DialogRuoli) {
                    this._DialogRuoli = new sap.ui.core.Fragment.load({
                        id: this.getView().getId(),
                        name: "flexcollay.view.GestioneRuoli",
                        controller: this
                    }).then(function (oDialog) {
                        //debugger
                        this._DialogRuoli = oDialog
                        return oDialog;
                    }.bind(this));
                }
                self._DialogRuoli.then(async function (oDialog) {
                    //debugger
                    let utenti = await Utenti.getAll()

                    oDialog.setModel(new sap.ui.model.json.JSONModel(), "modelloListaUtenti")
                    oDialog.setModel(new sap.ui.model.json.JSONModel(), "modelloGestioneRuoli")

                    oDialog.getModel("modelloListaUtenti").setProperty("/utenti", utenti)

                    let listaRuoli = [{ nome: "Qualità" }, { nome: 'Ricerca e Sviluppo' }, { nome: "Logistica" }, { nome: "Acquisti" }, { nome: "PM" }]
                    oDialog.getModel("modelloGestioneRuoli").setProperty("/", { listaRuoli: listaRuoli })

                    oDialog.open();

                }.bind(this));

            },
            addUser: function () {
                //debugger
                if (!this.oDialogNewUser) {
                    this.oDialogNewUser = new sap.m.Dialog({
                        contentWidth: "550px",
                        contentHeight: "250px",
                        customHeader: new sap.m.Bar({
                            contentMiddle: [
                                new sap.m.Title({ text: "Inserimento nuovo utente" })
                            ],
                            contentRight: [
                                new sap.m.Button({
                                    icon: 'sap-icon://decline',
                                    type: 'Emphasized',
                                    press: function (oEvent) {
                                        this.oDialogNewUser.destroy();
                                        this.oDialogNewUser = undefined
                                    }.bind(this)
                                })
                            ]
                        }),
                        content: [
                            new sap.ui.layout.form.SimpleForm({
                                layout: "ResponsiveGridLayout",
                                content: [
                                    new sap.m.Label({ text: "Nome", required: true }),
                                    new sap.m.Input({ value: "{modelloDialog>/nome}" }),
                                    new sap.m.Label({ text: "Email", required: true }),
                                    new sap.m.Input({ value: "{modelloDialog>/email}" }),
                                    new sap.m.Label({ text: "Ruolo", width: "50%", required: true }),
                                    new sap.m.ComboBox({
                                        selectedKey: '{modelloDialog>/ruolo}',
                                        items: {
                                            path: "modelloGestioneRuoli>/listaRuoli",
                                            template: new sap.ui.core.Item({
                                                key: "{modelloGestioneRuoli>nome}",
                                                text: "{modelloGestioneRuoli>nome}"
                                            })
                                        },

                                    })
                                ]
                            })
                        ],
                        endButton: new sap.m.Button({
                            text: "OK",
                            type: 'Emphasized',
                            press: function (oEvent) {
                                let valoriInseriti = oEvent.getSource().getParent().getModel("modelloDialog").getProperty("/")
                                if (Object.keys(valoriInseriti).find(x => valoriInseriti[x] === null || valoriInseriti[x].length == 0) !== undefined) {
                                    sap.m.MessageBox.error("Inserire tutti i campi");
                                } else {
                                    sap.m.MessageBox.confirm(
                                        "Sei sicuro di voler creare un nuovo utente?", {
                                        icon: sap.m.MessageBox.Icon.INFORMATION,
                                        title: "Creazione utente",
                                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                                        emphasizedAction: sap.m.MessageBox.Action.YES,
                                        onClose: function (oAction) {
                                            if (oAction == 'YES') {
                                                this._DialogRuoli.getModel("modelloListaUtenti").getProperty("/utenti").push(valoriInseriti);
                                                this._DialogRuoli.getModel("modelloListaUtenti").updateBindings();
                                            }
                                            this.oDialogNewUser.destroy();
                                            this.oDialogNewUser = undefined
                                        }.bind(this)
                                    })

                                }
                            }.bind(this)
                        }),
                        beginButton: new sap.m.Button({
                            text: "Annulla",
                            press: function () {
                                this.oDialogNewUser.destroy();
                                this.oDialogNewUser = undefined
                            }.bind(this)
                        })
                    });

                    // // Add dialog to the root view
                    // this.getView().addDependent(this.oDialog);
                }
                //debugger
                this.oDialogNewUser.setModel(new sap.ui.model.json.JSONModel(), "modelloDialog")
                this.oDialogNewUser.setModel(new sap.ui.model.json.JSONModel(), "modelloGestioneRuoli")
                this.oDialogNewUser.getModel("modelloDialog").setProperty("/", {
                    nome: null,
                    email: null,
                    ruolo: [],
                    flag: "I"


                })
                let listaRuoli = [{ nome: "Qualità" }, { nome: 'Ricerca e Sviluppo' }, { nome: "Logistica" }, { nome: "Acquisti" }, { nome: "PM" }]
                this.oDialogNewUser.getModel("modelloGestioneRuoli").setProperty("/", { listaRuoli: listaRuoli })
                this.oDialogNewUser.open();
            },
            deleteUser: function (oEvent) {
                let table = this.byId("tableUser")
                let dialog = oEvent.getSource().getParent().getParent().getParent() ///attenzione
                const oModel = dialog.getModel("modelloListaUtenti")
                const oData = oModel.getProperty("/utenti")
                const aSelectedIndices = table.getSelectedItems()
                if (aSelectedIndices.length === 0) {
                    sap.m.MessageBox.error('Selezionare almeno una riga')
                } else {
                    sap.m.MessageBox.confirm(
                        "Sei sicuro di voler eliminare gli utenti selezionati?", {
                        icon: sap.m.MessageBox.Icon.INFORMATION,
                        title: "Conferma cancellazione",
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                        emphasizedAction: sap.m.MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if (oAction == 'YES') {
                                let indexElementRemove = [], arrayDelete = []
                                aSelectedIndices.forEach(x => {
                                    let obj = x.getBindingContext("modelloListaUtenti").getObject()
                                    let index = oData.findIndex(x => x.nome == obj.nome)
                                    if (index != -1) {
                                        indexElementRemove.push(index)
                                    }
                                })
                                indexElementRemove.sort((a, b) => b - a);


                                indexElementRemove.forEach(indice => {
                                    arrayDelete.push(oData[indice])
                                    oData.splice(indice, 1);

                                });
                                aSelectedIndices.forEach(x => x.setSelected(false))
                                dialog.getModel("modelloListaUtenti").setProperty("/utentiCancellati", arrayDelete)
                                dialog.getModel("modelloListaUtenti").updateBindings()


                            }
                        }.bind(this)
                    }
                    );
                }
            },


            onSaveChangeUser: async function (oEvent) {
                let dataob = this._DialogRuoli.getModel("modelloListaUtenti").getData()

                //debugger
                await Utenti.updateUser({ data: [dataob] })
                sap.m.MessageBox.success("Salvataggio avvenuto con successo", {
                    title: "Salvataggio",
                    actions: [sap.m.MessageBox.Action.OK],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    onClose: function (oAction) {
                        // this.navPagPrec()
                        this._DialogRuoli.destroy()
                        this._DialogRuoli = undefined;
                    }.bind(this)
                });

            },


        });
    });
