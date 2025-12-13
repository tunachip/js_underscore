export function buildMove () {
	return {
		id: 0,
		element: 'WATER',
		type: 'ATTACK',
		damage: 2,
		times: 2,
		opCodes: {
			attuneTo: {
				target: 'caster',
			},
			attack: {
				target: 'opponent',
			}
	  },
		damageElement: function () {
			return this?.opCodes?.attuneTo?.element || this?.element
		}
	}
}



const move = buildMove()
const dmgElem = damageElement(move)
console.log(dmgElem)

