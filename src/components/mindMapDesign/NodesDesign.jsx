import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function NodesDesign({ id, data }) {
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);

  const [checked, setChecked] = useState(false);

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

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  return (
    <>
      <div className='node-design bg-orange-300 pl-4 pr-12 min-w-40 min-h-32  flex items-center z-10'>

        <div className="dragHandle flex items-center ml-2 mr-4 for-checkbox">
          <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={toggleCheckbox}
          />
          <label
            className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
            onClick={toggleCheckbox}
          >
            {checked && (
              <svg
                className="w-4 h-4 text-orange-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </label>
        </div>

        <div className='flex flex-col justify-center items-center mx-auto flex-grow-1 cursor-text max-w-64 overflow-hidden'>
          {isEditingTaskName ? (
            <div className='relative '>
            <input
              type='text'
              value={taskName}
              onChange={handleTaskNameChange}
              onBlur={handleInputBlur}
              onKeyDown={(e) => handleInputKeyPress(e, setIsEditingTaskName)}
              className='block w-40 px-3 pt-7 bg-transparent focus:outline-none text-center text-4xl font-semibold text-gray-600'
              autoFocus
            />
            <label
            className={'absolute left-3 top-0 transition-all duration-300 -translate-y-0 text-lg text-gray-600'}
            >
              TaskName
            </label>
          </div>
          ) : (
            <div className='font-bold text-4xl text-white overflow-hidden text-ellipsis whitespace-nowrap' onDoubleClick={handleTaskNameDoubleClick}>
              {taskName}
            </div>
          )}
          {isEditingDeadline ? (
            <div className='relative'>
              <input
                type='date'
                value={deadline}
                onChange={handleDeadlineChange}
                onBlur={handleInputBlur}
                onKeyDown={(e) => handleInputKeyPress(e, setIsEditingDeadline)}
                className='block w-full px-3 pt-6 bg-transparent focus:outline-none text-xl font-semibold text-gray-600'
                autoFocus
              />
              <label
              className={'absolute left-3 top-0 transition-all duration-300 -translate-y-0 text-lg text-gray-600'}
              >
                Deadline
              </label>
            </div>

          ) : (
            <div className='font-semibold text-xl text-white overflow-hidden text-ellipsis whitespace-nowrap' onDoubleClick={handleDeadlineDoubleClick}>
              {deadline}
            </div>
          )}
        </div>
      </div>
      <Handle type='target' position={Position.Top} className='top-1/2 pointer-events-none' />
      <Handle type='source' position={Position.Bottom} className='top-0 left-0 transform-none opacity-0 bg-orange-400 h-full w-full rounded-[2px] border-none'
      />
    </>
  );
}