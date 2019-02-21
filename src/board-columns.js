'use strict'

const Boards = require('./boards')

module.exports = {
	async getById(opts, columnId) {
		const boards = await Boards.getAll(opts)
		if (boards.length === 0) {
			throw new Error('No board found')
		}
		for (const board of boards) {
			const column = board.columns.find(column => column.id === columnId)
			if (column !== undefined) {
				return column
			}
		}
		throw new Error(`No board column found with id "${columnId}"`)
	},
	async getByName(opts, columnName) {
		const boards = await Boards.getAll(opts)
		if (boards.length === 0) {
			throw new Error('No board found')
		}
		for (const board of boards) {
			const column = board.columns.find(column => column.name === columnName)
			if (column !== undefined) {
				return column
			}
		}
		throw new Error(`No board column found with name "${columnName}"`)
	}
}
