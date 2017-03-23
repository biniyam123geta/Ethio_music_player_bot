﻿const Datastore = require('nedb');

//initalize db collection
const init = function (collection) {
    var db = new Datastore({ filename: 'db/' + collection + '.db', autoload: true });
    return db;
}
//save unique users
const saveUser = (user) => new Promise((resolve, reject) => {
    const userDb = init('users');
    userDb.ensureIndex({ fieldName: 'userId', unique: true });

    let u = {};
    u.name = user.username;
    u.username = user.first_name;
    u.userId = user.id;

    userDb.insert(u, function (err, doc) {
        return resolve(userDb);
    });
});
//save user search history
const updateUserSearchData = (user, action, keyword) => new Promise((resolve, reject) => {
    saveUser(user).then(function (userModel) {
        userModel.update({ userId: user.id }, {
            $push: { searches: { action: action, date: new Date, keyword: keyword } }
        }, {}, function () {
            resolve({ status: true });
        });
    }).catch(function(err){
        console.log(err);
        resolve();
    });
});
//save music to user play history
const updateUserPlayData = (user, musicId, url) => new Promise((resolve, reject) => {
    saveUser(user).then(function (userModel) {
        userModel.update({ userId: user.id }, {
            $push: { plays: { musicId: musicId, date: new Date, url: url } }
        }, {}, function () {
            resolve({ status: true });
        });
    }).catch(function(err){
        console.log(err);
        resolve();
    });
    
});
//show list of saved users
const showDb = function () {
    const userDb = init('users');
    userDb.find({}, function (err, docs) {
        console.log(docs)
    });
}

module.exports = {
    saveUser: saveUser,
    updateUserSearchData: updateUserSearchData,
    updateUserPlayData: updateUserPlayData,
    showDb: showDb
}