import Usuario from './Usuario.js';
import Vehiculo from './Vehiculo.js';
import Celda from './Celda.js';
import readline from 'readline';1

class ControlCelda {
    constructor() {
        this.usuarios = [];
        this.vehiculos = [];
        this.celdas = [];
        this.ocupacionCeldas = new Map(); // Map para relacionar celda con vehículo
        this.usuarioActual = null;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // Inicializar datos de prueba
        this.inicializarUsuariosPrueba();
        this.inicializarVehiculosPrueba();
        this.inicializarCeldasPrueba();
    }

    inicializarUsuariosPrueba() {
        // Usuario administrador
        const admin = new Usuario(
            1, 'CC', '12345678', 'Admin', '', 'Sistema', '', 
            'admin@sistema.com', '3001234567', '', 'activo', 
            'admin123', 'administrador'
        );
        
        // Usuario operador
        const operador = new Usuario(
            2, 'CC', '87654321', 'Carlos', 'Alberto', 'Operador', 'Prueba',
            'operador@sistema.com', '3007654321', '', 'activo',
            'oper123', 'operador'
        );
        
        // Usuario cliente
        const cliente = new Usuario(
            3, 'CC', '11111111', 'Juan', 'Carlos', 'Cliente', 'Prueba',
            'cliente@email.com', '3009876543', '', 'activo',
            'client123', 'cliente'
        );

        // Usuario cliente 2
        const cliente2 = new Usuario(
            4, 'CC', '22222222', 'Maria', 'Elena', 'Rodriguez', 'Lopez',
            'maria@email.com', '3008765432', '', 'activo',
            'maria123', 'cliente'
        );
        
        this.usuarios.push(admin, operador, cliente, cliente2);
    }

    inicializarVehiculosPrueba() {
        const vehiculo1 = new Vehiculo(1, 'ABC123', 'Rojo', '2020', 'Toyota', 'automóvil', 3);
        const vehiculo2 = new Vehiculo(2, 'XYZ789', 'Azul', '2019', 'Honda', 'motocicleta', 4);
        const vehiculo3 = new Vehiculo(3, 'DEF456', 'Blanco', '2021', 'Chevrolet', 'automóvil', null);
        
        this.vehiculos.push(vehiculo1, vehiculo2, vehiculo3);
    }

    inicializarCeldasPrueba() {
        // Crear celdas para diferentes áreas y pisos
        const areas = ['A', 'B', 'C'];
        const pisos = [1, 2, 3];
        const tiposCelda = ['automóvil', 'motocicleta'];
        
        let celdaId = 1;
        
        areas.forEach(area => {
            pisos.forEach(piso => {
                // 10 celdas de automóvil por área/piso
                for (let i = 1; i <= 10; i++) {
                    const codigo = `${area}${piso}-C${i.toString().padStart(2, '0')}`;
                    const celda = new Celda(celdaId++, 'automóvil', 'disponible');
                    celda.setCodigo = codigo;
                    celda.setArea = area;
                    celda.setPiso = piso;
                    this.celdas.push(celda);
                }
                
                // 5 celdas de motocicleta por área/piso
                for (let i = 1; i <= 5; i++) {
                    const codigo = `${area}${piso}-M${i.toString().padStart(2, '0')}`;
                    const celda = new Celda(celdaId++, 'motocicleta', 'disponible');
                    celda.setCodigo = codigo;
                    celda.setArea = area;
                    celda.setPiso = piso;
                    this.celdas.push(celda);
                }
            });
        });

        // Ocupar algunas celdas de ejemplo
        this.ocuparCeldaEjemplo('A1-C01', 'ABC123');
        this.ocuparCeldaEjemplo('B2-M01', 'XYZ789');
    }

    ocuparCeldaEjemplo(codigoCelda, placaVehiculo) {
        const celda = this.celdas.find(c => c.getCodigo === codigoCelda);
        const vehiculo = this.vehiculos.find(v => v.getPlaca === placaVehiculo);
        
        if (celda && vehiculo) {
            celda.setEstado = 'ocupado';
            this.ocupacionCeldas.set(celda.getId, vehiculo.getId);
        }
    }

