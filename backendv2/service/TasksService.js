'use strict';


/**
 * Create Task
 *
 * body Timer Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.createTask = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Deleting a task
 *
 * id Id Deleting a done task
 * no response value expected for this operation
 **/
exports.deleteTask = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get All Tasks
 *
 * returns Tasks
 **/
exports.getAllTasks = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "id" : "ytVgh",
  "completed" : false,
  "title" : "Coding in JavaScript"
}, {
  "id" : "ytVgh",
  "completed" : false,
  "title" : "Coding in JavaScript"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get a Task by id
 *
 * id Id A single task id
 * returns Timer
 **/
exports.getTaskById = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "id" : "ytVgh",
  "completed" : false,
  "title" : "Coding in JavaScript"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update a Task
 *
 * body Timer Updated a Timer object
 * id Id Id of task to be updated
 * returns Timer
 **/
exports.updateTask = function(body,id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "id" : "ytVgh",
  "completed" : false,
  "title" : "Coding in JavaScript"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

