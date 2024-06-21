sap.ui.define(["./API"], function (API) {
    "use strict";

    return {
        getAll: async function () {
            return await API.getEntitySet({ entity: "/Enti/getAll" });
        },
        getOne: async function ({ id, ruolo }) {
            return await API.getEntity({ entity: `/Enti/getOne/${id}/${ruolo}` });
        },
        createFirstModel: async function ({ data }) {
            return await API.createEntity({ entity: "/Enti/createFirstModel", data });
        },
        createMany: async function ({ data }) {
            return await API.createEntity({ entity: "/Enti/create", data });
        },
        updateOne: async function ({ id, data }) {
            return await API.updateEntity({ entity: `/Enti/update/${id}`, data });
        },
        updateMany: async function ({ data }) {
            return await API.updateEntity({ entity: "/Enti/update", data });
        },
        deleteOne: async function ({ data }) {
            return await API.deleteEntity({ entity: "/Enti/delete", data });
        },
        deleteMany: async function ({ data }) {
            return await API.deleteEntity({ entity: "/Enti/delete", data });
        },
        filterid: async function ({ data }) {
            return await API.getFilterID({ entity: `/Enti/filter/${data}` });
        },
        getLast: async function () {
            return await API.getLastElement({ entity: `/Enti/last` });
        }
    };
});