    pregunta(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async autenticarUsuario() {
        console.log('\n=== SISTEMA DE CONTROL DE CELDAS DE PARQUEO ===');
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
            return true;
        } else {
            console.log('\nCredenciales incorrectas. Intente nuevamente.');
            return false;
        }
    }

    async mostrarMenu() {
        console.log('\n=== MENÚ PRINCIPAL - CONTROL DE CELDAS ===');
        console.log('1. Ver todas las celdas por área');
        console.log('2. Ver todas las celdas por piso');
        console.log('3. Ver celdas disponibles');
        console.log('4. Ver celdas ocupadas');
        console.log('5. Ver mis vehículos y celdas ocupadas');
        console.log('6. Actualizar estado de celda');
        console.log('7. Buscar celda por código');
        console.log('8. Ver estadísticas generales');
        console.log('9. Salir');
        
        const opcion = await this.pregunta('\nSeleccione una opción: ');
        return opcion;
    }

    // REQ-CLD-01: Visualizar celdas por área, piso o nivel
    async verCeldasPorArea() {
        console.log('\n=== CELDAS POR ÁREA ===');
        const areas = [...new Set(this.celdas.map(c => c.getArea))];
        
        for (const area of areas) {
            console.log(`\n--- ÁREA ${area} ---`);
            const celdasArea = this.celdas.filter(c => c.getArea === area);
            
            const pisos = [...new Set(celdasArea.map(c => c.getPiso))];
            
            pisos.forEach(piso => {
                console.log(`  Piso ${piso}:`);
                const celdasPiso = celdasArea.filter(c => c.getPiso === piso);
                
                // Agrupar por tipo
                const automoviles = celdasPiso.filter(c => c.getTipo === 'automóvil');
                const motocicletas = celdasPiso.filter(c => c.getTipo === 'motocicleta');
                
                this.mostrarCeldasPorTipo('    Automóviles', automoviles);
                this.mostrarCeldasPorTipo('    Motocicletas', motocicletas);
            });
        }
    }

    async verCeldasPorPiso() {
        console.log('\n=== CELDAS POR PISO ===');
        const pisos = [...new Set(this.celdas.map(c => c.getPiso))].sort();
        
        for (const piso of pisos) {
            console.log(`\n--- PISO ${piso} ---`);
            const celdasPiso = this.celdas.filter(c => c.getPiso === piso);
            
            const areas = [...new Set(celdasPiso.map(c => c.getArea))];
            
            areas.forEach(area => {
                console.log(`  Área ${area}:`);
                const celdasArea = celdasPiso.filter(c => c.getArea === area);
                
                // Agrupar por tipo
                const automoviles = celdasArea.filter(c => c.getTipo === 'automóvil');
                const motocicletas = celdasArea.filter(c => c.getTipo === 'motocicleta');
                
                this.mostrarCeldasPorTipo('    Automóviles', automoviles);
                this.mostrarCeldasPorTipo('    Motocicletas', motocicletas);
            });
        }
    }

    mostrarCeldasPorTipo(titulo, celdas) {
        if (celdas.length === 0) return;
        
        console.log(`${titulo}:`);
        celdas.forEach(celda => {
            const vehiculo = this.obtenerVehiculoEnCelda(celda);
            const infoVehiculo = vehiculo ? ` (${vehiculo.getPlaca} - ${vehiculo.getMarca})` : '';
            const estado = celda.getEstado === 'ocupado' ? '🔴' : '🟢';
            
            console.log(`      ${estado} ${celda.getCodigo} - ${celda.getEstado.toUpperCase()}${infoVehiculo}`);
        });
    }

    // REQ-CLD-02: Visualizar celdas disponibles y ocupadas
    verCeldasDisponibles() {
        console.log('\n=== CELDAS DISPONIBLES ===');
        const celdasDisponibles = this.celdas.filter(c => c.getEstado === 'disponible');
        
        if (celdasDisponibles.length === 0) {
            console.log('No hay celdas disponibles en este momento.');
            return;
        }

        // Agrupar por tipo
        const automoviles = celdasDisponibles.filter(c => c.getTipo === 'automóvil');
        const motocicletas = celdasDisponibles.filter(c => c.getTipo === 'motocicleta');
        
        console.log(`\nCeldas para AUTOMÓVILES disponibles: ${automoviles.length}`);
        automoviles.forEach(celda => {
            console.log(`  🟢 ${celda.getCodigo} - Área ${celda.getArea}, Piso ${celda.getPiso}`);
        });
        
        console.log(`\nCeldas para MOTOCICLETAS disponibles: ${motocicletas.length}`);
        motocicletas.forEach(celda => {
            console.log(`  🟢 ${celda.getCodigo} - Área ${celda.getArea}, Piso ${celda.getPiso}`);
        });
    }

