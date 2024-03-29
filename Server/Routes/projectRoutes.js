const express = require('express');
const router = express.Router();
const projectController = require('../../Controllers/Projects/projectController');

//Ruta POST para agregar un nuevo proyecto a la base de datos
router.post('/registerProject', async (req, res) => {
    const { projectName, description, dueDate } = req.body;

    try {
        const { userId } = req.session; // Obtener el userId del usuario desde la sesión después de iniciar sesión

        if (!userId) {
            return res.redirect('/'); // Redirigir al formulario de inicio de sesión si el usuario no ha iniciado sesión
        }

        // Pasar el userId como un argumento adicional a la función
        await projectController.registerProject(res, userId, projectName, description, dueDate);

    } catch (error) {
        console.error('Error al registrar el proyecto:', error);
        res.status(500).json({ message: 'Se produjo un error al registrar el proyecto' });
    }
});

// Ruta GET para obtener los proyectos
router.get('/getProjects', async (req, res) => {
    try {
        const userId = req.session.userId; // Obtener el userId del usuario desde la sesión después de iniciar sesión

        if (!userId) {
            return res.redirect('/'); // Redirigir al formulario de inicio de sesión si el usuario no ha iniciado sesión
        }

        // Llamar a la función getProjectsFromDatabase pasando el userId
        const projects = await projectController.getProjectsFromDatabase(userId);
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        res.status(500).json({ message: 'Error al obtener los proyectos' });
    }
});


// Ruta GET para eliminar los proyectos
router.delete('/deleteProjects', async (req, res) => {
    try {
        const { userId } = req.session;// Obtener el userId del usuario desde la sesión después de iniciar sesión

        if (!userId) {
            // Si el usuario no ha iniciado sesión, enviar una respuesta de error
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        const projectId = req.query.id;
        // Llamar a la función getProjectsFromDatabase pasando el userId
        const confirmation = await projectController.DeleteProject(req,res,userId,projectId);
        res.status(200).json(confirmation);
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        res.status(500).json({ message: 'Error al obtener al eliminar el proyecto' });
    }
});

// Ruta POST para crear tareas para los proyectos
router.post('/CreateProjectTask', async (req, res) => {
    try {
        const { taskName, selectedTag ,idProyecto} = req.body;
        const { userId } = req.session; // Obtener el userId del usuario desde la sesión después de iniciar sesión

        if (!userId) {
            return res.redirect('/'); // Redirigir al formulario de inicio de sesión si el usuario no ha iniciado sesión
        }

        await projectController.AddTaskProject(
            req,
            res,
            userId,
            idProyecto,
            taskName,
            selectedTag,
            "1"
        );
    } catch (error) {
        console.error('Error al registrar la tarea', error);
        res.status(500).json({ message: 'Se produjo un error al registrar la tarea' });
    }
});

// Ruta GET para obtener las tareas de los proyectos
router.get('/getProjectTasks', async(req, res) => {
    try {
        // Obtener el userId del usuario desde la sesión después de iniciar sesión
        const { userId } = req.session;
        if (!userId) {
            return res.redirect('/'); // Redirigir al formulario de inicio de sesión si el usuario no ha iniciado sesión
        }

        const projectId = req.query.id; //Recibe como parametro el ID del proyecto seleccionado desde la URL

        // Llamar a la función GetTaskProject pasando el userId
        const { tasks, taskCounts } = await projectController.GetTaskProject(req, res, userId, projectId);

        // Devolver las tareas y los totales de tareas por categoría de prioridad en la respuesta JSON
        res.status(200).json({ tasks, taskCounts });
    } catch (error) {
        console.error('Error al obtener los las tareas del proyecto:', error);
        res.status(500).json({ message: 'Error al obtener las tareas del proyecto' });
    }
});

// Ruta PUT para modificar las columnas de los proyectos
router.put('/saveTaskPosition', async (req, res) => {
    try {
        const { userId } = req.session;

        if (!userId) {
            return res.redirect('/'); // Redirigir al formulario de inicio de sesión si el usuario no ha iniciado sesión
        }

        const projectId = req.query.id;
        const { taskId, columnIndex  } = req.body;

        const thisMovement = await projectController.SaveTaskMovement(userId, projectId, taskId, columnIndex);
        res.status(200).json(thisMovement);
    } catch (error) {
        console.error('Error al guardar el movimiento de tarea:', error);
        res.status(500).json({ message: 'Error al guardar el movimiento de tarea:' });
    }
});

// Ruta DELETE para eliminar las tareas de los proyectos
router.delete('/DeleteTask', async (req, res) => {
    try {
        const { userId } = req.session;

        if (!userId) {
            return res.redirect('/'); // Redirigir al formulario de inicio de sesión si el usuario no ha iniciado sesión
        }

        const projectId = req.query.id; // Obtiene el ID del proyecto de la URL (parámetro de consulta)
        const taskId = req.query.taskId; // Obtén el taskId de la URL (parámetro de consulta)
        console.log(projectId);
        console.log(taskId);

        const thisMovement = await projectController.DeleteTask(userId, projectId, taskId);
        res.status(200).json(thisMovement);
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).json({ message: 'Error al eliminar la tarea:' });
    }
});

router.get('/getAllTask', async (req, res) => {
    try {
        // Obtener el userId del usuario desde la sesión después de iniciar sesión
        const { userId } = req.session;
        if (!userId) {
            return res.redirect('/'); // Redirigir al formulario de inicio de sesión si el usuario no ha iniciado sesión
        }

        // Llamar a la función GetAllTaskUser pasando el userId
        const allTask = await projectController.AllTaskUser(req,res,userId);
        res.status(200).json(allTask);
    } catch (error) {
        console.error('Error al obtener todas las tareas:', error);
        res.status(500).json({ message: 'Error al obtener todas las tareas' });
    }
});

// Exporta el enrutador
module.exports = router;