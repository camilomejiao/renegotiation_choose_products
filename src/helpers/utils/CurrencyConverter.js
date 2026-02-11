export const numeroALetras = (num) => {
    num = Number(num) || 0;
    if (num === 0) return "cero";

    const UNIDADES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const DIECES = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve"];
    const DECENAS = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    const cientos = (n) => {
        if (n === 0) return "";
        if (n === 100) return "cien";
        const c = Math.floor(n / 100);
        const r = n % 100;
        return [CENTENAS[c], decenas(r)].filter(Boolean).join(" ").trim();
    };

    const decenas = (n) => {
        if (n < 10) return UNIDADES[n];
        if (n >= 10 && n < 20) return DIECES[n - 10];
        const d = Math.floor(n / 10);
        const u = n % 10;
        if (d === 2) { // 20-29
            return u === 0 ? "veinte" : `veinti${UNIDADES[u]}`;
        }
        return u === 0 ? DECENAS[d] : `${DECENAS[d]} y ${UNIDADES[u]}`;
    };

    // Convierte números de 0..999999
    const miles = (n) => {
        if (n < 1000) return cientos(n);
        const m = Math.floor(n / 1000);
        const r = n % 1000;
        const mTxt = m === 1 ? "mil" : `${cientos(m)} mil`;
        const rTxt = cientos(r);
        return [mTxt, rTxt].filter(Boolean).join(" ").trim();
    };

    // Hasta miles de millones
    const millones = (n) => {
        if (n < 1_000_000) return miles(n);
        const mill = Math.floor(n / 1_000_000);
        const r = n % 1_000_000;
        const millTxt = mill === 1 ? "un millon" : `${miles(mill)} millones`;
        const rTxt = miles(r);
        return [millTxt, rTxt].filter(Boolean).join(" ").trim();
    };

    return millones(num);
};

