import { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import {ProjectIcons} from '@/components/projectIcons/ProjectIcons'

// MindMap のZustandでの管理
import useMindMapStore from "@/util/store/mindMap";
import { shallow } from 'zustand/shallow';
import { theme_colors, done_colors } from '@/util/colors'; // theme_colorをJSファイルから利用する

// Nodeの見た目を調整する
export default function RootNodeDesign({ id, data }) {
  // zUstandでのステート管理
  const {colorId,updateNode} = useMindMapStore(
    (state) => ({
      colorId: state.colorId,
      updateNode: state.updateNode,
    }),
    shallow
  );
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [checked, setChecked] = useState(data.done);

  // zustandのState管理を行なう。
  const [taskName, setTaskName] = useState();
  const [deadline, setDeadline] = useState();

  useEffect(()=>{
    setTaskName(data.taskName);
    setDeadline(data.deadline);
  },[data])

  const handleTaskNameDoubleClick = () => {
    setIsEditingTaskName(true);
  };

  const handleDeadlineDoubleClick = () => {
    setIsEditingDeadline(true);
  };

  const handleInputBlur = () => {
    updateNode(id, taskName, deadline, checked)
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
      updateNode(id, taskName, deadline, checked)
      setIsEditing(false);
    }
  };

  const toggleCheckbox = () => {
    updateNode(id, taskName, deadline, !checked)
    setChecked(!checked);
  };


    return (
      <>
      {checked ? // done
        <div className='nodeDesign bg-done-color-bg rounded-full shadow-2xl pl-4 pr-12 aspect-square flex items-center z-10'>

          <div className="dragHandle flex items-center ml-2 mr-4 for-checkbox">
            <input
              type="checkbox"
              className="hidden"
              checked={checked}
              onChange={toggleCheckbox}
            />
            <label
              className="w-6 h-6 bg-white border-2 border-done-color-text rounded-full flex items-center justify-center cursor-pointer"
              onClick={toggleCheckbox}
            >
              {checked && (
                <svg
                  className="w-4 h-4 text-done-color-text"
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
            <ProjectIcons className={`dragHandle h-36 w-36 fill-done-color-text `} type=""/>
            {isEditingTaskName ? (
              <div className='relative cursor-text'>
              <input
                type='text'
                value={taskName}
                onChange={handleTaskNameChange}
                onBlur={handleInputBlur}
                onKeyDown={(e) => handleInputKeyPress(e, setIsEditingTaskName)}
                className='block w-56 px-3 pt-4 focus:outline-none text-center text-6xl font-bold text-done-color-text'
                autoFocus
              />
              <label
              className={'absolute left-3 top-0 transition-all duration-300 -translate-y-0 text-xl text-done-color-text'}
              >TaskName</label>
            </div>
            ) : (
              <div className={`font-bold text-6xl text-done-color-text cursor-text overflow-hidden text-ellipsis whitespace-nowrap`} onDoubleClick={handleTaskNameDoubleClick}>
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
                className='block w-full px-3 pt-8 focus:outline-none text-2xl font-bold text-done-color-text'
                autoFocus
              />
              <label
              className={'absolute left-3 top-0 transition-all duration-300 -translate-y-0 text-lg text-done-color-text'}
              >Deadline</label>
            </div>
            ) : (
              <div className={`font-semibold text-2xl text-done-color-text cursor-text overflow-hidden text-ellipsis whitespace-nowrap`} onDoubleClick={handleDeadlineDoubleClick}>
                {deadline}
              </div>
            )}
          </div>
        </div>
        : // not done
          <div className='nodeDesign bg-white rounded-full shadow-2xl pl-4 pr-12 aspect-square flex items-center z-10'>

            <div className="dragHandle flex items-center ml-2 mr-4 for-checkbox">
              <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={toggleCheckbox}
              />
              <label
                className="w-6 h-6 bg-white border-2 border-done-color-text rounded-full flex items-center justify-center cursor-pointer"
                onClick={toggleCheckbox}
              >
                {checked && (
                  <svg
                    className="w-4 h-4 text-done-color-text"
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
              <ProjectIcons className={`dragHandle h-36 w-36 `} style = {{fill : theme_colors[colorId]}} type=""/>
              {isEditingTaskName ? (
                <div className='relative cursor-text'>
                <input
                  type='text'
                  value={taskName}
                  onChange={handleTaskNameChange}
                  onBlur={handleInputBlur}
                  onKeyDown={(e) => handleInputKeyPress(e, setIsEditingTaskName)}
                  className={`block w-56 px-3 pt-4 focus:outline-none text-center text-6xl font-bold` }
                  style = {{color : theme_colors[colorId]}}
                  autoFocus
                />
                <label
                className={`absolute left-3 top-0 transition-all duration-300 -translate-y-0 text-xl `}
                style = {{color : theme_colors[colorId]}}
                >TaskName</label>
              </div>
              ) : (
                <div className={`font-bold text-6xl cursor-text overflow-hidden text-ellipsis whitespace-nowrap`} 
                style = {{color : theme_colors[colorId]}}
                onDoubleClick={handleTaskNameDoubleClick}>
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
                  className={`block w-full px-3 pt-8 focus:outline-none text-2xl font-bold `}
                  style = {{color : theme_colors[colorId]}}
                  autoFocus
                />
                <label
                  className={`absolute left-3 top-0 transition-all duration-300 -translate-y-0 text-lg `}
                  style = {{color : theme_colors[colorId]}}
                >Deadline</label>
              </div>
              ) : (
                <div className={`font-semibold text-2xl cursor-text overflow-hidden text-ellipsis whitespace-nowrap`} 
                style = {{color : theme_colors[colorId]}}
                onDoubleClick={handleDeadlineDoubleClick}>
                  {deadline}
                </div>
              )}
            </div>
          </div>
      }

        {/* HandleとはEdgeを生やす点 */}
        <Handle type="source" position={Position.Bottom} />
      </>
        
    );
  }