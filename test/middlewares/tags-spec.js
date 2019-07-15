'use strict'

const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Tags middleware', function () {
    let mockTags
    let tagsMiddleware

    const tags = [{
        id: 'tag-0',
    }, {
        id: 'tag-1'
    }]

    beforeEach(function () {
        mockTags = {
            getAll: sinon.stub().resolves(tags)
        }
        tagsMiddleware = proxyquire('../../src/middlewares/tags', {
            '../tags': mockTags
        })
    })

    it('should populate a single object with tags', async function () {
        // given
        const objects = await tagsMiddleware.populateTags({}, {tagIDs: ['tag-0', 'tag-1']})

        // then
        objects[0].tags.should.eql(tags)
    })

    it('should populate objects with tags', async function () {
        // given
        const tagIDs = ['tag-0', 'tag-1']
        const objects = await tagsMiddleware.populateTags({}, [{tagIDs: ['tag-0']}, {tagIDs: ['tag-1']}])

        // then
        objects[0].tags.should.eql([tags[0]])
        objects[1].tags.should.eql([tags[1]])
    })

    it('should not alter an object withoud tags', async function () {
        // given
        const object = {a: 1}
        const objects = await tagsMiddleware.populateTags({}, object)

        // then
        objects[0].should.eql(object)
    })

})