import * as sapper from '@sapper/app'

const target = document.querySelector('#sapper')
if (!target) throw new Error("Element #sapper not found.");
sapper.start({
	target
})
