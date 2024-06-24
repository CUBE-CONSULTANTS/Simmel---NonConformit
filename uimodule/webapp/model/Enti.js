sap.ui.define(["./API"], function (API) {
    "use strict";

    return {
        getAll: async function ({ token }) {
            return await API.getEntitySet({ entity: "/Enti/getAll", token });
        },
        getOne: async function ({ id, ruolo, token }) {
            return await API.getEntity({ entity: `/Enti/getOne/${id}/${ruolo}`, token });
        },
        createFirstModel: async function ({ data, token }) {
            return await API.createEntity({ entity: "/Enti/createFirstModel", data, token });
        },
        createMany: async function ({ data, token }) {
            return await API.createEntity({ entity: "/Enti/create", data, token });
        },
        updateOne: async function ({ id, data, token }) {
            return await API.updateEntity({ entity: `/Enti/update/${id}`, data, token });
        },
        updateMany: async function ({ data, token }) {
            return await API.updateEntity({ entity: "/Enti/update", data, token });
        },
        deleteOne: async function ({ data, token }) {
            return await API.deleteEntity({ entity: "/Enti/delete", data, token });
        },
        deleteMany: async function ({ data, token }) {
            return await API.deleteEntity({ entity: "/Enti/delete", data, token });
        },
        filterid: async function ({ data, token }) {
            return await API.getFilterID({ entity: `/Enti/filter/${data}`, token });
        },
        getLast: async function ({ token }) {
            return await API.getLastElement({ entity: `/Enti/last`, token });
        }
    };
});
