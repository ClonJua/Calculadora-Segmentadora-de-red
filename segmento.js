

function ultimosN(ip) {
    const max = 32;
    const mascara = document.getElementById("subnet").value;
    const n = max - mascara;
    const res = ip.split('.').map(seg => {
        return ("00000000" + parseInt(seg, 10).toString(2)).slice(-8);
    }).join('');
    return res.slice(-n);
}

function ipToBinary(ip) {
    return ip.split('.').map(seg => {
        return ("00000000" + parseInt(seg, 10).toString(2)).slice(-8);
    }).join('');
}

function ultimosN_modificado(ip, mascara) {
    const max_bits = 32; 
    const n = max_bits - mascara; 

    const binario = ipToBinary(ip);

    let resultado = '';
    for (let i = 0; i < max_bits; i++) {
        if (i < mascara) {
            resultado += '1'; 
        } else {
            resultado += '0'; 
        }
    }

    return resultado; 
}

function andBinarios(paso1, paso2) {
    let resultado = '';
    for (let i = 0; i < paso1.length; i++) {
        resultado += (paso1[i] === '1' && paso2[i] === '1') ? '1' : '0';
    }
    return resultado;
}
function test() {
    const iptes = document.getElementById("ip").value;
    const mascara = parseInt(document.getElementById("subnet").value, 10);
    const max = 32;
    const n = max - mascara;

    const binN = ultimosN(iptes);
    const bin = ipToBinary(iptes);
    const resultado = ultimosN_modificado(iptes, mascara); 

    const binarioFinal = andBinarios(bin, resultado); // paso 3

    const binarioModificado = paso4(binarioFinal, n);  // paso 4

    const resultDiv = document.getElementById("result");

    resultDiv.innerHTML = `<u>Valor del host (binario):</u> ${binN} <br> 
    <u>Dirección IP (binario):</u> ${bin} <br> 
    <u>Máscara de subred (binario):</u> ${resultado} <br> 
    <u>Dirección de subred (binario):</u> ${binarioFinal} <br> 
    <u>Dirección de broadcast:</u> ${binarioModificado}`;
}

function paso4(binarioFinal, n) {
    const longitud = binarioFinal.length;
 

    // Crear la parte que se cambia a 1
    const parteConUnos = '1'.repeat(n);
    // Crear la parte que permanece igual
    const parteSinCambiar = binarioFinal.slice(0, longitud - n);

    // Unir ambas partes
    return parteSinCambiar + parteConUnos;
}


function imprimePruebaDEC() {
    const iptes = document.getElementById("ip").value;
    const mascara = parseInt(document.getElementById("subnet").value, 10);

    const binN = ultimosN(iptes);
    const bin = ipToBinary(iptes);
    const resultado = ultimosN_modificado(iptes, mascara);

    const binarioFinal = andBinarios(bin, resultado); //paso 3

    const bins = binaryToIp(binarioFinal);

    const max = 32;
    const n = max - mascara;
    const binarioModificado = paso4(binarioFinal, n);  //paso 4
    const ipModificada = binaryToIp(binarioModificado); //broadcast

    const primera = primeraDisponible(binarioFinal);
    const primeraDEC = binaryToIp(primera);  //PRIMERA IP DISPONIBLE A USAR


    const ultima = ultimaDisponible(binarioModificado);
    const ultimaDEC = binaryToIp(ultima);  //ultima IP DISPONIBLE A USAR

    const host = Math.pow(2,n) - 2;

    const resultadoFinal = document.getElementById("resultado");
    resultadoFinal.textContent = ` Dirección de subred: ${bins} || Dirección de broadcast: ${ipModificada} || 
    Primera dirección IP: ${primeraDEC} || Ultima dirección IP: ${ultimaDEC} || Numero de host: ${host}`  ;

}

function binaryToIp(bin) {
    const octetos = [];

    for (let i = 0; i < bin.length; i += 8) {
        const binOctet = bin.slice(i, i + 8);
        const decimalOctet = parseInt(binOctet, 2);
        octetos.push(decimalOctet);
    }

    return octetos.join('.');
}

function primeraDisponible(bin) {
    // Convertir el binario a un entero, sumar 1, y volver a binario
    const numero = parseInt(bin, 2) + 1;
    const binarioSiguiente = numero.toString(2).padStart(32, '0'); // Asegura 32 bits
    return binarioSiguiente;
}

function ultimaDisponible(bin) {
    // Convertir el binario a un entero, sumar 1, y volver a binario
    const numero = parseInt(bin, 2) - 1;
    const binarioSiguiente = numero.toString(2).padStart(32, '0'); // Asegura 32 bits
    return binarioSiguiente;
}