import Usuario from './Usuario.js';
import Vehiculo from './Vehiculo.js';
import Celda from './Celda.js';
import Pico_placa from './Pico_placa.js';
import Historial_parqueo from './Historial_parqueo.js';
import readline from 'readline';

class ControlReporteConsulta {
    constructor() {
        this.usuarios = [];
        this.vehiculos = [];
        this.celdas = [];
        this.restriccionesPicoPlaca = [];
        this.historialEntradas = [];
        this.historialSalidas = [];
        this.incidencias = [];
        this.ocupacionDiaria = new Map(); // Map para almacenar ocupación por día
        this.usuarioActual = null;
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // Inicializar datos de prueba
        this.inicializarDatosPrueba();
    }

    inicializarDatosPrueba() {
        this.inicializarUsuarios();
        this.inicializarVehiculos();
        this.inicializarCeldas();
        this.inicializarRestricciones();
        this.inicializarHistorialEntradas();
        this.inicializarHistorialSalidas();
        this.inicializarIncidencias();
        this.inicializarOcupacionDiaria();
    }

    inicializarUsuarios() {
        const admin = new Usuario(1, 'CC', '12345678', 'Admin', 'Principal', 'Sistema', 'Control', 'admin@parqueo.com', '3001234567', '', 'activo', 'admin123', 'administrador');
        const operador = new Usuario(2, 'CC', '87654321', 'Carlos', 'Alberto', 'Operador', 'Turno', 'operador@parqueo.com', '3007654321', '', 'activo', 'oper123', 'operador');
        const cliente1 = new Usuario(3, 'CC', '11111111', 'Juan', 'Carlos', 'Pérez', 'García', 'juan@email.com', '3009876543', '', 'activo', 'juan123', 'cliente');
        const cliente2 = new Usuario(4, 'CC', '22222222', 'María', 'Elena', 'Rodríguez', 'López', 'maria@email.com', '3008765432', '', 'activo', 'maria123', 'cliente');
        const cliente3 = new Usuario(5, 'CC', '33333333', 'Pedro', 'Antonio', 'González', 'Martínez', 'pedro@email.com', '3007654321', '', 'activo', 'pedro123', 'cliente');
        
        this.usuarios.push(admin, operador, cliente1, cliente2, cliente3);
    }

    inicializarVehiculos() {
        const vehiculo1 = new Vehiculo(1, 'ABC123', 'Rojo', '2020', 'Toyota', 'automóvil', 3);
        const vehiculo2 = new Vehiculo(2, 'XYZ789', 'Azul', '2019', 'Honda', 'motocicleta', 4);
        const vehiculo3 = new Vehiculo(3, 'DEF456', 'Blanco', '2021', 'Chevrolet', 'automóvil', 5);
        const vehiculo4 = new Vehiculo(4, 'GHI789', 'Negro', '2022', 'Yamaha', 'motocicleta', 3);
        const vehiculo5 = new Vehiculo(5, 'JKL012', 'Verde', '2018', 'Nissan', 'automóvil', 4);
        
        this.vehiculos.push(vehiculo1, vehiculo2, vehiculo3, vehiculo4, vehiculo5);
    }

    inicializarCeldas() {
        const areas = ['A', 'B', 'C'];
        const pisos = [1, 2, 3];
        let celdaId = 1;
        
        areas.forEach(area => {
            pisos.forEach(piso => {
                // 8 celdas de automóvil por área/piso
                for (let i = 1; i <= 8; i++) {
                    const codigo = `${area}${piso}-C${i.toString().padStart(2, '0')}`;
                    const celda = new Celda(celdaId++, 'automóvil', 'disponible');
                    celda._codigo = codigo;
                    celda._area = area;
                    celda._piso = piso;
                    this.celdas.push(celda);
                }
                
                // 4 celdas de motocicleta por área/piso
                for (let i = 1; i <= 4; i++) {
                    const codigo = `${area}${piso}-M${i.toString().padStart(2, '0')}`;
                    const celda = new Celda(celdaId++, 'motocicleta', 'disponible');
                    celda._codigo = codigo;
                    celda._area = area;
                    celda._piso = piso;
                    this.celdas.push(celda);
                }
            });
        });
    }

