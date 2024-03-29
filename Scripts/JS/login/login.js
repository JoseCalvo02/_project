$(document).ready(function() {
    // Asignar el evento de submit al formulario de inicio de sesión
    $('#sign-in-form').submit(function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe automáticamente
        login(); // Llamar a la función de inicio de sesión
    });

    function login() {
        const userLogin = $('#userLogin').val();
        const passLogin = $('#passLogin').val();

        $.ajax({
            url: '/user/login', // Nueva ruta para el inicio de sesión
            method: 'POST',
            data: JSON.stringify({ userLogin, passLogin }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(response) {
                // Procesar la respuesta exitosa
                console.log(response);
                const userDetails = response.userDetails;
                localStorage.setItem('userDetails', JSON.stringify(userDetails));

                // Mostrar el nombre de usuario en el HTML
                $('#userNamePlaceholder').text(userDetails.username);

                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: '¡Bienvenido de nuevo ' + userDetails.username +"!",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    customClass: {
                        icon: 'swal-icon--success',
                        title: 'swal-title',
                        text: 'swal-text',
                        confirmButton: 'swal-button--confirm',
                    },
                }).then((result) => {
                    // Redirigir al usuario a la página principal después del inicio de sesión
                    window.location.href = '../../Views/Home/index.html?user=' + encodeURIComponent(JSON.stringify(userDetails));
                });
            },
            error: function(xhr, status, error) {
                console.log('XHR status:', xhr.status);
                console.log('XHR responseJSON:', xhr.responseJSON);

                // Mostrar un mensaje de error al usuario
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops..',
                    text: 'Credenciales incorrectas. Por favor, verifica tus datos.',
                    customClass: {
                        icon: 'swal-icon--error',
                        title: 'swal-title',
                        text: 'swal-text',
                        confirmButton: 'swal-button--confirm',
                    },
                });
            }
        });
    }
});