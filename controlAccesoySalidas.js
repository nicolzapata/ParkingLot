import vehiculo from './Vehiculo.js';
import pico_placa from './PicoPlaca.js';
import acceso_salidas from './AccesoSalidas.js';
import historial_parqueo from './HistorialParqueo.js';
import Usuario from './Usuario.js';
import celda from './Celda.js';
import readline from 'readline';

class ControlAccesoSalidas {
    constructor() {
        this.vehiculosRegistrados = new Map(); // Mapa de vehiculos por placa
        this.usuariosRegistrados = new Map(); // Mapa de usuarios por ID
        this.celdasParqueadero = new Map(); // Mapa de celdas por ID
        this.vehiculosEnParqueadero = new Map(); // Vehiculos actualmente en el parqueadero
        this.registrosAccesoSalida = []; // Array de objetos AccesoSalidas
        this.historialParqueo = []; // Array de objetos HistorialParqueo
        this.restriccionesPicoPlaca = new Map(); // Restricciones por día
        this.contadorIds = {
            acceso: 1,
            vehiculo: 1,
            usuario: 1,
            celda: 1
        };
        
        this.inicializarRestricciones();
        this.inicializarCeldas();
        
        // Configurar readline para entrada interactiva
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // Inicializar celdas del parqueadero
    inicializarCeldas() {
        console.log('🔧 Verificando importación de celda...');
        console.log('Tipo de celda:', typeof celda);
        console.log('celda:', celda);
        
        // Crear celdas para automóviles (A1-A20)
        for (let i = 1; i <= 20; i++) {
            try {
                const celdaAuto = new celda(`A${i}`, 'automovil', 'libre');
                // Verificar que la celda se creó correctamente
                if (!celdaAuto._estado) {
                    celdaAuto._estado = 'libre'; // Fix directo
                }
                this.celdasParqueadero.set(`A${i}`, celdaAuto);
            } catch (error) {
                console.log(`❌ Error creando celda A${i}:`, error.message);
                // Crear objeto manual si la clase falla
                const celdaManual = {
                    _id: `A${i}`,
                    _tipo: 'automovil',
                    _estado: 'libre',
                    getid: `A${i}`,
                    gettipo: 'automovil',
                    getestado: 'libre'
                };
                this.celdasParqueadero.set(`A${i}`, celdaManual);
            }
        }
        
        // Crear celdas para motocicletas (M1-M10)
        for (let i = 1; i <= 10; i++) {
            try {
                const celdaMoto = new celda(`M${i}`, 'motocicleta', 'libre');
                // Verificar que la celda se creó correctamente
                if (!celdaMoto._estado) {
                    celdaMoto._estado = 'libre'; // Fix directo
                }
                this.celdasParqueadero.set(`M${i}`, celdaMoto);
            } catch (error) {
                console.log(`❌ Error creando celda M${i}:`, error.message);
                // Crear objeto manual si la clase falla
                const celdaManual = {
                    _id: `M${i}`,
                    _tipo: 'motocicleta',
                    _estado: 'libre',
                    getid: `M${i}`,
                    gettipo: 'motocicleta',
                    getestado: 'libre'
                };
                this.celdasParqueadero.set(`M${i}`, celdaManual);
            }
        }
        
        console.log('🅿️ Celdas inicializadas: 20 para automóviles (A1-A20), 10 para motocicletas (M1-M10)');
    }
    inicializarRestricciones() {
        const restricciones = [
            new pico_placa(1, 'automovil', [1, 2], 'lunes'),
            new pico_placa(2, 'automovil', [3, 4], 'martes'),
            new pico_placa(3, 'automovil', [5, 6], 'miercoles'),
            new pico_placa(4, 'automovil', [7, 8], 'jueves'),
            new pico_placa(5, 'automovil', [9, 0], 'viernes'),
            new pico_placa(6, 'motocicleta', [1, 2], 'lunes'),
            new pico_placa(7, 'motocicleta', [3, 4], 'martes'),
            new pico_placa(8, 'motocicleta', [5, 6], 'miercoles'),
            new pico_placa(9, 'motocicleta', [7, 8], 'jueves'),
            new pico_placa(10, 'motocicleta', [9, 0], 'viernes')
        ];

        restricciones.forEach(restriccion => {
            const key = `${restriccion.gettipo_vehiculo}-${restriccion.getdia}`;
            this.restriccionesPicoPlaca.set(key, restriccion.getnumero);
        });
    }

    // Registrar un nuevo usuario
    async registrarUsuario() {
        console.log('\n=== REGISTRO DE USUARIO ===');
        
        try {
            const tipoDoc = await this.pregunta('Tipo de documento (CC/TI/CE/PP): ');
            const numeroDoc = await this.pregunta('Número de documento: ');
            
            // Verificar si el usuario ya existe
            const usuarioExistente = Array.from(this.usuariosRegistrados.values())
                .find(u => u.getNumero_documento === numeroDoc);
            
            if (usuarioExistente) {
                console.log('❌ ERROR: Ya existe un usuario con ese número de documento.');
                return null;
            }
            
            const primerNombre = await this.pregunta('Primer nombre: ');
            const segundoNombre = await this.pregunta('Segundo nombre (opcional): ');
            const primerApellido = await this.pregunta('Primer apellido: ');
            const segundoApellido = await this.pregunta('Segundo apellido (opcional): ');
            const email = await this.pregunta('Correo electrónico: ');
            const celular = await this.pregunta('Número de celular: ');
            const clave = await this.pregunta('Contraseña: ');
            const perfil = await this.pregunta('Perfil (residente/visitante/administrador): ');
            'Golpe contra muro'

            const usuario = new Usuario(
                this.contadorIds.usuario++,
                tipoDoc,
                numeroDoc,
                primerNombre,
                segundoNombre || '',
                primerApellido,
                segundoApellido || '',
                email,
                celular,
                null, // foto_perfil
                'activo',
                clave,
                perfil
            );
            
            this.usuariosRegistrados.set(usuario.getId, usuario);
            
            console.log('✅ Usuario registrado exitosamente');
            console.log(`ID: ${usuario.getId}`);
            console.log(`Nombre: ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}`);
            
            return usuario;
            
        } catch (error) {
            console.log('❌ ERROR al registrar usuario:', error.message);
            return null;
        }
    }

    // Buscar celda libre según tipo de vehículo
    buscarCeldaLibre(tipoVehiculo) {
        const prefijo = tipoVehiculo.toLowerCase() === 'automovil' ? 'A' : 'M';
        
        for (let [id, celdaObj] of this.celdasParqueadero) {
            if (id.startsWith(prefijo) && (celdaObj.getestado === 'libre' || celdaObj._estado === 'libre')) {
                return celdaObj;
            }
        }
        return null; // No hay celdas libres
    }

    // Liberar celda
    liberarCelda(idCelda) {
        const celdaObj = this.celdasParqueadero.get(idCelda);
        if (celdaObj) {
            // Usar la propiedad directamente debido a error en setter
            celdaObj._estado = 'libre';
        }
    }

    // Ocupar celda
    ocuparCelda(idCelda) {
        const celdaObj = this.celdasParqueadero.get(idCelda);
        if (celdaObj) {
            // Usar la propiedad directamente debido a error en setter
            celdaObj._estado = 'ocupado';
        }
    }
    buscarUsuario(idUsuario) {
        return this.usuariosRegistrados.get(parseInt(idUsuario));
    }

    // REQ-INEX-4: Verificar restricciones de pico y placa
    verificarPicoPlaca(placa, tipoVehiculo, fecha) {
        const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const dia = diasSemana[fecha.getDay()];
        const ultimoDigito = parseInt(placa.slice(-1));
        
        const key = `${tipoVehiculo.toLowerCase()}-${dia}`;
        const numerosRestringidos = this.restriccionesPicoPlaca.get(key);
        
        if (numerosRestringidos && numerosRestringidos.includes(ultimoDigito)) {
            return false; // Vehículo restringido
        }
        
        return true; // Vehículo permitido
    }

    // REQ-INEX-1: Registrar entrada de vehículo
    async registrarEntrada() {
        console.log('\n=== REGISTRO DE ENTRADA ===');
        
        try {
            const puertaAcceso = await this.pregunta('Ingrese la puerta de acceso: ');
            const placa = await this.pregunta('Ingrese la placa del vehículo: ');
            
            const fechaHoraEntrada = new Date();
            
            // Verificar si el vehículo ya está en el parqueadero
            if (this.vehiculosEnParqueadero.has(placa.toUpperCase())) {
                console.log('❌ ERROR: El vehículo ya se encuentra en el parqueadero.');
                return;
            }
            
            let vehiculoObj;
            let usuarioObj;
            
            // Buscar vehículo existente o crear uno nuevo
            if (this.vehiculosRegistrados.has(placa.toUpperCase())) {
                vehiculoObj = this.vehiculosRegistrados.get(placa.toUpperCase());
                usuarioObj = this.usuariosRegistrados.get(vehiculoObj.getUsuario_id);
            } else {
                console.log('\n--- Vehículo no registrado, creando registro ---');
                
                const tipoVehiculo = await this.pregunta('Tipo de vehículo (automovil/motocicleta): ');
                
                // REQ-INEX-4: Verificar restricciones antes de registrar
                if (!this.verificarPicoPlaca(placa, tipoVehiculo, fechaHoraEntrada)) {
                    console.log('❌ ACCESO DENEGADO: El vehículo tiene restricción de pico y placa para este día.');
                    console.log(`Fecha: ${fechaHoraEntrada.toLocaleDateString()}`);
                    console.log(`Día: ${fechaHoraEntrada.toLocaleDateString('es-ES', { weekday: 'long' })}`);
                    console.log(`Último dígito de placa: ${placa.slice(-1)}`);
                    return;
                }
                
                const marca = await this.pregunta('Marca del vehículo: ');
                const modelo = await this.pregunta('Modelo del vehículo: ');
                const color = await this.pregunta('Color del vehículo: ');
                
                // Buscar usuario existente o crear uno nuevo
                const idUsuario = await this.pregunta('ID del usuario propietario (0 para crear nuevo): ');
                
                if (idUsuario === '0') {
                    usuarioObj = await this.registrarUsuario();
                    if (!usuarioObj) return;
                } else {
                    usuarioObj = this.buscarUsuario(idUsuario);
                    if (!usuarioObj) {
                        console.log(`❌ ERROR: Usuario con ID ${idUsuario} no encontrado.`);
                        const crearNuevo = await this.pregunta('¿Desea crear un nuevo usuario? (s/n): ');
                        if (crearNuevo.toLowerCase() === 's') {
                            usuarioObj = await this.registrarUsuario();
                            if (!usuarioObj) return;
                        } else {
                            console.log('Operación cancelada.');
                            return;
                        }
                    }
                }
                
                vehiculoObj = new vehiculo(
                    this.contadorIds.vehiculo++,
                    placa.toUpperCase(),
                    color,
                    marca,
                    modelo,
                    tipoVehiculo,
                    usuarioObj.getId
                );
                
                this.vehiculosRegistrados.set(placa.toUpperCase(), vehiculoObj);
            }
            
            // Verificar restricciones para vehículos existentes
            if (!this.verificarPicoPlaca(vehiculoObj.getPlaca, vehiculoObj.getTipo, fechaHoraEntrada)) {
                console.log('❌ ACCESO DENEGADO: El vehículo tiene restricción de pico y placa para este día.');
                return;
            }
            
            // Buscar celda libre
            const celdaAsignada = this.buscarCeldaLibre(vehiculoObj.getTipo);
            if (!celdaAsignada) {
                console.log('❌ ERROR: No hay celdas libres para este tipo de vehículo.');
                return;
            }
            
            // Ocupar la celda
            this.ocuparCelda(celdaAsignada.getid);
            
            // REQ-INEX-3: Crear registro de acceso (entrada)
            const registroAcceso = new acceso_salidas(
                this.contadorIds.acceso++,
                'ENTRADA',
                fechaHoraEntrada,
                puertaAcceso,
                null, // tiempo_estadia se calcula en la salida
                vehiculoObj
            );
            
            this.registrosAccesoSalida.push(registroAcceso);
            this.vehiculosEnParqueadero.set(placa.toUpperCase(), {
                registroAcceso: registroAcceso,
                fechaEntrada: fechaHoraEntrada,
                celdaAsignada: celdaAsignada.getid
            });
            
            console.log('✅ ENTRADA REGISTRADA EXITOSAMENTE');
            console.log(`ID Registro: ${registroAcceso.getId}`);
            console.log(`Placa: ${vehiculoObj.getPlaca}`);
            console.log(`Propietario: ${usuarioObj.getPrimer_nombre} ${usuarioObj.getPrimer_apellido}`);
            console.log(`Vehículo: ${vehiculoObj.getMarca} ${vehiculoObj.getModelo} - ${vehiculoObj.getColor}`);
            console.log(`Puerta: ${puertaAcceso}`);
            console.log(`Celda asignada: ${celdaAsignada.getid}`);
            console.log(`Fecha y hora: ${fechaHoraEntrada.toLocaleString()}`);
            
        } catch (error) {
            console.log('❌ ERROR al registrar entrada:', error.message);
        }
    }

    // REQ-INEX-2: Registrar salida de vehículo
    async registrarSalida() {
        console.log('\n=== REGISTRO DE SALIDA ===');
        
        try {
            const puertaAcceso = await this.pregunta('Ingrese la puerta de salida: ');
            const placa = await this.pregunta('Ingrese la placa del vehículo: ');
            
            const fechaHoraSalida = new Date();
            
            // Verificar si el vehículo está en el parqueadero
            if (!this.vehiculosEnParqueadero.has(placa.toUpperCase())) {
                console.log('❌ ERROR: El vehículo no se encuentra registrado en el parqueadero.');
                return;
            }
            
            const datosVehiculo = this.vehiculosEnParqueadero.get(placa.toUpperCase());
            const vehiculoObj = datosVehiculo.registroAcceso.getVehiculo;
            const usuarioObj = this.usuariosRegistrados.get(vehiculoObj.getUsuario_id);
            
            // REQ-INEX-3: Calcular tiempo de estadía
            const tiempoEstadia = fechaHoraSalida - datosVehiculo.fechaEntrada;
            const horas = Math.floor(tiempoEstadia / (1000 * 60 * 60));
            const minutos = Math.floor((tiempoEstadia % (1000 * 60 * 60)) / (1000 * 60));
            
            // Crear registro de salida
            const registroSalida = new acceso_salidas(
                this.contadorIds.acceso++,
                'SALIDA',
                fechaHoraSalida,
                puertaAcceso,
                tiempoEstadia,
                vehiculoObj
            );
            
            this.registrosAccesoSalida.push(registroSalida);
            
            // Crear registro en historial de parqueo
            const historialReg = new historial_parqueo(
                datosVehiculo.celdaAsignada, // Usar la celda que fue asignada
                vehiculoObj,
                datosVehiculo.fechaEntrada // Esta es la fecha de entrada original
            );
            
            this.historialParqueo.push(historialReg);
            
            // Liberar la celda
            this.liberarCelda(datosVehiculo.celdaAsignada);
            
            // Remover del parqueadero
            this.vehiculosEnParqueadero.delete(placa.toUpperCase());
            
            console.log('✅ SALIDA REGISTRADA EXITOSAMENTE');
            console.log(`ID Registro: ${registroSalida.getId}`);
            console.log(`Placa: ${vehiculoObj.getPlaca}`);
            console.log(`Propietario: ${usuarioObj.getPrimer_nombre} ${usuarioObj.getPrimer_apellido}`);
            console.log(`Puerta de salida: ${puertaAcceso}`);
            console.log(`Celda liberada: ${datosVehiculo.celdaAsignada}`);
            console.log(`Fecha y hora de salida: ${fechaHoraSalida.toLocaleString()}`);
            console.log(`Tiempo total en parqueadero: ${horas}h ${minutos}m`);
            
        } catch (error) {
            console.log('❌ ERROR al registrar salida:', error.message);
        }
    }

    // Consultar vehículos en parqueadero
    consultarVehiculosEnParqueadero() {
        console.log('\n=== VEHÍCULOS EN PARQUEADERO ===');
        
        if (this.vehiculosEnParqueadero.size === 0) {
            console.log('No hay vehículos en el parqueadero actualmente.');
            return;
        }
        
        this.vehiculosEnParqueadero.forEach((datos, placa) => {
            const vehiculoObj = datos.registroAcceso.getVehiculo;
            const usuarioObj = this.usuariosRegistrados.get(vehiculoObj.getUsuario_id);
            const tiempoActual = new Date() - datos.fechaEntrada;
            const horas = Math.floor(tiempoActual / (1000 * 60 * 60));
            const minutos = Math.floor((tiempoActual % (1000 * 60 * 60)) / (1000 * 60));
            
            console.log(`\n--- Vehículo en parqueadero ---`);
            console.log(`Placa: ${vehiculoObj.getPlaca}`);
            console.log(`Vehículo: ${vehiculoObj.getMarca} ${vehiculoObj.getModelo} - ${vehiculoObj.getColor}`);
            console.log(`Propietario: ${usuarioObj.getPrimer_nombre} ${usuarioObj.getPrimer_apellido}`);
            console.log(`Contacto: ${usuarioObj.getNumero_celular}`);
            console.log(`Puerta de entrada: ${datos.registroAcceso.getPuerta}`);
            console.log(`Celda asignada: ${datos.celdaAsignada}`);
            console.log(`Hora de entrada: ${datos.registroAcceso.getFecha_hora.toLocaleString()}`);
            console.log(`Tiempo transcurrido: ${horas}h ${minutos}m`);
        });
    }

    // Consultar historial completo de accesos y salidas
    consultarHistorialAccesos() {
        console.log('\n=== HISTORIAL DE ACCESOS Y SALIDAS ===');
        
        if (this.registrosAccesoSalida.length === 0) {
            console.log('No hay registros en el historial.');
            return;
        }
        
        this.registrosAccesoSalida.forEach((registro) => {
            const vehiculo = registro.getVehiculo;
            const usuario = this.usuariosRegistrados.get(vehiculo.getUsuario_id);
            
            console.log(`\n--- Registro ID: ${registro.getId} ---`);
            console.log(`Movimiento: ${registro.getMovimiento}`);
            console.log(`Placa: ${vehiculo.getPlaca}`);
            console.log(`Vehículo: ${vehiculo.getMarca} ${vehiculo.getModelo}`);
            console.log(`Propietario: ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}`);
            console.log(`Puerta: ${registro.getPuerta}`);
            console.log(`Fecha y hora: ${registro.getFecha_hora.toLocaleString()}`);
            
            if (registro.getTiempo_estadia) {
                const horas = Math.floor(registro.getTiempo_estadia / (1000 * 60 * 60));
                const minutos = Math.floor((registro.getTiempo_estadia % (1000 * 60 * 60)) / (1000 * 60));
                console.log(`Tiempo de estadía: ${horas}h ${minutos}m`);
            }
        });
    }

    // Consultar estado de celdas
    consultarEstadoCeldas() {
        console.log('\n=== ESTADO DE CELDAS ===');
        
        console.log('\n--- CELDAS PARA AUTOMÓVILES ---');
        let libresAuto = 0, ocupadasAuto = 0;
        
        for (let i = 1; i <= 20; i++) {
            const celdaObj = this.celdasParqueadero.get(`A${i}`);
            const estado = (celdaObj.getestado || celdaObj._estado) === 'libre' ? '🟢' : '🔴';
            process.stdout.write(`${estado} A${i} `);
            
            if ((celdaObj.getestado || celdaObj._estado) === 'libre') libresAuto++;
            else ocupadasAuto++;
            
            if (i % 5 === 0) console.log(''); // Nueva línea cada 5 celdas
        }
        
        console.log('\n--- CELDAS PARA MOTOCICLETAS ---');
        let libresMoto = 0, ocupadasMoto = 0;
        
        for (let i = 1; i <= 10; i++) {
            const celdaObj = this.celdasParqueadero.get(`M${i}`);
            const estado = (celdaObj.getestado || celdaObj._estado) === 'libre' ? '🟢' : '🔴';
            process.stdout.write(`${estado} M${i} `);
            
            if ((celdaObj.getestado || celdaObj._estado) === 'libre') libresMoto++;
            else ocupadasMoto++;
            
            if (i % 5 === 0) console.log(''); // Nueva línea cada 5 celdas
        }
        
        console.log('\n--- RESUMEN ---');
        console.log(`Automóviles: ${libresAuto} libres, ${ocupadasAuto} ocupadas`);
        console.log(`Motocicletas: ${libresMoto} libres, ${ocupadasMoto} ocupadas`);
        console.log(`Total: ${libresAuto + libresMoto} libres, ${ocupadasAuto + ocupadasMoto} ocupadas`);
    }

    // Consultar historial de parqueo
    consultarHistorialParqueo() {
        console.log('\n=== HISTORIAL DE PARQUEO ===');
        
        if (this.historialParqueo.length === 0) {
            console.log('No hay registros en el historial de parqueo.');
            return;
        }
        
        this.historialParqueo.forEach((registro, index) => {
            const vehiculo = registro.getvehiculo;
            const usuario = this.usuariosRegistrados.get(vehiculo.getUsuario_id);
            
            console.log(`\n--- Registro ${index + 1} ---`);
            console.log(`Celda: ${registro.getcelda}`);
            console.log(`Placa: ${vehiculo.getPlaca}`);
            console.log(`Vehículo: ${vehiculo.getMarca} ${vehiculo.getModelo}`);
            console.log(`Propietario: ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}`);
            
            // Verificar si la fecha existe antes de mostrarla
            if (registro._fecha_hora && typeof registro._fecha_hora.toLocaleString === 'function') {
                console.log(`Fecha de parqueo: ${registro._fecha_hora.toLocaleString()}`);
            } else {
                console.log(`Fecha de parqueo: No disponible`);
                console.log(`Debug - fecha_hora:`, registro._fecha_hora);
            }
        });
    }

    // Listar todos los usuarios registrados
    listarUsuarios() {
        console.log('\n=== USUARIOS REGISTRADOS ===');
        
        if (this.usuariosRegistrados.size === 0) {
            console.log('No hay usuarios registrados.');
            return;
        }
        
        this.usuariosRegistrados.forEach((usuario) => {
            console.log(`\n--- Usuario ID: ${usuario.getId} ---`);
            console.log(`Nombre: ${usuario.getPrimer_nombre} ${usuario.getSegundo_nombre || ''} ${usuario.getPrimer_apellido} ${usuario.getSegundo_apellido || ''}`);
            console.log(`Documento: ${usuario.getTipo_documento} ${usuario.getNumero_documento}`);
            console.log(`Email: ${usuario.getDireccion_correo}`);
            console.log(`Celular: ${usuario.getNumero_celular}`);
            console.log(`Perfil: ${usuario.getPerfil_usuario}`);
            console.log(`Estado: ${usuario.getEstado}`);
        });
    }

    // Método auxiliar para preguntas interactivas
    pregunta(texto) {
        return new Promise((resolve) => {
            this.rl.question(texto, (respuesta) => {
                resolve(respuesta.trim());
            });
        });
    }

    // Menú principal
    async mostrarMenu() {
        while (true) {
            console.log('\n' + '='.repeat(60));
            console.log('        SISTEMA DE CONTROL DE ACCESOS Y SALIDAS');
            console.log('='.repeat(60));
            console.log('1.  Registrar entrada de vehículo');
            console.log('2.  Registrar salida de vehículo');
            console.log('3.  Registrar nuevo usuario');
            console.log('4.  Consultar vehículos en parqueadero');
            console.log('5.  Consultar historial de accesos y salidas');
            console.log('6.  Consultar historial de parqueo');
            console.log('7.  Consultar estado de celdas');
            console.log('8.  Listar usuarios registrados');
            console.log('9.  Salir');
            console.log('='.repeat(60));
            
            const opcion = await this.pregunta('Seleccione una opción: ');
            
            switch (opcion) {
                case '1':
                    await this.registrarEntrada();
                    break;
                case '2':
                    await this.registrarSalida();
                    break;
                case '3':
                    await this.registrarUsuario();
                    break;
                case '4':
                    this.consultarVehiculosEnParqueadero();
                    break;
                case '5':
                    this.consultarHistorialAccesos();
                    break;
                case '6':
                    this.consultarHistorialParqueo();
                    break;
                case '7':
                    this.consultarEstadoCeldas();
                    break;
                case '8':
                    this.listarUsuarios();
                    break;
                case '9':
                    console.log('¡Gracias por usar el sistema!');
                    this.rl.close();
                    return;
                default:
                    console.log('❌ Opción inválida. Intente nuevamente.');
            }
        }
    }

    // Inicializar el sistema
    async iniciar() {
        console.log('🚗 Iniciando Sistema de Control de Accesos y Salidas...');
        console.log('📋 Restricciones de Pico y Placa configuradas.');
        console.log('👥 Sistema de usuarios integrado.');
        console.log('📊 Historial de parqueo disponible.');
        await this.mostrarMenu();
    }
}

// Ejecutar el sistema
const sistema = new ControlAccesoSalidas();
sistema.iniciar().catch(console.error);