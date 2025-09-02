# ParkingLot

## Descripción general

ParkingLot es un sistema de gestión de parqueadero desarrollado en Node.js, orientado a la administración de usuarios, vehículos, celdas, accesos, salidas, incidencias y reportes. El proyecto simula la lógica de un parqueadero moderno, permitiendo registrar entradas y salidas de vehículos, controlar la ocupación de celdas, gestionar usuarios y sus perfiles, aplicar restricciones de pico y placa, y reportar incidencias ocurridas en el parqueadero.

## Tecnologías usadas

- Node.js (ES Modules)
- JavaScript
- readline (interfaz de consola)

## Instalación

1. Clona el repositorio:
	 ```bash
	 git clone https://github.com/nicolzapata/ParkingLot.git
	 ```
2. Accede al directorio del proyecto:
	 ```bash
	 cd ParkingLot
	 ```
3. Instala Node.js si no lo tienes instalado.
4. Ejecuta el sistema desde la terminal, por ejemplo:
	 ```bash
	 node Control_usuario.js
	 ```
	 O cualquier otro archivo principal según el módulo que desees probar.

## Ejemplo de uso

- **Gestión de usuarios:**
	- Crear, editar y consultar usuarios con diferentes perfiles (Administrador, Operador, Usuario).
- **Gestión de vehículos:**
	- Registrar vehículos, consultar información y asociarlos a usuarios.
- **Control de celdas:**
	- Asignar vehículos a celdas, consultar ocupación y liberar espacios.
- **Acceso y salidas:**
	- Registrar entradas y salidas de vehículos, calcular tiempo de estadía.
- **Incidencias:**
	- Reportar y consultar incidencias como rayones, choques, atropellamientos, etc.
- **Restricciones pico y placa:**
	- Aplicar restricciones de acceso según el día y tipo de vehículo.

Ejemplo básico para iniciar el sistema de usuarios:
```bash
node Control_usuario.js
```

Sigue las instrucciones en consola para interactuar con el sistema.

---

Desarrollado por nicolzapata.
