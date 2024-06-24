sap.ui.define([], function () {
    "use strict";

    const endpoint = "http://192.168.50.64/dev/Simmel----NonConformit-NodeJS";
    return {
        getEntitySet: function ({ entity, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `${endpoint}${entity}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "GET",
                    contentType: "application/json",
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        getExpandedEntitySet: function ({ entity, data, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `${endpoint}${entity}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        getEntity: function ({ entity, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "GET",
                    contentType: "application/json",
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        createEntity: function ({ entity, data, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        updateEntity: function ({ entity, data, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        deleteEntity: function ({ entity, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "DELETE",
                    contentType: "application/json",
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },
        getFilter: function ({ entity, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "GET",
                    contentType: "application/json",
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },
        createFirstModel: function ({ entity, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "GET",
                    contentType: "application/json",
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        updateStato: function ({ entity, data, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        updateModelAndRev: function ({ entity, data, token }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },
    };
});
