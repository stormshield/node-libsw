'use strict'

const {getData, DELETED_PERSONS, PERSONS} = require('./get-data')

module.exports = {
	async getAll(opts) {
		const data = await getData(opts, DELETED_PERSONS, PERSONS)
		return [
			...data.result.deletedPersons,
			...data.result.persons
		]
	}
}
