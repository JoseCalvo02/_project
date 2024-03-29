$(document).ready(function() {
    var consultIDproject = new URLSearchParams(window.location.search);
    var ProjectID = consultIDproject.get('id');

    $("#Borrar").click(function() {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el proyecto y sus tareas relacionadas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff7782',
            cancelButtonColor: '#6380ec',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Si el usuario confirma, hacer la petición de eliminación
                $.ajax({
                    url: `/deleteProjects?id=${encodeURIComponent(ProjectID)}`,
                    type: 'DELETE',
                    success: function(response) {
                        console.log("Proyecto eliminado exitosamente:", response);
                        Swal.fire(
                            'Eliminado',
                            'El proyecto y sus tareas relacionadas han sido eliminadas.',
                            'success'
                        )
                        window.close();
                        // Reload the parent window/tab
                        window.opener.location.reload();

                        window.location.href = '../../Views/Home/index.html';
                    },
                    error: function(error) {
                        console.error("Error al eliminar el proyecto:", error);
                        Swal.fire(
                            'Error',
                            'Ha ocurrido un error al intentar eliminar el proyecto.',
                            'error'
                        );
                    }
                });
            }
            // Llama a la función fillProjects para llenar los proyectos al cargar la página
            fillProjects();
        });
    });
});
