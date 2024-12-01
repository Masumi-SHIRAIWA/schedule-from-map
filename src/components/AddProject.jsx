import React, {useState} from 'react';
import Router from 'next/router';


export const AddProject = ({ addProject }) => {

    const [projectName, setProjectName] = useState(null)
    const [icon, setIcon] = useState(null)
    const [colorid, setColorId] = useState(0)
    const [deadline, setDeadline] = useState(null)

    const submitData = async (e) =>{
        e.preventDefault(); 
        // if state がどれかひとつでもNullなら 例外処理

        document.getElementById('projectNameForm').value='';
        document.getElementById('IconForm').value='';
        document.getElementById('colorIdForm').value='';
        document.getElementById('deadlineForm').value=''; 
        
        try{
            let result = await fetch('/api/addProject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({projectName, icon, colorid, deadline}),
            })
            .then(res => res.json())
            .then(data => {
                console.log("data in submit function in addPeoject.jsx", data);
                Router.push("/projects/[id]", `/projects/${data.id}`)
            });
        } catch (e){
            console.error(e);
        }
    }

    //--------------------------
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const generateProject = () => {
        alert('You\'ve completed to generate a new project.');
        setIsModalOpen(false);
    };

    const declinegenerating = () => {
        // alert('You declined to generating a new project.');
        setIsModalOpen(false);
    };
    
    return (
        <div>
            <button
                onClick={openModal}
                className="block text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
                プロジェクトを作成
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
                >
                    <div className="bg-white w-full max-w-maxModal mx-20 px-20 pt-8 pb-5 rounded-lg shadow-lg">
                        <h2 className="text-2xl my-4 font-semibold text-gray-900">
                            NEW PROJECT
                        </h2>
                        
                        <form onSubmit={submitData} className=' mb-4 space-y-3 '>

                            <input type='text' id='projectNameForm' placeholder='Project Name' onChange={(e) => {setProjectName(e.target.value)}} className="h-12 w-full pl-3 mb-8 shadow-lg  rounded-lg focus:outline"/>

                            <input type='text' id='IconForm' placeholder='Icon Name' onChange={(e) => {setIcon(e.target.value)}} className="h-12 w-full mb-8 pl-3 shadow-lg  rounded-lg focus:outline"/>

                            <input type='text' id='colorIdForm' placeholder='Color Id' onChange={(e) => {setColorId(parseInt(e.target.value))}} className="h-12 w-full pl-3 shadow-lg  rounded-lg focus:outline"/>

                            <input type='date' id='deadlineForm' placeholder='Deadline' onChange={(e) => {setDeadline(e.target.value)}} className="h-12 w-full pl-3 pr-6 shadow-lg  rounded-lg focus:outline"/>
                            <div className="flex justify-end mt-4">
                                <input type="submit" value="ADD A PROJECT" className='text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5'/>
                                <button
                                    onClick={declinegenerating}
                                    className="ml-3 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        {/* <div className="flex justify-end mt-4">
                            <button
                                onClick={generateProject}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                新規作成
                            </button>
                            <button
                                onClick={declinegenerating}
                                className="ml-3 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
                            >
                                破棄
                            </button>
                        </div> */}
                    </div>
                </div>
            )}
        </div>
    );
    // return(



        
    // )
}

export default AddProject;