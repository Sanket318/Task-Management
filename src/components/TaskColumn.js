import React from 'react';
import TaskCard from './TaskCard';

function TaskColumn({ status, tasks, onDragStart, onDragOver, onDrop }) {
  return (
    <div 
      className="col-md-4" 
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            {status} 
            <span className="badge bg-secondary ms-2">{tasks.length}</span>
          </h5>
        </div>
        <div className="card-body task-column">
          {tasks.length === 0 ? (
            <p className="text-muted text-center">No tasks</p>
          ) : (
            tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDragStart={onDragStart} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskColumn;