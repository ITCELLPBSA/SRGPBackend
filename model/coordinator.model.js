const collection = require('./DB/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const coordinatorModel = {};

coordinatorModel.getCoordinators = () => {
    return collection.getCollection(COLLECTION_NAME.COORDINATORS)
        .then(model => model.find())
        .then(response => response);
}

module.exports = coordinatorModel;