document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    cargarTabla();
    document.getElementById("txtNombre").onkeyup = e => revisarControl(e, 2, 60);
    document.getElementById("txtTelefono").onkeyup = e => {
        if (e.target.value.trim().length > 0)
            revisarControl(e, 10, 10);
    }
    document.getElementById("txtTelefono").addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    document.getElementById("txtPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
        validarContrasenia();
    }
    document.getElementById("txtConfirmarPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
        validarContrasenia();
    }
    document.getElementById("txtEmail").onblur = e => {
        validarCorreo();
    }

    document.getElementById("btnLimpiar").addEventListener("click", e => {
        e.target.form.classList.remove("validado");
        let controles = e.target.form.querySelectorAll("input,select");
        controles.forEach(control => {
            control.classList.remove("valido");
            control.classList.remove("novalido");
        });
    });
    document.getElementById("btnAceptar").addEventListener("click", e => {
        let alert = e.target.parentElement.querySelector(".alert");
        if (alert) {
            alert.remove();
        }

        e.target.form.classList.add("validado");
        let txtNombre = document.getElementById("txtNombre");
        let txtContrasenia = document.getElementById("txtPassword");
        let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
        let txtEmail = document.getElementById("txtEmail");
        let txtTel = document.getElementById("txtTelefono");
        txtNombre.setCustomValidity("");
        txtContrasenia.setCustomValidity("");
        txtContrasenia2.setCustomValidity("");
        txtEmail.setCustomValidity("");
        txtTel.setCustomValidity("");

        if (txtNombre.value.trim().length < 2 ||
            txtNombre.value.trim().length > 60) {
            txtNombre.setCustomValidity("El nombre es obligatorio (entre 2 y 60 caracteres)");
        }
        if (txtContrasenia.value.trim().length < 6 ||
            txtContrasenia.value.trim().length > 20) {
            txtContrasenia.setCustomValidity("La contraseña es obligatoria (entre 2 y 60 caracteres)");
        }
        if (txtContrasenia2.value.trim().length < 6 ||
            txtContrasenia2.value.trim().length > 20) {
            txtContrasenia2.setCustomValidity("Confirma la contraseña");
        }

        if (txtTel.value.trim().length > 0 && txtTel.value.trim().length != 10) {
            txtTel.setCustomValidity("El teléfono debe tener 10 dígitos");
        }

        if (e.target.form.checkValidity()) {
            validarCorreo();
            if (!validarContrasenia()) {
                e.preventDefault();
                return;
            }
            let correo = document.getElementById("txtEmail").value.trim();
            if (!correo.endsWith('@gmail.com')) {
                mostrarAlerta('El correo debe ser de Gmail');
                e.preventDefault();
                return;
            }

            let usuario = {
                nombre: txtNombre.value.trim(),
                correo: correo,
                contrasenia: txtContrasenia.value.trim(),
                telefono: txtTel.value.trim()
            };

            let usuarios = JSON.parse(localStorage.getItem("usuarios"));
            if (document.querySelector("#mdlRegistro .modal-title").innerText == 'Agregar') {
                let usuarioEncontrado = usuarios.find((element) => usuario.correo == element.correo);
                if (usuarioEncontrado) {
                    mostrarAlerta('Este correo ya se encuentra registrado, favor de usar otro');
                    e.preventDefault();
                    return;
                }
                usuarios.push(usuario);
            } else {
                if (usuario.correo != correo) {
                    let usuarioEncontrado = usuarios.find((element) => usuario.correo == element.correo);
                    if (usuarioEncontrado) {
                        mostrarAlerta('Este correo ya se encuentra registrado, favor de usar otro');
                        e.preventDefault();
                        return;
                    }
                }
            }
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        } else {
            e.preventDefault();
        }
    });

    document.getElementById("mdlRegistro").addEventListener('shown.bs.modal', (e) => {
        document.getElementById("btnLimpiar").click();
        let operacion = e.relatedTarget.innerText;
        e.target.querySelector(".modal-title").innerText = operacion;

        if (operacion == 'Editar') {
            let correo = e.relatedTarget.value;
            let usuarios = JSON.parse(localStorage.getItem('usuarios'));
            let usuario = usuarios.find((element => element.correo == correo));
            document.getElementById("txtNombre").value = usuario.nombre;
            document.getElementById("txtEmail").value = usuario.correo;
            document.getElementById("txtCorreoOriginal").value = usuario.correo;
            document.getElementById("txtTelefono").value = usuario.telefono;
        }
        document.getElementById("txtNombre").focus();
    });

    document.getElementById("btnEliminar").onclick = function () {
        let correo = document.getElementById("txtCorreoEliminar").value;
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        let index = usuarios.findIndex((element => element.correo == correo));
        if (index !== -1) {
            usuarios.splice(index, 1);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            cargarTabla();
        }
    };

    document.getElementById("btnRestablecer").onclick = function () {
        let correo = document.getElementById("txtCorreoRestablecer").value;
        let nuevaContrasenia = document.getElementById("txtNuevaContrasenia").value.trim();
        let confirmarContrasenia = document.getElementById("txtConfirmarContrasenia").value.trim();
        if (nuevaContrasenia.length < 6 || nuevaContrasenia.length > 20) {
            mostrarAlerta('La contraseña debe tener entre 6 y 20 caracteres');
            return;
        }
        if (nuevaContrasenia !== confirmarContrasenia) {
            mostrarAlerta('Las contraseñas no coinciden');
            return;
        }
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        let usuario = usuarios.find((element => element.correo == correo));
        if (usuario) {
            usuario.contrasenia = nuevaContrasenia;
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            cargarTabla();
        }
    };

});

