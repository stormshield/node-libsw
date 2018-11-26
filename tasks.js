'use strict'

const request = require('superagent')

const BacklogItems = require('./backlog-items')
const config = require('./config.json')

module.exports = {
    async addTask(opts, backlogItemId, task) {
        const res = await request
            .post(`${config.url}/addTask`)
            .auth(opts.email, opts.apikey)
            .type('form')
            .send({
                backlogItemID: backlogItemId,
                ...task
            })
        return res.body
    },
    async delete(opts, taskId) {
        await request
            .post(`${config.url}/deleteTask`)
            .auth(opts.email, opts.apikey)
            .type('form')
            .send({taskID: taskId})
    },
    async getById(opts, taskId) {
        const backlogItems = await BacklogItems.getAll({getTasks: true, ...opts})
        if (backlogItems.length === 0) {
            throw new Error('No backlog item found')
        }
        let task = null
        for (const item of backlogItems) {
            const task = item.tasks.find(task => task.id === taskId)
            if (task !== undefined) {
                return task
            }
        }
        throw new Error(`No task found with id "${taskId}"`)
    },
    async getByNumber(opts, taskNumber) {
        const backlogItems = await BacklogItems.getAll({getTasks: true, ...opts})
        if (backlogItems.length === 0) {
            throw new Error('No backlog item found')
        }
        let task = null
        for (const item of backlogItems) {
            const task = item.tasks.find(task => String(task.taskNumber) === taskNumber)
            if (task !== undefined) {
                return task
            }
        }
        throw new Error(`No task found with number "${taskNumber}"`)
    },
    async setTaskDescription(opts, taskId, description) {
        const res = await request
            .post(`${config.url}/setTaskDescription`)
            .auth(opts.email, opts.apikey)
            .type('form')
            .send({
                taskID: taskId,
                description
            })
        return res.body
    },
    async setTaskName(opts, taskId, name) {
        const res = await request
            .post(`${config.url}/setTaskName`)
            .auth(opts.email, opts.apikey)
            .type('form')
            .send({
                taskID: taskId,
                name
            })
        return res.body
    }
}
