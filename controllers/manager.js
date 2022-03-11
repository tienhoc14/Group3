const express = require('express')
const { ObjectId } = require('mongodb')
const { getDB, insertObject, deleteCoordinator, deleteStaff, deleteManager} = require('../databaseHandler')