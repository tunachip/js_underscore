const counterStore = {
	state: function () {
		return {
			count: 2
		};
	},
	mutations: {
		incremenetCounter: function () {
			this.count++;
		}
	},
	getters: {
		doubleCount: function (state) {
			return
		}
	}
}
