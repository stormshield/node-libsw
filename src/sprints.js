'use strict'

const {getData, SPRINTS} = require('./get-data')

module.exports = {
    async getAll(opts, filter = {}) {
        const data = await getData(opts, SPRINTS)
        return data.result.projects[0].sprints.filter(sprint => {
            for (const field of Object.keys(filter)) {
                if (typeof filter[field] === 'string' && sprint[field] !== filter[field]) {
                    return false
                } else if (Array.isArray(filter[field]) && !filter[field].includes(sprint[field])) {
                    return false
                }
            }
            return true
        })
    },
    async getOne(opts, filter = {}) {
        const sprints = await this.getAll(opts, filter)
        return sprints[0]
    },
    async getById(opts, sprintId) {
        const sprint = await this.getOne(opts, {id: sprintId})
        if (!sprint) {
            throw new Error(`No sprint found with id "${sprintId}"`)
        }
        return sprint
    },
    async getByName(opts, sprintName) {
        const sprint = await this.getOne(opts, {name: sprintName})
        if (!sprint) {
            throw new Error(`No sprint found with name "${sprintName}"`)
        }
        return sprint
    }
}
