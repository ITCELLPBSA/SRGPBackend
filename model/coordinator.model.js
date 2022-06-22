const collection = require('./DB/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const coordinatorModel = {};

coordinatorModel.getCoordinators = () => {
    return collection.getCollection(COLLECTION_NAME.COORDINATORS)
        .then(model => model.find())
        .then(response => response);
}

coordinatorModel.addCoordinators = (PFNumber) => {
    return collection.getCollection(COLLECTION_NAME.COORDINATORS)
        .then(model => model.findOneAndUpdate({ ID: 'COORDINATORS' }, { $push: { Coordinators: PFNumber } }))
        .then(response => response);
}
coordinatorModel.removeCoordinators = (PFNumber) => {
    return collection.getCollection(COLLECTION_NAME.COORDINATORS)
        .then(model => model.findOneAndUpdate({ ID: 'COORDINATORS' }, { $pull: { Coordinators: PFNumber } }))
        .then(response => response);
}
module.exports = coordinatorModel;