    verCeldasOcupadas() {
        console.log('\n=== CELDAS OCUPADAS ===');
        const celdasOcupadas = this.celdas.filter(c => c.getEstado === 'ocupado');
        
        if (celdasOcupadas.length === 0) {
            console.log('No hay celdas ocupadas en este momento.');
            return;
        }

        celdasOcupadas.forEach(celda => {
            const vehiculo = this.obtenerVehiculoEnCelda(celda);
            const usuario = vehiculo ? this.usuarios.find(u => u.getId === vehiculo.getUsuario) : null;
            const propietario = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin asignar';
            
            console.log(`🔴 ${celda.getCodigo} - Área ${celda.getArea}, Piso ${celda.getPiso}`);
            console.log(`   Tipo: ${celda.getTipo}`);
            if (vehiculo) {
                console.log(`   Vehículo: ${vehiculo.getPlaca} - ${vehiculo.getMarca} ${vehiculo.getModelo}`);
                console.log(`   Propietario: ${propietario}`);
            }
            console.log('---');
        });
    }

    // REQ-CLD-02: Interfaz individual para usuarios
    verMisVehiculosYCeldas() {
        if (this.usuarioActual.getPerfil_usuario === 'administrador' || 
            this.usuarioActual.getPerfil_usuario === 'operador') {
            console.log('\nEsta función es para usuarios clientes. Los administradores y operadores pueden ver todas las celdas.');
            return;
        }

        console.log('\n=== MIS VEHÍCULOS Y CELDAS OCUPADAS ===');
        
        const misVehiculos = this.vehiculos.filter(v => v.getUsuario === this.usuarioActual.getId);
        
        if (misVehiculos.length === 0) {
            console.log('No tiene vehículos registrados.');
            return;
        }

        misVehiculos.forEach(vehiculo => {
            console.log(`\nVehículo: ${vehiculo.getPlaca} - ${vehiculo.getMarca} ${vehiculo.getModelo}`);
            console.log(`Tipo: ${vehiculo.getTipo}, Color: ${vehiculo.getColor}`);
            
            // Buscar si está ocupando alguna celda
            const celdaOcupada = this.celdas.find(c => {
                const vehiculoEnCelda = this.obtenerVehiculoEnCelda(c);
                return vehiculoEnCelda && vehiculoEnCelda.getId === vehiculo.getId;
            });
            
            if (celdaOcupada) {
                console.log(`🔴 Ocupando celda: ${celdaOcupada.getCodigo} - Área ${celdaOcupada.getArea}, Piso ${celdaOcupada.getPiso}`);
            } else {
                console.log('🟢 No está ocupando ninguna celda');
            }
            console.log('---');
        });
    }

    // REQ-CLD-03: Actualizar estado de celda
    async actualizarEstadoCelda() {
        if (!this.puedeActualizarCelda()) {
            console.log('\nNo tiene permisos para actualizar el estado de las celdas.');
            return;
        }

        console.log('\n=== ACTUALIZAR ESTADO DE CELDA ===');
        
        const codigo = await this.pregunta('Ingrese el código de la celda: ');
        const celda = this.celdas.find(c => c.getCodigo === codigo);
        
        if (!celda) {
            console.log('\nCelda no encontrada.');
            return;
        }

        console.log(`\nCelda encontrada: ${celda.getCodigo}`);
        console.log(`Estado actual: ${celda.getEstado}`);
        console.log(`Tipo: ${celda.getTipo}`);
        console.log(`Ubicación: Área ${celda.getArea}, Piso ${celda.getPiso}`);

        if (celda.getEstado === 'disponible') {
            await this.ocuparCelda(celda);
        } else {
            await this.liberarCelda(celda);
        }
    }

