const selectedDep = (depto) => {
    let deptoS;
    switch (depto) {
        case 'atl':
            deptoS = 'Atlántida'
            break;
        case 'cho':
            deptoS = 'Choluteca'
            break;
        case 'col':
            deptoS = 'Colón'
            break;
        case 'com':
            deptoS = 'Comayagua'
            break;
        case 'cop':
            deptoS = 'Copán'
            break;
        case 'cor':
            deptoS = 'Cortés'
            break;
        case 'epa':
            deptoS = 'El Paraíso'
            break;
        case 'fco':
            deptoS = 'Francisco Morazán'
            break;
        case 'gdi':
            deptoS = 'Gracias a Dios'
            break;
        case 'int':
            deptoS = 'Intibucá'
            break;
        case 'iba':
            deptoS = 'Islas de la Bahía'
            break;
        case 'lpa':
            deptoS = 'La Paz'
            break;
        case 'lem':
            deptoS = 'Lempira'
            break;
        case 'oco':
            deptoS = 'Ocotepeque'
            break;
        case 'ola':
            deptoS = 'Olancho'
            break;
        case 'sba':
            deptoS = 'Santa Bárbara'
            break;
        case 'val':
            deptoS = 'Valle'
            break;
        case 'yor':
            deptoS = 'Yoro'
            break;
        default:
            return;
    }
    return deptoS;
}

const selectedCat = (categ) => {
    let categS;
    switch (categ) {
        case 'rest':
            categS = 'restaurantes';
            break;
        case 'turist':
            categS = 'lugares turísticos';
            break;
        case 'hotel':
            categS = 'hoteles';
            break;

    }
    return categS;
}

export {
    selectedDep,
    selectedCat
};