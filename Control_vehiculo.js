import Usuario from './Usuario.js';
import Vehiculo from './Vehiculo.js';
import Pico_placa from './Pico_placa.js';
import readline from 'readline';

class ControlVehiculo {
    constructor() {
        this.usuarios = [];
        this.vehiculos = [];
        this.restriccionesPicoPlaca = [];
        this.usuarioActual = null;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // Crear algunos usuarios de prueba
        this.inicializarUsuariosPrueba();
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
        
        this.usuarios.push(admin, operador, cliente);
    }

    pregunta(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async autenticarUsuario() {
        console.log('\n=== SISTEMA DE CONTROL DE VEHÍCULOS ===');
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
        console.log('\n=== MENÚ PRINCIPAL ===');
        console.log('1. Crear vehículo');
        console.log('2. Actualizar vehículo');
        console.log('3. Asignar vehículo a usuario');
        console.log('4. Crear restricción pico y placa');
        console.log('5. Ver vehículos');
        console.log('6. Ver restricciones pico y placa');
        console.log('7. Verificar restricción de vehículo');
        console.log('8. Salir');
        
        const opcion = await this.pregunta('\nSeleccione una opción: ');
        return opcion;
    }

    // REQ-CAR-1: Crear vehículo (administrador o operador)
    async crearVehiculo() {
        if (!this.puedeCrearVehiculo()) {
            console.log('\nNo tiene permisos para crear vehículos.');
            return;
        }

        console.log('\n=== CREAR VEHÍCULO ===');
        
        const placa = await this.pregunta('Ingrese la placa: ');
        const color = await this.pregunta('Ingrese el color: ');
        const marca = await this.pregunta('Ingrese la marca: ');
        const modelo = await this.pregunta('Ingrese el modelo: ');
        const tipo = await this.pregunta('Ingrese el tipo de vehículo: ');
        
        // Verificar si la placa ya existe
        const placaExiste = this.vehiculos.some(v => v.getPlaca === placa);
        if (placaExiste) {
            console.log('\nError: Ya existe un vehículo con esa placa.');
            return;
        }

        const nuevoId = this.vehiculos.length + 1;
        const nuevoVehiculo = new Vehiculo(
            nuevoId, placa, color, modelo, marca, tipo, null
        );
        
        this.vehiculos.push(nuevoVehiculo);
        console.log('\n¡Vehículo creado exitosamente!');
        console.log(`ID: ${nuevoId}, Placa: ${placa}, Marca: ${marca}, Modelo: ${modelo}`);
    }

    // REQ-CAR-2: Actualizar vehículo (solo administrador)
    async actualizarVehiculo() {
        if (!this.esAdministrador()) {
            console.log('\nNo tiene permisos para actualizar vehículos.');
            return;
        }

        if (this.vehiculos.length === 0) {
            console.log('\nNo hay vehículos registrados.');
            return;
        }

        console.log('\n=== ACTUALIZAR VEHÍCULO ===');
        this.mostrarVehiculos();
        
        const id = parseInt(await this.pregunta('Ingrese el ID del vehículo a actualizar: '));
        const vehiculo = this.vehiculos.find(v => v.getId === id);
        
        if (!vehiculo) {
            console.log('\nVehículo no encontrado.');
            return;
        }

        console.log(`\nDatos actuales del vehículo ID ${id}:`);
        console.log(`Placa: ${vehiculo.getPlaca}`);
        console.log(`Color: ${vehiculo.getColor}`);
        console.log(`Marca: ${vehiculo.getMarca}`);
        console.log(`Modelo: ${vehiculo.getModelo}`);
        console.log(`Tipo: ${vehiculo.getTipo}`);

        const nuevaPlaca = await this.pregunta('Nueva placa (Enter para mantener actual): ');
        const nuevoColor = await this.pregunta('Nuevo color (Enter para mantener actual): ');
        const nuevaMarca = await this.pregunta('Nueva marca (Enter para mantener actual): ');
        const nuevoModelo = await this.pregunta('Nuevo modelo (Enter para mantener actual): ');
        const nuevoTipo = await this.pregunta('Nuevo tipo (Enter para mantener actual): ');

        if (nuevaPlaca) vehiculo.setPlaca = nuevaPlaca;
        if (nuevoColor) vehiculo.setColor = nuevoColor;
        if (nuevaMarca) vehiculo.setMarca = nuevaMarca;
        if (nuevoModelo) vehiculo.setModelo = nuevoModelo;
        if (nuevoTipo) vehiculo.setTipo = nuevoTipo;

        console.log('\n¡Vehículo actualizado exitosamente!');
    }

    // REQ-CAR-3: Asignar vehículo a usuario (solo administrador)
    async asignarVehiculoUsuario() {
        if (!this.esAdministrador()) {
            console.log('\nNo tiene permisos para asignar vehículos.');
            return;
        }

        if (this.vehiculos.length === 0) {
            console.log('\nNo hay vehículos registrados.');
            return;
        }

        console.log('\n=== ASIGNAR VEHÍCULO A USUARIO ===');
        
        // Mostrar vehículos disponibles
        console.log('\nVehículos disponibles:');
        this.vehiculos.forEach(v => {
            const usuario = v.getUsuario ? this.usuarios.find(u => u.getId === v.getUsuario) : null;
            const asignado = usuario ? `(Asignado a: ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido})` : '(Sin asignar)';
            console.log(`${v.getId}. Placa: ${v.getPlaca} - ${v.getMarca} ${v.getModelo} ${asignado}`);
        });

        const vehiculoId = parseInt(await this.pregunta('\nIngrese el ID del vehículo: '));
        const vehiculo = this.vehiculos.find(v => v.getId === vehiculoId);
        
        if (!vehiculo) {
            console.log('\nVehículo no encontrado.');
            return;
        }

        // Mostrar usuarios disponibles
        console.log('\nUsuarios disponibles:');
        this.usuarios.forEach(u => {
            if (u.getPerfil_usuario !== 'administrador') {
                console.log(`${u.getId}. ${u.getPrimer_nombre} ${u.getPrimer_apellido} - ${u.getDireccion_correo}`);
            }
        });

        const usuarioId = parseInt(await this.pregunta('\nIngrese el ID del usuario (0 para desasignar): '));
        
        if (usuarioId === 0) {
            vehiculo.setUsuario = null;
            console.log('\nVehículo desasignado exitosamente.');
        } else {
            const usuario = this.usuarios.find(u => u.getId === usuarioId);
            if (!usuario) {
                console.log('\nUsuario no encontrado.');
                return;
            }
            
            vehiculo.setUsuario = usuarioId;
            console.log(`\nVehículo asignado exitosamente a ${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}.`);
        }
    }

    // REQ-CAR-4: Crear restricción pico y placa (administrador o operador)
    async crearRestriccionPicoPlaca() {
        if (!this.puedeCrearVehiculo()) {
            console.log('\nNo tiene permisos para crear restricciones.');
            return;
        }

        console.log('\n=== CREAR RESTRICCIÓN PICO Y PLACA ===');
        console.log('Tipos de vehículo disponibles: automóvil, motocicleta, camión, bus');
        console.log('Días disponibles: lunes, martes, miércoles, jueves, viernes, sábado, domingo');
        
        const tipoVehiculo = await this.pregunta('Tipo de vehículo: ');
        const numero = await this.pregunta('Último dígito de placa restringido: ');
        const dia = await this.pregunta('Día de restricción: ');

        // Validar que el número sea un dígito
        if (isNaN(numero) || numero < 0 || numero > 9) {
            console.log('\nError: El número debe ser un dígito del 0 al 9.');
            return;
        }

        // Verificar si ya existe la restricción
        const restriccionExiste = this.restriccionesPicoPlaca.some(r => 
            r.getTipo_vehiculo === tipoVehiculo && 
            r.getNumrto == numero && 
            r.getDia === dia.toLowerCase()
        );

        if (restriccionExiste) {
            console.log('\nError: Ya existe una restricción para estos parámetros.');
            return;
        }

        const nuevaRestriccion = new Pico_placa(
            this.restriccionesPicoPlaca.length + 1,
            tipoVehiculo.toLowerCase(),
            parseInt(numero),
            dia.toLowerCase()
        );

        this.restriccionesPicoPlaca.push(nuevaRestriccion);
        console.log('\n¡Restricción creada exitosamente!');
        console.log(`Tipo: ${tipoVehiculo}, Dígito: ${numero}, Día: ${dia}`);
    }

    async verificarRestriccionVehiculo() {
        if (this.vehiculos.length === 0) {
            console.log('\nNo hay vehículos registrados.');
            return;
        }

        console.log('\n=== VERIFICAR RESTRICCIÓN DE VEHÍCULO ===');
        
        const placa = await this.pregunta('Ingrese la placa del vehículo: ');
        const dia = await this.pregunta('Ingrese el día a verificar: ');

        const vehiculo = this.vehiculos.find(v => v.getPlaca === placa);
        if (!vehiculo) {
            console.log('\nVehículo no encontrado.');
            return;
        }

        const ultimoDigito = parseInt(placa.slice(-1));
        if (isNaN(ultimoDigito)) {
            console.log('\nError: No se puede determinar el último dígito de la placa.');
            return;
        }

        const restriccion = this.restriccionesPicoPlaca.find(r => 
            r.getTipo_vehiculo === vehiculo.getTipo.toLowerCase() && 
            r.getNumrto === ultimoDigito && 
            r.getDia === dia.toLowerCase()
        );

        if (restriccion) {
            console.log(`\n⚠️  RESTRICCIÓN ACTIVA`);
            console.log(`El vehículo con placa ${placa} NO puede circular el día ${dia}.`);
            console.log(`Tipo: ${vehiculo.getTipo}, Último dígito: ${ultimoDigito}`);
        } else {
            console.log(`\n✅ SIN RESTRICCIÓN`);
            console.log(`El vehículo con placa ${placa} SÍ puede circular el día ${dia}.`);
        }
    }

    mostrarVehiculos() {
        if (this.vehiculos.length === 0) {
            console.log('\nNo hay vehículos registrados.');
            return;
        }

        console.log('\n=== LISTA DE VEHÍCULOS ===');
        this.vehiculos.forEach(v => {
            const usuario = v.getUsuario ? this.usuarios.find(u => u.getId === v.getUsuario) : null;
            const asignado = usuario ? `${usuario.getPrimer_nombre} ${usuario.getPrimer_apellido}` : 'Sin asignar';
            
            console.log(`ID: ${v.getId}`);
            console.log(`  Placa: ${v.getPlaca}`);
            console.log(`  Marca: ${v.getMarca} ${v.getModelo}`);
            console.log(`  Color: ${v.getColor}`);
            console.log(`  Tipo: ${v.getTipo}`);
            console.log(`  Asignado a: ${asignado}`);
            console.log('---');
        });
    }

    mostrarRestricciones() {
        if (this.restriccionesPicoPlaca.length === 0) {
            console.log('\nNo hay restricciones registradas.');
            return;
        }

        console.log('\n=== RESTRICCIONES PICO Y PLACA ===');
        this.restriccionesPicoPlaca.forEach(r => {
            console.log(`ID: ${r.getId} - Tipo: ${r.getTipo_vehiculo}, Dígito: ${r.getNumrto}, Día: ${r.getDia}`);
        });
    }

    puedeCrearVehiculo() {
        return this.usuarioActual && 
               (this.usuarioActual.getPerfil_usuario === 'administrador' || 
                this.usuarioActual.getPerfil_usuario === 'operador');
    }

    esAdministrador() {
        return this.usuarioActual && this.usuarioActual.getPerfil_usuario === 'administrador';
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
                    await this.crearVehiculo();
                    break;
                case '2':
                    await this.actualizarVehiculo();
                    break;
                case '3':
                    await this.asignarVehiculoUsuario();
                    break;
                case '4':
                    await this.crearRestriccionPicoPlaca();
                    break;
                case '5':
                    this.mostrarVehiculos();
                    break;
                case '6':
                    this.mostrarRestricciones();
                    break;
                case '7':
                    await this.verificarRestriccionVehiculo();
                    break;
                case '8':
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
const controlVehiculo = new ControlVehiculo();
controlVehiculo.ejecutar().catch(console.error);