import readline from 'readline';
import vehiculo from './Vehiculo.js';
import reporte_incidencia from './ReporteIncidencia.js';
import historial_parqueo from './HistorialParqueo.js';

class ControladorIncidencias {
    constructor() {
        this.incidencias = [];
        this.vehiculos = []; // Simular base de datos de vehículos
        this.tiposIncidencia = [
            'Rayón',
            'Choque',
            'Atropellamiento',
            'Golpe contra muro'
        ];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // Inicializar algunos vehículos de ejemplo
        this.inicializarVehiculosEjemplo();
    }

    // Inicializar vehículos de ejemplo
    inicializarVehiculosEjemplo() {
        const vehiculosEjemplo = [
            new vehiculo(1, 'ABC123', 'Rojo', 'Toyota', 'Corolla', 'Sedán', 101),
            new vehiculo(2, 'XYZ789', 'Azul', 'Chevrolet', 'Spark', 'Compacto', 102),
            new vehiculo(3, 'DEF456', 'Blanco', 'Renault', 'Logan', 'Sedán', 103),
            new vehiculo(4, 'GHI321', 'Negro', 'Mazda', 'CX-5', 'SUV', 104)
        ];
        this.vehiculos.push(...vehiculosEjemplo);
    }

    // Generar código único para la incidencia
    generarCodigoIncidencia() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `INC-${timestamp}-${random}`;
    }

    // Buscar vehículo por placa
    buscarVehiculoPorPlaca(placa) {
        return this.vehiculos.find(v => v.getPlaca.toLowerCase() === placa.toLowerCase());
    }

    // Mostrar información del vehículo
    mostrarInfoVehiculo(vehiculo) {
        console.log(`  Placa: ${vehiculo.getPlaca}`);
        console.log(`  Marca: ${vehiculo.getMarca} ${vehiculo.getModelo}`);
        console.log(`  Color: ${vehiculo.getColor}`);
        console.log(`  Tipo: ${vehiculo.getTipo}`);
        console.log(`  ID Usuario: ${vehiculo.getUsuario_id}`);
    }

    // Listar vehículos disponibles
    listarVehiculosDisponibles() {
        console.log('\n🚗 VEHÍCULOS REGISTRADOS EN EL SISTEMA:');
        console.log('-'.repeat(50));
        this.vehiculos.forEach((v, index) => {
            console.log(`${index + 1}. ${v.getPlaca} - ${v.getMarca} ${v.getModelo} (${v.getColor})`);
        });
        console.log('-'.repeat(50));
    }

    // Mostrar menú principal
    mostrarMenu() {
        console.log('\n' + '='.repeat(50));
        console.log('     SISTEMA DE CONTROL DE INCIDENCIAS');
        console.log('='.repeat(50));
        console.log('1. Registrar nueva incidencia');
        console.log('2. Ver todas las incidencias');
        console.log('3. Buscar incidencia por código');
        console.log('4. Filtrar por tipo de incidencia');
        console.log('5. Estadísticas de incidencias');
        console.log('6. Ver vehículos registrados');
        console.log('7. Registrar nuevo vehículo');
        console.log('0. Salir');
        console.log('='.repeat(50));
    }

    // Mostrar tipos de incidencia disponibles
    mostrarTiposIncidencia() {
        console.log('\nTipos de incidencia disponibles:');
        this.tiposIncidencia.forEach((tipo, index) => {
            console.log(`${index + 1}. ${tipo}`);
        });
    }

    // Registrar nuevo vehículo
    async registrarNuevoVehiculo() {
        return new Promise((resolve) => {
            console.log('\n🚗 REGISTRAR NUEVO VEHÍCULO');
            console.log('-'.repeat(35));
            
            this.rl.question('Ingrese la placa del vehículo: ', (placa) => {
                // Verificar si ya existe
                if (this.buscarVehiculoPorPlaca(placa)) {
                    console.log('❌ Ya existe un vehículo con esa placa.');
                    resolve();
                    return;
                }
                
                this.rl.question('Ingrese el color: ', (color) => {
                    this.rl.question('Ingrese la marca: ', (marca) => {
                        this.rl.question('Ingrese el modelo: ', (modelo) => {
                            this.rl.question('Ingrese el tipo (Sedán, SUV, Compacto, etc.): ', (tipo) => {
                                this.rl.question('Ingrese el ID del usuario: ', (usuarioId) => {
                                    const nuevoId = this.vehiculos.length + 1;
                                    const nuevoVehiculo = new vehiculo(
                                        nuevoId, 
                                        placa.toUpperCase(), 
                                        color, 
                                        marca, 
                                        modelo, 
                                        tipo, 
                                        parseInt(usuarioId)
                                    );
                                    
                                    this.vehiculos.push(nuevoVehiculo);
                                    console.log('✅ Vehículo registrado exitosamente!');
                                    this.mostrarInfoVehiculo(nuevoVehiculo);
                                    resolve();
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    // Preguntar datos de la incidencia
    async preguntarDatosIncidencia() {
        return new Promise((resolve) => {
            this.listarVehiculosDisponibles();
            
            this.rl.question('Ingrese la placa del vehículo afectado: ', (placa) => {
                const vehiculoAfectado = this.buscarVehiculoPorPlaca(placa);
                
                if (!vehiculoAfectado) {
                    console.log('❌ Vehículo no encontrado en el sistema.');
                    console.log('💡 Puede registrar el vehículo primero usando la opción 7 del menú principal.');
                    resolve(null);
                    return;
                }

                console.log('\n✅ Vehículo encontrado:');
                this.mostrarInfoVehiculo(vehiculoAfectado);
                
                this.mostrarTiposIncidencia();
                this.rl.question('Seleccione el tipo de incidencia (1-4): ', (tipoNum) => {
                    const tipoIndex = parseInt(tipoNum) - 1;
                    if (tipoIndex >= 0 && tipoIndex < this.tiposIncidencia.length) {
                        const tipoIncidencia = this.tiposIncidencia[tipoIndex];
                        
                        // Crear el reporte usando la clase
                        const fechaHora = new Date();
                        const reporteIncidencia = new reporte_incidencia(
                            vehiculoAfectado,
                            tipoIncidencia,
                            fechaHora
                        );
                        
                        this.rl.question('Ingrese una descripción adicional (opcional): ', (descripcion) => {
                            const incidencia = {
                                codigo: this.generarCodigoIncidencia(),
                                reporte: reporteIncidencia,
                                descripcion: descripcion || 'Sin descripción adicional',
                                fecha: fechaHora.toLocaleDateString('es-CO'),
                                hora: fechaHora.toLocaleTimeString('es-CO')
                            };
                            
                            resolve(incidencia);
                        });
                    } else {
                        console.log('❌ Tipo de incidencia inválido. Intente nuevamente.');
                        this.preguntarDatosIncidencia().then(resolve);
                    }
                });
            });
        });
    }

    // Registrar nueva incidencia
    async registrarIncidencia() {
        console.log('\n📝 REGISTRANDO NUEVA INCIDENCIA');
        console.log('-'.repeat(35));
        
        try {
            const incidencia = await this.preguntarDatosIncidencia();
            
            if (incidencia) {
                this.incidencias.push(incidencia);
                
                console.log('\n✅ Incidencia registrada exitosamente!');
                console.log(`Código de incidencia: ${incidencia.codigo}`);
                this.mostrarDetalleIncidencia(incidencia);
            }
            
        } catch (error) {
            console.log('❌ Error al registrar la incidencia:', error.message);
        }
    }

    // Mostrar detalle de una incidencia
    mostrarDetalleIncidencia(incidencia) {
        console.log('\n' + '-'.repeat(40));
        console.log(`Código: ${incidencia.codigo}`);
        console.log(`Fecha: ${incidencia.fecha}`);
        console.log(`Hora: ${incidencia.hora}`);
        console.log(`Tipo de incidencia: ${incidencia.reporte._incidencia}`);
        console.log(`Descripción: ${incidencia.descripcion}`);
        console.log('\n📋 Información del vehículo afectado:');
        this.mostrarInfoVehiculo(incidencia.reporte._vehiculo);
        console.log('-'.repeat(40));
    }

    // Ver todas las incidencias
    verTodasIncidencias() {
        console.log('\n📋 LISTADO DE INCIDENCIAS');
        console.log('='.repeat(50));
        
        if (this.incidencias.length === 0) {
            console.log('No hay incidencias registradas.');
            return;
        }

        this.incidencias.forEach((incidencia, index) => {
            console.log(`\n${index + 1}. Incidencia ${incidencia.codigo}`);
            this.mostrarDetalleIncidencia(incidencia);
        });
    }

    // Buscar incidencia por código
    async buscarPorCodigo() {
        return new Promise((resolve) => {
            this.rl.question('Ingrese el código de la incidencia: ', (codigo) => {
                const incidencia = this.incidencias.find(inc => 
                    inc.codigo.toLowerCase() === codigo.toLowerCase()
                );
                
                if (incidencia) {
                    console.log('\n✅ Incidencia encontrada:');
                    this.mostrarDetalleIncidencia(incidencia);
                } else {
                    console.log('❌ No se encontró ninguna incidencia con ese código.');
                }
                resolve();
            });
        });
    }

    // Filtrar por tipo de incidencia
    async filtrarPorTipo() {
        return new Promise((resolve) => {
            this.mostrarTiposIncidencia();
            this.rl.question('Seleccione el tipo de incidencia (1-4): ', (tipoNum) => {
                const tipoIndex = parseInt(tipoNum) - 1;
                
                if (tipoIndex >= 0 && tipoIndex < this.tiposIncidencia.length) {
                    const tipoSeleccionado = this.tiposIncidencia[tipoIndex];
                    const incidenciasFiltradas = this.incidencias.filter(inc => 
                        inc.reporte._incidencia === tipoSeleccionado
                    );
                    
                    console.log(`\n📊 INCIDENCIAS DE TIPO: ${tipoSeleccionado}`);
                    console.log('='.repeat(50));
                    
                    if (incidenciasFiltradas.length === 0) {
                        console.log(`No hay incidencias registradas de tipo "${tipoSeleccionado}".`);
                        console.log('\n🔍 Depuración - Incidencias en el sistema:');
                        this.incidencias.forEach((inc, i) => {
                            console.log(`  ${i+1}. Código: ${inc.codigo}, Tipo: "${inc.reporte._incidencia}"`);
                        });
                    } else {
                        incidenciasFiltradas.forEach((incidencia, index) => {
                            console.log(`\n${index + 1}. Incidencia ${incidencia.codigo}`);
                            this.mostrarDetalleIncidencia(incidencia);
                        });
                    }
                } else {
                    console.log('❌ Tipo de incidencia inválido.');
                }
                resolve();
            });
        });
    }

    // Mostrar estadísticas
    mostrarEstadisticas() {
        console.log('\n📊 ESTADÍSTICAS DE INCIDENCIAS');
        console.log('='.repeat(50));
        
        if (this.incidencias.length === 0) {
            console.log('No hay incidencias registradas para mostrar estadísticas.');
            return;
        }

        console.log(`Total de incidencias: ${this.incidencias.length}`);
        console.log(`Total de vehículos registrados: ${this.vehiculos.length}`);
        
        console.log('\nIncidencias por tipo:');
        this.tiposIncidencia.forEach(tipo => {
            const cantidad = this.incidencias.filter(inc => inc.reporte._incidencia === tipo).length;
            const porcentaje = ((cantidad / this.incidencias.length) * 100).toFixed(1);
            console.log(`  ${tipo}: ${cantidad} (${porcentaje}%)`);
        });

        // Incidencias por día
        const incidenciasPorDia = {};
        this.incidencias.forEach(inc => {
            if (incidenciasPorDia[inc.fecha]) {
                incidenciasPorDia[inc.fecha]++;
            } else {
                incidenciasPorDia[inc.fecha] = 1;
            }
        });

        console.log('\nIncidencias por fecha:');
        Object.keys(incidenciasPorDia).forEach(fecha => {
            console.log(`  ${fecha}: ${incidenciasPorDia[fecha]} incidencias`);
        });

        // Vehículos más afectados
        const vehiculosAfectados = {};
        this.incidencias.forEach(inc => {
            const placa = inc.reporte._vehiculo.getPlaca;
            vehiculosAfectados[placa] = (vehiculosAfectados[placa] || 0) + 1;
        });

        console.log('\nVehículos con más incidencias:');
        Object.entries(vehiculosAfectados)
            .sort(([,a], [,b]) => b - a)
            .forEach(([placa, cantidad]) => {
                console.log(`  ${placa}: ${cantidad} incidencias`);
            });
    }

    // Ver vehículos registrados
    verVehiculosRegistrados() {
        console.log('\n🚗 VEHÍCULOS REGISTRADOS');
        console.log('='.repeat(50));
        
        if (this.vehiculos.length === 0) {
            console.log('No hay vehículos registrados.');
            return;
        }

        this.vehiculos.forEach((vehiculo, index) => {
            console.log(`\n${index + 1}. ID: ${vehiculo.getId}`);
            this.mostrarInfoVehiculo(vehiculo);
        });
    }

    // Menú principal
    async ejecutarMenu() {
        return new Promise((resolve) => {
            this.mostrarMenu();
            this.rl.question('Seleccione una opción: ', async (opcion) => {
                switch(opcion) {
                    case '1':
                        await this.registrarIncidencia();
                        break;
                    case '2':
                        this.verTodasIncidencias();
                        break;
                    case '3':
                        await this.buscarPorCodigo();
                        break;
                    case '4':
                        await this.filtrarPorTipo();
                        break;
                    case '5':
                        this.mostrarEstadisticas();
                        break;
                    case '6':
                        this.verVehiculosRegistrados();
                        break;
                    case '7':
                        await this.registrarNuevoVehiculo();
                        break;
                    case '0':
                        console.log('👋 Gracias por usar el Sistema de Control de Incidencias');
                        this.rl.close();
                        resolve();
                        return;
                    default:
                        console.log('❌ Opción inválida. Por favor seleccione una opción válida.');
                }
                
                // Pausa antes de mostrar el menú nuevamente
                this.rl.question('\nPresione Enter para continuar...', () => {
                    this.ejecutarMenu().then(resolve);
                });
            });
        });
    }

    // Inicializar el sistema
    async iniciar() {
        console.log('🚗 Iniciando Sistema de Control de Incidencias...');
        console.log('Parqueadero - Gestión de Incidencias v2.0\n');
        console.log(`📊 Sistema inicializado con ${this.vehiculos.length} vehículos registrados`);
        
        await this.ejecutarMenu();
    }
}

// Crear instancia y ejecutar el sistema
const controlador = new ControladorIncidencias();

// Manejar cierre del programa
process.on('SIGINT', () => {
    console.log('\n👋 Cerrando el sistema...');
    controlador.rl.close();
    process.exit(0);
});

// Iniciar la aplicación
controlador.iniciar().catch(console.error);

export default ControladorIncidencias;