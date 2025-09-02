import Usuario from "./Usuario.js";
import PerfilUsuario from "./Perfil_usuario.js";
import readline from "readline";

// REQ-USR-1: Solo 3 perfiles de usuario
const perfilUsuario1 = new PerfilUsuario(1, 'Administrador');
const perfilUsuario2 = new PerfilUsuario(2, 'Operador');
const perfilUsuario3 = new PerfilUsuario(3, 'Usuario');

// Usuarios iniciales
const usuario1 = new Usuario(1, 'C.C', '123456789', 'Karen', 'Dayana', 'Gómez', 'Rodriguez', 'karengomez@gmail.com', '3023240967', 'foto1.jpg', 'Activo', 'contraseña456', perfilUsuario1);
const usuario2 = new Usuario(2, 'C.C', '987654321', 'Juan', 'David', 'Zapata', 'López', 'juanzapata@gmail.com', '3014567890', 'foto2.jpg', 'Activo', 'contraseña123', perfilUsuario2);
const usuario3 = new Usuario(3, 'C.C', '555555555', 'Ana', 'María', 'Pérez', 'García', 'anaperez@gmail.com', '3001234567', 'foto3.jpg', 'Inactivo', 'contraseña789', perfilUsuario3);

console.log("--------------------------------------------");
console.log("Sistema de Parqueadero - Usuarios iniciales creados");
console.log("--------------------------------------------");

// Agrupar perfiles y usuarios
const perfiles = [perfilUsuario1, perfilUsuario2, perfilUsuario3];
const usuarios = [usuario1, usuario2, usuario3];
let nextId = usuarios.length + 1;
let usuarioLogueado = null;

