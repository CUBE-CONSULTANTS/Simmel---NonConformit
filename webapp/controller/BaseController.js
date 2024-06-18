sap.ui.define([
    "sap/ui/core/mvc/Controller", "../model/Revisioni","../model/Utenti"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Revisioni,Utenti) {
        "use strict";
        return Controller.extend("project1.controller.BaseController", {
            openDialogShowPDF: function (oEvent) {
                let self = this
                //differenziare con il custom data
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
                    let file
                    oEvent.getSource().getCustomData()[0].getKey() === 'TabellaHome'
                        ? file = oEvent.getSource().getBindingContext("modelloDatiNode").getObject("pdfname")
                        : file = this.getView().getModel("modelloAppoggio").getProperty("/elemento_selezionato/pdfname")
                    this.byId("PDF").setSource(`http://localhost:3404/NonConformit/1/${file}.pdf`)
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
                // debugger
                // let call = await fetch("../model/modelloDatiMock.json")
                // let oggetto = await call.json()
                // console.log(oggetto)
                // // debugger
                arrayPromise.push(new Promise((resolve) => resolve(Utenti.getAll())))
                Promise.all(arrayPromise).then(results => {
                    self.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({ utenti: results[0] }), "modello")
                    debugger
                    elemento_selezionato !== undefined ? obj = {
                        titolo: elemento_selezionato.titolo,
                        data: new Date(),

                    } : obj = {
                        titolo: null,
                        data: new Date(),
                        firmatari: null,
                        filename: null,
                        enti_firmatari: null,
                        enti: ["Qualità",'Ricerca e Sviluppo',"Logistica", "Acquisti", "PM"],
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
                let self = this, obj
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
                obj['enti'] = ["Qualità",'Ricerca e Sviluppo',"Logistica", "Acquisti", "PM"],
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
            },
            creaRevisione: async function (oEvent) {
                let filename = this.getFileName()
                let oggettoSelezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                let copyObj = {
                    id_nonconf: oggettoSelezionato.id_nonconf,
                    data_ora: new Date(),
                    pdfname: filename,
                    stato: 'In fase di firma',
                    enti: oggettoSelezionato.enti

                }
                await Revisioni.createOne({ data: copyObj })
                oEvent.getSource().getParent().destroy()
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
        })
    })