    async ocuparCelda(celda) {
        console.log('\n--- OCUPAR CELDA ---');
        
        // Mostrar vehículos compatibles
        const vehiculosCompatibles = this.vehiculos.filter(v => {
            // Verificar tipo compatible
            const tipoCompatible = (celda.getTipo === 'automóvil' && v.getTipo === 'automóvil') ||
                                 (celda.getTipo === 'motocicleta' && v.getTipo === 'motocicleta');
            
            // Verificar que no esté ya ocupando otra celda
            const yaOcupaOtraCelda = this.celdas.some(c => {
                const vehiculoEnCelda = this.obtenerVehiculoEnCelda(c);
                return vehiculoEnCelda && vehiculoEnCelda.getId === v.getId;
            });
            
            return tipoCompatible && !yaOcupaOtraCelda;
        });

        if (vehiculosCompatibles.length === 0) {
            console.log(`No hay vehículos tipo "${celda.getTipo}" disponibles para ocupar esta celda.`);
            return;
        }

        console.log('\nVehículos compatibles disponibles:');
        vehiculosCompatibles.forEach(v => {
            const usuario = this.usuarios.find(u => u.getId === v.getUsuario);
            const propietario = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin asignar';
            console.log(`${v.getId}. ${v.getPlaca} - ${v.getMarca} ${v.getModelo} (${propietario})`);
        });

        const vehiculoId = parseInt(await this.pregunta('\nIngrese el ID del vehículo: '));
        const vehiculo = vehiculosCompatibles.find(v => v.getId === vehiculoId);
        
        if (!vehiculo) {
            console.log('\nVehículo no válido.');
            return;
        }

        // Ocupar la celda
        celda.setEstado = 'ocupado';
        this.ocupacionCeldas.set(celda.getId, vehiculo.getId);
        
        console.log(`\n✅ Celda ${celda.getCodigo} ocupada exitosamente por el vehículo ${vehiculo.getPlaca}.`);
    }

    async liberarCelda(celda) {
        console.log('\n--- LIBERAR CELDA ---');
        
        const vehiculo = this.obtenerVehiculoEnCelda(celda);
        if (vehiculo) {
            const usuario = this.usuarios.find(u => u.getId === vehiculo.getUsuario);
            const propietario = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin asignar';
            
            console.log(`Vehículo actual: ${vehiculo.getPlaca} - ${vehiculo.getMarca} ${vehiculo.getModelo}`);
            console.log(`Propietario: ${propietario}`);
        }

        const confirmacion = await this.pregunta('\n¿Confirma que desea liberar esta celda? (s/n): ');
        
        if (confirmacion.toLowerCase() === 's' || confirmacion.toLowerCase() === 'si') {
            celda.setEstado = 'disponible';
            this.ocupacionCeldas.delete(celda.getId);
            
            console.log(`\n✅ Celda ${celda.getCodigo} liberada exitosamente.`);
        } else {
            console.log('\nOperación cancelada.');
        }
    }

    async buscarCeldaPorCodigo() {
        console.log('\n=== BUSCAR CELDA POR CÓDIGO ===');
        
        const codigo = await this.pregunta('Ingrese el código de la celda: ');
        const celda = this.celdas.find(c => c.getCodigo === codigo);
        
        if (!celda) {
            console.log('\nCelda no encontrada.');
            return;
        }

        console.log(`\n--- INFORMACIÓN DE LA CELDA ---`);
        console.log(`Código: ${celda.getCodigo}`);
        console.log(`Tipo: ${celda.getTipo}`);
        console.log(`Estado: ${celda.getEstado}`);
        console.log(`Ubicación: Área ${celda.getArea}, Piso ${celda.getPiso}`);
        
        if (celda.getEstado === 'ocupado') {
            const vehiculo = this.obtenerVehiculoEnCelda(celda);
            if (vehiculo) {
                const usuario = this.usuarios.find(u => u.getId === vehiculo.getUsuario);
                const propietario = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin asignar';
                
                console.log(`\nVehículo ocupando:`);
                console.log(`  Placa: ${vehiculo.getPlaca}`);
                console.log(`  Marca/Modelo: ${vehiculo.getMarca} ${vehiculo.getModelo}`);
                console.log(`  Color: ${vehiculo.getColor}`);
                console.log(`  Propietario: ${propietario}`);
            }
        }
    }

