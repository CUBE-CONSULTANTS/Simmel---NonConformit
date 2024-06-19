sap.ui.define(["./API"], function (API) {
    "use strict";

    return {
        getAll: async function () {
            return await API.getEntitySet({ entity: "/Utenti/getAll" });
        },
        getOne: async function ({ nome }) {
            return await API.getEntity({ entity: `/Utenti/getRuoloByName/${nome}` });
        },
        getInfoUserLog: async function ({ nome }) {
            return await API.getEntity({ entity: `/Utenti/getInfoUserLog/${nome}` });
        },
        updateUser: async function ({ data }) {
            return await API.createEntity({ entity: "/Utenti/updateUser", data });
        },
        createMany: async function ({ data }) {
            return await API.createEntity({ entity: "/Utenti/create", data });
        },
        updateOne: async function ({ id, data }) {
            return await API.updateEntity({ entity: `/Utenti/update/${id}`, data });
        },
        updateMany: async function ({ data }) {
            return await API.updateEntity({ entity: "/Utenti/update", data });
        },
        deleteOne: async function ({ data }) {
            return await API.deleteEntity({ entity: "/Utenti/delete", data });
        },
        deleteMany: async function ({ data }) {
            return await API.deleteEntity({ entity: "/Utenti/delete", data });
        },
        filterid: async function ({ data }) {
            return await API.getFilterID({ entity: `/Utenti/filter/${data}` });
        },
        getLast: async function () {
            return await API.getLastElement({ entity: `/Utenti/last` });
        },
       
    };
});
