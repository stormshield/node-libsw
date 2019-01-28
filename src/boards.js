'use strict'

const {getData, BOARDS} = require('./get-data')

module.exports = {
	async getAll(opts, filter = {}) {
		const data = await getData(opts, BOARDS)
		return data.result.projects[0].boards.filter(board => {
			for (const field of Object.keys(filter)) {
				if (board[field] !== filter[field]) {
					return false
				}
			}
			return true
		})
	},
	async getOne(opts, filter = {}) {
		const boards = await this.getAll(opts, filter)
		return boards[0]
	},
	async getById(opts, boardId) {
		const board = await this.getOne(opts, {id: boardId})
		if (!board) {
			throw new Error(`No board found with id "${boardId}"`)
		}
		return board
	},
	async getByName(opts, boardName) {
		const board = await this.getOne(opts, {name: boardName})
		if (!board) {
			throw new Error(`No board found with name "${boardName}"`)
		}
		return board
	}
}