function revisarControl(e, min, max) {
    txt = e.target;
    txt.setCustomValidity("");
    txt.classList.remove("valido");
    txt.classList.remove("novalido");
    if (txt.value.trim().length < min ||
        txt.value.trim().length > max) {
        txt.setCustomValidity("Campo no válido");
        txt.classList.add("novalido");
    } else {
        txt.classList.add("valido");
    }
}

function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let tbody = document.querySelector("#tblUsuarios tbody");
    tbody.innerHTML = ""; // Limpiar el contenido existente de la tabla
    for (let i = 0; i < usuarios.length; i++) {
        let usuario = usuarios[i];
        let fila = document.createElement("tr");

        let celdaNombre = document.createElement("td");
        celdaNombre.innerText = usuario.nombre;
        fila.appendChild(celdaNombre);

        let celdaCorreo = document.createElement("td");
        celdaCorreo.innerText = usuario.correo;
        fila.appendChild(celdaCorreo);

        let celdaTelefono = document.createElement("td");
        celdaTelefono.innerText = usuario.telefono;
        fila.appendChild(celdaTelefono);

        let celdaBotonEditar = document.createElement("td");
        let botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.className = "btn btn-primary";
        botonEditar.dataset.bsToggle = "modal";
        botonEditar.dataset.bsTarget = "#mdlRegistro";
        botonEditar.value = usuario.correo;
        botonEditar.innerText = "Editar";
        botonEditar.onclick = function () {
            mostrarFormularioEditar(usuario.correo);
        };
        celdaBotonEditar.appendChild(botonEditar);
        fila.appendChild(celdaBotonEditar);

        let celdaBotonBorrar = document.createElement("td");
        let botonBorrar = document.createElement("button");
        botonBorrar.type = "button";
        botonBorrar.className = "btn btn-danger";
        botonBorrar.innerText = "Borrar";
        botonBorrar.onclick = function () {
            // Implementar la lógica para borrar el usuario
        };
        celdaBotonBorrar.appendChild(botonBorrar);
        fila.appendChild(celdaBotonBorrar);

        tbody.appendChild(fila);
    }
}

function mostrarFormularioEditar(correo) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let usuario = usuarios.find((element => element.correo == correo));
    if (usuario) {
        document.getElementById("txtNombre").value = usuario.nombre;
        document.getElementById("txtEmail").value = usuario.correo;
        document.getElementById("txtCorreoOriginal").value = usuario.correo;
        document.getElementById("txtTelefono").value = usuario.telefono;
    }
}

function mostrarAlerta(mensaje) {
    let alerta = document.createElement('div');
    alerta.innerHTML = mensaje + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    alerta.className = "alert alert-warning alert-dismissible fade show";
    let contenedorAlerta = document.getElementById("contenedorAlerta");
    contenedorAlerta.innerHTML = ""; // Limpiar alertas anteriores
    contenedorAlerta.appendChild(alerta);
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function inicializarDatos() {
    let usuarios = localStorage.getItem('usuarios');
    if (!usuarios) {
        usuarios = [
            {
                nombre: 'Uriel Perez Gomez',
                correo: 'uriel@gmail.com',
                contrasenia: '123456',
                telefono: ''
            },
            {
                nombre: 'Lorena Garcia Hernandez',
                correo: 'lorena@gmail.com',
                contrasenia: '567890',
                telefono: '4454577468'
            }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

function validarContrasenia() {
    let contrasenia = document.getElementById("txtPassword").value;
    let confirmarContrasenia = document.getElementById("txtConfirmarPassword").value;
    let mensaje = document.getElementById("mensajeContrasenia");

    if (contrasenia !== confirmarContrasenia) {
        mensaje.innerText = "Las contraseñas no coinciden";
        mensaje.style.color = "red";
        return false;
    } else {
        mensaje.innerText = "";
        return true;
    }
}

function validarCorreo() {
    let correo = document.getElementById("txtEmail").value.trim();
    let mensaje = document.getElementById("mensajeCorreo");

    if (!correo.endsWith('@gmail.com')) {
        mensaje.innerText = "El correo debe ser de Gmail";
        mensaje.style.color = "red";
        return false;
    } else {
        mensaje.innerText = "";
        return true;
    }
}
