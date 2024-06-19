sap.ui.define([
    "sap/ui/core/mvc/Controller", "../model/Revisioni",
    "../model/Utenti", 'sap/ui/model/FilterOperator',
    'sap/m/MessageToast', "sap/ui/core/Fragment",
    "../model/Enti"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Revisioni, Utenti, FilterOperator, MessageToast, Fragment, Enti) {
        "use strict";
        return Controller.extend("project1.controller.BaseController", {
            //funzione per ripopolare il modello della tabella principale aggiornato
            renderModelDatiNode: async function () {
                let ruolo = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")
                let nome = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome")
                let data = await Revisioni.getAll({ ruolo, nome })
                data.map((x, index, data) => data[index].data_ora = this.format.formatData(x.data_ora))
                this.getOwnerComponent().getModel("modelloDatiNode").setProperty("/", data)
            },
            openDialogShowPDF: function (oEvent) {
                let self = this
                //differenziare con il custom data
                if (!this._dialgPDF) {
                    this._dialgPDF = new sap.ui.core.Fragment.load({
                        id: this.getView().getId(),
                        name: "flexcollay.view.Fragments.PdfFragment",
                        controller: this
                    }).then(function (oDialog) {
                        //debugger
                        return oDialog;
                    });
                }

                self._dialgPDF.then(async function (oDialog) {
                    let file
                    oEvent.getSource().getCustomData()[0].getKey() === 'TabellaHome'
                        ? file = oEvent.getSource().getBindingContext("modelloDatiNode").getObject("pdfname")
                        : file = this.getView().getModel("modelloAppoggio").getProperty("/elemento_selezionato/pdfname")
                    this.byId("PDF").setSource(`http://localhost:51531/NonConformit/1/${file}.pdf`)
                    oDialog.setModel(new sap.ui.model.json.JSONModel({ filename: file }), "modelloDialogFile")
                    oDialog.open();

                }.bind(this));
            },
            closeDialog: function (oEvent) {
                oEvent.getSource().getParent().getParent().close()
            },
            openDialogCreaModello: async function (oEvent, elemento_selezionato) {
                let self = this, obj,
                    arrayPromise = []

                arrayPromise.push(new Promise((resolve) => resolve(Utenti.getAll())))
                arrayPromise.push(new Promise((resolve) => resolve(Enti.getAll())))

                Promise.all(arrayPromise).then(results => {
                    self.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({ utenti: results[0] }), "modello")
                    elemento_selezionato !== undefined ? obj = {
                        titolo: elemento_selezionato.titolo,
                        data: new Date(),

                    } : obj = {
                        titolo: null,
                        data: new Date(),
                        firmatari: null,
                        filename: null,
                        enti_firmatari: null,
                        enti: results[1].map(x => x.nome),
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
                            //debugger
                            return oDialog;
                        });
                    }
                    self._dialog.then(async function (oDialog) {

                        oDialog.setModel(new sap.ui.model.json.JSONModel(obj), "modelloNewModel")

                        oDialog.open();

                    }.bind(this));
                })

            },
            closeDialog: function (oEvent) {
                oEvent.getSource().getParent().getParent().close()
            },
            format: {
                formatData: function (model) {
                    if (model) {
                        let datinizi = new Date(model)
                        let datainizioformat = `${datinizi.getDate().toString().padStart(2, "0")}/${[datinizi.getMonth() + 1].toString().padStart(2, "0")}/${datinizi.getFullYear()}`
                        return datainizioformat;
                    } else return
                },

            },
            getFileName: function () {
                let FileUpload = this.byId("myFileUpload"),
                    filename = FileUpload.getValue().split(".")[0]
                return filename
            },
            handleNavigateToTable: function () {
                this.bus.publish("flexible", "setListPage");
            },
            onNewRev: function (oEvent, state) {
                let elemento_selezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                this.openDialogCreaRevisione(oEvent, elemento_selezionato, state)
            },


            openDialogCreaRevisione: function (oEvent, elemento_selezionato, state) {
                let self = this, obj, arrayPromise = []
                obj = {
                    titleDialog: state === 'Review' ? 'Invio a firma non conformità' : "Creazione revisione non conformità",
                    titolo: elemento_selezionato.titolo,
                    data: new Date(),
                    firmatari: (elemento_selezionato.enti.entiSelezionati) != null ? (elemento_selezionato.enti.entiSelezionati).map(x => x.nome) : null,
                    filename: null,
                    entiSelezionati: (elemento_selezionato.enti.entiSelezionati) != null ? (elemento_selezionato.enti.entiSelezionati).map(x => x.settore_lavorativo) : null,
                    editable: state === 'Review' ? true : false,
                    tipologia: elemento_selezionato.tipologia || null
                }
                arrayPromise.push(new Promise((resolve) => resolve(Enti.getAll())))
                Promise.all(arrayPromise).then(results => {
                    obj['enti'] = results[0].map(x => x.nome),
                        obj['listaUtenti'] = self.getOwnerComponent().getModel("modello").getProperty("/utenti")
                    obj['utentiSelect'] = self.getOwnerComponent().getModel("modello").getProperty("/utenti")
                    if (!this._dialogRevisioni) {
                        this._dialogRevisioni = new sap.ui.core.Fragment.load({
                            id: this.getView().getId(),
                            name: "flexcollay.view.Fragments.creaRevisione",
                            controller: this
                        }).then(function (oDialog) {
                            return oDialog;
                        });
                    }
                    self._dialogRevisioni.then(async function (oDialog) {
                        oDialog.setModel(new sap.ui.model.json.JSONModel(obj), "modelloNewModel")
                        oDialog.open();

                    }.bind(this));
                })
            },
            creaRevisione: async function (oEvent) {
                let filename = this.getFileName()
                let oggettoSelezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")

                oggettoSelezionato.enti.entiSelezionati.forEach(ente => {
                    ente.firmato = false;
                });
                let copyObj = {
                    id_nonconf: oggettoSelezionato.id_nonconf,
                    data_ora: new Date(),
                    pdfname: filename,
                    stato: 'In fase di firma',
                    enti: oggettoSelezionato.enti

                    // enti: oggettoSelezionato.enti

                }
                await Revisioni.createOne({ data: copyObj })
                oEvent.getSource().getParent().destroy()
                this.handleNavigateToTable()

                //ricarico i dati aggiornati nella tabella principale
                this.renderModelDatiNode()
            },


            ////
            afterClose: function (oEvent) {
                if (this._dialog) {
                    oEvent.getSource().destroy()
                    this._dialog = null;
                }

                if (this._dialogRevisioni) {
                    oEvent.getSource().destroy()
                    this._dialogRevisioni = null;
                }
            },
            onSearchField: function (oEvent) {
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new sap.ui.model.Filter("nome", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }
                var oList = this.byId("tableUser");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },

            //prova
            AlertDialog: function (oEvent) {
                //debugger
                let key = oEvent.getSource().getCustomData()[0].getKey(),
                    descrizione = null
                key == "Reject" ? this.dialogReject(this, descrizione) : this.dialogConferma(this, descrizione, key)

            },
            dialogReject: function (self, descrizione) {
                if (!this.oDefaultMessageDialog) {
                    this.oDefaultMessageDialog = new sap.m.Dialog({
                        type: sap.m.DialogType.Message,
                        title: "Rifiuta",
                        content: [
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({
                                        text: "Sei sicuro di voler rifiutare?"
                                    }),
                                    new sap.m.VBox({
                                        width: "auto",
                                        alignItems: sap.m.FlexAlignItems.Baseline,
                                        items: [
                                            new sap.m.Label({
                                                text: "Note"
                                            }),
                                            new sap.m.TextArea({
                                                value: "{modelloDialog>/data}",
                                                width: "260px"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ],
                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "Si",
                            press: async function () {
                                let elemento_selezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato"),
                                    notaAggiuntiva = this.oDefaultMessageDialog.getModel("modelloDialog").getProperty("/data"),
                                    nomeutente = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome"),
                                    date = new Date()
                                let objNote = [{
                                    nota: notaAggiuntiva,
                                    utente: nomeutente,
                                    data: date
                                }]
                                let settoreutente = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")

                                await Revisioni.updateSignature({ id: elemento_selezionato.id, firma: false, utente: nomeutente, settore: settoreutente, data: { note: objNote } })

                                this.oDefaultMessageDialog.close();
                                MessageToast.show("Salvataggio avvenuto con successo")
                                this.handleNavigateToTable()

                                //ricarico i dati aggiornati nella tabella principale
                                this.renderModelDatiNode()

                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "No",
                            press: function () {
                                this.oDefaultMessageDialog.close();
                            }.bind(this)
                        })
                    })
                }
                this.oDefaultMessageDialog.setModel(new sap.ui.model.json.JSONModel({
                    self: self,
                    data: descrizione
                }), "modelloDialog")
                this.oDefaultMessageDialog.open();
            },
            dialogConferma: function (self, descrizione, key) {
                new sap.m.MessageBox.show(
                    "Sei sicuro di voler confermare?", {
                    icon: sap.m.MessageBox.Icon.SUCCESS,
                    title: "Salvataggio",
                    content: [key, self],
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: async function (sAction) {
                        //debugger
                        let self = this.content[1]
                        if (sAction == 'YES') {
                            let elemento_selezionato = self.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                            if (this.content[0] === 'Chiusura') {
                                await Revisioni.updateStato({ id: elemento_selezionato.id, stato: 'Chiuso' })
                                this.onClose()
                                MessageToast.show("Salvataggio avvenuto con successo")
                                self.handleNavigateToTable()
                            } else {
                                //debugger
                                let nomeutente = self.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome")
                                let settoreutente = self.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")

                                let objNote = [{
                                    nota: 'Firmato',
                                    utente: nomeutente,
                                    data: new Date()
                                }]

                                await Revisioni.updateSignature({ id: elemento_selezionato.id, firma: true, utente: nomeutente, settore: settoreutente, data: { note: objNote } })
                                this.onClose()
                                MessageToast.show("Salvataggio avvenuto con successo")
                                self.handleNavigateToTable()
                                //ricarico i dati aggiornati nella tabella principale
                                this.renderModelDatiNode()
                            }

                        } else {
                            this.onClose()
                        }
                    }
                }
                );
            },
        })
    })