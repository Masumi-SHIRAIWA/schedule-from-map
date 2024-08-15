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
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
                プロジェクトを作成
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
                >
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900">
                            新規作成
                        </h3>
                        
                        <form onSubmit={submitData} className='mb-4 space-y-3'>
                            <p className="mt-2 text-sm text-gray-500">
                                Project Name
                            </p>
                            <input type='text' id='projectNameForm'  onChange={(e) => {setProjectName(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
                            <p className="mt-2 text-sm text-gray-500">
                                Icon Name
                            </p>
                            <input type='text' id='IconForm'  onChange={(e) => {setIcon(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
                            <p className="mt-2 text-sm text-gray-500">
                                Color Id
                            </p>
                            <input type='text' id='colorIdForm'  onChange={(e) => {setColorId(parseInt(e.target.value))}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
                            <p className="mt-2 text-sm text-gray-500">
                                Deadline
                            </p>
                            <input type='date' id='deadlineForm'  onChange={(e) => {setDeadline(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
                            <div className="flex justify-end mt-4">
                                <input type="submit" value="ADD A PROJECT" className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5'/>
                                <button
                                    onClick={declinegenerating}
                                    className="ml-3 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
                                >
                                    破棄
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