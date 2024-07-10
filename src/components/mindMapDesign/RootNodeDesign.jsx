import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import {ProjectIcons} from '@/components/projectIcons/ProjectIcons'

// Nodeの見た目を調整する

export default function RootNodeDesign({ id, data }) {
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
        <div className='nodeDesign bg-white rounded-full pl-4 pr-12 aspect-square flex items-center z-10'>
          {/* <div className='dragHandle bg-transparent w-10 h-full flex items-center'>
            <svg viewBox='0 0 24 24'>
              <path
                fill='#333'
                stroke='#333'
                strokeWidth='1'
                d='M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z'
              />
            </svg>
          </div> */}

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


          <div className='flex flex-col justify-center items-center mx-auto flex-grow-1  w-60 overflow-hidden'>
            <ProjectIcons className="h-36 w-36 fill-orange-300" type=""/>
            {isEditingTaskName ? (
              <div className='relative cursor-text'>
              <input
                type='text'
                value={taskName}
                onChange={handleTaskNameChange}
                onBlur={handleInputBlur}
                onKeyDown={(e) => handleInputKeyPress(e, setIsEditingTaskName)}
                className='block w-56 px-3 pt-4 focus:outline-none text-center text-6xl font-bold text-gray-500'
                autoFocus
              />
              <label
              className={'absolute left-3 top-0 transition-all duration-300 -translate-y-0 text-xl text-gray-500'}
              >TaskName</label>
            </div>
            ) : (
              <div className='font-bold text-6xl text-orange-300 cursor-text overflow-hidden text-ellipsis whitespace-nowrap' onDoubleClick={handleTaskNameDoubleClick}>
                {taskName}
              </div>
            )}
            {isEditingDeadline ? (
              <div className='relative cursor-text'>
              <input
                type='date'
                value={deadline}
                onChange={handleDeadlineChange}
                onBlur={handleInputBlur}
                onKeyDown={(e) => handleInputKeyPress(e, setIsEditingDeadline)}
                className='block w-full px-3 pt-8 focus:outline-none text-2xl font-bold text-gray-500'
                autoFocus
              />
              <label
              className={'absolute left-3 top-0 transition-all duration-300 -translate-y-0 text-lg text-gray-500'}
              >Deadline</label>
            </div>
            ) : (
              <div className='font-semibold text-2xl text-orange-300 cursor-text overflow-hidden text-ellipsis whitespace-nowrap' onDoubleClick={handleDeadlineDoubleClick}>
                {deadline}
              </div>
            )}
          </div>
        </div>
        

        {/* HandleとはEdgeを生やす点 */}
        {/* <Handle type="target" position={Position.Top} /> */}
        <Handle type="source" position={Position.Bottom} />
      </>
        
    );
  }