import React, {useState} from 'react';
import Router from 'next/router';


export const AddProject = ({ addProject }) => {

    const [projectName, setProjectName] = useState(null)
    const [icon, setIcon] = useState(null)
    const [deadline, setDeadline] = useState(null)

    const submitData = async (e) =>{
        e.preventDefault(); 
        // if state がどれかひとつでもNullなら 例外処理

        document.getElementById('projectNameForm').value='';
        document.getElementById('IconForm').value='';
        document.getElementById('deadlineForm').value=''; 
        
        try{
            let result = await fetch('/api/addProject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({projectName, icon, deadline}),
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
    
    return(
        <form onSubmit={submitData} className='mb-4 space-y-3'>
            {/* <input type='text' id='projectNameForm' value = {projectName} onChange={(e) => {setProjectName(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/> */}
            <input type='text' id='projectNameForm'  onChange={(e) => {setProjectName(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
            <input type='text' id='IconForm'  onChange={(e) => {setIcon(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
            <input type='date' id='deadlineForm'  onChange={(e) => {setDeadline(e.target.value)}} className="w-full border px-4 py-2 rounded-lg focus:outlin"/>
            <input type="submit" value="ADD A PROJECT"/>
        </form>
    )
}

export default AddProject;