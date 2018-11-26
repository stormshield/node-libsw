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
    async getById(opts, sprintId) {
        const sprints = await this.getAll(opts, {id: sprintId})
        if (sprints.length === 0) {
            throw new Error(`No sprint found with id "${sprintId}"`)
        }
        return sprints[0]
    },
    async getByName(opts, sprintName) {
        const sprints = await this.getAll(opts, {name: sprintName})
        if (sprints.length === 0) {
            throw new Error(`No sprint found with name "${sprintName}"`)
        }
        return sprints[0]
    }
}
