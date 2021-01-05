
const initialState = {
    version: "1.2.4"
};

export default function global(state, action) {
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        default:
            return state;
    }
}