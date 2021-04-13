
export  function formmatedNumber(data) {
    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}