    inicializarRestricciones() {
        const restriccion1 = new Pico_placa(1, 'automóvil', 1, 'lunes');
        const restriccion2 = new Pico_placa(2, 'automóvil', 2, 'lunes');
        const restriccion3 = new Pico_placa(3, 'motocicleta', 3, 'martes');
        const restriccion4 = new Pico_placa(4, 'automóvil', 4, 'miércoles');
        
        this.restriccionesPicoPlaca.push(restriccion1, restriccion2, restriccion3, restriccion4);
    }

    inicializarHistorialEntradas() {
        const entradas = [
            { celda: 1, vehiculo: 1, fechaHora: new Date('2025-08-29T08:30:00') },
            { celda: 15, vehiculo: 2, fechaHora: new Date('2025-08-29T09:15:00') },
            { celda: 8, vehiculo: 3, fechaHora: new Date('2025-08-29T10:00:00') },
            { celda: 25, vehiculo: 4, fechaHora: new Date('2025-08-28T07:45:00') },
            { celda: 32, vehiculo: 5, fechaHora: new Date('2025-08-28T11:30:00') },
            { celda: 12, vehiculo: 1, fechaHora: new Date('2025-08-27T08:00:00') },
            { celda: 18, vehiculo: 2, fechaHora: new Date('2025-08-27T14:20:00') }
        ];

        entradas.forEach(entrada => {
            const historial = new Historial_parqueo(entrada.celda, entrada.vehiculo, entrada.fechaHora);
            this.historialEntradas.push(historial);
        });
    }

    inicializarHistorialSalidas() {
        const salidas = [
            { celda: 12, vehiculo: 1, fechaHora: new Date('2025-08-27T17:30:00') },
            { celda: 18, vehiculo: 2, fechaHora: new Date('2025-08-27T18:45:00') },
            { celda: 25, vehiculo: 4, fechaHora: new Date('2025-08-28T16:15:00') },
            { celda: 32, vehiculo: 5, fechaHora: new Date('2025-08-28T19:00:00') }
        ];

        salidas.forEach(salida => {
            const historial = new Historial_parqueo(salida.celda, salida.vehiculo, salida.fechaHora);
            this.historialSalidas.push(historial);
        });
    }

    inicializarIncidencias() {
        this.incidencias = [
            {
                id: 1,
                fecha: new Date('2025-08-29T10:30:00'),
                tipo: 'Daño a vehículo',
                descripcion: 'Rayón en vehículo ABC123 en celda A1-C01',
                celda: 1,
                vehiculo: 1,
                usuario: 3,
                estado: 'reportado'
            },
            {
                id: 2,
                fecha: new Date('2025-08-28T15:45:00'),
                tipo: 'Ocupación indebida',
                descripcion: 'Vehículo sin autorización en celda B2-M01',
                celda: 15,
                vehiculo: null,
                usuario: null,
                estado: 'resuelto'
            },
            {
                id: 3,
                fecha: new Date('2025-08-27T12:20:00'),
                tipo: 'Falla en sistema',
                descripcion: 'Sensor de celda C3-C05 no funciona correctamente',
                celda: 29,
                vehiculo: null,
                usuario: null,
                estado: 'en_proceso'
            }
        ];
    }

    inicializarOcupacionDiaria() {
        // Simular datos de ocupación diaria
        const fechas = [
            '2025-08-27', '2025-08-28', '2025-08-29',
            '2025-08-26', '2025-08-25', '2025-08-24'
        ];
        
        fechas.forEach(fecha => {
            // Simular diferentes niveles de ocupación por hora
            const ocupacionDia = new Map();
            for (let hora = 6; hora <= 22; hora++) {
                let ocupadas;
                if (hora >= 8 && hora <= 10) ocupadas = Math.floor(Math.random() * 20) + 45; // Hora pico mañana
                else if (hora >= 17 && hora <= 19) ocupadas = Math.floor(Math.random() * 25) + 50; // Hora pico tarde
                else if (hora >= 12 && hora <= 14) ocupadas = Math.floor(Math.random() * 15) + 30; // Almuerzo
                else ocupadas = Math.floor(Math.random() * 20) + 10; // Otras horas
                
                ocupacionDia.set(hora, ocupadas);
            }
            this.ocupacionDiaria.set(fecha, ocupacionDia);
        });
    }

