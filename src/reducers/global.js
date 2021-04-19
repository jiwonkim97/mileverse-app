
const initialState = {
    version: "1.3.3"
};

export default function global(state, action) {
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        default:
            return state;
    }
}