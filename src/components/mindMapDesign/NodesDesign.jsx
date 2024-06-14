import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function NodesDesign({ id, data }) {
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);

  // zustandのState管理を行なう。
  const [taskName, setTaskName] = useState(data.taskName);
  const [deadline, setDeadline] = useState(data.deadline);

  const handleTaskNameDoubleClick = () => {
    setIsEditingTaskName(true);
  };

  const handleDeadlineDoubleClick = () => {
    setIsEditingDeadline(true);
  };

  const handleInputBlur = () => {
    setIsEditingTaskName(false);
    setIsEditingDeadline(false);
  };

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleDeadlineChange = (event) => {
    setDeadline(event.target.value);
  };

  const handleInputKeyPress = (event, setIsEditing) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className='nodeDesign bg-orange-300 rounded-full pl-5 pr-4 min-w-72 min-h-24 flex items-center z-10'>
        <div className='dragHandle bg-transparent w-6 h-full flex items-center'>
          <svg viewBox='0 0 24 24'>
            <path
              fill='#333'
              stroke='#333'
              strokeWidth='1'
              d='M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z'
            />
          </svg>
        </div>
        <div className='flex flex-col justify-center items-center mx-auto flex-grow-1 cursor-text'>
          {isEditingTaskName ? (
            <input
              type='text'
              value={taskName}
              onChange={handleTaskNameChange}
              onBlur={handleInputBlur}
              onKeyDown={(e) => handleInputKeyPress(e, setIsEditingTaskName)}
              className='border-none p-0 px-0.5 rounded-sm font-bold bg-transparent h-full text-gray-900'
              autoFocus
            />
          ) : (
            <div className='font-semibold text-4xl text-white' onDoubleClick={handleTaskNameDoubleClick}>
              {taskName}
            </div>
          )}
          {isEditingDeadline ? (
            <input
              type='text'
              value={deadline}
              onChange={handleDeadlineChange}
              onBlur={handleInputBlur}
              onKeyDown={(e) => handleInputKeyPress(e, setIsEditingDeadline)}
              className='border-none p-0 px-0.5 rounded-sm font-bold bg-transparent h-full text-gray-900'
              autoFocus
            />
          ) : (
            <div className='text-sm text-white' onDoubleClick={handleDeadlineDoubleClick}>
              {deadline}
            </div>
          )}
        </div>
        <input type='checkbox' className='rounded-full h-5 w-5 ml-5' />
      </div>
      <Handle type='target' position={Position.Top} className='top-1/2 pointer-events-none' />
      <Handle
        type='source'
        position={Position.Bottom}
        className='top-0 left-0 transform-none opacity-0 bg-orange-400 h-full w-full rounded-[2px] border-none'
      />
    </>
  );
}