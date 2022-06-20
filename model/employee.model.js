const collection = require('./DB/connection');
const { COLLECTION_NAME } = require('../keys/constant');
const { model } = require('mongoose');

const employeeModel = {};

employeeModel.bulkInsert = (employeeData) => {
    return collection.getCollection(COLLECTION_NAME.EMPLOYEE)
        .then(model => model.insertMany(employeeData, { ordered: false }))
        .then(response => response)
        .catch(err => { console.log(err.result.result.insertedIds.length - err.result.result.writeErrors.length); return err.result.result.insertedIds.length - err.result.result.writeErrors.length });
}

employeeModel.bulkDelete = (employeePFData) => {
    return collection.getCollection(COLLECTION_NAME.EMPLOYEE)
        .then(model => model.deleteMany({ EMPNO: { $in: employeePFData.toDelete } }))
        .then(response => response)
        .catch(err => { return err.toDelete.length });
}

module.exports = employeeModel;