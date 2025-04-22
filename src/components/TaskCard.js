import React from 'react';

function TaskCard({ task, onDragStart }) {
  // Determine badge color based on status
  const getBadgeColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'bg-secondary';
      case 'In Progress':
        return 'bg-primary';
      case 'Done':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div 
      className="card mb-2 task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="card-body">
        <h6 className="card-title">{task.title}</h6>
        {task.description && (
          <p className="card-text small text-muted">{task.description}</p>
        )}
        <span className={`badge ${getBadgeColor(task.status)}`}>
          {task.status}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;