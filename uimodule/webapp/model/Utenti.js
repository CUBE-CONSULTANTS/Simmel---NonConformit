sap.ui.define(["./API"], function (API) {
    "use strict";

    return {
        getAll: async function ({ token }) {
            return await API.getEntitySet({ entity: "/Utenti/getAll", token });
        },
        getOne: async function ({ nome, token }) {
            return await API.getEntity({ entity: `/Utenti/getRuoloByName/${nome}`, token });
        },
        getInfoUserLog: async function ({ nome, token }) {
            return await API.getEntity({ entity: `/Utenti/getInfoUserLog/${nome}`, token });
        },
        updateUser: async function ({ data, token }) {
            return await API.createEntity({ entity: "/Utenti/updateUser", data, token });
        },
        createMany: async function ({ data, token }) {
            return await API.createEntity({ entity: "/Utenti/create", data, token });
        },
        updateOne: async function ({ id, data, token }) {
            return await API.updateEntity({ entity: `/Utenti/update/${id}`, data, token });
        },
        updateMany: async function ({ data, token }) {
            return await API.updateEntity({ entity: "/Utenti/update", data, token });
        },
        deleteOne: async function ({ data, token }) {
            return await API.deleteEntity({ entity: "/Utenti/delete", data, token });
        },
        deleteMany: async function ({ data, token }) {
            return await API.deleteEntity({ entity: "/Utenti/delete", data, token });
        },
        filterid: async function ({ data, token }) {
            return await API.getFilterID({ entity: `/Utenti/filter/${data}`, token });
        },
        getLast: async function ({ token }) {
            return await API.getLastElement({ entity: `/Utenti/last`, token });
        },

    };
});