    verEstadisticasGenerales() {
        console.log('\n=== ESTADÍSTICAS GENERALES ===');
        
        const totalCeldas = this.celdas.length;
        const celdasOcupadas = this.celdas.filter(c => c.getEstado === 'ocupado').length;
        const celdasDisponibles = this.celdas.filter(c => c.getEstado === 'disponible').length;
        
        const celdasAutomovil = this.celdas.filter(c => c.getTipo === 'automóvil');
        const celdasMotocicleta = this.celdas.filter(c => c.getTipo === 'motocicleta');
        
        const automovilesOcupados = celdasAutomovil.filter(c => c.getEstado === 'ocupado').length;
        const motocicletasOcupadas = celdasMotocicleta.filter(c => c.getEstado === 'ocupado').length;
        
        console.log(`Total de celdas: ${totalCeldas}`);
        console.log(`Celdas ocupadas: ${celdasOcupadas} (${((celdasOcupadas/totalCeldas)*100).toFixed(1)}%)`);
        console.log(`Celdas disponibles: ${celdasDisponibles} (${((celdasDisponibles/totalCeldas)*100).toFixed(1)}%)`);
        
        console.log(`\nPor tipo de vehículo:`);
        console.log(`  Automóviles: ${celdasAutomovil.length} celdas (${automovilesOcupados} ocupadas, ${celdasAutomovil.length - automovilesOcupados} disponibles)`);
        console.log(`  Motocicletas: ${celdasMotocicleta.length} celdas (${motocicletasOcupadas} ocupadas, ${celdasMotocicleta.length - motocicletasOcupadas} disponibles)`);
        
        console.log(`\nPor área:`);
        const areas = [...new Set(this.celdas.map(c => c.getArea))];
        areas.forEach(area => {
            const celdasArea = this.celdas.filter(c => c.getArea === area);
            const ocupadasArea = celdasArea.filter(c => c.getEstado === 'ocupado').length;
            console.log(`  Área ${area}: ${celdasArea.length} celdas (${ocupadasArea} ocupadas)`);
        });
    }

    obtenerVehiculoEnCelda(celda) {
        const vehiculoId = this.ocupacionCeldas.get(celda.getId);
        return vehiculoId ? this.vehiculos.find(v => v.getId === vehiculoId) : null;
    }

    puedeActualizarCelda() {
        return this.usuarioActual && 
               (this.usuarioActual.getPerfil_usuario === 'administrador' || 
                this.usuarioActual.getPerfil_usuario === 'operador');
    }

    async ejecutar() {
        let autenticado = false;
        
        while (!autenticado) {
            autenticado = await this.autenticarUsuario();
        }

        let continuar = true;
        while (continuar) {
            const opcion = await this.mostrarMenu();
            
            switch (opcion) {
                case '1':
                    await this.verCeldasPorArea();
                    break;
                case '2':
                    await this.verCeldasPorPiso();
                    break;
                case '3':
                    this.verCeldasDisponibles();
                    break;
                case '4':
                    this.verCeldasOcupadas();
                    break;
                case '5':
                    this.verMisVehiculosYCeldas();
                    break;
                case '6':
                    await this.actualizarEstadoCelda();
                    break;
                case '7':
                    await this.buscarCeldaPorCodigo();
                    break;
                case '8':
                    this.verEstadisticasGenerales();
                    break;
                case '9':
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

// Agregar propiedades adicionales a la clase Celda
Celda.prototype.getCodigo = function() {
    return this._codigo;
};

Celda.prototype.setCodigo = function(codigo) {
    this._codigo = codigo;
};

Celda.prototype.getArea = function() {
    return this._area;
};

Celda.prototype.setArea = function(area) {
    this._area = area;
};

Celda.prototype.getPiso = function() {
    return this._piso;
};

Celda.prototype.setPiso = function(piso) {
    this._piso = piso;
};

// Ejecutar el sistema
const controlCelda = new ControlCelda();
controlCelda.ejecutar().catch(console.error);