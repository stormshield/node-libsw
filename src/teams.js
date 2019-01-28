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
	async getOne(opts, filter = {}) {
		const teams = await this.getAll(opts, filter)
		return teams[0]
	},
	async getById(opts, teamId) {
		const team = await this.getOne(opts, {id: teamId})
		if (!team) {
			throw new Error(`No team found with id "${teamId}"`)
		}
		return team
	},
	async getByName(opts, teamName) {
		const team = await this.getOne(opts, {name: teamName})
		if (!team) {
			throw new Error(`No team found with name "${teamName}"`)
		}
		return team
	}
}
