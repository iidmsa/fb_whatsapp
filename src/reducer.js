export const initialState = {
    user: null,
    isTyping: false
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_TYPING: "SET_TYPING"
};

const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case actionTypes.SET_USER:            
            return {
                ...state,
                user: action.user
            };  
        case actionTypes.SET_TYPING:            
            return {
                ...state,
                isTyping: action.isTyping
            };    
        default:
            return state;
    }
};

export default reducer;

