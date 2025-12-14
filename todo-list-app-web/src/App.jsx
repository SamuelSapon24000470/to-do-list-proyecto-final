import { FaHome, FaBuilding, FaBriefcase } from "react-icons/fa";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Trabajo");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

  const addTask = () => {
    if (!title || !description) return;

    const newTask = {
      id: Date.now(),
      title,
      description,
      type,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle("");
    setDescription("");
    setType("Trabajo");
    setShowForm(false);
  };

  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;

  return (
    <div className="app-container">
      <h1 className="app-title">To-Do-List</h1>
      <p className="app-subtitle">
        Gestiona tus tareas de forma simple y rápida
      </p>
      <br />
      {/* RESUMEN */}
      <div className="summary">
          <div className="summary-row">
          <div className="summary-left">
            <FaCheckCircle className="summary-icon completed" />
            <span>Tareas completadas</span>
          </div>
          <span className="summary-number">{completed}</span>
        </div>

        <div className="summary-row">
          <div className="summary-left">
            <FaClock className="summary-icon pending" />
            <span>Tareas pendientes</span>
          </div>
          <span className="summary-number">{pending}</span>
        </div>
      </div>



      {/* BOTÓN AGREGAR */}
      <button className="add-task-btn" onClick={() => setShowForm(true)}>
        Agregar tarea
      </button>

      {/* LISTA DE TAREAS AGRUPADA */}
        <div className="tasks-container">
          <h2 className="tasks-title">Lista de tareas</h2>

          {[
            { name: "Casa", icon: <FaHome /> },
            { name: "Trabajo", icon: <FaBuilding /> },
            { name: "Negocios", icon: <FaBriefcase /> },
          ].map((category) => {
            const tasksByType = tasks.filter(
              (task) => task.type === category.name
            );

            return (
              <div key={category.name} className="task-group">
                <h3 className="task-group-title">
                  <span className="category-icon">
                    {category.icon}
                  </span>
                  {category.name}
                </h3>

                {tasksByType.length === 0 ? (
                  <p className="empty-text">
                    No hay tareas registradas
                  </p>
                ) : (
                  tasksByType.map((task) => (
                    <div
                      key={task.id}
                      className="task-item"
                      onClick={() => setSelectedTask(task)}
                    >
                      <span className="task-name">
                        {task.title}
                      </span>

                      <span
                        className={`task-status ${
                          task.completed ? "done" : ""
                        }`}
                      >
                        {task.completed ? "Completada" : "Pendiente"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>



      {/* MODAL DETALLES */}
      {selectedTask && (
  <div className="modal-overlay">
    <div className="modal details-modal">

      <div className="modal-header">
        <h2>{selectedTask.title}</h2>
        <span
          className={`status-badge ${
            selectedTask.completed ? "done" : "pending"
          }`}
        >
          {selectedTask.completed ? "Completada" : "Pendiente"}
        </span>
      </div>

      <div className="modal-section">
        <h4>Descripción</h4>
        <p className="modal-description">
          {selectedTask.description}
        </p>
      </div>

      <div className="modal-info">
        <div>
          <strong>Tipo:</strong> {selectedTask.type}
        </div>
        <div>
          <strong>Estado:</strong>{" "}
          {selectedTask.completed ? "Completada" : "Pendiente"}
        </div>
      </div>

      {/* BOTONES */}
      <div className="modal-actions">
        {!selectedTask.completed && (
          <button
            className="complete-btn"
            onClick={() => {
              setTasks(
                tasks.map(t =>
                      t.id === selectedTask.id
                        ? { ...t, completed: true }
                        : t
              ));
              setSelectedTask(null);
            }}
          >
            Tarea completada
          </button>
        )}

        <button
          className="delete-btn"
          onClick={() => {
            setTasks(tasks.filter(t => t.id !== selectedTask.id));
            setSelectedTask(null);
          }}
        >
          Eliminar tarea
        </button>
      </div>

      <button
        className="close-btn"
        onClick={() => setSelectedTask(null)}
      >
        Cerrar
      </button>

    </div>
  </div>
)}


      {/* MODAL FORMULARIO */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nueva tarea</h2>

            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Trabajo">Trabajo</option>
              <option value="Casa">Casa</option>
              <option value="Negocios">Negocios</option>
            </select>

            <div className="modal-actions">
              
              <button
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>

              <button onClick={addTask}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
