'use strict'

const {getData, TEAMS} = require('./get-data')

module.exports = {
    async getAll(opts, filter = {}) {
        const data = await getData(opts, TEAMS)
        return data.result.projects[0].teams.filter(team => {
            for (const field of Object.keys(filter)) {
                if (team[field] !== filter[field]) {
                    return false
                }
            }
            return true
        })
    },
    async getById(opts, teamId) {
        const teams = await this.getAll(opts, {id: teamId})
        if (teams.length === 0) {
            throw new Error(`No team found with id "${teamId}"`)
        }
        return teams[0]
    },
    async getByName(opts, teamName) {
        const teams = await this.getAll(opts, {name: teamName})
        if (teams.length === 0) {
            throw new Error(`No team found with name "${teamName}"`)
        }
        return teams[0]
    }
}