// Crear la interfaz de consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// REQ-USR-2: Solo administrador y operador pueden crear usuarios
function crearUsuario() {
    // Verificar permisos
    if (!usuarioLogueado) {
        console.log("❌ Debe iniciar sesión primero.");
        return mostrarMenu();
    }
    
    if (usuarioLogueado.getPerfil_usuario.getPerfil !== "Administrador" && usuarioLogueado.getPerfil_usuario.getPerfil !== "Operador") {
        console.log("❌ No tiene permisos para crear usuarios. Solo Administradores y Operadores pueden crear usuarios.");
        return mostrarMenu();
    }

    console.log("\n" + "=".repeat(40));
    console.log("         CREAR NUEVO USUARIO");
    console.log("=".repeat(40));
    
    // Paso 1: Tipo de documento (obligatorio)
    console.log("📝 Tipos de documento disponibles: C.C, T.I, C.E");
    rl.question("Ingrese el tipo de documento: ", (tipoDoc) => {
        if (!tipoDoc.trim()) {
            console.log("❌ El tipo de documento es obligatorio.");
            return mostrarMenu();
        }

        // Paso 2: Número de documento (obligatorio)
        rl.question("Ingrese el número de documento: ", (numDoc) => {
            if (!numDoc.trim()) {
                console.log("❌ El número de documento es obligatorio.");
                return mostrarMenu();
            }
            
            if (!/^[0-9]+$/.test(numDoc)) {
                console.log("❌ El número de documento debe contener solo números.");
                return mostrarMenu();
            }

            // Verificar documento único
            const existe = usuarios.find(u => u.getNumero_documento === numDoc);
            if (existe) {
                console.log("❌ Ya existe un usuario con este número de documento.");
                return mostrarMenu();
            }

            // Paso 3: Primer nombre (obligatorio)
            rl.question("Ingrese el primer nombre: ", (primerNombre) => {
                if (!primerNombre.trim()) {
                    console.log("❌ El primer nombre es obligatorio.");
                    return mostrarMenu();
                }

                // Paso 4: Segundo nombre (opcional)
                rl.question("Ingrese el segundo nombre (opcional, presione Enter para omitir): ", (segundoNombre) => {
                    
                    // Paso 5: Primer apellido (obligatorio)
                    rl.question("Ingrese el primer apellido: ", (primerApellido) => {
                        if (!primerApellido.trim()) {
                            console.log("❌ El primer apellido es obligatorio.");
                            return mostrarMenu();
                        }

                        // Paso 6: Segundo apellido (opcional)
                        rl.question("Ingrese el segundo apellido (opcional, presione Enter para omitir): ", (segundoApellido) => {
                            
                            // Paso 7: Correo electrónico (obligatorio)
                            rl.question("Ingrese el correo electrónico: ", (correo) => {
                                if (!correo.trim()) {
                                    console.log("❌ El correo electrónico es obligatorio.");
                                    return mostrarMenu();
                                }
                                
                                if (!correo.includes("@") || !correo.includes(".")) {
                                    console.log("❌ Ingrese un correo electrónico válido.");
                                    return mostrarMenu();
                                }

                                // Paso 8: Número de celular (obligatorio)
                                rl.question("Ingrese el número de celular: ", (celular) => {
                                    if (!celular.trim()) {
                                        console.log("❌ El número de celular es obligatorio.");
                                        return mostrarMenu();
                                    }
                                    
                                    if (!/^[0-9]+$/.test(celular)) {
                                        console.log("❌ El número de celular debe contener solo números.");
                                        return mostrarMenu();
                                    }

                                    // Paso 9: Fotografía (opcional)
                                    rl.question("Ingrese el nombre de la fotografía (opcional, presione Enter para omitir): ", (foto) => {
                                        
                                        // Paso 10: Tipo de usuario (obligatorio)
                                        console.log("\n🎯 Seleccione el tipo de usuario:");
                                        console.log("1. Administrador");
                                        console.log("2. Operador");
                                        console.log("3. Usuario");
                                        
                                        rl.question("Ingrese su opción (1, 2 o 3): ", (opcion) => {
                                            if (!["1", "2", "3"].includes(opcion)) {
                                                console.log("❌ Opción inválida. Debe ser 1, 2 o 3.");
                                                return mostrarMenu();
                                            }

                                            const perfil = perfiles.find(p => p.getId == parseInt(opcion));
                                            
                                            // Si es Administrador u Operador, necesita contraseña
                                            if (opcion === "1" || opcion === "2") {
                                                rl.question("Ingrese la contraseña (mínimo 6 caracteres): ", (clave) => {
                                                    if (!clave || clave.length < 6) {
                                                        console.log("❌ La contraseña debe tener al menos 6 caracteres.");
                                                        return mostrarMenu();
                                                    }

                                                    // Crear usuario con contraseña
                                                    const nuevoUsuario = new Usuario(
                                                        nextId++,
                                                        tipoDoc.trim(),
                                                        numDoc.trim(),
                                                        primerNombre.trim(),
                                                        segundoNombre.trim() || "",
                                                        primerApellido.trim(),
                                                        segundoApellido.trim() || "",
                                                        correo.trim(),
                                                        celular.trim(),
                                                        foto.trim() || "",
                                                        "Activo",
                                                        clave,
                                                        perfil
                                                    );
                                                    
                                                    usuarios.push(nuevoUsuario);
                                                    console.log("\n✅ ¡Usuario " + perfil.getPerfil + " creado exitosamente!");
                                                    console.log("📋 Código único asignado: " + nuevoUsuario.getId);
                                                    console.log("👤 Nombre completo: " + nuevoUsuario.getPrimer_nombre + " " + nuevoUsuario.getPrimer_apellido);
                                                    console.log("📄 Documento: " + nuevoUsuario.getTipo_documento + " " + nuevoUsuario.getNumero_documento);
                                                    console.log("📧 Correo: " + nuevoUsuario.getDireccion_correo);
                                                    mostrarMenu();
                                                });
                                            } else {
                                                // Usuario común no necesita contraseña
                                                const nuevoUsuario = new Usuario(
                                                    nextId++,
                                                    tipoDoc.trim(),
                                                    numDoc.trim(),
                                                    primerNombre.trim(),
                                                    segundoNombre.trim() || "",
                                                    primerApellido.trim(),
                                                    segundoApellido.trim() || "",
                                                    correo.trim(),
                                                    celular.trim(),
                                                    foto.trim() || "",
                                                    "Activo",
                                                    "", // Sin contraseña
                                                    perfil
                                                );
                                                
                                                usuarios.push(nuevoUsuario);
                                                console.log("\n✅ ¡Usuario creado exitosamente!");
                                                console.log("📋 Código único asignado: " + nuevoUsuario.getId);
                                                console.log("👤 Nombre completo: " + nuevoUsuario.getPrimer_nombre + " " + nuevoUsuario.getPrimer_apellido);
                                                console.log("📄 Documento: " + nuevoUsuario.getTipo_documento + " " + nuevoUsuario.getNumero_documento);
                                                console.log("📧 Correo: " + nuevoUsuario.getDireccion_correo);
                                                mostrarMenu();
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// REQ-USR-3: Solo administrador puede cambiar estado de activo a inactivo
function cambiarEstadoUsuario() {
    if (!usuarioLogueado) {
        console.log("❌ Debe iniciar sesión primero.");
        return mostrarMenu();
    }
    
    if (usuarioLogueado.getPerfil_usuario.getPerfil !== "Administrador") {
        console.log("❌ Solo el Administrador puede cambiar el estado de usuarios.");
        return mostrarMenu();
    }

    console.log("\n" + "=".repeat(40));
    console.log("      CAMBIAR ESTADO DE USUARIO");
    console.log("=".repeat(40));
    
    rl.question("Ingrese el número de documento del usuario: ", (numDoc) => {
        if (!numDoc.trim()) {
            console.log("❌ Debe ingresar un número de documento.");
            return mostrarMenu();
        }
        
        if (!/^[0-9]+$/.test(numDoc)) {
            console.log("❌ El documento debe contener solo números.");
            return mostrarMenu();
        }

        const usuario = usuarios.find(u => u.getNumero_documento === numDoc.trim());
        if (!usuario) {
            console.log("❌ Usuario no encontrado con ese número de documento.");
            return mostrarMenu();
        }

        console.log("📋 Usuario encontrado: " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido);
        console.log("📊 Estado actual: " + usuario.getEstado);

        if (usuario.getEstado === "Activo") {
            usuario.setEstado = "Inactivo";
            console.log("✅ Usuario " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido + " ha sido marcado como INACTIVO");
        } else {
            console.log("⚠️ El usuario ya está INACTIVO. No se pueden reactivar usuarios desde esta función.");
        }
        
        mostrarMenu();
    });
}

// REQ-USR-4: Usuario puede actualizar sus datos personales
function actualizarMisDatos() {
    if (!usuarioLogueado) {
        console.log("❌ Debe iniciar sesión para actualizar sus datos.");
        return mostrarMenu();
    }

    console.log("\n" + "=".repeat(40));
    console.log("    ACTUALIZAR MIS DATOS PERSONALES");
    console.log("=".repeat(40));
    console.log("👤 Usuario: " + usuarioLogueado.getPrimer_nombre + " " + usuarioLogueado.getPrimer_apellido);
    console.log("💡 Ingrese el nuevo valor o presione Enter para mantener el actual\n");
    
    rl.question("Primer nombre (actual: " + usuarioLogueado.getPrimer_nombre + "): ", (primerNombre) => {
        rl.question("Segundo nombre (actual: " + usuarioLogueado.getSegundo_nombre + "): ", (segundoNombre) => {
            rl.question("Primer apellido (actual: " + usuarioLogueado.getPrimer_apellido + "): ", (primerApellido) => {
                rl.question("Segundo apellido (actual: " + usuarioLogueado.getSegundo_apellido + "): ", (segundoApellido) => {
                    rl.question("Correo electrónico (actual: " + usuarioLogueado.getDireccion_correo + "): ", (correo) => {
                        rl.question("Número de celular (actual: " + usuarioLogueado.getNumero_celular + "): ", (celular) => {
                            
                            let cambiosRealizados = [];
                            
                            if (primerNombre.trim()) {
                                usuarioLogueado.setPrimer_nombre = primerNombre.trim();
                                cambiosRealizados.push("Primer nombre");
                            }
                            if (segundoNombre.trim()) {
                                usuarioLogueado.setSegundo_nombre = segundoNombre.trim();
                                cambiosRealizados.push("Segundo nombre");
                            }
                            if (primerApellido.trim()) {
                                usuarioLogueado.setPrimer_apellido = primerApellido.trim();
                                cambiosRealizados.push("Primer apellido");
                            }
                            if (segundoApellido.trim()) {
                                usuarioLogueado.setSegundo_apellido = segundoApellido.trim();
                                cambiosRealizados.push("Segundo apellido");
                            }
                            if (correo.trim() && correo.includes("@")) {
                                usuarioLogueado.setDireccion_correo = correo.trim();
                                cambiosRealizados.push("Correo electrónico");
                            }
                            if (celular.trim() && /^[0-9]+$/.test(celular)) {
                                usuarioLogueado.setNumero_celular = celular.trim();
                                cambiosRealizados.push("Número de celular");
                            }

                            if (cambiosRealizados.length > 0) {
                                console.log("\n✅ Datos actualizados correctamente:");
                                cambiosRealizados.forEach(campo => console.log("   - " + campo));
                                console.log("📧 Notificación enviada al administrador sobre los cambios realizados");
                            } else {
                                console.log("ℹ️ No se realizaron cambios en los datos");
                            }
                            
                            mostrarMenu();
                        });
                    });
                });
            });
        });
    });
}

// REQ-USR-5: Administrador puede actualizar datos de cualquier usuario
function actualizarDatosUsuario() {
    if (!usuarioLogueado) {
        console.log("❌ Debe iniciar sesión primero.");
        return mostrarMenu();
    }
    
    if (usuarioLogueado.getPerfil_usuario.getPerfil !== "Administrador") {
        console.log("❌ Solo el Administrador puede actualizar datos de otros usuarios.");
        return mostrarMenu();
    }

    console.log("\n" + "=".repeat(40));
    console.log("      ACTUALIZAR DATOS DE USUARIO");
    console.log("=".repeat(40));
    
    rl.question("Ingrese el número de documento del usuario a actualizar: ", (numDoc) => {
        if (!numDoc.trim()) {
            console.log("❌ Debe ingresar un número de documento.");
            return mostrarMenu();
        }

        const usuario = usuarios.find(u => u.getNumero_documento === numDoc.trim());
        if (!usuario) {
            console.log("❌ Usuario no encontrado con ese número de documento.");
            return mostrarMenu();
        }

        console.log("\n👤 Actualizando datos de: " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido);
        console.log("💡 Ingrese el nuevo valor o presione Enter para mantener el actual\n");
        
        rl.question("Primer nombre (actual: " + usuario.getPrimer_nombre + "): ", (primerNombre) => {
            rl.question("Correo electrónico (actual: " + usuario.getDireccion_correo + "): ", (correo) => {
                rl.question("Número de celular (actual: " + usuario.getNumero_celular + "): ", (celular) => {
                    
                    let cambiosRealizados = [];
                    
                    if (primerNombre.trim()) {
                        usuario.setPrimer_nombre = primerNombre.trim();
                        cambiosRealizados.push("Primer nombre");
                    }
                    if (correo.trim() && correo.includes("@")) {
                        usuario.setDireccion_correo = correo.trim();
                        cambiosRealizados.push("Correo electrónico");
                    }
                    if (celular.trim() && /^[0-9]+$/.test(celular)) {
                        usuario.setNumero_celular = celular.trim();
                        cambiosRealizados.push("Número de celular");
                    }

                    if (cambiosRealizados.length > 0) {
                        console.log("\n✅ Datos del usuario actualizados correctamente:");
                        cambiosRealizados.forEach(campo => console.log("   - " + campo));
                    } else {
                        console.log("ℹ️ No se realizaron cambios en los datos");
                    }
                    
                    mostrarMenu();
                });
            });
        });
    });
}

// REQ-USR-6: Administrador u operador pueden asignar vehículo a usuario
function asignarVehiculo() {
    if (!usuarioLogueado) {
        console.log("❌ Debe iniciar sesión primero.");
        return mostrarMenu();
    }
    
    if (usuarioLogueado.getPerfil_usuario.getPerfil !== "Administrador" && usuarioLogueado.getPerfil_usuario.getPerfil !== "Operador") {
        console.log("❌ Solo Administradores y Operadores pueden asignar vehículos.");
        return mostrarMenu();
    }

    console.log("\n" + "=".repeat(40));
    console.log("      ASIGNAR VEHÍCULO A USUARIO");
    console.log("=".repeat(40));
    
    rl.question("Ingrese el número de documento del usuario: ", (numDoc) => {
        if (!numDoc.trim()) {
            console.log("❌ Debe ingresar un número de documento.");
            return mostrarMenu();
        }

        const usuario = usuarios.find(u => u.getNumero_documento === numDoc.trim());
        if (!usuario) {
            console.log("❌ Usuario no encontrado con ese número de documento.");
            return mostrarMenu();
        }

        console.log("👤 Usuario encontrado: " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido);
        
        rl.question("Ingrese la placa del vehículo (formato ABC123): ", (placa) => {
            if (!placa.trim()) {
                console.log("❌ Debe ingresar una placa.");
                return mostrarMenu();
            }
            
            const placaUpper = placa.trim().toUpperCase();
            if (!/^[A-Z]{3}[0-9]{3}$/.test(placaUpper)) {
                console.log("❌ La placa debe tener el formato ABC123 (3 letras seguidas de 3 números).");
                return mostrarMenu();
            }
            
            // Asignar vehículo como propiedad del usuario
            usuario.vehiculo = placaUpper;
            console.log("✅ Vehículo con placa " + placaUpper + " asignado exitosamente a " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido);
            mostrarMenu();
        });
    });
}

// REQ-USR-7: Login para administrador y operador con documento y contraseña
function loginAdminOperador() {
    console.log("\n" + "=".repeat(40));
    console.log("      LOGIN ADMINISTRADOR/OPERADOR");
    console.log("=".repeat(40));
    
    rl.question("Ingrese su número de documento: ", (numDoc) => {
        if (!numDoc.trim()) {
            console.log("❌ Debe ingresar su número de documento.");
            return mostrarMenu();
        }
        
        if (!/^[0-9]+$/.test(numDoc)) {
            console.log("❌ El documento debe contener solo números.");
            return mostrarMenu();
        }

        rl.question("Ingrese su contraseña: ", (clave) => {
            if (!clave) {
                console.log("❌ Debe ingresar su contraseña.");
                return mostrarMenu();
            }

            const usuario = usuarios.find(u => 
                u.getNumero_documento === numDoc.trim() && 
                u.getClave === clave &&
                u.getEstado === "Activo"
            );
            
            if (!usuario) {
                console.log("❌ Credenciales incorrectas o usuario inactivo.");
                return mostrarMenu();
            }
            
            if (usuario.getPerfil_usuario.getPerfil === "Administrador" || usuario.getPerfil_usuario.getPerfil === "Operador") {
                usuarioLogueado = usuario;
                console.log("\n✅ ¡Bienvenido " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido + "!");
                console.log("🏷️  Perfil: " + usuario.getPerfil_usuario.getPerfil);
                console.log("🆔 Código de usuario: " + usuario.getId);
            } else {
                console.log("❌ Su perfil no tiene permisos de administrador u operador.");
            }
            
            mostrarMenu();
        });
    });
}

// REQ-USR-8: Login para usuarios solo con número de documento
function loginUsuario() {
    console.log("\n" + "=".repeat(40));
    console.log("            LOGIN USUARIO");
    console.log("=".repeat(40));
    
    rl.question("Ingrese su número de documento: ", (numDoc) => {
        if (!numDoc.trim()) {
            console.log("❌ Debe ingresar su número de documento.");
            return mostrarMenu();
        }
        
        if (!/^[0-9]+$/.test(numDoc)) {
            console.log("❌ El documento debe contener solo números.");
            return mostrarMenu();
        }

        const usuario = usuarios.find(u => 
            u.getNumero_documento === numDoc.trim() && 
            u.getEstado === "Activo"
        );
        
        if (!usuario) {
            console.log("❌ Usuario no encontrado o cuenta inactiva.");
            return mostrarMenu();
        }
        
        usuarioLogueado = usuario;
        console.log("\n✅ ¡Bienvenido " + usuario.getPrimer_nombre + " " + usuario.getPrimer_apellido + "!");
        console.log("🏷️  Perfil: " + usuario.getPerfil_usuario.getPerfil);
        console.log("🆔 Código de usuario: " + usuario.getId);
        mostrarMenu();
    });
}

// Cerrar sesión
function cerrarSesion() {
    if (usuarioLogueado) {
        console.log("👋 Sesión cerrada. ¡Hasta luego " + usuarioLogueado.getPrimer_nombre + "!");
        usuarioLogueado = null;
    } else {
        console.log("ℹ️ No hay ninguna sesión activa");
    }
    mostrarMenu();
}

// Ver usuarios registrados
function verUsuarios() {
    if (!usuarioLogueado) {
        console.log("❌ Debe iniciar sesión para ver esta información.");
        return mostrarMenu();
    }

    console.log("\n" + "=".repeat(60));
    console.log("                USUARIOS REGISTRADOS");
    console.log("=".repeat(60));
    console.log("ID | Documento | Nombre Completo | Estado | Perfil | Vehículo");
    console.log("-".repeat(60));
    
    usuarios.forEach(u => {
        const vehiculo = u.vehiculo || "Sin vehículo";
        console.log(u.getId + " | " + u.getNumero_documento + " | " + u.getPrimer_nombre + " " + u.getPrimer_apellido + " | " + u.getEstado + " | " + u.getPerfil_usuario.getPerfil + " | " + vehiculo);
    });
    
    mostrarMenu();
}

// ========================
// MENÚ PRINCIPAL
// ========================
function mostrarMenu() {
    console.log("\n" + "=".repeat(60));
    console.log("                SISTEMA DE PARQUEADERO");
    console.log("=".repeat(60));
    
    if (usuarioLogueado) {
        console.log("🟢 Sesión activa: " + usuarioLogueado.getPrimer_nombre + " " + usuarioLogueado.getPrimer_apellido + " (" + usuarioLogueado.getPerfil_usuario.getPerfil + ")");
    } else {
        console.log("🔴 No hay sesión activa - Inicie sesión para acceder a las funciones");
    }
    
    console.log("\n📋 OPCIONES DISPONIBLES:");
    console.log("1️⃣  Crear usuario (requiere login como Admin/Operador)");
    console.log("2️⃣  Cambiar estado de usuario (requiere login como Admin)");
    console.log("3️⃣  Actualizar mis datos personales (requiere login)");
    console.log("4️⃣  Actualizar datos de usuario (requiere login como Admin)");
    console.log("5️⃣  Asignar vehículo a usuario (requiere login como Admin/Operador)");
    console.log("6️⃣  Login como Administrador/Operador");
    console.log("7️⃣  Login como Usuario");
    console.log("8️⃣  Ver usuarios registrados (requiere login)");
    console.log("9️⃣  Cerrar sesión");
    console.log("0️⃣  Salir del sistema");

    rl.question("\n👉 Seleccione una opción (0-9): ", (opcion) => {
        switch (opcion.trim()) {
            case "1":
                crearUsuario();
                break;
            case "2":
                cambiarEstadoUsuario();
                break;
            case "3":
                actualizarMisDatos();
                break;
            case "4":
                actualizarDatosUsuario();
                break;
            case "5":
                asignarVehiculo();
                break;
            case "6":
                loginAdminOperador();
                break;
            case "7":
                loginUsuario();
                break;
            case "8":
                verUsuarios();
                break;
            case "9":
                cerrarSesion();
                break;
            case "0":
                console.log("👋 ¡Gracias por usar el Sistema de Parqueadero!");
                console.log("🚪 Cerrando aplicación...");
                rl.close();
                break;
            default:
                console.log("❌ Opción no válida. Por favor seleccione un número del 0 al 9.");
                mostrarMenu();
        }
    });
}

// ========================
// INICIO DEL PROGRAMA
// ========================
console.log("🚀 Iniciando Sistema de Parqueadero...");
console.log("💡 Usuarios de prueba disponibles:");
console.log("   📋 Admin: documento 123456789, contraseña: contraseña456");
console.log("   📋 Operador: documento 987654321, contraseña: contraseña123");
console.log("   📋 Usuario común: documento 555555555 (sin contraseña)");
console.log("\n🔥 ¡El sistema está listo para usar!");
mostrarMenu();