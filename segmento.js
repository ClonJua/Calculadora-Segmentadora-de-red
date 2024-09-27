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

function paso4(binarioFinal, n) {
    const longitud = binarioFinal.length;

    const parteConUnos = '1'.repeat(n);
    const parteSinCambiar = binarioFinal.slice(0, longitud - n);

    return parteSinCambiar + parteConUnos;
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
    const numero = parseInt(bin, 2) + 1;
    const binarioSiguiente = numero.toString(2).padStart(32, '0'); 
    return binarioSiguiente;
}

function ultimaDisponible(bin) {
    const numero = parseInt(bin, 2) - 1;
    const binarioSiguiente = numero.toString(2).padStart(32, '0'); 
    return binarioSiguiente;
}

function test() {
    const iptes = document.getElementById("ip").value;
    const mascara = parseInt(document.getElementById("subnet").value, 10);
    
    // Validar IP y máscara
    if (!validarIP(iptes)) {
        alert("Por favor ingresa una IP válida. Asegúrate de que contenga 4 octetos con valores entre 0 y 255.");
        return;
    }

    if (!validarMascara(mascara)) {
        alert("Por favor ingresa una máscara de subred válida (número entre 0 y 32).");
        return;
    }

    const max = 32;
    const n = max - mascara;

    const binN = ultimosN(iptes);
    const bin = ipToBinary(iptes);
    const resultado = ultimosN_modificado(iptes, mascara);
    const mascaraIP = binaryToIp(resultado);

    const binarioFinal = andBinarios(bin, resultado);
    const binarioModificado = paso4(binarioFinal, n);

    const resultDiv = document.getElementById("result");

    // Función para subrayar los últimos N bits en cualquier binario
    const subrayarUltimosN = (binario, n) => {
        const longitud = binario.length;
        const parteSinCambiar = binario.slice(0, longitud - n);
        const parteSubrayada = `<u>${binario.slice(longitud - n)}</u>`;
        return parteSinCambiar + parteSubrayada;
    };

    // Imprimir y subrayar los últimos N bits para todos los binarios
    resultDiv.innerHTML = `<u>Valor del host (binario):</u> ${subrayarUltimosN(binN, n)} <br> 
    <u>Dirección IP (binario):</u> ${separarOctetos(subrayarUltimosN(bin, n))} <br> 
    <u>Máscara de subred (binario):</u> ${separarOctetos(subrayarUltimosN(resultado, n))} <br>
    <u>Máscara de subred (IP):</u> ${mascaraIP} <br> 
    <u>Dirección de subred (binario):</u> ${separarOctetos(subrayarUltimosN(binarioFinal, n))} <br> 
    <u>Dirección de broadcast:</u> ${separarOctetos(subrayarUltimosN(binarioModificado, n))}`;
}



function separarOctetos(binario) {
    return binario.match(/.{1,8}/g).join('.');
}


function imprimePruebaDEC() {
    
    const iptes = document.getElementById("ip").value;
    const mascara = parseInt(document.getElementById("subnet").value, 10);

    if (!validarIP(iptes)) {
        alert("Por favor ingresa una IP válida. Asegúrate de que contenga 4 octetos con valores entre 0 y 255.");
        return;
    }

    if (!validarMascara(mascara)) {
        alert("Por favor ingresa una máscara de subred válida (número entre 0 y 32).");
        return;
    }
    
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
    
    const priv = esIpPrivada(iptes);

    const clase = tipoClase(iptes);

   
    const resultadoFinal = document.getElementById("resultado");
    resultadoFinal.textContent = ` Dirección de subred: ${bins} || Dirección de broadcast: ${ipModificada} || 
    Primera dirección IP: ${primeraDEC} || Ultima dirección IP: ${ultimaDEC} || Numero de host: ${host} || Es: ${priv} || Tipo de clase: ${clase}`  ;

}
//crear funcion para clases
function esIpPrivada(ip) {
    
    const segmentos = ip.split('.').map(Number); // Dividir la IP en segmentos y convertir a número

    // Verificar si es del rango privado de Clase A (10.0.0.0 - 10.255.255.255)
    if (segmentos[0] === 10) {
        return "privada";
        
    }

    // Verificar si es del rango privado de Clase B (172.16.0.0 - 172.31.255.255)
    if (segmentos[0] === 172 && segmentos[1] >= 16 && segmentos[1] <= 31) {
        return "privada";
    }

    // Verificar si es del rango privado de Clase C (192.168.0.0 - 192.168.255.255)
    if (segmentos[0] === 192 && segmentos[1] === 168) {
        return "privada";
    }

    else{
    // Si no pertenece a ninguno de los rangos anteriores, es una IP pública
    return "publica";
    }
}

//Octeto 1 A-> 1-126 B->128-191 C->192-223  D->224-239
function tipoClase(ip){
    const segmentos = ip.split('.').map(Number);

    if(segmentos[0] >= 1 && segmentos[0] <= 126){
        return "clase A";
    }

    if(segmentos[0] >= 128 && segmentos[0] <= 191){
        return "clase B";
    }

    if(segmentos[0] >= 192 && segmentos[0] <= 223){
        return "clase C";
    }

    if(segmentos[0] >= 224 && segmentos[0] <= 239){
        return "clase D";
    }
}

function validarIP(ip) {
    const segmentos = ip.split('.');

    if (segmentos.length !== 4) {
        return false;
    }

    for (let i = 0; i < segmentos.length; i++) {
        const segmento = segmentos[i];

        // Verificar que el segmento no esté vacío y que sea un número válido entre 0 y 255
        if (!segmento || isNaN(segmento) || segmento < 0 || segmento > 255) {
            return false;
        }
    }
    return true;
}

// Función para validar la máscara de subred
function validarMascara(mascara) {
    return !isNaN(mascara) && mascara >= 0 && mascara <= 32;
}
