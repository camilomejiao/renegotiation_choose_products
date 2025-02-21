import AlertComponent from "../alert/AlertComponent";

//Dividir un array en lotes
export const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};

//Extraer los precios de municipios dinámicos
export const extractMunicipios = (product) => {
    return Object.keys(product)
        .filter(key => key.startsWith("price_"))
        .reduce((acc, key) => {
            const municipioId = key.split("_")[1];
            acc[municipioId] = product[key];
            return acc;
        }, {});
};

//Maneja el error en caso de fallo de la llamada
export const handleError = (error, title) => {
    AlertComponent.error(error, title);
};

export const showAlert = (title, message) => {
    AlertComponent.success(title, message)
};