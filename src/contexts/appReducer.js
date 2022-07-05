export default function AppReducer(state, action) {
    let newState = {}
    action.type.forEach((type, i) => {
        switch (type) {
            case 'CHANGE_TODOS':
                return newState = { ...newState, todos: action.value[i] }
            case 'CHANGE_PAGE':
                return newState = { ...newState, page: action.value[i] }
            case 'CHANGE_ADMIN':
                return newState = { ...newState, isAdmin: action.value[i] }
            case 'CHANGE_SORT':
                return newState = { ...newState, sort: action.value[i] }
        }
    })
    return {
        ...state,
        ...newState
    }
}