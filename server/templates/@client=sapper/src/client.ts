import assert from 'assert'
import * as sapper from '@sapper/app'

const target = document.querySelector('#sapper')
assert(target, 'Element #sapper not found.')
sapper.start({
	target
})
