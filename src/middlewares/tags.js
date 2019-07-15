'use strict'

const Tags = require('../tags')

async function populateTags(opts, rawObjects) {
    const objects = Array.isArray(rawObjects) ? rawObjects : [rawObjects]
    const tags = await Tags.getAll(opts)
    return objects.map(object => {
        const newObject = Object.assign({}, object)
        if (Array.isArray(object.tagIDs)) {
            newObject.tags = object.tagIDs.map(tagId => tags.find(tag => tag.id === tagId))
        }
        return newObject
    })
}

module.exports = {
    populateTags
}