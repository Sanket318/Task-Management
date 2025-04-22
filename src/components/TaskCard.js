import React, { useState, useRef } from 'react';

function TaskCard({ task, onDragStart, onStatusChange }) {
  const [touchStart, setTouchStart] = useState(null);
  const cardRef = useRef(null);
  const originalPosition = useRef(null);
  
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

  // Handle touch events for mobile drag-and-drop
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
    
    // Store original position
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      originalPosition.current = {
        x: rect.left,
        y: rect.top
      };
      
      // Add visual feedback
      cardRef.current.style.opacity = '0.8';
      cardRef.current.style.transform = 'scale(1.05)';
      cardRef.current.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    }
  };

  const handleTouchMove = (e) => {
    if (!touchStart || !cardRef.current) return;
    
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    
    // Calculate the difference from the start position
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Update card position
    cardRef.current.style.position = 'fixed';
    cardRef.current.style.left = `${originalPosition.current.x + deltaX}px`;
    cardRef.current.style.top = `${originalPosition.current.y + deltaY}px`;
    cardRef.current.style.zIndex = '1000';
  };

  const handleTouchEnd = (e) => {
    if (!cardRef.current) return;
    
    // Reset card styles
    cardRef.current.style.position = '';
    cardRef.current.style.left = '';
    cardRef.current.style.top = '';
    cardRef.current.style.zIndex = '';
    cardRef.current.style.opacity = '';
    cardRef.current.style.transform = '';
    cardRef.current.style.boxShadow = '';
    
    // Detect which column we're over
    const columns = document.querySelectorAll('.task-column');
    const touch = e.changedTouches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    let newStatus = null;
    
    columns.forEach(column => {
      const rect = column.getBoundingClientRect();
      if (
        touchX >= rect.left && 
        touchX <= rect.right && 
        touchY >= rect.top && 
        touchY <= rect.bottom
      ) {
        // Get status from the column's header
        const statusHeader = column.previousElementSibling;
        if (statusHeader && statusHeader.textContent) {
          const statusText = statusHeader.textContent.trim().split(' ')[0];
          if (['To Do', 'In Progress', 'Done'].includes(statusText)) {
            newStatus = statusText;
          }
        }
      }
    });
    
    // If we found a valid status and it's different from current status
    if (newStatus && newStatus !== task.status) {
      onStatusChange(task.id, newStatus);
    }
    
    // Reset touch state
    setTouchStart(null);
  };

  return (
    <div 
      ref={cardRef}
      className="card mb-2 task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-task-id={task.id}
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