    pregunta(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async autenticarUsuario() {
        console.log('\n=== SISTEMA DE REPORTES Y CONSULTAS ===');
        console.log('Por favor, inicie sesión:');
        
        const email = await this.pregunta('Correo electrónico: ');
        const clave = await this.pregunta('Contraseña: ');
        
        const usuario = this.usuarios.find(u => 
            u.getDireccion_correo === email && u.getClave === clave
        );
        
        if (usuario) {
            this.usuarioActual = usuario;
            console.log(`\n¡Bienvenido ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}!`);
            console.log(`Perfil: ${usuario.getPerfil_usuario}`);
            
            if (usuario.getPerfil_usuario !== 'administrador') {
                console.log('\n⚠️  ACCESO RESTRINGIDO: Solo los administradores pueden acceder a este sistema.');
                return false;
            }
            return true;
        } else {
            console.log('\nCredenciales incorrectas. Intente nuevamente.');
            return false;
        }
    }

    async mostrarMenu() {
        console.log('\n=== MENÚ DE REPORTES Y CONSULTAS ===');
        console.log('1.  📋 Listar todos los usuarios');
        console.log('2.  🚗 Listar todos los vehículos con propietarios');
        console.log('3.  📥 Listar entradas al parqueadero');
        console.log('4.  📤 Listar salidas del parqueadero');
        console.log('5.  ⚠️  Listar incidencias');
        console.log('6.  🚫 Vehículos restringidos por pico y placa');
        console.log('7.  📊 Celdas ocupadas por día');
        console.log('8.  🏆 Celdas más usadas');
        console.log('9.  👤 Vehículos que más usan el parqueadero');
        console.log('10. ⏰ Horas y días de mayor ocupación');
        console.log('11. 🚪 Salir');
        
        const opcion = await this.pregunta('\nSeleccione una opción: ');
        return opcion;
    }

    // REQ-REP-01: Listado de todos los usuarios
    listarTodosUsuarios() {
        console.log('\n=== 📋 LISTADO COMPLETO DE USUARIOS ===');
        console.log(`Total de usuarios registrados: ${this.usuarios.length}\n`);
        
        this.usuarios.forEach((usuario, index) => {
            console.log(`--- USUARIO ${index + 1} ---`);
            console.log(`ID: ${usuario.getId}`);
            console.log(`Documento: ${usuario.getTipo_documento} ${usuario.getNumero_documento}`);
            console.log(`Nombre completo: ${usuario.getPrimer_nombre} ${usuario.getSegundo_nombre || ''} ${usuario.getPrimer_apellido} ${usuario.getSegundo_apellido || ''}`.replace(/\s+/g, ' ').trim());
            console.log(`Correo: ${usuario.getDireccion_correo}`);
            console.log(`Celular: ${usuario.getNumero_celular}`);
            console.log(`Estado: ${usuario.getEstado}`);
            console.log(`Perfil: ${usuario.getPerfil_usuario}`);
            console.log('');
        });
    }

    // REQ-REP-02: Listado de vehículos con propietarios
    listarTodosVehiculos() {
        console.log('\n=== 🚗 LISTADO COMPLETO DE VEHÍCULOS ===');
        console.log(`Total de vehículos registrados: ${this.vehiculos.length}\n`);
        
        this.vehiculos.forEach((vehiculo, index) => {
            const usuario = this.usuarios.find(u => u.getId === vehiculo.getUsuario);
            const propietario = usuario ? 
                `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido} (${usuario.getDireccion_correo})` : 
                'Sin propietario asignado';
            
            console.log(`--- VEHÍCULO ${index + 1} ---`);
            console.log(`ID: ${vehiculo.getId}`);
            console.log(`Placa: ${vehiculo.getPlaca}`);
            console.log(`Marca: ${vehiculo.getMarca}`);
            console.log(`Modelo: ${vehiculo.getModelo}`);
            console.log(`Color: ${vehiculo.getColor}`);
            console.log(`Tipo: ${vehiculo.getTipo}`);
            console.log(`Propietario: ${propietario}`);
            if (usuario) {
                console.log(`Contacto propietario: ${usuario.getNumero_celular}`);
            }
            console.log('');
        });
    }

    // REQ-REP-03: Listar entradas al parqueadero
    async listarEntradas() {
        console.log('\n=== 📥 HISTORIAL DE ENTRADAS ===');
        
        if (this.historialEntradas.length === 0) {
            console.log('No hay registros de entradas.');
            return;
        }

        const fechaFiltro = await this.pregunta('Filtrar por fecha (YYYY-MM-DD) o Enter para ver todas: ');
        
        let entradasFiltradas = this.historialEntradas;
        if (fechaFiltro) {
            entradasFiltradas = this.historialEntradas.filter(entrada => {
                const fechaEntrada = entrada.getFecha_hora.toISOString().split('T')[0];
                return fechaEntrada === fechaFiltro;
            });
        }

        console.log(`\nTotal de entradas${fechaFiltro ? ` para ${fechaFiltro}` : ''}: ${entradasFiltradas.length}\n`);
        
        entradasFiltradas
            .sort((a, b) => b.getFecha_hora - a.getFecha_hora)
            .forEach((entrada, index) => {
                const celda = this.celdas.find(c => c.getId === entrada.getCelda);
                const vehiculo = this.vehiculos.find(v => v.getId === entrada.getVehiculo);
                const usuario = vehiculo ? this.usuarios.find(u => u.getId === vehiculo.getUsuario) : null;
                
                console.log(`${index + 1}. Fecha/Hora: ${entrada.getFecha_hora.toLocaleString('es-CO')}`);
                console.log(`   Celda: ${celda ? celda._codigo : 'N/A'} (${celda ? celda.getTipo : 'N/A'})`);
                console.log(`   Vehículo: ${vehiculo ? vehiculo.getPlaca : 'N/A'} - ${vehiculo ? vehiculo.getMarca : 'N/A'} ${vehiculo ? vehiculo.getModelo : 'N/A'}`);
                console.log(`   Propietario: ${usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'N/A'}`);
                console.log('');
            });
    }

    // REQ-REP-04: Listar salidas del parqueadero
    async listarSalidas() {
        console.log('\n=== 📤 HISTORIAL DE SALIDAS ===');
        
        if (this.historialSalidas.length === 0) {
            console.log('No hay registros de salidas.');
            return;
        }

        const fechaFiltro = await this.pregunta('Filtrar por fecha (YYYY-MM-DD) o Enter para ver todas: ');
        
        let salidasFiltradas = this.historialSalidas;
        if (fechaFiltro) {
            salidasFiltradas = this.historialSalidas.filter(salida => {
                const fechaSalida = salida.getFecha_hora.toISOString().split('T')[0];
                return fechaSalida === fechaFiltro;
            });
        }

        console.log(`\nTotal de salidas${fechaFiltro ? ` para ${fechaFiltro}` : ''}: ${salidasFiltradas.length}\n`);
        
        salidasFiltradas
            .sort((a, b) => b.getFecha_hora - a.getFecha_hora)
            .forEach((salida, index) => {
                const celda = this.celdas.find(c => c.getId === salida.getCelda);
                const vehiculo = this.vehiculos.find(v => v.getId === salida.getVehiculo);
                const usuario = vehiculo ? this.usuarios.find(u => u.getId === vehiculo.getUsuario) : null;
                
                console.log(`${index + 1}. Fecha/Hora: ${salida.getFecha_hora.toLocaleString('es-CO')}`);
                console.log(`   Celda: ${celda ? celda._codigo : 'N/A'} (${celda ? celda.getTipo : 'N/A'})`);
                console.log(`   Vehículo: ${vehiculo ? vehiculo.getPlaca : 'N/A'} - ${vehiculo ? vehiculo.getMarca : 'N/A'} ${vehiculo ? vehiculo.getModelo : 'N/A'}`);
                console.log(`   Propietario: ${usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'N/A'}`);
                console.log('');
            });
    }

    // REQ-REP-05: Listar incidencias
    listarIncidencias() {
        console.log('\n=== ⚠️  LISTADO DE INCIDENCIAS ===');
        
        if (this.incidencias.length === 0) {
            console.log('No hay incidencias registradas.');
            return;
        }

        console.log(`Total de incidencias: ${this.incidencias.length}\n`);
        
        this.incidencias
            .sort((a, b) => b.fecha - a.fecha)
            .forEach((incidencia, index) => {
                const celda = incidencia.celda ? this.celdas.find(c => c.getId === incidencia.celda) : null;
                const vehiculo = incidencia.vehiculo ? this.vehiculos.find(v => v.getId === incidencia.vehiculo) : null;
                const usuario = incidencia.usuario ? this.usuarios.find(u => u.getId === incidencia.usuario) : null;
                
                console.log(`--- INCIDENCIA ${index + 1} ---`);
                console.log(`ID: ${incidencia.id}`);
                console.log(`Fecha/Hora: ${incidencia.fecha.toLocaleString('es-CO')}`);
                console.log(`Tipo: ${incidencia.tipo}`);
                console.log(`Descripción: ${incidencia.descripcion}`);
                console.log(`Estado: ${incidencia.estado.toUpperCase()}`);
                
                if (celda) console.log(`Celda involucrada: ${celda._codigo}`);
                if (vehiculo) console.log(`Vehículo involucrado: ${vehiculo.getPlaca} - ${vehiculo.getMarca}`);
                if (usuario) console.log(`Usuario involucrado: ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}`);
                
                console.log('');
            });
    }

    // REQ-REP-06: Vehículos restringidos por pico y placa
    async listarVehiculosRestringidos() {
        console.log('\n=== 🚫 VEHÍCULOS RESTRINGIDOS POR PICO Y PLACA ===');
        
        const dia = await this.pregunta('Ingrese el día a consultar (lunes, martes, etc.): ');
        const diaLower = dia.toLowerCase();
        
        const restriccionesDia = this.restriccionesPicoPlaca.filter(r => r.getDia === diaLower);
        
        if (restriccionesDia.length === 0) {
            console.log(`\nNo hay restricciones configuradas para el día ${dia}.`);
            return;
        }

        console.log(`\nRestricciones para ${dia}:`);
        restriccionesDia.forEach(r => {
            console.log(`- Tipo ${r.getTipo_vehiculo}: dígito ${r.getNumrto}`);
        });

        const vehiculosRestringidos = [];
        
        this.vehiculos.forEach(vehiculo => {
            const ultimoDigito = parseInt(vehiculo.getPlaca.slice(-1));
            if (!isNaN(ultimoDigito)) {
                const restriccion = restriccionesDia.find(r => 
                    r.getTipo_vehiculo === vehiculo.getTipo && r.getNumrto === ultimoDigito
                );
                
                if (restriccion) {
                    vehiculosRestringidos.push(vehiculo);
                }
            }
        });

        console.log(`\nTotal de vehículos restringidos: ${vehiculosRestringidos.length}\n`);
        
        if (vehiculosRestringidos.length > 0) {
            vehiculosRestringidos.forEach((vehiculo, index) => {
                const usuario = this.usuarios.find(u => u.getId === vehiculo.getUsuario);
                const propietario = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin propietario';
                
                console.log(`${index + 1}. ${vehiculo.getPlaca} - ${vehiculo.getMarca} ${vehiculo.getModelo}`);
                console.log(`   Tipo: ${vehiculo.getTipo}, Dígito: ${vehiculo.getPlaca.slice(-1)}`);
                console.log(`   Propietario: ${propietario}`);
                console.log('');
            });
        }
    }

    // REQ-REP-07: Celdas ocupadas por día
    async listarCeldasOcupadasPorDia() {
        console.log('\n=== 📊 CELDAS OCUPADAS POR DÍA ===');
        
        const fecha = await this.pregunta('Ingrese la fecha (YYYY-MM-DD): ');
        const ocupacionDia = this.ocupacionDiaria.get(fecha);
        
        if (!ocupacionDia) {
            console.log(`\nNo hay datos de ocupación para la fecha ${fecha}.`);
            return;
        }

        console.log(`\nOcupación de celdas para ${fecha}:\n`);
        
        const totalCeldas = this.celdas.length;
        let totalOcupadas = 0;
        
        console.log('Hora\t| Celdas Ocupadas\t| % Ocupación');
        console.log('--------|---------------|-------------');
        
        for (let hora = 6; hora <= 22; hora++) {
            const ocupadas = ocupacionDia.get(hora) || 0;
            const porcentaje = ((ocupadas / totalCeldas) * 100).toFixed(1);
            totalOcupadas += ocupadas;
            
            const horaStr = `${hora.toString().padStart(2, '0')}:00`;
            console.log(`${horaStr}\t| ${ocupadas.toString().padStart(13, ' ')}\t| ${porcentaje.padStart(10, ' ')}%`);
        }
        
        const promedioOcupacion = (totalOcupadas / 17).toFixed(1); // 17 horas de operación
        const porcentajePromedio = ((promedioOcupacion / totalCeldas) * 100).toFixed(1);
        
        console.log('--------|---------------|-------------');
        console.log(`Promedio| ${promedioOcupacion.toString().padStart(13, ' ')}\t| ${porcentajePromedio.padStart(10, ' ')}%`);
    }

    // REQ-REP-08: Celdas más usadas
    async listarCeldasMasUsadas() {
        console.log('\n=== 🏆 CELDAS MÁS USADAS ===');
        
        const fechaInicio = await this.pregunta('Fecha inicio (YYYY-MM-DD): ');
        const fechaFin = await this.pregunta('Fecha fin (YYYY-MM-DD): ');
        
        // Simular datos de uso de celdas
        const usoCeldas = new Map();
        
        this.celdas.forEach(celda => {
            // Simular uso aleatorio para cada celda
            const uso = Math.floor(Math.random() * 50) + 1;
            usoCeldas.set(celda.getId, uso);
        });

        console.log(`\nCeldas más usadas entre ${fechaInicio} y ${fechaFin}:\n`);
        
        // Ordenar celdas por uso
        const celdasOrdenadas = Array.from(usoCeldas.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Top 10
        
        console.log('Ranking | Código\t| Tipo\t\t| Área-Piso | Usos');
        console.log('--------|-----------|-----------|-----------|------');
        
        celdasOrdenadas.forEach(([celdaId, usos], index) => {
            const celda = this.celdas.find(c => c.getId === celdaId);
            if (celda) {
                const ranking = (index + 1).toString().padStart(7, ' ');
                const codigo = celda._codigo.padEnd(10, ' ');
                const tipo = celda.getTipo.padEnd(10, ' ');
                const ubicacion = `${celda._area}${celda._piso}`.padEnd(10, ' ');
                
                console.log(`${ranking} | ${codigo} | ${tipo} | ${ubicacion} | ${usos}`);
            }
        });
    }

    // REQ-REP-09: Vehículos que más usan el parqueadero
    listarVehiculosMasUsados() {
        console.log('\n=== 👤 VEHÍCULOS QUE MÁS USAN EL PARQUEADERO ===');
        
        // Calcular frecuencia de uso basada en entradas
        const usoVehiculos = new Map();
        
        this.historialEntradas.forEach(entrada => {
            const vehiculoId = entrada.getVehiculo;
            usoVehiculos.set(vehiculoId, (usoVehiculos.get(vehiculoId) || 0) + 1);
        });

        if (usoVehiculos.size === 0) {
            console.log('No hay datos de uso de vehículos.');
            return;
        }

        console.log('\nRanking | Placa\t| Marca/Modelo\t\t| Propietario\t\t| Visitas');
        console.log('--------|-------|-------------------|-------------------|--------');
        
        Array.from(usoVehiculos.entries())
            .sort((a, b) => b[1] - a[1])
            .forEach(([vehiculoId, visitas], index) => {
                const vehiculo = this.vehiculos.find(v => v.getId === vehiculoId);
                const usuario = vehiculo ? this.usuarios.find(u => u.getId === vehiculo.getUsuario) : null;
                
                if (vehiculo) {
                    const ranking = (index + 1).toString().padStart(7, ' ');
                    const placa = vehiculo.getPlaca.padEnd(6, ' ');
                    const marcaModelo = `${vehiculo.getMarca} ${vehiculo.getModelo}`.padEnd(18, ' ');
                    const propietario = usuario ? 
                        `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}`.padEnd(18, ' ') : 
                        'Sin propietario'.padEnd(18, ' ');
                    
                    console.log(`${ranking} | ${placa} | ${marcaModelo} | ${propietario} | ${visitas}`);
                }
            });
    }

    // REQ-REP-10: Horas y días de mayor ocupación
    listarHorasDiasMayorOcupacion() {
        console.log('\n=== ⏰ HORAS Y DÍAS DE MAYOR OCUPACIÓN ===');
        
        if (this.ocupacionDiaria.size === 0) {
            console.log('No hay datos de ocupación disponibles.');
            return;
        }

        // Analizar ocupación por hora (promedio de todos los días)
        const ocupacionPorHora = new Map();
        const ocupacionPorDia = new Map();
        
        // Calcular promedio por hora
        for (let hora = 6; hora <= 22; hora++) {
            let totalOcupacion = 0;
            let diasConDatos = 0;
            
            this.ocupacionDiaria.forEach((ocupacionDia, fecha) => {
                if (ocupacionDia.has(hora)) {
                    totalOcupacion += ocupacionDia.get(hora);
                    diasConDatos++;
                }
            });
            
            if (diasConDatos > 0) {
                ocupacionPorHora.set(hora, totalOcupacion / diasConDatos);
            }
        }

        // Calcular ocupación total por día
        this.ocupacionDiaria.forEach((ocupacionDia, fecha) => {
            let totalDia = 0;
            ocupacionDia.forEach(ocupadas => {
                totalDia += ocupadas;
            });
            ocupacionPorDia.set(fecha, totalDia / ocupacionDia.size);
        });

        // Mostrar horas de mayor ocupación
        console.log('\n--- HORAS DE MAYOR OCUPACIÓN (Promedio) ---');
        console.log('Hora\t| Celdas Ocupadas | % Ocupación');
        console.log('--------|-----------------|-------------');
        
        Array.from(ocupacionPorHora.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .forEach(([hora, ocupadas], index) => {
                const porcentaje = ((ocupadas / this.celdas.length) * 100).toFixed(1);
                const horaStr = `${hora.toString().padStart(2, '0')}:00`;
                console.log(`${horaStr}\t| ${ocupadas.toFixed(1).padStart(15, ' ')} | ${porcentaje.padStart(10, ' ')}%`);
            });

        // Mostrar días de mayor ocupación
        console.log('\n--- DÍAS DE MAYOR OCUPACIÓN ---');
        console.log('Fecha\t\t| Ocupación Promedio | % Ocupación');
        console.log('--------------|-------------------|-------------');
        
        Array.from(ocupacionPorDia.entries())
            .sort((a, b) => b[1] - a[1])
            .forEach(([fecha, ocupadas]) => {
                const porcentaje = ((ocupadas / this.celdas.length) * 100).toFixed(1);
                const fechaStr = fecha.padEnd(13, ' ');
                console.log(`${fechaStr} | ${ocupadas.toFixed(1).padStart(17, ' ')} | ${porcentaje.padStart(10, ' ')}%`);
            });

        // Identificar patrones
        const horasPico = Array.from(ocupacionPorHora.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([hora, _]) => `${hora}:00`);

        console.log('\n--- ANÁLISIS DE PATRONES ---');
        console.log(`Horas pico identificadas: ${horasPico.join(', ')}`);
        
        const ocupacionPromedio = Array.from(ocupacionPorDia.values()).reduce((a, b) => a + b, 0) / ocupacionPorDia.size;
        console.log(`Ocupación promedio general: ${ocupacionPromedio.toFixed(1)} celdas (${((ocupacionPromedio / this.celdas.length) * 100).toFixed(1)}%)`);
    }

    esAdministrador() {
        return this.usuarioActual && this.usuarioActual.getPerfil_usuario === 'administrador';
    }

    async ejecutar() {
        let autenticado = false;
        
        while (!autenticado) {
            autenticado = await this.autenticarUsuario();
            if (!autenticado && this.usuarioActual) {
                // Usuario autenticado pero no es administrador
                this.rl.close();
                return;
            }
        }

        let continuar = true;
        while (continuar) {
            const opcion = await this.mostrarMenu();
            
            switch (opcion) {
                case '1':
                    this.listarTodosUsuarios();
                    break;
                case '2':
                    this.listarTodosVehiculos();
                    break;
                case '3':
                    await this.listarEntradas();
                    break;
                case '4':
                    await this.listarSalidas();
                    break;
                case '5':
                    this.listarIncidencias();
                    break;
                case '6':
                    await this.listarVehiculosRestringidos();
                    break;
                case '7':
                    await this.listarCeldasOcupadasPorDia();
                    break;
                case '8':
                    await this.listarCeldasMasUsadas();
                    break;
                case '9':
                    this.listarVehiculosMasUsados();
                    break;
                case '10':
                    this.listarHorasDiasMayorOcupacion();
                    break;
                case '11':
                    console.log('\n¡Hasta luego!');
                    continuar = false;
                    break;
                default:
                    console.log('\nOpción no válida. Intente nuevamente.');
            }
            
            if (continuar) {
                await this.pregunta('\nPresione Enter para continuar...');
            }
        }
        
        this.rl.close();
    }
}

// Ejecutar el sistema
const controlReporte = new ControlReporteConsulta();
controlReporte.ejecutar().catch(console.error);