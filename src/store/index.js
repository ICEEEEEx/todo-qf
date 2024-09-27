import Vue from 'vue';
import Vuex from 'vuex'
import Parse from "parse";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {

		curUserId: null,

		filters: {
			attachmentsOnly: false,
			setStatusOnly: null,
			setDueDateOnly: undefined,
		},

		availableToDos: [],
	},
	getters: {
		filterAttach(state){
			return state.filters.attachmentsOnly;
		},
		filterStatus(state) {
			return state.filters.setStatusOnly;
		},
		filterDate(state){
			return state.filters.setDueDateOnly;
		},

		getAvailableToDos(state){
			return state.availableToDos;
		},
		getUserId(state){
			return state.curUserId;
		}
	},
	mutations: {
		setFilterAttach(state, newValue){
			state.filters.attachmentsOnly = newValue;
		},
		setFilterStatus(state, newValue){
			state.filters.setStatusOnly = newValue;
		},
		setFilterDueDate(state, newValue){
			state.filters.setDueDateOnly = newValue;
		},


		setAvailableToDos(state, newItems) {
			state.availableToDos = newItems;
		},
		setUserId(state, userId){
			state.curUserId = userId;
		}
	},
	actions: {
		fetchToDos(context, payload) {
			let localUserId = context.getters['getUserId'];

			if(payload && payload.userId) {
				localUserId = payload.userId;
			}

			let toDoQuery = new Parse.Query('ToDo');
			let userPointer = {"__type": "Pointer", className: '_User', objectId: localUserId,}

			toDoQuery.equalTo('owner', userPointer);




			if(context.getters['filterAttach']){
				// toDoQuery.notEqual('attachment', null);
				toDoQuery.exists('attachment');
			}

			if(context.getters['filterStatus'] === true || context.getters['filterStatus'] === false){
				// console.log(context.getters['filterStatus'])
				toDoQuery.equalTo('status', context.getters['filterStatus']);
			} else{
				toDoQuery.equalTo('owner', userPointer);
			}

			if(context.getters['filterDate']){
				// toDoQuery.notEqual('attachment', null);
				toDoQuery.equalTo('dueDate', context.getters['filterDate']);
			}



			// toDoQuery.descending('status');

			toDoQuery.find().then((data) => {
				console.log("My todos", data);
				let mappedData = data.map((todo) => {
					return {
						status: todo.get('status') ? 1 : 0,
						name: todo.get('name'),
						content: todo.get('content'),
						dueDate: todo.get('dueDate'),
						attachment: todo.get('attachment'),

						id: todo.id,
						originalTodo: todo
					}
				});
				context.commit('setAvailableToDos', mappedData);
			});
		}
	}
})