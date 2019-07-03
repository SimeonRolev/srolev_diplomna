import axios from 'axios';

const request = axios.create({
    baseURL: "http://127.0.0.1:5000"
})


const translations = {
    getAll: () => request.get('/translations'),
    get: (id) => request.get(`/translations/${id}`),
    create: (params) => request.post('/translations', params),
    update: (id, params) => request.put(`/translations/${id}`, params)
}

const contexts = {
    get: (id) => request.get(`/contexts/${id}`),
    create: (params) => request.post('/contexts', params)
}

export {
    translations,
    contexts
};
